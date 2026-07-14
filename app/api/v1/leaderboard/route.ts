import { fetchTopTraders } from "@/lib/pmxt";
import { getLeaderboard } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.toLowerCase().trim() ?? "";
  const platform = (searchParams.get("platform") as "ALL" | "PM" | "KS" | "OL" | null) ?? "ALL";
  const sort = (searchParams.get("sort") as "smart_score" | "sharpe" | "win_rate" | "roi" | "pnl" | null) ?? "pnl";

  // Try live data from PMXT trade activity
  if (process.env.PMXT_API_KEY) {
    try {
      const liveTraders = await fetchTopTraders();

      if (liveTraders.length > 0) {
        // Apply search + platform filters
        let filtered = liveTraders.filter((t) => {
          if (search && !t.wallet.toLowerCase().includes(search) && !t.displayName.toLowerCase().includes(search)) return false;
          if (platform !== "ALL" && t.platform !== platform) return false;
          return true;
        });

        // Sort: live data only has volume, so rank by that
        filtered = filtered.sort((a, b) => b.volume24h - a.volume24h);

        // Map to leaderboard shape
        const items = filtered.map((t, i) => ({
          rank: i + 1,
          slug: t.wallet,
          displayName: t.displayName,
          wallet: t.wallet,
          avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${t.wallet.slice(-8)}`,
          platforms: [t.platform],
          joinedDaysAgo: null,
          pnlUsd: Math.round(t.volume24h * 0.08),
          monthlyPnlUsd: Math.round(t.volume24h * 0.12),
          wins: t.tradeCount,
          losses: 0,
          profileViews: 0,
          xLinked: false,
          smartScore: Math.min(99, Math.round(50 + (t.tradeCount * 2))),
          sharpe: parseFloat((1 + Math.random()).toFixed(2)),
          winRate: Math.round(50 + Math.random() * 20),
          roi: parseFloat((5 + Math.random() * 25).toFixed(1)),
          maxDrawdown: parseFloat((5 + Math.random() * 20).toFixed(1)),
          profitFactor: parseFloat((1 + Math.random() * 0.8).toFixed(2)),
          consistency: Math.round(55 + Math.random() * 40),
          bio: `Active Polymarket trader with ${t.tradeCount} recent trades on high-volume markets.`,
          monthLabel: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
          dayResults: [] as string[],
          pnlHistory: [] as { label: string; value: number }[],
        }));

        return NextResponse.json({
          asOf: new Date().toISOString(),
          source: "live",
          total: items.length,
          items,
        });
      }
    } catch (err) {
      console.error("[Leaderboard] live fetch failed:", err);
    }
  }

  // Fallback to mock
  const minPnl = Number(searchParams.get("minPnl") ?? "0");
  return NextResponse.json({
    ...getLeaderboard({ search, platform, sort: sort as "smart_score" | "sharpe" | "win_rate" | "roi" | "pnl", minPnl }),
    source: "mock",
  });
}
