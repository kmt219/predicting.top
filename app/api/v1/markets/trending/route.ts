import { getTrendingMarkets } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const window = (request.nextUrl.searchParams.get("window") as "1H" | "6H" | "24H" | "3D" | "1W" | null) ?? "1W";
  return NextResponse.json(getTrendingMarkets(window));
}
