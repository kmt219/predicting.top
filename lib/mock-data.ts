import {
  LeaderboardSortKey,
  PeriodKey,
  PlatformCode,
  PositionMarket,
  RecentTrade,
  TraderProfile,
  TraderSummary,
  TrendWindow,
  TrendingMarket
} from "@/lib/types";

const traders: TraderProfile[] = [
  {
    rank: 1,
    slug: "aenews",
    displayName: "aenews",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=aenews",
    platforms: ["PM", "KS"],
    joinedDaysAgo: 911,
    pnlUsd: 99231,
    monthlyPnlUsd: 123596,
    wins: 7,
    losses: 5,
    wallet: "0x44c1dfe43260c94ed4f1d00de2e1f80fb113ebc1",
    profileViews: 116764,
    xLinked: true,
    smartScore: 79.1,
    sharpe: 2.24,
    winRate: 61,
    roi: 33.4,
    maxDrawdown: 16.4,
    profitFactor: 1.67,
    consistency: 94,
    bio: "Cross-platform macro and politics trader with strong conviction sizing and steady realized P&L.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "loss", "loss", "flat", "win", "win", "flat", "win", "loss", "win", "win", "flat"],
    pnlHistory: [
      { label: "Dec 27", value: 350000 },
      { label: "Jan 1", value: 360000 },
      { label: "Jan 26", value: 402000 },
      { label: "Mar 12", value: 748000 },
      { label: "May 3", value: 775000 },
      { label: "May 14", value: 355000 },
      { label: "Today", value: 742000 }
    ]
  },
  {
    rank: 2,
    slug: "labvek",
    displayName: "labvek",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=labvek",
    platforms: ["PM", "KS"],
    joinedDaysAgo: 569,
    pnlUsd: 63810,
    monthlyPnlUsd: 82210,
    wins: 8,
    losses: 4,
    wallet: "0x8795bcb2fe129d1ea3e3d73bc13a3d8078047544",
    profileViews: 83210,
    xLinked: true,
    smartScore: 68.9,
    sharpe: 1.96,
    winRate: 58.3,
    roi: 28.4,
    maxDrawdown: 14.2,
    profitFactor: 1.49,
    consistency: 82,
    bio: "High-frequency event trader with steady weekly outperformance and lower drawdowns.",
    monthLabel: "Jul 2026",
    dayResults: ["flat", "win", "win", "loss", "win", "flat", "win", "loss", "win", "flat", "win", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 190000 },
      { label: "Jan 1", value: 206000 },
      { label: "Jan 26", value: 265000 },
      { label: "Mar 12", value: 402000 },
      { label: "May 3", value: 488000 },
      { label: "May 14", value: 432000 },
      { label: "Today", value: 519000 }
    ]
  },
  {
    rank: 3,
    slug: "iqdegen",
    displayName: "IqDegen",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=iqdegen",
    platforms: ["PM"],
    joinedDaysAgo: 699,
    pnlUsd: 41620,
    monthlyPnlUsd: 55210,
    wins: 6,
    losses: 6,
    wallet: "0x088ba59031e4bac4cc7b344581e3d908258221cc",
    profileViews: 64012,
    xLinked: false,
    smartScore: 32.9,
    sharpe: 0.84,
    winRate: 49.1,
    roi: 20.2,
    maxDrawdown: 35.9,
    profitFactor: 1.02,
    consistency: 54,
    bio: "Aggressive momentum trader with uneven but occasionally exceptional upside.",
    monthLabel: "Jul 2026",
    dayResults: ["loss", "win", "loss", "flat", "loss", "win", "flat", "loss", "win", "loss", "win", "loss"],
    pnlHistory: [
      { label: "Dec 27", value: 110000 },
      { label: "Jan 1", value: 155000 },
      { label: "Jan 26", value: 232000 },
      { label: "Mar 12", value: 302000 },
      { label: "May 3", value: 286000 },
      { label: "May 14", value: 219000 },
      { label: "Today", value: 317000 }
    ]
  },
  {
    rank: 4,
    slug: "user-x",
    displayName: "user.x",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=userx",
    platforms: ["KS"],
    joinedDaysAgo: 376,
    pnlUsd: 40440,
    monthlyPnlUsd: 48780,
    wins: 9,
    losses: 3,
    wallet: "kalshi-user-x",
    profileViews: 28801,
    xLinked: true,
    smartScore: 79.4,
    sharpe: 2.38,
    winRate: 67.4,
    roi: 35.8,
    maxDrawdown: 12.6,
    profitFactor: 1.84,
    consistency: 91,
    bio: "Short-horizon rates and politics trader with elite drawdown control.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "flat", "win", "loss", "win", "flat", "win", "win", "flat", "win", "loss"],
    pnlHistory: [
      { label: "Dec 27", value: 250000 },
      { label: "Jan 1", value: 276000 },
      { label: "Jan 26", value: 332000 },
      { label: "Mar 12", value: 399000 },
      { label: "May 3", value: 455000 },
      { label: "May 14", value: 441000 },
      { label: "Today", value: 523000 }
    ]
  },
  {
    rank: 5,
    slug: "robdfs",
    displayName: "RobDFS",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=robdfs",
    platforms: ["KS"],
    joinedDaysAgo: 437,
    pnlUsd: 34980,
    monthlyPnlUsd: 41010,
    wins: 5,
    losses: 7,
    wallet: "kalshi-robdfs",
    profileViews: 22100,
    xLinked: true,
    smartScore: 49.4,
    sharpe: 1.04,
    winRate: 47.8,
    roi: 18.9,
    maxDrawdown: 24.3,
    profitFactor: 1.11,
    consistency: 68,
    bio: "Event-heavy trader with solid edge in sports and macro but noisier equity curve.",
    monthLabel: "Jul 2026",
    dayResults: ["loss", "flat", "win", "loss", "win", "loss", "flat", "win", "loss", "flat", "win", "loss"],
    pnlHistory: [
      { label: "Dec 27", value: 80000 },
      { label: "Jan 1", value: 120000 },
      { label: "Jan 26", value: 180000 },
      { label: "Mar 12", value: 233000 },
      { label: "May 3", value: 252000 },
      { label: "May 14", value: 230000 },
      { label: "Today", value: 288000 }
    ]
  },
  {
    rank: 6,
    slug: "haon",
    displayName: "haon",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=haon",
    platforms: ["KS"],
    joinedDaysAgo: 771,
    pnlUsd: 33100,
    monthlyPnlUsd: 39500,
    wins: 8,
    losses: 4,
    wallet: "kalshi-haon",
    profileViews: 18442,
    xLinked: false,
    smartScore: 66.4,
    sharpe: 1.88,
    winRate: 59.2,
    roi: 24.2,
    maxDrawdown: 15.7,
    profitFactor: 1.44,
    consistency: 80,
    bio: "Consistent trader with clean execution and disciplined sizing.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "flat", "win", "loss", "win", "win", "flat", "win", "loss", "flat", "win", "flat"],
    pnlHistory: [
      { label: "Dec 27", value: 150000 },
      { label: "Jan 1", value: 169000 },
      { label: "Jan 26", value: 220000 },
      { label: "Mar 12", value: 278000 },
      { label: "May 3", value: 321000 },
      { label: "May 14", value: 308000 },
      { label: "Today", value: 366000 }
    ]
  }
];

