import Image from "next/image";
import Link from "next/link";
import { TraderSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { PlatformBadges } from "@/components/platform-badges";

export function LeaderboardTable({
  traders
}: {
  traders: TraderSummary[];
}) {
  return (
    <div className="panel table-panel">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Trader</th>
            <th>Joined</th>
            <th>Score</th>
            <th>P&amp;L</th>
            <th>Sharpe</th>
            <th>Win%</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {traders.map((trader) => (
            <tr key={trader.slug}>
              <td className="rank-col">{trader.rank}</td>
              <td>
                <div className="trader-cell">
                  <Image src={trader.avatarUrl} alt={trader.displayName} width={44} height={44} className="avatar" />
                  <div>
                    <Link href={`/account/${trader.slug}`} className="trader-link">
                      {trader.displayName}
                    </Link>
                    <PlatformBadges platforms={trader.platforms} compact />
                  </div>
                </div>
              </td>
              <td>{trader.joinedDaysAgo}d</td>
              <td className={trader.smartScore >= 70 ? "positive" : trader.smartScore >= 50 ? "" : "negative"}>
                {trader.smartScore.toFixed(1)}
              </td>
              <td className="positive">{formatCurrency(trader.pnlUsd)}</td>
              <td>{trader.sharpe.toFixed(2)}</td>
              <td>{trader.winRate.toFixed(1)}%</td>
              <td>{trader.roi.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
