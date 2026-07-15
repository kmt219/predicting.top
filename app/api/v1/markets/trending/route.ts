import { getLiveTrendingMarkets } from "@/lib/live-api";
import { fetchPMXTMarkets } from "@/lib/pmxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const window = (searchParams.get("window") as "1H" | "6H" | "24H" | "3D" | "1W" | null) ?? "1W";
  const query = searchParams.get("query") ?? undefined;

  if (process.env.PMXT_API_KEY) {
    try {
      const pmxtMarkets = await fetchPMXTMarkets(query);
      if (pmxtMarkets.length > 0) {
        return NextResponse.json({
          asOf: new Date().toISOString(),
          window,
          source: "live-pmxt",
          exchanges: ["polymarket", "kalshi", "opinion"],
          items: pmxtMarkets,
        });
      }
    } catch (err) {
      console.error("[PMXT] Error fetching markets:", err);
      // Fall through to live aggregator
    }
  }

  try {
    // Fall back to live aggregator instead of static mock data
    const liveData = await getLiveTrendingMarkets(window, query);
    return NextResponse.json({
      asOf: new Date().toISOString(),
      window,
      source: "live-aggregator",
      items: liveData
    });
  } catch (error: any) {
    console.error("[Trending Markets API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch live trending markets", details: error.message }, { status: 502 });
  }
}
