import { getTrendingMarkets } from "@/lib/mock-data";
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
          window,
          source: "live",
          exchanges: ["polymarket", "kalshi", "opinion"],
          items: pmxtMarkets,
        });
      }
    } catch (err) {
      console.error("[PMXT] Error fetching markets:", err);
      // Fall through to mock data
    }
  }

  // Fall back to mock data
  const mockData = getTrendingMarkets(window);
  return NextResponse.json({ ...mockData, source: "mock" });
}
