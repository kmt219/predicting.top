import Link from "next/link";
import { PositionMarket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getTraderProfile } from "@/lib/mock-data";

function getMarketEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("argentina")) return "🇦🇷";
  if (t.includes("world cup") || t.includes("fifa")) return "🏆";
  if (t.includes("us ") || t.includes("president") || t.includes("election") || t.includes("trump") || t.includes("harris")) return "🇺🇸";
  if (t.includes("fed ") || t.includes("rate") || t.includes("inflation") || t.includes("interest")) return "🏦";
  if (t.includes("btc") || t.includes("bitcoin") || t.includes("crypto") || t.includes("ethereum") || t.includes("eth")) return "🪙";
  return "🌐";
}

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
    <div className="positions-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map((market) => {
        const renderedTraders = getFilteredTraders(market.traders);
        if (renderedTraders.length === 0) return null;

        // Custom mock mapping for endsIn and probability based on title
        let prob = market.probability ?? 50;
        let days = market.endsIn ?? "12d";
        if (market.title.toLowerCase().includes("argentina")) {
          prob = 83;
          days = "6d";
        }

        return (
          <section key={market.slug} className="panel position-card" style={{
            padding: "14px 16px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--panel)"
          }}>
            {/* Header info matching spec */}
            <div className="position-card-header" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "12px",
              gap: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.5rem", display: "inline-flex", userSelect: "none" }} aria-hidden="true">
                  {getMarketEmoji(market.title)}
                </span>
                <div>
                  <h2 style={{
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    margin: 0,
                    fontFamily: "Inter, var(--font-sans), sans-serif",
                    lineHeight: "1.3"
                  }}>{market.title}</h2>
                  <p style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    margin: "4px 0 0 0",
                    fontFamily: "Inter, var(--font-sans), sans-serif"
                  }}>
                    {prob}¢ · {days}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  fontFamily: "Inter, var(--font-sans), sans-serif"
                }}>{formatCurrency(market.marketValueUsd, true)}</span>
              </div>
            </div>

            {/* Compact traders sub-table */}
            <div style={{ overflowX: "auto", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "8px" }}>
              <table className="position-table" style={{ fontSize: "0.78rem", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "none" }}>
                    <th style={{ padding: "4px 8px 4px 0", color: "var(--muted)", fontWeight: 500, border: "none" }}>Trader</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 500, border: "none" }}>Score</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 500, border: "none" }}>Entry</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 500, border: "none" }}>P&amp;L</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 500, border: "none" }}>Shares</th>
                    <th style={{ padding: "4px 8px 4px 0", color: "var(--muted)", fontWeight: 500, border: "none", textAlign: "right" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {renderedTraders.map((trader) => (
                    <tr key={`${market.slug}-${trader.traderSlug}`} style={{ borderBottom: "none" }}>
                      <td style={{ padding: "4px 8px 4px 0", borderTop: "1px solid rgba(255,255,255,0.02)" }}>
                        <Link href={`/account/${trader.traderSlug}`} style={{ color: "#5ea5ff", textDecoration: "none", fontWeight: 500 }}>{trader.traderName}</Link>
                      </td>
                      <td style={{ padding: "4px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: "#ffffff" }}>{trader.score}</td>
                      <td style={{ padding: "4px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: "var(--muted)" }}>{trader.entry.toFixed(2)}</td>
                      <td style={{ padding: "4px 8px", borderTop: "1px solid rgba(255,255,255,0.02)" }} className={trader.pnlUsd >= 0 ? "positive" : "negative"}>
                        {trader.pnlUsd >= 0 ? "+" : ""}{formatCurrency(trader.pnlUsd)}
                      </td>
                      <td style={{ padding: "4px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: "var(--muted)" }}>{trader.shares}</td>
                      <td style={{ padding: "4px 8px 4px 0", borderTop: "1px solid rgba(255,255,255,0.02)", textAlign: "right", color: "#ffffff", fontWeight: 500 }}>
                        {formatCurrency(trader.valueUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
