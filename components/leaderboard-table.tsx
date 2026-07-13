import Image from "next/image";
import Link from "next/link";
import { LeaderboardSortKey, TraderSummary } from "@/lib/types";
import { PlatformBadges } from "@/components/platform-badges";

export function LeaderboardTable({
  traders,
  sort = "smart_score"
}: {
  traders: TraderSummary[];
  sort?: LeaderboardSortKey;
}) {
  const formatPnl = (val: number) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
    return val >= 0 ? `+${formatted}` : formatted;
  };

  const renderMetricHeader = () => {
    if (sort === "sharpe") return "Sharpe";
    if (sort === "win_rate") return "Win%";
    if (sort === "roi") return "ROI";
    return "Score";
  };

  const renderMetricValue = (trader: TraderSummary) => {
    if (sort === "sharpe") return trader.sharpe.toFixed(2);
    if (sort === "win_rate") return `${trader.winRate.toFixed(1)}%`;
    if (sort === "roi") return `${trader.roi.toFixed(1)}%`;
    return trader.smartScore.toFixed(1);
  };

  return (
    <div className="panel table-panel">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Trader</th>
            <th>Joined</th>
            <th>{renderMetricHeader()}</th>
            <th style={{ textAlign: "right" }}>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {traders.map((trader) => {
            const pnlClass = trader.pnlUsd >= 0 ? "positive" : "negative";
            return (
              <tr key={trader.slug}>
                <td className="rank-col">{trader.rank}</td>
                <td>
                  <div className="trader-cell">
                    <Image src={trader.avatarUrl} alt={trader.displayName} width={44} height={44} className="avatar" unoptimized />
                    <div className="trader-info">
                      <Link href={`/account/${trader.slug}`} className="trader-link">
                        {trader.displayName}
                      </Link>
                      <div className="social-badges-row">
                        {trader.xLinked && <span className="x-badge">X</span>}
                        <PlatformBadges platforms={trader.platforms} compact />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{trader.joinedDaysAgo}d</td>
                <td className={trader.smartScore >= 70 ? "positive" : trader.smartScore >= 50 ? "" : "negative"}>
                  {renderMetricValue(trader)}
                </td>
                <td className={`${pnlClass} profit-col`}>
                  {formatPnl(trader.pnlUsd)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
