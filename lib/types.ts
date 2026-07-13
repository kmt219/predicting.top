export type PlatformCode = "PM" | "KS" | "OL";
export type PeriodKey = "1D" | "1M" | "YTD" | "ALL";
export type TrendWindow = "1H" | "6H" | "24H" | "3D" | "1W";
export type LeaderboardSortKey = "smart_score" | "sharpe" | "win_rate" | "roi" | "pnl";

export interface TraderMetricSet {
  smartScore: number;
  sharpe: number;
  winRate: number;
  roi: number;
  maxDrawdown: number;
  profitFactor: number;
  consistency: number;
}

export interface TraderSummary extends TraderMetricSet {
  rank: number;
  slug: string;
  displayName: string;
  avatarUrl: string;
  platforms: PlatformCode[];
  joinedDaysAgo: number;
  pnlUsd: number;
  monthlyPnlUsd: number;
  wins: number;
  losses: number;
  wallet: string;
  profileViews: number;
}

export interface TrendingMarket {
  slug: string;
  title: string;
  platform: PlatformCode;
  volumeLabel: string;
  momentum: string;
  probability: number;
  traders: Array<{
    name: string;
    txs: string;
    inflow: number;
    last: string;
  }>;
  url: string;
  endsIn: string;
}

export interface RecentTrade {
  id: string;
  traderSlug: string;
  traderName: string;
  marketTitle: string;
  side: "YES" | "NO";
  sizeUsd: number;
  timestamp: string;
  platform: PlatformCode;
  price: number;
  traderScore: number;
  category: string;
}

export interface PositionTrader {
  traderSlug: string;
  traderName: string;
  score: number;
  entry: number;
  pnlUsd: number;
  shares: string;
  valueUsd: number;
}

export interface PositionMarket {
  slug: string;
  title: string;
  platform: PlatformCode;
  side: "YES" | "NO";
  marketValueUsd: number;
  smartMoneyShare: number;
  traders: PositionTrader[];
}

export interface TraderProfile extends TraderSummary {
  bio: string;
  monthLabel: string;
  dayResults: Array<"win" | "loss" | "flat">;
  pnlHistory: Array<{ label: string; value: number }>;
}
