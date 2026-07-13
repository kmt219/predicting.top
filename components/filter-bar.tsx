import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  stacked = false
}: {
  children: React.ReactNode;
  stacked?: boolean;
}) {
  return <div className={cn("filter-bar", stacked && "stacked")}>{children}</div>;
}

export function FilterGroup({
  label,
  children
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="filter-group">
      {label ? <span className="filter-label">{label}</span> : null}
      {children}
    </div>
  );
}

export function FilterChip({
  label,
  active = false
}: {
  label: string;
  active?: boolean;
}) {
  return <span className={cn("filter-chip", active && "active")}>{label}</span>;
}

export function FilterSelect({
  label
}: {
  label: string;
}) {
  return (
    <span className="filter-select">
      {label}
      <span className="filter-caret">▾</span>
    </span>
  );
}
