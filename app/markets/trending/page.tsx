"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FilterBar, FilterChip, FilterDropdown } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { SiteHeader } from "@/components/site-header";
import { TrendWindow, TrendingMarket, PlatformCode } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getTraderProfile } from "@/lib/mock-data";

const windows: TrendWindow[] = ["1H", "6H", "24H", "3D", "1W"];
const scoreOptions = [
  { label: "Any", value: "Any" },
  { label: "60+", value: "60+" },
  { label: "70+", value: "70+" },
];
const sharpeOptions = [
  { label: "Any", value: "Any" },
  { label: "1.0+", value: "1.0+" },
  { label: "1.5+", value: "1.5+" },
  { label: "2.0+", value: "2.0+" },
];

const PLATFORM_META: Record<PlatformCode, { label: string; color: string; dot: string }> = {
  PM: { label: "Polymarket", color: "rgba(0,132,199,0.15)", dot: "#0084c7" },
  KS: { label: "Kalshi", color: "rgba(56,178,103,0.15)", dot: "#38b267" },
  OL: { label: "Opinion Labs", color: "rgba(180,90,220,0.15)", dot: "#b45adc" },
};

export default function TrendingMarketsPage() {
  const [trendWindow, setTrendWindow] = useState<TrendWindow>("1W");
  const [greaterThan95, setGreaterThan95] = useState(false);
  const [sportsOnly, setSportsOnly] = useState(false);
  const [endedOnly, setEndedOnly] = useState(false);
  const [lessThan30d, setLessThan30d] = useState(false);
  const [fivePlusTraders, setFivePlusTraders] = useState(false);
  const [scoreFloor, setScoreFloor] = useState("Any");
  const [sharpeFloor, setSharpeFloor] = useState("Any");

  const [markets, setMarkets] = useState<TrendingMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<"live" | "mock">("mock");
  const [exchanges, setExchanges] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/v1/markets/trending?window=${trendWindow}`)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "<failed to read body>");
          throw new Error(`Trending fetch failed: ${r.status} ${r.statusText} - ${text}`);
        }
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const items: TrendingMarket[] = Array.isArray(data) ? data : (data?.items ?? []);
        setMarkets(items);
        setSource(data?.source === "live" ? "live" : "mock");
        setExchanges(data?.exchanges ?? []);
      })
      .catch((err) => console.error("Error loading trending markets:", err))
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [trendWindow]);

  const items = useMemo(() => {
    let result = [...markets];

    if (greaterThan95) result = result.filter((m) => (m.probability ?? 0) > 95);

    if (sportsOnly) {
      result = result.filter((m) =>
        /sport|soccer|football|basketball|nfl|nba|cricket|tennis|golf|f1|world cup/i.test(m.title)
      );
    }

    if (endedOnly) {
      result = result.filter((m) => !m.endsIn.toLowerCase().includes("left") && m.endsIn !== "Active");
    } else {
      result = result.filter((m) => m.endsIn.toLowerCase().includes("left") || m.endsIn === "Active");
    }

    if (lessThan30d) {
      result = result.filter((m) => {
        const s = m.endsIn.toLowerCase();
        if (s.includes("h left")) return true;
        const match = s.match(/(\d+)d/);
        return match ? parseInt(match[1]) < 30 : false;
      });
    }

    if (fivePlusTraders) result = result.filter((m) => m.traders.length >= 5);

    if (scoreFloor !== "Any") {
      const threshold = Number(scoreFloor.replace("+", ""));
      if (!Number.isNaN(threshold)) {
        result = result.filter((m) =>
          m.traders.some((t) => {
            const profile = getTraderProfile(t.name);
            return profile?.smartScore != null && profile.smartScore >= threshold;
          })
        );
      }
    }

    if (sharpeFloor !== "Any") {
      const threshold = Number(sharpeFloor.replace("+", ""));
      if (!Number.isNaN(threshold)) {
        result = result.filter((m) =>
          m.traders.some((t) => {
            const profile = getTraderProfile(t.name);
            return profile?.sharpe != null && profile.sharpe >= threshold;
          })
        );
      }
    }

    return result;
  }, [markets, greaterThan95, sportsOnly, endedOnly, lessThan30d, fivePlusTraders, scoreFloor, sharpeFloor]);

  return (
    <main className="page-shell">
      <SiteHeader active="trending" />
      <section className="panel page-panel">
        <PageHeader
          eyebrow="Momentum"
          title="Trending Markets"
          description="Live markets across Polymarket, Kalshi, and Opinion Labs — ranked by 24-hour volume."
        />

        {/* Live data badge */}
        {source === "live" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(56,178,103,0.08)", border: "1px solid rgba(56,178,103,0.25)",
            borderRadius: "24px", padding: "6px 14px", fontSize: "0.78rem",
            color: "var(--text)", fontWeight: 500, marginBottom: "16px",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#38b267",
              display: "inline-block", boxShadow: "0 0 7px #38b267bb",
            }} />
            <span style={{ color: "#38b267", fontWeight: 700 }}>Live</span>
            <span style={{ color: "var(--muted)" }}>·</span>
            {exchanges.map((ex, i) => (
              <span key={ex} style={{ color: "var(--muted)" }}>
                {ex.charAt(0).toUpperCase() + ex.slice(1)}
                {i < exchanges.length - 1 && <span style={{ margin: "0 4px", opacity: 0.4 }}>·</span>}
              </span>
            ))}
          </div>
        )}

        <FilterBar className="one-row">
          {windows.map((window) => (
            <FilterChip
              key={window}
              label={window}
              active={window === trendWindow}
              onClick={() => setTrendWindow(window)}
            />
          ))}
          <FilterChip label=">95%" active={greaterThan95} onClick={() => setGreaterThan95((v) => !v)} />
          <FilterChip label="Sports" active={sportsOnly} onClick={() => setSportsOnly((v) => !v)} />
          <FilterChip label="Ended" active={endedOnly} onClick={() => setEndedOnly((v) => !v)} />
          <FilterChip label="<30d" active={lessThan30d} onClick={() => setLessThan30d((v) => !v)} />
          <FilterChip label="5+" active={fivePlusTraders} onClick={() => setFivePlusTraders((v) => !v)} />
          <FilterDropdown label="Score" value={scoreFloor} options={scoreOptions} onChange={setScoreFloor} />
          <FilterDropdown label="Sharpe" value={sharpeFloor} options={sharpeOptions} onChange={setSharpeFloor} />
        </FilterBar>
      </section>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: 16 }}>Loading</div>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>Fetching live markets from Polymarket, Kalshi & Opinion Labs…</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          No markets match your filters.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "20px",
          marginTop: "24px",
        }}>
          {items.map((market, index) => {
            const meta = PLATFORM_META[market.platform] ?? { label: market.platform, color: "rgba(255,255,255,0.05)", dot: "#888" };
            // PMXT catalog doesn't return live prices so prob=50 means "unknown"
            const probDisplay = market.probability == null ? "—" : `${market.probability}%`;
            const probColor = market.probability == null ? "var(--muted)" : market.probability >= 50 ? "var(--positive)" : "var(--negative)";

            return (
              <article
                key={`${market.platform}-${market.slug || market.title}-${index}`}
                role="button"
                tabIndex={0}
                className="market-card"
                aria-label={`Open market: ${market.title}`}
                onClick={() => window.open(market.url, "_blank", "noopener,noreferrer")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.open(market.url, "_blank", "noopener,noreferrer");
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px", cursor: "pointer" }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      background: meta.color, border: `1px solid ${meta.dot}33`,
                      borderRadius: "20px", padding: "3px 10px",
                      fontSize: "0.72rem", fontWeight: 700, color: meta.dot,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
                      {meta.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{market.endsIn}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  margin: 0, fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.45,
                  color: "var(--text)",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {market.title}
                </h3>

                {/* Stats row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "auto" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", marginBottom: 2 }}>24h Volume</p>
                    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>
                      {market.volumeLabel}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", marginBottom: 2 }}>Probability</p>
                    <p style={{ margin: 0, fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em", color: probColor }}>
                      {probDisplay}
                    </p>
                  </div>
                </div>

                {/* Inflow bar */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Smart Inflow
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--positive)", fontWeight: 600 }}>
                      {market.momentum}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {market.traders.slice(0, 2).map((t) => (
                      <Link
                        key={t.name}
                        href={`/account/${encodeURIComponent(t.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="market-trader-chip"
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 8,
                          padding: "6px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit"
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80 }}>
                          {t.name}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--positive)", fontWeight: 600 }}>
                          {formatCurrency(t.inflow, true)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
