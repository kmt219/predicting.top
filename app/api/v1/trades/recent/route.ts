import { getRecentTrades } from "@/lib/mock-data";
import { fetchPMXTRecentTrades } from "@/lib/pmxt";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.PMXT_API_KEY) {
    const pmxtTrades = await fetchPMXTRecentTrades();
    if (pmxtTrades.length > 0) {
      return NextResponse.json(pmxtTrades);
    }
  }
  return NextResponse.json(getRecentTrades());
}
