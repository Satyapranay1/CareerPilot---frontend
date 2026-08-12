import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Badge, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-1.5">
        {eyebrow && (
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span className="size-1 rounded-full bg-primary" /> {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  suffix,
  tone = "default",
  spark,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
  suffix?: string;
  tone?: "default" | "success" | "warning" | "brand";
  spark?: ReactNode;
}) {
  const positive = (delta ?? 0) >= 0;
  const toneRing =
    tone === "brand"
      ? "before:bg-primary/15"
      : tone === "success"
        ? "before:bg-success/15"
        : tone === "warning"
          ? "before:bg-warning/20"
          : "before:bg-muted";
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/70 bg-card/60 shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow",
      )}
    >
      <div className={cn("pointer-events-none absolute -right-6 -top-6 size-24 rounded-full blur-2xl before:absolute before:inset-0 before:rounded-full", toneRing)} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">
                {value}
              </span>
              {suffix && (
                <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
              )}
            </div>
          </div>
          {Icon && (
            <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors group-hover:text-primary">
              <Icon className="size-4" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          {delta !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                positive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta)}%
            </div>
          )}
          {spark && <div className="ml-auto h-8 w-24">{spark}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <Card className={cn("overflow-hidden border-border/70 bg-card/60 shadow-elevated", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3.5">
          <div className="min-w-0">
            {title && <div className="truncate text-sm font-semibold">{title}</div>}
            {description && (
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{description}</div>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </div>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
      <div className="grid size-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <div className="mt-3 text-sm font-semibold">{title}</div>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DifficultyPill({
  level,
}: {
  level: string;
}) {
  const difficulty = String(level ?? "").toUpperCase();

  let displayName = level;
  let styles = "border-border bg-background text-foreground";

  if (difficulty === "EASY") {
    displayName = "Easy";
    styles =
      "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";
  } else if (difficulty === "MEDIUM") {
    displayName = "Medium";
    styles =
      "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
  } else if (difficulty === "HARD") {
    displayName = "Hard";
    styles =
      "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  }

  return (
    <Badge
      variant="outline"
      className={styles}
    >
      {displayName}
    </Badge>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Solved: "bg-success/10 text-success ring-success/20",
    Attempted: "bg-warning/15 text-warning ring-warning/25",
    Bookmarked: "bg-info/10 text-info ring-info/20",
    Todo: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        map[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      <span className={cn(
        "size-1.5 rounded-full",
        status === "Solved" && "bg-success",
        status === "Attempted" && "bg-warning",
        status === "Bookmarked" && "bg-info",
      )} />
      {status}
    </span>
  );
}

export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.2 264)" />
            <stop offset="100%" stopColor="oklch(0.7 0.22 300)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-semibold tabular-nums">{value}</div>
          {label && <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>}
          {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function CompanyLogo({ name, color }: { name: string; color?: string }) {
  return (
    <div
      className="grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white ring-1 ring-inset ring-white/10"
      style={{ background: color ?? "oklch(0.5 0.1 264)" }}
    >
      {name[0]}
    </div>
  );
}