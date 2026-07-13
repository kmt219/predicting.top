import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  stacked = false,
  className
}: {
  children: React.ReactNode;
  stacked?: boolean;
  className?: string;
}) {
  return <div className={cn("filter-bar", stacked && "stacked", className)}>{children}</div>;
}

export function FilterGroup({
  label,
  children,
  className
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("filter-group", className)}>
      {label ? <span className="filter-label">{label}</span> : null}
      {children}
    </div>
  );
}

export function FilterChip({
  label,
  active = false,
  icon,
  onClick
}: {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={cn("filter-chip", active && "active")} onClick={onClick} aria-pressed={active}>
      {icon ? <span className="filter-chip-icon">{icon}</span> : null}
      {label}
    </button>
  );
}

export function FilterSelect({
  label,
  onClick
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="filter-select" onClick={onClick}>
      {label}
      <span className="filter-caret">▾</span>
    </button>
  );
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-dropdown">
      <span className="filter-dropdown-label">{label}</span>
      <select
        className={cn("filter-dropdown-select", value !== "Any" && "active")}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
