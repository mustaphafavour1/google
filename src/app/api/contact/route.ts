import { NextResponse } from "next/server";
import { extractClientIp } from "@/lib/visitor-hash";
import { checkRateLimit } from "@/lib/metrics-store";

/**
 * See src/app/api/comment/route.ts for why this moved server-side — same
 * Google Form, same reasoning (a same-origin server fetch doesn't carry the
 * foreign Referer a cross-origin hidden-iframe POST always does).
 */
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdpsQgMKSp0daAm_opx1IxNkyXxn9jHVJ96WELPnQD5nRSk9A/formResponse";
const ENTRY = {
  name: "entry.875926583",
  email: "entry.485278952",
  phone: "entry.298588619",
  category: "entry.501439978",
  message: "entry.552349922",
};

const MAX_LEN = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = extractClientIp(request.headers) ?? "unknown";
  if (!checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many messages — try again in a few minutes." }, { status: 429 });
  }

  let body: { name?: string; email?: string; phone?: string; category?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  const phone = (body.phone ?? "").trim().slice(0, 50);
  const category = (body.category ?? "").trim().slice(0, 100);
  const message = (body.message ?? "").trim().slice(0, MAX_LEN);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
  }

  const params = new URLSearchParams({
    [ENTRY.name]: name,
    [ENTRY.email]: email,
    [ENTRY.phone]: phone,
    [ENTRY.category]: category,
    [ENTRY.message]: message,
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
