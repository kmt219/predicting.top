import Image from "next/image";
import Link from "next/link";
import { MetricGrid, defaultProfileMetrics } from "@/components/metric-grid";
import { PlatformBadges } from "@/components/platform-badges";
import { ProfileChart } from "@/components/profile-chart";
import { getTraderProfile } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function TraderProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getTraderProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="profile-backbar">
        <Link href="/" className="pill">
          Back to Leaderboard
        </Link>
      </div>

      <section className="panel profile-header">
        <div className="profile-header-main">
          <Image src={profile.avatarUrl} alt={profile.displayName} width={92} height={92} className="avatar avatar-lg" unoptimized />
          <div>
            <h1>{profile.displayName}</h1>
            <PlatformBadges platforms={profile.platforms} />
            <p className="muted profile-meta">
              Joined {profile.joinedDaysAgo}d ago · {profile.profileViews.toLocaleString()} views
            </p>
            <p className="muted profile-wallet">{profile.wallet}</p>
            <p className="profile-bio">{profile.bio}</p>
          </div>
        </div>
        <div className="profile-summary">
          <div className="panel summary-strip">
            <span className="muted">{profile.monthLabel}</span>
            <strong className="positive">{formatCurrency(profile.monthlyPnlUsd)}</strong>
            <span className="muted">
              {profile.wins}W / {profile.losses}L
            </span>
          </div>
          <div className="day-chip-row">
            {profile.dayResults.map((result, index) => (
              <span key={`${result}-${index}`} className={`day-chip ${result}`} />
            ))}
          </div>
        </div>
      </section>

      <ProfileChart data={profile.pnlHistory} />
      <MetricGrid metrics={defaultProfileMetrics(profile)} />
    </main>
  );
}
