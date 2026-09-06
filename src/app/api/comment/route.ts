import { NextResponse } from "next/server";
import { extractClientIp } from "@/lib/visitor-hash";
import { checkRateLimit } from "@/lib/metrics-store";

/**
 * Same Google Form the client-side hidden-iframe submission used to post
 * to directly. Moved server-side because a cross-origin browser POST always
 * carries this site's own Referer/Origin — exactly the signal Google's
 * anti-abuse heuristics use to silently drop submissions that didn't come
 * from a real, freshly-loaded /viewform session. A same-origin fetch from
 * this route doesn't carry that foreign Referer, and — unlike the old
 * fire-and-forget hidden iframe — this can actually report failure back to
 * the client instead of always showing "sent".
 */
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdBCtMWjKonKeREfKIN0MDY9SbrSdaTqMwwCAFJNPRVf6l8CQ/formResponse";
const FORM_ENTRY_ID = "entry.1022555387";
const FORM_NAME_ENTRY_ID = "entry.387254039";

const MAX_LEN = 2000;

export async function POST(request: Request) {
  const ip = extractClientIp(request.headers) ?? "unknown";
  if (!checkRateLimit(`comment:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many comments — try again in a few minutes." }, { status: 429 });
  }

  let body: { name?: string; projectName?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const text = (body.text ?? "").trim().slice(0, MAX_LEN);
  const name = (body.name ?? "").trim().slice(0, 200);
  const projectName = (body.projectName ?? "").trim().slice(0, 200);
  if (!text) {
    return NextResponse.json({ ok: false, error: "Comment can't be empty." }, { status: 400 });
  }

  const params = new URLSearchParams({
    [FORM_ENTRY_ID]: projectName ? `[${projectName}] ${text}` : text,
    [FORM_NAME_ENTRY_ID]: name,
  });

  try {
    const response = await fetch(FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Google Forms rejected the submission." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn't reach Google Forms." }, { status: 502 });
  }
}
