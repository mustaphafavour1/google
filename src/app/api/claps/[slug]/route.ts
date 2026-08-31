import { NextResponse } from "next/server";
import { addClap, getClaps } from "@/lib/metrics-store";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ claps: getClaps(slug) });
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ claps: addClap(slug) });
}
