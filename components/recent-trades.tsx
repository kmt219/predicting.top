import Link from "next/link";
import { RecentTrade } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getTraderProfile } from "@/lib/mock-data";

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
                const trader = getTraderProfile(trade.traderSlug);
                const score = trader ? trader.smartScore : 0;
                const sharpe = trader ? trader.sharpe : 0;
                const tradeStatusClass = trade.traderScore >= 0 ? "positive" : "negative";
                return (
                  <tr key={trade.id} className={tradeStatusClass}>
                    <td>
                      <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
                    </td>
                    <td className={tradeStatusClass}>
                      {trader ? score.toFixed(1) : "-"}
                    </td>
                    <td>
                      {trader ? sharpe.toFixed(2) : "-"}
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
        {items.map((trade) => (
          <div className={`trade-card ${trade.traderScore >= 0 ? "trade-positive" : "trade-negative"}`} key={trade.id}>
            <div className="trade-card-top">
              <Link href={`/account/${trade.traderSlug}`}>{trade.traderName}</Link>
              <span className={`pill compact-pill ${trade.traderScore >= 0 ? "positive-pill" : "negative-pill"}`}>
                {trade.side === "YES" ? "YES" : "NO"}
              </span>
            </div>
            <p>{trade.marketTitle}</p>
            <div className="trade-meta muted">
              <span>{trade.platform}</span>
              <span>{formatCurrency(trade.sizeUsd)}</span>
              <span className={trade.traderScore >= 0 ? "positive" : "negative"}>
                {trade.traderScore >= 0 ? `+${trade.traderScore.toFixed(2)}` : trade.traderScore.toFixed(2)}
              </span>
              <span>{trade.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
