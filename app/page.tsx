"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar, FilterChip, FilterGroup } from "@/components/filter-bar";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { SiteHeader } from "@/components/site-header";
import { getLeaderboard } from "@/lib/mock-data";
import { LeaderboardSortKey, PeriodKey, PlatformCode } from "@/lib/types";

const periods: PeriodKey[] = ["ALL", "YTD", "1M", "1D"];
const platformKeys: PlatformCode[] = ["PM", "KS", "OL"];
const sortKeys: Array<{ label: string; value: LeaderboardSortKey }> = [
  { label: "Sharpe", value: "sharpe" },
  { label: "Win%", value: "win_rate" },
  { label: "ROI", value: "roi" }
];

const platformIcons: Record<PlatformCode, React.ReactNode> = {
  PM: <span className="platform-filter-icon pm" aria-hidden="true" />,
  KS: <span className="platform-filter-icon ks" aria-hidden="true" />,
  OL: <span className="platform-filter-icon ol" aria-hidden="true" />
};

export default function HomePage() {
  const [period, setPeriod] = useState<PeriodKey>("ALL");
  const [platform, setPlatform] = useState<"ALL" | PlatformCode>("ALL");
  const [sort, setSort] = useState<LeaderboardSortKey>("pnl"); // Set default sort to pnl to match production
  const [search, setSearch] = useState("");
  const [xLinkedOnly, setXLinkedOnly] = useState(false);

  const [leaderboard, setLeaderboard] = useState<{ total: number; items: any[] }>(() => ({
    total: 0,
    items: []
  }));
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [dailyProfit, setDailyProfit] = useState<number | null>(null);
  const [tradersCount, setTradersCount] = useState(280);
  const [updatedTime, setUpdatedTime] = useState("");

  const pageCount = Math.max(1, Math.ceil(leaderboard.total / itemsPerPage));
  const paginatedItems = useMemo(
    () => leaderboard.items.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [leaderboard.items, page]
  );

  // Toggle sorting logic (deselecting resets to default P&L sort)
  const toggleSort = (value: LeaderboardSortKey) => {
    if (sort === value) {
      setSort("pnl");
    } else {
      setSort(value);
    }
  };

  useEffect(() => {
    // Fetch live daily profit and trader count statistics
    fetch("/api/v1/daily-profit")
      .then(res => res.json())
      .then(data => {
        if (data && data.dailyProfit !== undefined) {
          setDailyProfit(data.dailyProfit);
          setTradersCount(data.tradersCount);
        }
      })
      .catch(err => console.error("Error loading daily profit stats:", err));
  }, []);

  useEffect(() => {
    // Fetch filtered leaderboard
    setPage(1);
    fetch(`/api/v1/leaderboard?period=${period}&platform=${platform}&sort=${sort}&search=${encodeURIComponent(search)}&xLinkedOnly=${xLinkedOnly}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "<failed to read body>");
          throw new Error(`Leaderboard fetch failed: ${res.status} ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error loading leaderboard:", err));
  }, [period, platform, sort, search, xLinkedOnly]);

  useEffect(() => {
    // Format updated timestamp relative to browser's current local time
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    setUpdatedTime(`P&L updated ${formatted}`);
  }, [period, platform, sort, search, xLinkedOnly]);

  const formattedToday = useMemo(() => {
    if (dailyProfit === null) return "Today: ...";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(dailyProfit));
    return dailyProfit >= 0 ? `Today: +${formatted}` : `Today: -${formatted}`;
  }, [dailyProfit]);

  const todayPnlClass = dailyProfit !== null && dailyProfit >= 0 ? "positive" : "negative";

  return (
    <main className="page-shell">
      <SiteHeader active="leaderboard" />

      <section className="homepage-grid">
          <div className="hero-section">
            <div className="custom-hero-header compact-hero-header">
              <div>
                <p className="eyebrow hero-label">Prediction Leaderboard</p>
                <h1 className="custom-title">Prediction Leaderboard</h1>
                <p className="custom-subtitle">Track the top prediction traders in realtime with clean filters and score-first ranking.</p>
                <span className="update-time">{updatedTime || "P&L updated recently"}</span>
              </div>
              <div className="custom-header-right">
                <span 
                  className="today-pnl"
                  style={{ color: dailyProfit !== null && dailyProfit >= 0 ? "var(--green)" : "var(--red)" }}
                >
                  {formattedToday}
                </span>
              </div>
            </div>

            <div className="search-row">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search traders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="traders-count-text">
                {leaderboard.total} of {tradersCount} traders
              </span>
            </div>

            <FilterBar className="compact-filter-bar">
              <FilterGroup>
                <span className="filter-label-prefix">P&L:</span>
                {periods.map((item) => (
                  <FilterChip key={item} label={item} active={item === period} onClick={() => setPeriod(item)} />
                ))}
                {platformKeys.map((item) => (
                  <FilterChip key={item} label={item} icon={platformIcons[item]} active={platform === item} onClick={() => setPlatform(item)} />
                ))}
                <FilterChip label="All" active={platform === "ALL"} onClick={() => setPlatform("ALL")} />
                <FilterChip label="X linked" active={xLinkedOnly} onClick={() => setXLinkedOnly(!xLinkedOnly)} />
                <FilterChip label="Smart Score" active={sort === "smart_score"} onClick={() => toggleSort("smart_score")} />
                {sortKeys.map((item) => (
                  <FilterChip key={item.value} label={item.label} active={sort === item.value} onClick={() => toggleSort(item.value)} />
                ))}
              </FilterGroup>
            </FilterBar>

          <LeaderboardTable traders={paginatedItems} sort={sort} />

          {pageCount > 1 ? (
            <div className="pagination-row">
              <button type="button" className="pagination-button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span className="pagination-label">
                Page {page} of {pageCount}
              </span>
              <button type="button" className="pagination-button" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
