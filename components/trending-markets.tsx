"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TrendingMarket, TrendWindow } from "@/lib/types";
import { getTraderProfile } from "@/lib/mock-data";

const windows: TrendWindow[] = ["1H", "6H", "24H", "3D", "1W"];
const scoreOptions = ["Any", "60", "70", "80"];
const sharpeOptions = ["Any", "0.0", "0.5", "1.0", "1.5", "2.0"];

function getMarketFlagEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("argentina")) return "🇦🇷";
  if (t.includes("france")) return "🇫🇷";
  if (t.includes("england")) return "🇬🇧";
  if (t.includes("iran")) return "🇮🇷";
  if (t.includes("fed ") || t.includes("rate") || t.includes("inflation") || t.includes("interest")) return "🏦";
  if (t.includes("btc") || t.includes("bitcoin") || t.includes("crypto")) return "🪙";
  return "🌐";
}

export function TrendingMarketCard({ market }: { market: TrendingMarket }) {
  const probColor = market.probability == null ? "var(--muted)" : market.probability >= 50 ? "var(--green)" : "var(--red)";
  const probDisplay = market.probability == null ? "—" : `${market.probability}%`;

  function openMarket() {
    window.open(market.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="panel market-card"
      role="button"
      tabIndex={0}
      onClick={openMarket}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openMarket(); }}
      aria-label={`Open market: ${market.title}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border)",
        transition: "all 150ms ease",
        cursor: "pointer"
      }}
    >
      {/* Title & Probability row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span className="market-flag-badge" style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0
          }}>
            {getMarketFlagEmoji(market.title)}
          </span>
          <span id={`market-title-${market.slug}`} className="market-title">
            {market.title}
          </span>
        </div>
        <span className="market-prob" style={{ color: probColor }}>{probDisplay}</span>
      </div>

      {/* Stats row */}
      <div className="market-stats">
        <div className="market-stats-left">
          <span className="market-volume">{market.volumeLabel}</span>
          <span className="middot">·</span>
          <span className="market-trader-count">{market.traders.length} traders</span>
        </div>
        <div className="market-stats-right">
          <span className={market.momentum.startsWith("+") ? "positive" : "negative"} style={{ fontWeight: 700 }}>
            {market.momentum}
          </span>
          <span className="middot">·</span>
          <span className="market-endsin">{market.endsIn}</span>
        </div>
      </div>

      {/* Traders Mini Table */}
      <div className="market-traders" style={{ marginTop: "8px", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
        <div className="market-traders-scroll" style={{ width: "100%" }}>
          <table className="market-traders-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: "var(--muted)", fontWeight: 500, paddingBottom: "6px" }}>Trader</th>
              <th style={{ textAlign: "left", color: "var(--muted)", fontWeight: 500, paddingBottom: "6px" }}>TXs</th>
              <th style={{ textAlign: "left", color: "var(--muted)", fontWeight: 500, paddingBottom: "6px" }}>Inflow</th>
              <th style={{ textAlign: "right", color: "var(--muted)", fontWeight: 500, paddingBottom: "6px" }}>Last</th>
            </tr>
          </thead>
          <tbody>
            {market.traders.slice(0, 3).map((t, idx) => {
              const [yesTxs, noTxs] = t.txs.split("/");
              const isPositiveInflow = t.inflow >= 0;
              const inflowText = isPositiveInflow
                ? `+$${Math.round(t.inflow).toLocaleString()}`
                : `-$${Math.abs(Math.round(t.inflow)).toLocaleString()}`;
              const inflowClass = isPositiveInflow ? "positive" : "negative";
              return (
                <tr
                  key={`${t.name}-${idx}`}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/account/${encodeURIComponent(t.name)}`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      window.location.href = `/account/${encodeURIComponent(t.name)}`;
                    }
                  }}
                  style={{
                    borderTop: idx > 0 ? "1px solid rgba(255, 255, 255, 0.02)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "6px 0", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Image
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${t.name}`}
                        alt={t.name}
                        width={20}
                        height={20}
                        className="avatar"
                        style={{ width: 20, height: 20, borderRadius: "50%" }}
                        unoptimized
                      />
                      <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "110px", display: "inline-block" }}>
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "6px 0" }}>
                    <span className="positive">{yesTxs}</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.2)", margin: "0 6px" }}>/</span>
                    <span className="negative">{noTxs}</span>
                  </td>
                  <td className={inflowClass} style={{ padding: "6px 0", fontWeight: 600 }}>
                    {inflowText}
                  </td>
                  <td style={{ padding: "6px 0", textAlign: "right", color: "var(--muted)" }}>
                    <span>{t.last}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function TrendingMarketsSection() {
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
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/markets/trending?window=${trendWindow}`)
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.items ?? []);
        setMarkets(items);
      })
      .catch((err) => console.error("Error loading trending markets:", err))
      .finally(() => setIsLoading(false));
  }, [trendWindow]);

  const filteredItems = useMemo(() => {
    let result = [...markets];

    if (greaterThan95) {
      result = result.filter((m) => (m.probability ?? 0) > 95);
    }

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

    if (fivePlusTraders) {
      result = result.filter((m) => m.traders.length >= 5);
    }

    // Score/Sharpe filters (requires matching trader profile in mock metadata)
    if (scoreFloor !== "Any") {
      result = result.filter((m) =>
        m.traders.some((t) => {
          const profile = getTraderProfile(t.name);
          return profile && profile.smartScore >= Number(scoreFloor);
        })
      );
    }

    if (sharpeFloor !== "Any") {
      result = result.filter((m) =>
        m.traders.some((t) => {
          const profile = getTraderProfile(t.name);
          return profile && profile.sharpe >= Number(sharpeFloor);
        })
      );
    }

    return result;
  }, [markets, greaterThan95, sportsOnly, endedOnly, lessThan30d, fivePlusTraders, scoreFloor, sharpeFloor]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <div id="trending-markets" style={{ marginTop: "48px" }}>
      <div className="trending-box panel" style={{ padding: 0 }}>
        <div className="trending-header" style={{ padding: "18px 18px 12px 18px" }}>
          <h2 style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            marginBottom: "12px",
            fontFamily: "Inter, sans-serif"
          }}>Trending Markets</h2>

          {/* Filter Row matching screenshot */}
          <div className="trending-filter-row">
            {/* Timeframe selector group */}
            <div className="trending-pill-group">
              {windows.map((w) => (
                <button
                  key={w}
                  className={`trending-pill ${w === trendWindow ? "active" : ""}`}
                  onClick={() => setTrendWindow(w)}
                  type="button"
                >
                  {w}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`trending-filter-button ${greaterThan95 ? "active" : ""}`}
              onClick={() => setGreaterThan95(!greaterThan95)}
            >
              &gt;95%
            </button>

            <button
              type="button"
              className={`trending-filter-button ${sportsOnly ? "active" : ""}`}
              onClick={() => setSportsOnly(!sportsOnly)}
            >
              Sports
            </button>

            <button
              type="button"
              className={`trending-filter-button ${endedOnly ? "active" : ""}`}
              onClick={() => setEndedOnly(!endedOnly)}
            >
              Ended
            </button>

            <button
              type="button"
              className={`trending-filter-button ${lessThan30d ? "active" : ""}`}
              onClick={() => setLessThan30d(!lessThan30d)}
            >
              &lt;30d
            </button>

            <button
              type="button"
              className={`trending-filter-button ${fivePlusTraders ? "active" : ""}`}
              onClick={() => setFivePlusTraders(!fivePlusTraders)}
            >
              5+
            </button>

            <span className="trending-divider" />

            <div className="trending-select-wrapper">
              <select
                className="trending-select"
                value={scoreFloor}
                onChange={(e) => setScoreFloor(e.target.value)}
              >
                <option value="Any">Score</option>
                {scoreOptions.filter(o => o !== "Any").map((v) => (
                  <option key={v} value={v}>{v}+</option>
                ))}
              </select>
            </div>

            <div className="trending-select-wrapper">
              <select
                className="trending-select"
                value={sharpeFloor}
                onChange={(e) => setSharpeFloor(e.target.value)}
              >
                <option value="Any">Sharpe</option>
                {sharpeOptions.filter(o => o !== "Any").map((v) => (
                  <option key={v} value={v}>{v}+</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Scrollable grid area */}
        <div className="trending-scroll-area">
          {/* Grid of cards */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>Loading</div>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Fetching trending markets...</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid var(--border)" }}>
          No trending markets found matching these filters.
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "18px"
          }}>
            {visibleItems.map((market, idx) => (
              <TrendingMarketCard key={`${market.slug}-${idx}`} market={market} />
            ))}
          </div>

          {/* Show More / Show Less button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "22px" }}>
            {visibleCount < filteredItems.length ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="trending-show-more"
                type="button"
              >
                Show More
              </button>
            ) : filteredItems.length > 6 ? (
              <button
                onClick={() => setVisibleCount(6)}
                className="trending-show-more"
                type="button"
              >
                Show Less
              </button>
            ) : null}
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
}
