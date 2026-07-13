import { getTraderProfile } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getTraderProfile(slug);

  if (!profile) {
    return NextResponse.json({ error: "Trader not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