const trendingMarkets: TrendingMarket[] = [
  {
    slug: "fed-july-2026",
    title: "Will there be no change in Fed interest rates after the July 2026 meeting?",
    platform: "PM",
    volumeLabel: "$1.8M today",
    momentum: "+14.2%",
    probability: 97,
    traders: [
      { name: "wkmfa57", txs: "132/5", inflow: 264004, last: "2d" },
      { name: "sorcerer", txs: "13/47", inflow: -24473, last: "7hr" },
      { name: "x.compo...", txs: "34/29", inflow: -41528, last: "8hr" },
      { name: "trader4", txs: "12/4", inflow: 15000, last: "1d" },
      { name: "trader5", txs: "8/2", inflow: 8000, last: "3d" },
      { name: "trader6", txs: "5/1", inflow: 2000, last: "5d" }
    ],
    url: "https://polymarket.com",
    endsIn: "16d left"
  },
  {
    slug: "hormuz-july-31",
    title: "Strait of Hormuz traffic returns to normal by July 31?",
    platform: "PM",
    volumeLabel: "$339k tracked",
    momentum: "-$190,006",
    probability: 3,
    traders: [
      { name: "losingan...", txs: "2/0", inflow: 375, last: "1d" },
      { name: "MistaJen...", txs: "1/0", inflow: 119, last: "5d" },
      { name: "Rooke B...", txs: "1/0", inflow: 115, last: "2d" }
    ],
    url: "https://polymarket.com",
    endsIn: "45d left"
  },
  {
    slug: "argentina-world-cup",
    title: "Will Argentina win the 2026 FIFA World Cup?",
    platform: "PM",
    volumeLabel: "$300k tracked",
    momentum: "+$20,648",
    probability: 18,
    traders: [
      { name: "Parz1val", txs: "3/10", inflow: 2612, last: "11hr" },
      { name: "debased", txs: "43/17", inflow: 5971, last: "1d" },
      { name: "Xplayer", txs: "20/10", inflow: 6814, last: "10hr" }
    ],
    url: "https://polymarket.com",
    endsIn: "163h left"
  },
  {
    slug: "us-election-2024",
    title: "Who will win the 2024 US Presidential Election?",
    platform: "PM",
    volumeLabel: "$3.2B tracked",
    momentum: "$0",
    probability: 100,
    traders: [
      { name: "DonaldT", txs: "1/0", inflow: 1000000, last: "1y" }
    ],
    url: "https://polymarket.com",
    endsIn: "Ended"
  }
];

