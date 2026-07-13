"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar, FilterChip, FilterDropdown, FilterGroup } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { PositionsList } from "@/components/positions-list";
import { SiteHeader } from "@/components/site-header";
import { getPositions, getTraderProfile } from "@/lib/mock-data";
import { PlatformCode } from "@/lib/types";

const sideOptions = [
  { label: "All", value: "ALL" },
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
] as const;
const platformOptions = [
  { label: "All", value: "ALL" },
  { label: "PM", value: "PM" },
  { label: "KS", value: "KS" },
  { label: "OL", value: "OL" },
] as const;

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
  const [side, setSide] = useState<(typeof sideOptions)[number]["value"]>("ALL");
  const [platform, setPlatform] = useState<(typeof platformOptions)[number]["value"]>("ALL");
  const [hide95, setHide95] = useState(false);
  const [scoreFloor, setScoreFloor] = useState<string>("Any");
  const [sharpeFloor, setSharpeFloor] = useState<string>("Any");
  const [endsFloor, setEndsFloor] = useState<string>("Any");
  const [minExposure, setMinExposure] = useState<string>("Any");

  const positions = getPositions(side, platform as PlatformCode | "ALL");

  const filtered = useMemo(() => {
    return positions.items.filter((market) => {
      // 1. Hide 95%+ (smartMoneyShare >= 95)
      if (hide95 && market.smartMoneyShare >= 95) {
        return false;
      }

      // 2. Score filter
      if (scoreFloor !== "Any") {
        const floor = scoreFloor === "60+" ? 60 : 70;
        if (!market.traders.some((trader) => trader.score >= floor)) {
          return false;
        }
      }

      // 3. Sharpe filter
      if (sharpeFloor !== "Any") {
        const floor = parseFloat(sharpeFloor);
        if (!market.traders.some((trader) => {
          const profile = getTraderProfile(trader.traderSlug);
          return profile ? profile.sharpe >= floor : false;
        })) {
          return false;
        }
      }

      // 4. Ends filter
      if (endsFloor !== "Any") {
        const maxDays = endsFloor === "<30d" ? 30 : 90;
        let daysLeft = 170;
        if (market.slug === "france-world-cup") daysLeft = 6;
        else if (market.slug === "iran-regime-2027") daysLeft = 45;
        
        if (daysLeft > maxDays) {
          return false;
        }
      }

      // 5. Min Exposure filter
      if (minExposure !== "Any") {
        const floor = minExposure === "$250k+" ? 250000 : 400000;
        if (market.marketValueUsd < floor) {
          return false;
        }
      }

      return true;
    });
  }, [positions.items, hide95, scoreFloor, sharpeFloor, endsFloor, minExposure]);

  const totalMarkets = filtered.length;
  const totalPositions = filtered.reduce((acc, item) => acc + item.traders.length, 0);

  return (
    <main className="page-shell">
      <SiteHeader active="positions" />
      <section className="panel positions-hero">
        <PageHeader
          eyebrow="Smart Money Concentration"
          title="Top Positions"
          description="Grouped exposures from top prediction traders across the major platforms."
        />
        <div className="positions-hero-stats">
          <div>
            <strong>{totalMarkets}</strong>
            <span className="muted">Markets</span>
          </div>
          <div>
            <strong>{totalPositions}</strong>
            <span className="muted">Positions</span>
          </div>
        </div>
      </section>

      <FilterBar>
        <FilterDropdown
          label="Side"
          value={side}
          options={sideOptions.map((option) => ({ label: option.label, value: option.value }))}
          onChange={(value) => setSide(value as typeof side)}
        />
        <FilterDropdown
          label="Platform"
          value={platform}
          options={platformOptions.map((option) => ({ label: option.label, value: option.value }))}
          onChange={(value) => setPlatform(value as typeof platform)}
        />
        <FilterChip label="Hide 95%+" active={hide95} onClick={() => setHide95((val) => !val)} />
        <FilterDropdown label="Score" value={scoreFloor} options={scoreOptions} onChange={setScoreFloor} />
        <FilterDropdown label="Sharpe" value={sharpeFloor} options={sharpeOptions} onChange={setSharpeFloor} />
        <FilterDropdown label="Ends" value={endsFloor} options={endsOptions} onChange={setEndsFloor} />
        <FilterDropdown label="Min" value={minExposure} options={minOptions} onChange={setMinExposure} />
      </FilterBar>
      <PositionsList items={filtered} scoreFloor={scoreFloor} sharpeFloor={sharpeFloor} />
    </main>
  );
}
