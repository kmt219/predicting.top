import Link from "next/link";
import { PositionMarket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PositionsList({
  items
}: {
  items: PositionMarket[];
}) {
  return (
    <div className="positions-list">
      {items.map((market) => (
        <section key={market.slug} className="panel position-card">
          <div className="position-card-header">
            <div>
              <p className="eyebrow">{market.platform} {market.side}</p>
              <h2>{market.title}</h2>
            </div>
            <div className="position-stats">
              <strong>{formatCurrency(market.marketValueUsd, true)}</strong>
              <span className="muted">Smart money {market.smartMoneyShare}%</span>
            </div>
          </div>
          <table className="position-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Score</th>
                <th>Entry</th>
                <th>P&amp;L</th>
                <th>Shares</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {market.traders.map((trader) => (
                <tr key={`${market.slug}-${trader.traderSlug}`}>
                  <td>
                    <Link href={`/account/${trader.traderSlug}`}>{trader.traderName}</Link>
                  </td>
                  <td>{trader.score}</td>
                  <td>{trader.entry.toFixed(2)}</td>
                  <td className={trader.pnlUsd >= 0 ? "positive" : "negative"}>{formatCurrency(trader.pnlUsd)}</td>
                  <td>{trader.shares}</td>
                  <td>{formatCurrency(trader.valueUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
