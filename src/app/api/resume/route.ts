import { getPortfolioPassword, getSiteSettings } from "@/lib/content";
import { extractClientIp, hashVisitorIp } from "@/lib/visitor-hash";
import { checkResumeRateLimit } from "@/lib/resume-rate-limit";

function isValidBody(body: unknown): body is { password: string } {
  if (!body || typeof body !== "object") return false;
  const { password } = body as Record<string, unknown>;
  return typeof password === "string" && password.length > 0 && password.length <= 200;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isValidBody(body)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = extractClientIp(request.headers);
  const visitorHash = hashVisitorIp(ip ?? "unknown");
  const { allowed } = checkResumeRateLimit(visitorHash);
  if (!allowed) {
    return Response.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }

  const [realPassword, siteSettings] = await Promise.all([getPortfolioPassword(), getSiteSettings()]);
  if (body.password !== realPassword) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const url = siteSettings.contact.resumeUrl;
  if (!url) {
    return Response.json({ error: "No résumé is set up yet." }, { status: 404 });
  }

  return Response.json({ url });
}
