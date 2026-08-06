import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Sparkles,
  FileText,
  Target,
  Code2,
  Clock,
  Award,
  Layers,
  Flame,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Trophy,
  CalendarClock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DifficultyPill,
  PageHeader,
  ProgressRing,
  SectionCard,
  StatCard,
} from "@/components/ui-kit";
import {
  activities,
  currentUser,
  leaderboard,
  metrics,
  readinessTrend,
  skillRadar,
  topicDistribution,
  upcomingTasks,
  weeklyActivity,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const chartAxis = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-elevated backdrop-blur">
      {label !== undefined && <div className="mb-1 font-medium">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-medium tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5 shadow-elevated sm:p-6">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full gradient-brand opacity-20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="size-3" /> AI-generated daily brief
            </div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back,{" "}
              <span className="text-gradient-brand">{currentUser.name.split(" ")[0]}</span>.
              You're 6 sessions away from Google L5 ready.
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Focus today on Graph problems and one 45-min System Design mock. Your resume is up-to-date, but 4 quick wins remain.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button size="sm" className="gap-1.5 gradient-brand text-white shadow-glow hover:opacity-95">
                <Sparkles className="size-3.5" /> Start today's plan
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Plus className="size-3.5" /> Schedule mock
              </Button>
              <div className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-xs">
                <Flame className="size-3.5 text-amber-400" />
                <span className="font-medium">{currentUser.streak} day streak</span>
                <span className="text-muted-foreground">· +{currentUser.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <ProgressRing value={metrics.interviewReadiness} size={128} stroke={10} label="Ready" sub="Google L5" />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="ATS Score" value={metrics.atsScore} suffix="/100" delta={8} icon={FileText} tone="brand" />
        <StatCard label="Interview Ready" value={metrics.interviewReadiness} suffix="%" delta={12} icon={Target} tone="success" />
        <StatCard label="Problems Solved" value={metrics.problemsSolved} delta={5} icon={Code2} />
        <StatCard label="Learning Hours" value={metrics.learningHours} suffix="h" delta={14} icon={Clock} />
        <StatCard label="Resume Quality" value={metrics.resumeQuality} suffix="/100" delta={3} icon={Award} tone="brand" />
        <StatCard label="Skill Coverage" value={metrics.skillCoverage} suffix="%" delta={-2} icon={Layers} tone="warning" />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Interview readiness trend"
          description="Last 30 days · rolling readiness score"
          actions={
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
              <ArrowUpRight className="mr-1 size-3" /> +12% MoM
            </Badge>
          }
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readinessTrend} margin={{ left: -20, right: 8, top: 6 }}>
                <defs>
                  <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={2} fill="url(#area1)" name="Score" />
                <Line type="monotone" dataKey="target" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Skill coverage" description="Radar vs. target for L5">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" tick={{ ...chartAxis, fontSize: 10 }} />
                <Radar name="You" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
                <Radar name="Target" dataKey="target" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Weekly practice" description="Problems solved and minutes coded">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ left: -20, right: 8, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                <Bar dataKey="problems" fill="var(--chart-1)" radius={[6, 6, 0, 0]} name="Problems" />
                <Bar dataKey="mock" fill="var(--chart-2)" radius={[6, 6, 0, 0]} name="Mocks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Topic distribution" description="Where your time went this month">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {topicDistribution.map((t, i) => (
                      <Cell key={i} fill={t.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1.5 pr-1 text-xs">
              {topicDistribution.map((t) => (
                <div key={t.name} className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ background: t.color }} />
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="ml-auto font-medium tabular-nums">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Leaderboard" description="Weekly XP · your cohort" actions={<Trophy className="size-3.5 text-amber-400" />}>
          <ul className="space-y-1.5">
            {leaderboard.map((l) => (
              <li
                key={l.rank}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-sm",
                  l.me && "border-primary/30 bg-primary/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-md text-[11px] font-bold",
                    l.rank === 1 && "bg-amber-400/20 text-amber-400",
                    l.rank === 2 && "bg-zinc-400/20 text-zinc-300",
                    l.rank === 3 && "bg-orange-500/20 text-orange-400",
                    l.rank > 3 && "bg-muted text-muted-foreground",
                  )}
                >
                  {l.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{l.name}</span>
                <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Zap className="size-3 text-amber-400" />
                  {l.streak}
                </span>
                <span className="tabular-nums text-xs text-muted-foreground">{l.xp.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Recent activity"
          description="Everything you shipped in the last 24 hours"
          actions={
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              View all <ChevronRight className="ml-0.5 size-3" />
            </Button>
          }
        >
          <ol className="relative space-y-0">
            <span className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {activities.map((a) => (
              <li key={a.id} className="relative flex gap-3 py-2.5 pl-0">
                <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground">
                  {a.tag[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{a.title}</span>
                    <Badge variant="outline" className="h-4 shrink-0 px-1.5 text-[10px]">{a.tag}</Badge>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">{a.meta}</div>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Upcoming" description="Your prep for this week" actions={<CalendarClock className="size-4 text-muted-foreground" />}>
          <ul className="space-y-2">
            {upcomingTasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-2.5 transition-all hover:border-primary/40 hover:bg-primary/[0.04]">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Target className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">Due {t.due}</div>
                </div>
                <DifficultyPill level={t.priority === "High" ? "Hard" : t.priority === "Medium" ? "Medium" : "Easy"} />
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weekly goal</span>
              <span className="font-medium tabular-nums">{metrics.weeklyProgress}%</span>
            </div>
            <Progress value={metrics.weeklyProgress} className="h-1.5" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}