const recentTrades: RecentTrade[] = [
  {
    id: "t1",
    traderSlug: "aenews",
    traderName: "aenews",
    marketTitle: "No Fed change in July 2026?",
    side: "YES",
    sizeUsd: 450,
    timestamp: "2m ago",
    platform: "PM",
    price: 47,
    traderScore: 2.33,
    category: "Politics"
  },
  {
    id: "t2",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Lionel Messi be the top goalscorer?",
    side: "YES",
    sizeUsd: 16930,
    timestamp: "1 hour ago",
    platform: "PM",
    price: 34,
    traderScore: 0.46,
    category: "Sports"
  },
  {
    id: "t3",
    traderSlug: "iqdegen",
    traderName: "MEPP",
    marketTitle: "Will there be no change in Fed interest rates in July?",
    side: "YES",
    sizeUsd: 1520,
    timestamp: "1 hour ago",
    platform: "PM",
    price: 76,
    traderScore: -0.93,
    category: "Macro"
  },
  {
    id: "t4",
    traderSlug: "robdfs",
    traderName: "debased",
    marketTitle: "Will the Republican Party control the House in 2028?",
    side: "NO",
    sizeUsd: 850,
    timestamp: "2 hours ago",
    platform: "PM",
    price: 83,
    traderScore: 2.92,
    category: "Politics"
  },
  {
    id: "t5",
    traderSlug: "labvek",
    traderName: "Parz1val",
    marketTitle: "Will Mitch McConnell step down in 2026?",
    side: "NO",
    sizeUsd: 31874,
    timestamp: "2 hours ago",
    platform: "PM",
    price: 68,
    traderScore: 3.56,
    category: "Politics"
  },
  {
    id: "t6",
    traderSlug: "haon",
    traderName: "EltonMa",
    marketTitle: "Will NVIDIA be the largest company by market cap?",
    side: "YES",
    sizeUsd: 2500,
    timestamp: "2 hours ago",
    platform: "OL",
    price: 91,
    traderScore: -0.89,
    category: "Tech"
  },
  {
    id: "t7",
    traderSlug: "aenews",
    traderName: "aenews",
    marketTitle: "Will France win the 2026 World Cup?",
    side: "YES",
    sizeUsd: 125000,
    timestamp: "3 hours ago",
    platform: "PM",
    price: 96,
    traderScore: 2.24,
    category: "Sports"
  },
  {
    id: "t8",
    traderSlug: "user-x",
    traderName: "user.x",
    marketTitle: "Will the Fed cut rates by 25bps in September?",
    side: "YES",
    sizeUsd: 8500,
    timestamp: "4 hours ago",
    platform: "KS",
    price: 72,
    traderScore: 2.38,
    category: "Macro"
  },
  {
    id: "t9",
    traderSlug: "iqdegen",
    traderName: "IqDegen",
    marketTitle: "Will OpenAI announce GPT-5 in 2026?",
    side: "YES",
    sizeUsd: 150,
    timestamp: "4 hours ago",
    platform: "PM",
    price: 98,
    traderScore: 0.84,
    category: "Tech"
  },
  {
    id: "t10",
    traderSlug: "robdfs",
    traderName: "RobDFS",
    marketTitle: "Will England win the 2026 World Cup?",
    side: "NO",
    sizeUsd: 55000,
    timestamp: "5 hours ago",
    platform: "KS",
    price: 97,
    traderScore: 1.04,
    category: "Sports"
  },
  {
    id: "t11",
    traderSlug: "haon",
    traderName: "haon",
    marketTitle: "Will US Inflation fall below 2% by YTD?",
    side: "YES",
    sizeUsd: 12000,
    timestamp: "6 hours ago",
    platform: "KS",
    price: 45,
    traderScore: 1.88,
    category: "Macro"
  },
  {
    id: "t12",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Spain reach the World Cup semi-finals?",
    side: "YES",
    sizeUsd: 42000,
    timestamp: "6 hours ago",
    platform: "PM",
    price: 99,
    traderScore: 1.96,
    category: "Sports"
  }
];

