import { getLeaderboard } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") ?? undefined;
  const platform = (searchParams.get("platform") as "ALL" | "PM" | "KS" | "OL" | null) ?? "ALL";
  const sort = (searchParams.get("sort") as "smart_score" | "sharpe" | "win_rate" | "roi" | "pnl" | null) ?? "smart_score";
  const period = (searchParams.get("period") as "1D" | "1M" | "YTD" | "ALL" | null) ?? "1D";
  const minPnl = Number(searchParams.get("minPnl") ?? "0");

  return NextResponse.json(getLeaderboard({ search, platform, sort, period, minPnl }));
}
