import { FilterBar, FilterChip, FilterGroup, FilterSelect } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { SiteHeader } from "@/components/site-header";
import { TrendingMarkets } from "@/components/trending-markets";
import { getTrendingMarkets } from "@/lib/mock-data";

export default function TrendingMarketsPage() {
  const trending = getTrendingMarkets("1W");

  return (
    <main className="page-shell">
      <SiteHeader active="trending" />
      <section className="panel page-panel">
        <PageHeader
          eyebrow="Momentum"
          title="Trending Markets"
          description="Discover the markets attracting the strongest concentration of trader attention and inflow."
        />
        <FilterBar stacked>
          <FilterGroup>
            <FilterChip label="1H" />
            <FilterChip label="6H" />
            <FilterChip label="24H" />
            <FilterChip label="3D" />
            <FilterChip label="1W" active />
          </FilterGroup>
          <FilterGroup>
            <FilterChip label=">95%" />
            <FilterChip label="Sports" active />
            <FilterChip label="Ended" />
            <FilterChip label="<30d" />
            <FilterChip label="5+" />
            <FilterSelect label="Score" />
            <FilterSelect label="Sharpe" />
          </FilterGroup>
        </FilterBar>
      </section>

      <TrendingMarkets items={trending.items} window={trending.window} detailed />
    </main>
  );
}
