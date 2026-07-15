import Link from "next/link";
import Image from "next/image";
import { PositionMarket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getTraderProfile } from "@/lib/mock-data";

function getMarketEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("argentina")) return "🇦🇷";
  if (t.includes("iran") || t.includes("iranian")) return "🇮🇷";
  if (t.includes("france")) return "🇫🇷";
  if (t.includes("england")) return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  if (t.includes("spain")) return "🇪🇸";
  if (t.includes("us ") || t.includes("usa") || t.includes("america") || t.includes("united states") || t.includes("invade")) return "🇺🇸";
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
        } else if (market.title.toLowerCase().includes("iran")) {
          prob = 3;
          days = "5mo";
        }

        return (
          <section key={market.slug} className="panel position-card" style={{
            padding: "16px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
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
                <span style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0
                }} aria-hidden="true">
                  {getMarketEmoji(market.title)}
                </span>
                <div>
                  <h2 style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    margin: 0,
                    fontFamily: "Inter, var(--font-sans), sans-serif",
                    lineHeight: "1.3"
                  }}>{market.title}</h2>
                  <p style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    margin: "4px 0 0 0",
                    fontFamily: "Inter, var(--font-sans), sans-serif",
                    fontWeight: 500
                  }}>
                    {prob}¢ · {days}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "Inter, var(--font-sans), sans-serif"
                }}>{formatCurrency(market.marketValueUsd, true)}</div>
                
                <div style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  margin: "4px 0 0 0",
                  fontFamily: "Inter, var(--font-sans), sans-serif"
                }}>
                  <span style={{ color: "var(--muted)", marginRight: 6 }}>Smart</span>
                  <span style={{ color: prob >= 50 ? "var(--green)" : "var(--text)" }}>{prob}%Y</span>
                  <span style={{ color: "var(--muted)", margin: "0 4px" }}>·</span>
                  <span style={{ color: prob < 50 ? "var(--red)" : "var(--text)" }}>{100 - prob}%N</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 }}>
              {renderedTraders.length} traders
            </div>

            {/* Scrollable table container */}
            <div style={{ maxHeight: "220px", overflowY: "auto", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
              <table className="position-table" style={{ fontSize: "0.78rem", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "none" }}>
                    <th style={{ padding: "4px 8px 4px 0", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left" }}>Trader</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left" }}>Side</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left" }}>Score</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left" }}>Entry</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left", whiteSpace: "nowrap" }}>P&amp;L</th>
                    <th style={{ padding: "4px 8px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "left" }}>Shares</th>
                    <th style={{ padding: "4px 8px 4px 0", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", textAlign: "right" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {renderedTraders.map((trader) => {
                    const profile = getTraderProfile(trader.traderSlug);
                    const isXLinked = profile?.xLinked ?? false;

                    const scoreColor = trader.score >= 60 ? "var(--green)" : trader.score >= 40 ? "var(--amber)" : "var(--red)";
                    const sideColor = market.side === "YES" ? "var(--green)" : "var(--red)";

                    return (
                      <tr key={`${market.slug}-${trader.traderSlug}`} style={{ borderBottom: "none" }}>
                        <td style={{ padding: "8px 8px 8px 0", borderTop: "1px solid rgba(255,255,255,0.02)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Image
                              src={`https://api.dicebear.com/9.x/glass/svg?seed=${trader.traderName}`}
                              alt={trader.traderName}
                              width={16}
                              height={16}
                              style={{ borderRadius: "50%" }}
                              unoptimized
                            />
                            <Link href={`/account/${trader.traderSlug}`} style={{ color: "var(--text)", textDecoration: "none", fontWeight: 600 }}>
                              {trader.traderName}
                            </Link>
                            {isXLinked && (
                              <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: "#2563eb",
                                color: "#ffffff",
                                fontSize: "0.55rem",
                                flexShrink: 0
                              }}>
                                <svg viewBox="0 0 24 24" style={{ width: 8, height: 8 }} fill="none" stroke="currentColor" strokeWidth="4">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "8px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: sideColor, fontWeight: 700 }}>
                          {market.side === "YES" ? "Y" : "N"}
                        </td>
                        <td style={{ padding: "8px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: scoreColor, fontWeight: 700 }}>
                          {trader.score}
                        </td>
                        <td style={{ padding: "8px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: "var(--muted)" }}>
                          {Math.round(trader.entry * 100)}¢
                        </td>
                        <td style={{ padding: "8px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", fontWeight: 600, whiteSpace: "nowrap" }} className={trader.pnlUsd >= 0 ? "positive" : "negative"}>
                          {trader.pnlUsd >= 0 ? "+" : ""}{formatCurrency(trader.pnlUsd)}
                        </td>
                        <td style={{ padding: "8px 8px", borderTop: "1px solid rgba(255,255,255,0.02)", color: "var(--muted)" }}>
                          {trader.shares}
                        </td>
                        <td style={{ padding: "8px 8px 4px 0", borderTop: "1px solid rgba(255,255,255,0.02)", textAlign: "right", color: "var(--text)", fontWeight: 700 }}>
                          {formatCurrency(trader.valueUsd)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
