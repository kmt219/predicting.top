import { FilterBar, FilterChip, FilterGroup, FilterSelect } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { RecentTrades } from "@/components/recent-trades";
import { SiteHeader } from "@/components/site-header";
import { getRecentTrades } from "@/lib/mock-data";

export default function RecentTradesPage() {
  const trades = getRecentTrades();

  return (
    <main className="page-shell">
      <SiteHeader active="trades" />
      <section className="panel page-panel">
        <PageHeader
          eyebrow="Execution Flow"
          title="Recent Trades"
          description="Watch where top traders are deploying size right now and compare that flow against score and market context."
        />
        <FilterBar stacked>
          <FilterGroup>
            <FilterChip label="$100+" active />
            <FilterChip label="$1k+" />
            <FilterChip label="$10k+" />
          </FilterGroup>
          <FilterGroup>
            <FilterChip label=">95%" />
            <FilterChip label="Sports" active />
            <FilterSelect label="Score" />
            <FilterSelect label="Sharpe" />
          </FilterGroup>
        </FilterBar>
      </section>

      <RecentTrades items={trades.items} detailed />
    </main>
  );
}
