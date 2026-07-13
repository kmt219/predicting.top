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
        <p className="muted intro-copy">
          Track the top prediction traders across Polymarket, Kalshi, and Opinion Labs.
        </p>
      </div>
      <div className="header-controls">
        <nav className="nav-tabs panel" aria-label="Primary">
        <Link className={active === "leaderboard" ? "nav-tab active" : "nav-tab"} href="/">
          Leaderboard
        </Link>
        <Link className={active === "positions" ? "nav-tab active" : "nav-tab"} href="/positions">
          Positions
        </Link>
        <Link className={active === "trending" ? "nav-tab active" : "nav-tab"} href="/markets/trending">
          Trending Markets
        </Link>
        <Link className={active === "trades" ? "nav-tab active" : "nav-tab"} href="/trades/recent">
          Recent Trades
        </Link>
        </nav>
      </div>
    </header>
  );
}
