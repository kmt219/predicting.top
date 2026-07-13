import Link from "next/link";

export function SiteHeader({
  active
}: {
  active: "leaderboard" | "positions" | "trending" | "trades";
}) {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Realtime Prediction Intel</p>
        <h1>Prediction Leaderboard</h1>
        <p className="muted intro-copy">
          Track the top prediction traders across Polymarket, Kalshi, and Opinion Labs.
        </p>
      </div>
      <nav className="header-nav panel">
        <Link className={active === "leaderboard" ? "active" : ""} href="/">
          Leaderboard
        </Link>
        <Link className={active === "positions" ? "active" : ""} href="/positions">
          Positions
        </Link>
        <Link className={active === "trending" ? "active" : ""} href="/markets/trending">
          Trending Markets
        </Link>
        <Link className={active === "trades" ? "active" : ""} href="/trades/recent">
          Recent Trades
        </Link>
      </nav>
    </header>
  );
}
