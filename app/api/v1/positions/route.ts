import { getPositions } from "@/lib/mock-data";
import { fetchPMXTPositions } from "@/lib/pmxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const side = (request.nextUrl.searchParams.get("side") as "ALL" | "YES" | "NO" | null) ?? "ALL";
  const platform = (request.nextUrl.searchParams.get("platform") as "ALL" | "PM" | "KS" | "OL" | null) ?? "ALL";

  if (process.env.PMXT_API_KEY) {
    const pmxtPositions = await fetchPMXTPositions();
    if (pmxtPositions.length > 0) {
      // Filter PMXT positions based on requested side and platform
      const filteredItems = pmxtPositions.filter((market) => {
        if (side !== "ALL" && market.side !== side) return false;
        if (platform !== "ALL" && market.platform !== platform) return false;
        return true;
      });
      return NextResponse.json({
        asOf: new Date().toISOString(),
        totalMarkets: filteredItems.length,
        totalPositions: filteredItems.reduce((acc, item) => acc + item.traders.length, 0),
        items: filteredItems
      });
    }
  }

  return NextResponse.json(getPositions(side, platform));
}
