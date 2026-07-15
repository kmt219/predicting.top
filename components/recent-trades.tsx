import Link from "next/link";
import { RecentTrade } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function RecentTrades({
  items,
  detailed = false
}: {
  items: RecentTrade[];
  detailed?: boolean;
}) {
  if (detailed) {
    return (
      <section className="panel side-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Flow</p>
            <h2>Recent Trades</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table className="leaderboard-table dense-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Score</th>
                <th>Sharpe</th>
                <th>Market</th>
                <th>Side</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((trade) => {
                const isBuy = trade.type !== "sell";
                const tradeStatusClass = isBuy ? "positive" : "negative";
                return (
                  <tr key={trade.id} className={tradeStatusClass}>
                    <td>
                      <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
                    </td>
                    <td className={tradeStatusClass}>
                      {trade.traderScore.toFixed(1)}
                    </td>
                    <td>
                      {trade.traderSharpe != null ? trade.traderSharpe.toFixed(2) : "-"}
                    </td>
                    <td>{trade.marketTitle}</td>
                    <td>{trade.side === "YES" ? "YES" : "NO"}</td>
                    <td>{trade.price}¢</td>
                    <td>{formatCurrency(trade.sizeUsd)}</td>
                    <td className="muted">{trade.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="panel side-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Flow</p>
          <h2>Recent Trades</h2>
        </div>
      </div>
      <div className="stack-list">
        {items.map((trade) => {
          const isBuy = trade.type !== "sell";
          return (
            <div className={`trade-card ${isBuy ? "trade-positive" : "trade-negative"}`} key={trade.id}>
              <div className="trade-card-top">
                <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
                <span className={`pill compact-pill ${isBuy ? "positive-pill" : "negative-pill"}`}>
                  {trade.side === "YES" ? "YES" : "NO"}
                </span>
              </div>
              <p>{trade.marketTitle}</p>
              <div className="trade-meta muted">
                <span>{trade.platform}</span>
                <span>{formatCurrency(trade.sizeUsd)}</span>
                <span className={isBuy ? "positive" : "negative"}>
                  {isBuy ? "BUY" : "SELL"}
                </span>
                <span>{trade.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
