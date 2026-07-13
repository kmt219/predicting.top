import Link from "next/link";
import { FilterBar, FilterChip } from "@/components/filter-bar";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { PageHeader } from "@/components/page-header";
import { RecentTrades } from "@/components/recent-trades";
import { SiteHeader } from "@/components/site-header";
import { TrendingMarkets } from "@/components/trending-markets";
import { getLeaderboard, getRecentTrades, getTrendingMarkets } from "@/lib/mock-data";

export default function HomePage() {
  const leaderboard = getLeaderboard();
  const trending = getTrendingMarkets("1W");
  const recentTrades = getRecentTrades();

  return (
    <main className="page-shell">
      <SiteHeader active="leaderboard" />

      <section className="hero-grid">
        <div className="panel hero-card">
          <PageHeader
            eyebrow="Core Surface"
            title="Prediction Leaderboard"
            description="Track the top prediction traders in realtime and jump from rankings into conviction, flow, and market momentum."
            actions={<span className="today-pnl positive">Today: +$312k smart money</span>}
          />
          <div className="hero-metrics">
            <div>
              <strong>148</strong>
              <span className="muted">Tracked traders</span>
            </div>
            <div>
              <strong>3</strong>
              <span className="muted">Platforms</span>
            </div>
            <div>
              <strong>5 min</strong>
              <span className="muted">Refresh target</span>
            </div>
          </div>
          <FilterBar>
            <FilterChip label="P&L Updated Jul 12, 10:33 PM" active />
            <FilterChip label="1D" active />
            <FilterChip label="All Platforms" />
            <FilterChip label="$5+" />
            <FilterChip label="Linked" />
            <FilterChip label="Sharpe, Win%, ROI" />
          </FilterBar>
          <p className="muted formula-note">
            Score = consistency 25% + returns 25% + win rate 20% + max loss 15% + profit factor 15%.
          </p>
        </div>

        <div className="hero-side">
          <TrendingMarkets items={trending.items} window={trending.window} />
        </div>
      </section>

      <section className="content-grid">
        <div>
          <LeaderboardTable traders={leaderboard.items} />
        </div>
        <div className="sidebar-stack">
          <RecentTrades items={recentTrades.items} />
          <div className="subnav-links">
            <Link href="/markets/trending" className="pill">
              Open Trending Markets
            </Link>
            <Link href="/trades/recent" className="pill">
              Open Recent Trades
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
