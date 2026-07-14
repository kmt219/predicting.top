import { getRecentTrades } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  const { items } = getRecentTrades();
  return NextResponse.json(items);
}
