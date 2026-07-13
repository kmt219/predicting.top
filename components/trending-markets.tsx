import { TrendingMarket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function TrendingMarkets({
  items,
  window,
  detailed = false
}: {
  items: TrendingMarket[];
  window: string;
  detailed?: boolean;
}) {
  return (
    <section className="panel side-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Pulse</p>
          <h2>Trending Markets</h2>
        </div>
        <span className="pill">{window}</span>
      </div>
      <div className="stack-list">
        {items.map((market) => (
          <a key={market.slug} href={market.url} target="_blank" rel="noreferrer" className="market-card">
            <div className="market-topline">
              <span className="pill compact-pill">{market.platform}</span>
              <span className={market.momentum.startsWith("-") ? "negative" : "positive"}>{market.momentum}</span>
            </div>
            <h3>{market.title}</h3>
            <div className="market-stats-row">
              <p className="muted">{market.volumeLabel}</p>
              <p className={market.probability >= 50 ? "positive" : "negative"}>{market.probability}%</p>
            </div>
            {detailed ? (
              <div className="mini-table">
                <div className="mini-table-head muted">
                  <span>Trader</span>
                  <span>TXs</span>
                  <span>Inflow</span>
                  <span>Last</span>
                </div>
                {market.traders.map((trader) => (
                  <div className="mini-table-row" key={`${market.slug}-${trader.name}`}>
                    <span>{trader.name}</span>
                    <span>{trader.txs}</span>
                    <span className={trader.inflow >= 0 ? "positive" : "negative"}>{formatCurrency(trader.inflow, true)}</span>
                    <span className="muted">{trader.last}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Active traders: {market.traders.map((trader) => trader.name).join(", ")}</p>
            )}
            <p className="muted market-footnote">{market.endsIn}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
