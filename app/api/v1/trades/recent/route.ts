import { getLiveRecentTrades } from "@/lib/live-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit") ?? "100");
    const minAmount = Number(searchParams.get("minAmount") ?? "100");

    const data = await getLiveRecentTrades(limit, minAmount);
    
    return NextResponse.json({
      asOf: new Date().toISOString(),
      items: data
    });
  } catch (error: any) {
    console.error("[Recent Trades API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch live trades", details: error.message }, { status: 502 });
  }
}
