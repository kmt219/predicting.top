import Link from "next/link";
import { PositionMarket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getTraderProfile } from "@/lib/mock-data";

export function PositionsList({
  items,
  scoreFloor = "Any",
  sharpeFloor = "Any"
}: {
  items: PositionMarket[];
  scoreFloor?: string;
  sharpeFloor?: string;
}) {
  const getFilteredTraders = (tradersList: PositionMarket["traders"]) => {
    return tradersList.filter((trader) => {
      // Score filter
      if (scoreFloor !== "Any") {
        const floor = scoreFloor === "60+" ? 60 : 70;
        if (trader.score < floor) return false;
      }
      // Sharpe filter
      if (sharpeFloor !== "Any") {
        const floor = parseFloat(sharpeFloor);
        const profile = getTraderProfile(trader.traderSlug);
        if (!profile || profile.sharpe < floor) return false;
      }
      return true;
    });
  };

  return (
    <div className="positions-list">
      {items.map((market) => {
        const renderedTraders = getFilteredTraders(market.traders);
        if (renderedTraders.length === 0) return null;

        return (
          <section key={market.slug} className="panel position-card">
            <div className="position-card-header">
              <div>
                <p className="eyebrow">
                  {market.platform}
                  {market.priceLabel ? ` · ${market.priceLabel}` : ""}
                  {market.endsIn ? ` · ${market.endsIn}` : ""}
                  {` · ${market.tradersCount || market.traders.length} traders`}
                </p>
                <h2>{market.title}</h2>
              </div>
              <div className="position-stats">
                <strong>{formatCurrency(market.marketValueUsd, true)}</strong>
                <span className="muted">
                  {market.smartMoneyYes !== undefined && market.smartMoneyNo !== undefined
                    ? `Smart ${market.smartMoneyYes}%Y · ${market.smartMoneyNo}%N`
                    : `Smart money ${market.smartMoneyShare}%`}
                </span>
              </div>
            </div>
            <table className="position-table">
              <thead>
                <tr>
                  <th>Trader</th>
                  <th>Side</th>
                  <th>Score</th>
                  <th>Entry</th>
                  <th>P&amp;L</th>
                  <th>Shares</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {renderedTraders.map((trader) => (
                  <tr key={`${market.slug}-${trader.traderSlug}-${trader.side}`}>
                    <td>
                      <Link href={`/account/${trader.traderSlug}`}>{trader.traderName}</Link>
                    </td>
                    <td 
                      className={trader.side === "YES" ? "positive" : "negative"}
                      style={{ fontWeight: 600 }}
                    >
                      {trader.side === "YES" ? "Y" : "N"}
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
        );
      })}
    </div>
  );
}
