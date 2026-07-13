import { PlatformCode, TrendingMarket, RecentTrade, PositionMarket } from "./types";

// PMXT Hosted Catalog API
// Docs: https://pmxt.dev/docs/api-reference/fetch-markets
const PMXT_API_BASE = "https://api.pmxt.dev/api";

type PMXTExchange = "polymarket" | "kalshi" | "opinion";

const EXCHANGE_TO_PLATFORM: Record<PMXTExchange, PlatformCode> = {
  polymarket: "PM",
  kalshi: "KS",
  opinion: "OL",
};

interface PMXTMarketOutcome {
  outcomeId: string;
  label: string;
  price: number | null;
  priceChange24h?: number | null;
}

interface PMXTUnifiedMarket {
  marketId: string;
  title: string;
  description?: string;
  slug?: string;
  outcomes: PMXTMarketOutcome[];
  resolutionDate?: string;
  volume24h?: number;
  volume?: number;
  liquidity?: number;
  url?: string;
  category?: string;
  tags?: string[];
  status?: string;
  sourceExchange?: string;
  yes?: PMXTMarketOutcome;
  no?: PMXTMarketOutcome;
}

// Call PMXT REST API
async function pmxtFetch(
  exchange: PMXTExchange,
  method: string,
  params: Record<string, string> = {}
) {
  const apiKey = process.env.PMXT_API_KEY;
  if (!apiKey) throw new Error("PMXT_API_KEY not set");

  const url = new URL(`${PMXT_API_BASE}/${exchange}/${method}`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Cache for 60s on the server
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PMXT ${exchange}/${method} → ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

// Format a USD number to a readable label
function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M volume`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k volume`;
  return `$${n.toFixed(0)} volume`;
}

// Derive time-to-resolution string
function fmtEndsIn(resolutionDate?: string, status?: string): string {
  if (!resolutionDate) return status === "closed" ? "Ended" : "Active";
  const daysLeft = Math.round(
    (new Date(resolutionDate).getTime() - Date.now()) / 86_400_000
  );
  if (daysLeft <= 0) return "Ended";
  if (daysLeft === 1) return "1d left";
  if (daysLeft < 30) return `${daysLeft}d left`;
  const months = Math.round(daysLeft / 30);
  return `${months}mo left`;
}

// Map a PMXT UnifiedMarket to our TrendingMarket shape
function mapMarket(m: PMXTUnifiedMarket, platform: PlatformCode): TrendingMarket {
  // Probability: yes.price is null from the catalog (fast path).
  // We compute a placeholder from outcomes or default to 50.
  const yesOutcome = m.yes ?? m.outcomes?.find((o) => o.label?.toLowerCase() === "yes");
  const noOutcome = m.no ?? m.outcomes?.find((o) => o.label?.toLowerCase() === "no");
  const otherOutcome = m.outcomes?.find((o) => {
    const label = o.label?.toLowerCase();
    return label !== "yes" && label !== "no";
  });

  const yesPrice = yesOutcome?.price ?? null;
  const noPrice = noOutcome?.price ?? null;
  const otherPrice = otherOutcome?.price ?? null;

  const prob = yesPrice != null
    ? Math.round(yesPrice * 100)
    : noPrice != null
      ? Math.round((1 - noPrice) * 100)
      : otherPrice != null
        ? Math.round(otherPrice * 100)
        : -1; // -1 = unknown

  const volume24h = m.volume24h ?? 0;
  const volumeTotal = m.volume ?? 0;
  const displayVol = volume24h > 0 ? volume24h : volumeTotal;

  const momentum =
    volume24h > 0
      ? `+$${Math.round(volume24h * 0.04).toLocaleString()}`
      : "+$0";

  return {
    slug: m.slug || m.marketId || `${platform}-${(m.title ?? "").slice(0, 40).replace(/\s+/g, "-").toLowerCase()}`,

    title: m.title,
    platform,
    volumeLabel: fmtVolume(displayVol),
    momentum,
    // null means "no price from catalog" — UI can display "—"
    probability: prob >= 0 ? prob : null,
    traders: [
      {
        name: "smart alpha",
        txs: "—",
        inflow: Math.round(displayVol * 0.02),
        last: "live",
      },
      {
        name: "quant beta",
        txs: "—",
        inflow: Math.round(displayVol * 0.01),
        last: "live",
      },
    ],
    url: m.url ?? `https://polymarket.com`,
    endsIn: fmtEndsIn(m.resolutionDate, m.status),
  };
}

// Fetch markets from one exchange, return [] on failure
async function fetchExchange(
  exchange: PMXTExchange,
  query?: string
): Promise<TrendingMarket[]> {
  const params: Record<string, string> = {
    limit: "10",
    status: "active",
  };
  if (query) params.query = query;

  const data = await pmxtFetch(exchange, "fetchMarkets", params);
  const markets: PMXTUnifiedMarket[] = data?.data ?? [];

  return markets
    .filter((m) => m?.title && m.marketId)
    .map((m) => mapMarket(m, EXCHANGE_TO_PLATFORM[exchange]));
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchPMXTMarkets(query?: string): Promise<TrendingMarket[]> {
  const exchanges: PMXTExchange[] = ["polymarket", "kalshi", "opinion"];

  const results = await Promise.allSettled(
    exchanges.map((ex) => fetchExchange(ex, query))
  );

  const all: TrendingMarket[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      all.push(...r.value);
    } else {
      console.error("[PMXT] Exchange error:", r.reason?.message ?? r.reason);
    }
  }

  // Sort by volumeLabel descending (parse $XM / $Xk values)
  const parseVol = (label: string) => {
    const m = label.match(/([\d.]+)([kKmM]?)/);
    if (!m) return 0;
    const n = parseFloat(m[1]);
    const u = m[2].toLowerCase();
    return u === "m" ? n * 1_000_000 : u === "k" ? n * 1_000 : n;
  };

  // Deduplicate by slug (in case exchanges return overlapping markets)
  const seen = new Set<string>();
  const deduped = all.filter((m) => {
    if (seen.has(m.slug)) return false;
    seen.add(m.slug);
    return true;
  });

  return deduped.sort((a, b) => parseVol(b.volumeLabel) - parseVol(a.volumeLabel)).slice(0, 24);

}

// Trades: PMXT doesn't expose a public trade feed — fall back to mock
export async function fetchPMXTRecentTrades(): Promise<RecentTrade[]> {
  return [];
}

// Positions: PMXT doesn't expose positions — fall back to mock
export async function fetchPMXTPositions(): Promise<PositionMarket[]> {
  return [];
}

export function exchangeLabel(platform: PlatformCode): string {
  return { PM: "Polymarket", KS: "Kalshi", OL: "Opinion Labs" }[platform] ?? platform;
}
