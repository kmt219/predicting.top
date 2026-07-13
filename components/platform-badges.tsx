import { PlatformCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const labelMap: Record<PlatformCode, string> = {
  PM: "Polymarket",
  KS: "Kalshi",
  OL: "Opinion Labs"
};

function platformLogo(platform: PlatformCode) {
  if (platform === "PM") {
    return (
      <svg viewBox="0 0 24 24" className="platform-logo" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#2e65ff" />
        <path d="M9 8h2.5a3.5 3.5 0 0 1 0 7H9V8Z" fill="#fff" />
        <path d="M11 15.5h2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (platform === "KS") {
    return (
      <svg viewBox="0 0 24 24" className="platform-logo" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#00b87c" />
        <path d="M8 8h8v2.5L12 12.5 8 10.5V8Z" fill="#fff" />
        <path d="M8 15.5h8V13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}

export function PlatformBadges({
  platforms,
  compact = false
}: {
  platforms: PlatformCode[];
  compact?: boolean;
}) {
  return (
    <div className="platform-badges">
      {platforms.map((platform) => (
        <span key={platform} className={cn("platform-badge", `platform-${platform.toLowerCase()}`, compact && "compact")}>
          {platformLogo(platform)}
          <strong>{platform}</strong>
          {!compact ? <span>{labelMap[platform]}</span> : null}
        </span>
      ))}
    </div>
  );
}
