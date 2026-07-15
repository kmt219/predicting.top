import { getLiveDailyProfit } from "@/lib/live-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getLiveDailyProfit();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Daily Profit API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch live daily profit data", details: error.message }, { status: 502 });
  }
}
