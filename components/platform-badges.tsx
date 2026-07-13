import { PlatformCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const labelMap: Record<PlatformCode, string> = {
  PM: "Polymarket",
  KS: "Kalshi",
  OL: "Opinion Labs"
};

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
          <strong>{platform}</strong>
          {!compact ? <span>{labelMap[platform]}</span> : null}
        </span>
      ))}
    </div>
  );
}
