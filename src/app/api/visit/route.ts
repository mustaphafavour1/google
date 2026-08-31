import { NextResponse } from "next/server";
import { extractClientCountry, extractClientIp, hashVisitorIp } from "@/lib/visitor-hash";
import { recordVisit } from "@/lib/metrics-store";

export async function POST(request: Request) {
  const ip = extractClientIp(request.headers);
  if (ip) {
    const country = extractClientCountry(request.headers);
    recordVisit(hashVisitorIp(ip), country);
  }
  return NextResponse.json({ ok: true });
}
