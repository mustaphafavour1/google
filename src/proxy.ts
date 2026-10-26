import { NextResponse, type NextRequest } from "next/server";

/** Subdomains that are infrastructure, not a tailored company link. */
const RESERVED_SUBDOMAINS = new Set(["design", "www", "studio"]);

/**
 * Three entry points, all feeding the same "which tailored variant is
 * active" signal through to the rest of the app via the x-jd-slug request
 * header (read in the root layout to pick a default theme — see
 * src/app/(site)/layout.tsx):
 *
 * 1. {company}.headfavour.com -> rewritten to /apply/{company} so the
 *    existing route just works, no new page needed for the subdomain case.
 * 2. /apply/{company} directly (any host) -> no rewrite needed, the page
 *    already reads the slug from its own route param; this just forwards
 *    it via the header too, for the same theme-defaulting purpose.
 * 3. design.headfavour.com/?jd=company (or any host) -> same idea, for the
 *    general home page's jdVariant preview mechanism.
 */
export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const parts = hostname.split(".");
  const isTailoredSubdomain =
    hostname.endsWith(".headfavour.com") && parts.length === 3 && !RESERVED_SUBDOMAINS.has(parts[0]);
  const applyPathSlug = request.nextUrl.pathname.match(/^\/apply\/([^/]+)$/)?.[1];

  const jdSlug = isTailoredSubdomain
    ? parts[0]
    : (applyPathSlug ?? request.nextUrl.searchParams.get("jd"));

  const requestHeaders = new Headers(request.headers);
  if (jdSlug) requestHeaders.set("x-jd-slug", jdSlug);
  else requestHeaders.delete("x-jd-slug");

  if (isTailoredSubdomain && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/apply/${jdSlug}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
