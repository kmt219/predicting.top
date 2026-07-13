import { FilterBar, FilterChip, FilterGroup, FilterSelect } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { PositionsList } from "@/components/positions-list";
import { SiteHeader } from "@/components/site-header";
import { getPositions } from "@/lib/mock-data";

export default function PositionsPage() {
  const positions = getPositions();

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
            <strong>{positions.totalMarkets}</strong>
            <span className="muted">Markets</span>
          </div>
          <div>
            <strong>{positions.totalPositions}</strong>
            <span className="muted">Positions</span>
          </div>
        </div>
      </section>

      <FilterBar stacked>
        <FilterGroup label="Side">
          <FilterChip label="All" active />
          <FilterChip label="Yes" />
          <FilterChip label="No" />
        </FilterGroup>
        <FilterGroup>
          <FilterChip label="Hide 95%+" active />
          <FilterSelect label="Score: Any" />
          <FilterSelect label="Sharpe: Any" />
          <FilterSelect label="Ends: Any" />
          <FilterSelect label="Min: Any" />
        </FilterGroup>
      </FilterBar>

      <PositionsList items={positions.items} />
    </main>
  );
}
