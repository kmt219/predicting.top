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
                <th>Market</th>
                <th>Side</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((trade) => (
                <tr key={trade.id}>
                  <td>
                    <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
                  </td>
                  <td className={trade.traderScore >= 0 ? "positive" : "negative"}>{trade.traderScore.toFixed(2)}</td>
                  <td>{trade.marketTitle}</td>
                  <td>{trade.side === "YES" ? "Y" : "N"}</td>
                  <td>{trade.price}¢</td>
                  <td>{formatCurrency(trade.sizeUsd)}</td>
                  <td className="muted">{trade.timestamp}</td>
                </tr>
              ))}
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
        {items.map((trade) => (
          <div className="trade-card" key={trade.id}>
            <div className="trade-card-top">
              <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
              <span className={`pill compact-pill ${trade.side === "YES" ? "positive-pill" : "negative-pill"}`}>
                {trade.side}
              </span>
            </div>
            <p>{trade.marketTitle}</p>
            <div className="trade-meta muted">
              <span>{trade.platform}</span>
              <span>{formatCurrency(trade.sizeUsd)}</span>
              <span>{trade.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