const positions: PositionMarket[] = [
  {
    slug: "france-world-cup",
    title: "Will France win the 2026 FIFA World Cup?",
    platform: "PM",
    side: "YES",
    marketValueUsd: 556378,
    smartMoneyShare: 89,
    traders: [
      { traderSlug: "aenews", traderName: "aenews", score: 79, entry: 0.71, pnlUsd: 9833, shares: "406.3k", valueUsd: 193521 },
      { traderSlug: "labvek", traderName: "labvek", score: 75, entry: 0.74, pnlUsd: 12044, shares: "220.5k", valueUsd: 79486 },
      { traderSlug: "haon", traderName: "haon", score: 73, entry: 0.75, pnlUsd: 29695, shares: "350.1k", valueUsd: 79202 }
    ]
  },
  {
    slug: "iran-regime-2027",
    title: "Will the Iranian regime fall before 2027?",
    platform: "PM",
    side: "NO",
    marketValueUsd: 320000,
    smartMoneyShare: 75,
    traders: [
      { traderSlug: "aenews", traderName: "aenews", score: 63, entry: 0.66, pnlUsd: 71040, shares: "399.0k", valueUsd: 286205 },
      { traderSlug: "labvek", traderName: "labvek", score: 48, entry: 0.76, pnlUsd: 19994, shares: "79.8k", valueUsd: 44010 },
      { traderSlug: "robdfs", traderName: "RobDFS", score: 39, entry: 0.74, pnlUsd: 6930, shares: "48.0k", valueUsd: 16900 }
    ]
  },
  {
    slug: "argentina-world-cup",
    title: "Will Argentina win the 2026 FIFA World Cup?",
    platform: "PM",
    side: "NO",
    marketValueUsd: 180000,
    smartMoneyShare: 47,
    traders: [
      { traderSlug: "iqdegen", traderName: "IqDegen", score: 60, entry: 0.79, pnlUsd: 3257, shares: "66.8k", valueUsd: 153178 },
      { traderSlug: "haon", traderName: "haon", score: 77, entry: 0.79, pnlUsd: 22779, shares: "386.2k", valueUsd: 101524 },
      { traderSlug: "aenews", traderName: "aenews", score: 69, entry: 0.76, pnlUsd: 1802, shares: "37.2k", valueUsd: 47199 }
    ]
  }
];

const getPeriodMultiplier = (slug: string, period: PeriodKey) => {
  let seed = 0;
  for (let i = 0; i < slug.length; i++) {
    seed += slug.charCodeAt(i);
  }
  const val = (seed % 10) / 100; // 0.00 to 0.09 variation
  if (period === "YTD") return 0.8 + val;
  if (period === "1M") return 0.15 + val;
  if (period === "1D") return 0.01 + (seed % 5 === 0 ? -val * 0.5 : val); // can even be negative
  return 1.0;
};

