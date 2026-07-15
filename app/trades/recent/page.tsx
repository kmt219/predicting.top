"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar, FilterChip, FilterDropdown, FilterGroup } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { RecentTrades } from "@/components/recent-trades";
import { SiteHeader } from "@/components/site-header";
import { RecentTrade } from "@/lib/types";

const sizeOptions = [
  { label: "$100+", value: "100" },
  { label: "$1,000+", value: "1000" },
  { label: "$10,000+", value: "10000" }
] as const;
const priceOptions = [
  { label: "Any", value: "Any" },
  { label: ">95%", value: ">95%" }
];
const categoryOptions = [
  { label: "Any", value: "Any" },
  { label: "Sports", value: "Sports" }
];
const scoreOptions = [
  { label: "Any", value: "Any" },
  { label: "50", value: "50" },
  { label: "60", value: "60" },
  { label: "70", value: "70" },
  { label: "80", value: "80" }
];
const sharpeOptions = [
  { label: "Any", value: "Any" },
  { label: "0.0", value: "0" },
  { label: "0.5", value: "0.5" },
  { label: "1.0", value: "1.0" },
  { label: "1.5", value: "1.5" },
  { label: "2.0", value: "2.0" }
];

export default function RecentTradesPage() {
  const [minSize, setMinSize] = useState<(typeof sizeOptions)[number]["value"]>("100");
  const [scoreFilterActive, setScoreFilterActive] = useState(false);
  const [sharpeFilterActive, setSharpeFilterActive] = useState(false);
  const [scoreFloor, setScoreFloor] = useState("Any");
  const [sharpeFloor, setSharpeFloor] = useState("Any");
  const [greaterThan95, setGreaterThan95] = useState(false);
  const [sportsOnly, setSportsOnly] = useState(false);

  const [trades, setTrades] = useState<{ items: RecentTrade[] }>(() => ({ items: [] }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/trades/recent?limit=100&minAmount=${minSize}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch recent trades");
        return res.json();
      })
      .then(data => {
        setTrades({ items: data.items || [] });
      })
      .catch(err => console.error("Error loading recent trades:", err))
      .finally(() => setIsLoading(false));
  }, [minSize]);

  const handleScoreChipClick = () => {
    if (scoreFilterActive) {
      setScoreFilterActive(false);
      setScoreFloor("Any");
    } else {
      setScoreFilterActive(true);
      setScoreFloor("70");
    }
  };

  const handleSharpeChipClick = () => {
    if (sharpeFilterActive) {
      setSharpeFilterActive(false);
      setSharpeFloor("Any");
    } else {
      setSharpeFilterActive(true);
      setSharpeFloor("1.0");
    }
  };

  const handleScoreDropdownChange = (val: string) => {
    setScoreFloor(val);
    setScoreFilterActive(val !== "Any");
  };

  const handleSharpeDropdownChange = (val: string) => {
    setSharpeFloor(val);
    setSharpeFilterActive(val !== "Any");
  };

  const filtered = useMemo(() => {
    return trades.items
      .filter((trade) => {
        if (trade.sizeUsd < Number(minSize)) return false;
        if (greaterThan95 && trade.price < 95) return false;
        if (sportsOnly && trade.category !== "Sports") return false;

        if (scoreFilterActive && scoreFloor !== "Any" && trade.traderScore < Number(scoreFloor)) return false;
        if (sharpeFilterActive && sharpeFloor !== "Any" && (trade.traderSharpe == null || trade.traderSharpe < Number(sharpeFloor))) return false;

        return true;
      });
  }, [minSize, scoreFloor, sharpeFloor, scoreFilterActive, sharpeFilterActive, greaterThan95, sportsOnly, trades.items]);

  return (
    <main className="page-shell">
      <SiteHeader active="trades" />
      <section className="panel page-panel">
        <PageHeader
          eyebrow="Execution Flow"
          title="Recent Trades"
          description="Watch where top traders are deploying size right now and compare that flow against score and market context."
        />
        <FilterBar className="one-row">
          <FilterDropdown
            label="Size"
            value={minSize}
            options={sizeOptions.map((option) => ({ label: option.label, value: option.value }))}
            onChange={(value) => setMinSize(value as typeof sizeOptions[number]["value"])}
          />
          <FilterDropdown
            label=">95%"
            value={greaterThan95 ? ">95%" : "Any"}
            options={priceOptions}
            onChange={(value) => setGreaterThan95(value === ">95%")}
          />
          <FilterDropdown
            label="Sports"
            value={sportsOnly ? "Sports" : "Any"}
            options={categoryOptions}
            onChange={(value) => setSportsOnly(value === "Sports")}
          />
          <FilterDropdown
            label="Score"
            value={scoreFloor}
            options={scoreOptions}
            onChange={handleScoreDropdownChange}
          />
          <FilterDropdown
            label="Sharpe"
            value={sharpeFloor}
            options={sharpeOptions}
            onChange={handleSharpeDropdownChange}
          />
        </FilterBar>
      </section>

      <RecentTrades items={filtered} detailed />
    </main>
  );
}
