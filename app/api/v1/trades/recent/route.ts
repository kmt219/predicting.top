import { getRecentTrades } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(getRecentTrades());
}