export function getLeaderboard(options?: {
  search?: string;
  platform?: "ALL" | PlatformCode;
  minPnl?: number;
  sort?: LeaderboardSortKey;
  period?: PeriodKey;
  xLinkedOnly?: boolean;
}) {
  const search = options?.search?.toLowerCase().trim();
  const platform = options?.platform ?? "ALL";
  const minPnl = options?.minPnl ?? 0;
  const sort = options?.sort ?? "smart_score";
  const period = options?.period ?? "ALL";

  const filtered = traders
    .map((trader) => {
      const mult = getPeriodMultiplier(trader.slug, period);
      return { ...trader, pnlUsd: trader.pnlUsd * mult };
    })
    .filter((trader) => {
      if (search && !trader.displayName.toLowerCase().includes(search) && !trader.slug.toLowerCase().includes(search)) {
        return false;
      }

      if (platform !== "ALL" && !trader.platforms.includes(platform)) {
        return false;
      }

      if (options?.xLinkedOnly && !trader.xLinked) {
        return false;
      }

      return trader.pnlUsd >= minPnl;
    })
    .sort((a, b) => {
      const mapping: Record<LeaderboardSortKey, keyof TraderSummary> = {
        smart_score: "smartScore",
        sharpe: "sharpe",
        win_rate: "winRate",
        roi: "roi",
        pnl: "pnlUsd"
      };

      const key = mapping[sort];
      return Number(b[key]) - Number(a[key]);
    })
    .map((trader, index) => ({ ...trader, rank: index + 1 }));

  return {
    asOf: "2026-07-12T22:33:00Z",
    total: filtered.length,
    period,
    items: filtered
  };
}

export function getTraderProfile(slug: string) {
  return traders.find((trader) => trader.slug === slug) ?? null;
}

export function getTrendingMarkets(window: TrendWindow = "1W") {
  const windowMultipliers: Record<TrendWindow, number> = {
    "1H": 0.05,
    "6H": 0.25,
    "24H": 0.5,
    "3D": 0.8,
    "1W": 1.0
  };

  const mult = windowMultipliers[window];
  const items = trendingMarkets.map((market) => {
    let prob = market.probability ?? 50;
    if (window === "1H") {
      prob = Math.max(1, Math.min(99, prob + 2));
    } else if (window === "6H") {
      prob = Math.max(1, Math.min(99, prob - 3));
    } else if (window === "24H") {
      prob = Math.max(1, Math.min(99, prob + 1));
    } else if (window === "3D") {
      prob = Math.max(1, Math.min(99, prob - 1));
    }

    let volLabel = market.volumeLabel;
    const match = market.volumeLabel.match(/\$([\d.]+)([MK])/);
    if (match) {
      const val = parseFloat(match[1]) * mult;
      volLabel = `$${val.toFixed(1)}${match[2]} in ${window}`;
    }

    return {
      ...market,
      probability: prob,
      volumeLabel: volLabel
    };
  });

  return {
    asOf: "2026-07-12T22:33:00Z",
    window,
    items
  };
}

export function getRecentTrades() {
  return {
    asOf: "2026-07-12T22:33:00Z",
    items: recentTrades
  };
}

export function getPositions(side: "ALL" | "YES" | "NO" = "ALL", platform: "ALL" | PlatformCode = "ALL") {
  const items = positions.filter((position) => {
    if (side !== "ALL" && position.side !== side) {
      return false;
    }

    if (platform !== "ALL" && position.platform !== platform) {
      return false;
    }

    return true;
  });

  return {
    asOf: "2026-07-12T22:33:00Z",
    totalMarkets: items.length,
    totalPositions: items.reduce((acc, item) => acc + item.traders.length, 0),
    items
  };
}

export function getFilterMeta() {
  return {
    asOf: "2026-07-12T22:33:00Z",
    periods: ["1D", "1M", "YTD", "ALL"],
    sortKeys: ["smart_score", "sharpe", "win_rate", "roi", "pnl"],
    platforms: ["ALL", "PM", "KS", "OL"],
    trendWindows: ["1H", "6H", "24H", "3D", "1W"]
  };
}
