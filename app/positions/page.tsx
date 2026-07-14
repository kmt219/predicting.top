"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FilterBar, FilterChip } from "@/components/filter-bar";
import { SiteHeader } from "@/components/site-header";
import { PositionsList } from "@/components/positions-list";
import { PositionMarket } from "@/lib/types";

const scoreOptions = [
  { label: "Any", value: "Any" },
  { label: "60+", value: "60+" },
  { label: "70+", value: "70+" }
];
const sharpeOptions = [
  { label: "Any", value: "Any" },
  { label: "1.0+", value: "1.0+" },
  { label: "1.5+", value: "1.5+" },
  { label: "2.0+", value: "2.0+" }
];
const endsOptions = [
  { label: "Any", value: "Any" },
  { label: "<30d", value: "<30d" },
  { label: "<90d", value: "<90d" }
];
const minOptions = [
  { label: "Any", value: "Any" },
  { label: "$250k+", value: "$250k+" },
  { label: "$400k+", value: "$400k+" }
];

export default function PositionsPage() {
  const [side, setSide] = useState<"ALL" | "YES" | "NO">("ALL");
  const platform = "ALL" as const;
  const [hide95, setHide95] = useState(false);
  const [scoreFloor, setScoreFloor] = useState<string>("Any");
  const [sharpeFloor, setSharpeFloor] = useState<string>("Any");
  const [endsFloor, setEndsFloor] = useState<string>("Any");
  const [minExposure, setMinExposure] = useState<string>("Any");

  const [allPositions, setAllPositions] = useState<PositionMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live positions from API whenever side/platform changes
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/positions?side=${side}&platform=${platform}`)
      .then((r) => r.json())
      .then((data) => {
        const items: PositionMarket[] = data?.items ?? [];
        setAllPositions(items);
      })
      .catch((err) => console.error("[Positions] fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [side, platform]);

  const filtered = useMemo(() => {
    return allPositions.filter((market) => {
      if (hide95 && market.smartMoneyShare >= 95) return false;

      if (scoreFloor !== "Any") {
        const floor = scoreFloor === "60+" ? 60 : 70;
        if (!market.traders.some((trader) => trader.score >= floor)) return false;
      }

      if (minExposure !== "Any") {
        const floor = minExposure === "$250k+" ? 250000 : 400000;
        if (market.marketValueUsd < floor) return false;
      }

      return true;
    });
  }, [allPositions, hide95, scoreFloor, minExposure]);

  const totalMarkets = filtered.length;
  const totalPositions = filtered.reduce((acc, item) => acc + item.traders.length, 0);

  const selectStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "#ffffff",
    padding: "5px 24px 5px 10px",
    fontSize: "0.85rem",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    cursor: "pointer",
    fontFamily: "Inter, var(--font-sans), sans-serif"
  };

  const labelPrefixStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--muted)",
    textTransform: "uppercase",
    fontFamily: "Inter, var(--font-sans), sans-serif"
  };

  return (
    <main className="page-shell">
      <SiteHeader active="positions" />
      <section className="panel page-panel" style={{ marginBottom: "24px" }}>
        <div className="page-header-row">
          <div>
            <p className="eyebrow">Conviction</p>
            <h1 className="page-title">Top Positions</h1>
            <p className="muted" style={{ marginTop: 10, maxWidth: 680, fontSize: "0.95rem" }}>$1k+ positions from top prediction traders</p>
          </div>

          <div className="page-header-actions" style={{ gap: 10 }}>
            <Link
              href="/"
              className="nav-tab active"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                color: "var(--text)",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--border)",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Leaderboard
            </Link>
            <button
              type="button"
              aria-label="Refresh positions"
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.04)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ↻
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", marginBottom: 18, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={labelPrefixStyle}>Side:</span>
            <FilterChip label="All" active={side === "ALL"} onClick={() => setSide("ALL")} style={side === "ALL" ? { background: "#ffffff", color: "#000000", fontWeight: 700 } : { color: "var(--muted)", fontWeight: 700 }} />
            <FilterChip label="Yes" active={side === "YES"} onClick={() => setSide("YES")} style={side === "YES" ? { background: "#ffffff", color: "#000000", fontWeight: 700 } : { color: "var(--muted)", fontWeight: 700 }} />
            <FilterChip label="No" active={side === "NO"} onClick={() => setSide("NO")} style={side === "NO" ? { background: "#ffffff", color: "#000000", fontWeight: 700 } : { color: "var(--muted)", fontWeight: 700 }} />
          </div>

          <span style={{ fontSize: "0.95rem", color: "var(--muted)", fontFamily: "Inter, var(--font-sans), sans-serif" }}>
            {isLoading ? "—" : totalMarkets} markets · {isLoading ? "—" : totalPositions} positions
          </span>
        </div>

        <FilterBar className="compact-filter-bar" style={{ gap: "14px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <FilterChip
            label="Hide 95%+"
            active={hide95}
            onClick={() => setHide95((val) => !val)}
            style={hide95 ? { background: "#ffffff", color: "#000000", fontWeight: 700 } : { color: "var(--muted)", fontWeight: 700 }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={labelPrefixStyle}>Score:</span>
            <select value={scoreFloor} onChange={(e) => setScoreFloor(e.target.value)} style={selectStyle}>
              {scoreOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#111", color: "#fff" }}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={labelPrefixStyle}>Sharpe:</span>
            <select value={sharpeFloor} onChange={(e) => setSharpeFloor(e.target.value)} style={selectStyle}>
              {sharpeOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#111", color: "#fff" }}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={labelPrefixStyle}>Ends:</span>
            <select value={endsFloor} onChange={(e) => setEndsFloor(e.target.value)} style={selectStyle}>
              {endsOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#111", color: "#fff" }}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={labelPrefixStyle}>Min:</span>
            <select value={minExposure} onChange={(e) => setMinExposure(e.target.value)} style={selectStyle}>
              {minOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#111", color: "#fff" }}>{opt.label}</option>
              ))}
            </select>
          </div>
        </FilterBar>
      </section>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>Loading</div>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Fetching live positions from Polymarket…</p>
        </div>
      ) : (
        <PositionsList items={filtered} scoreFloor={scoreFloor} sharpeFloor={sharpeFloor} />
      )}
    </main>
  );
}
