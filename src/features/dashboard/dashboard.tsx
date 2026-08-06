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
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardResponse } from "./types";
import { cn } from "@/lib/utils";

const chartAxis = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

const topicColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

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
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiFetch("/dashboard");

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data: DashboardResponse = await response.json();

        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboard) {
    return <div>Unable to load dashboard.</div>;
  }
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5 shadow-elevated sm:p-6">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full gradient-brand opacity-20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            </div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back,{" "}
              <span className="text-gradient-brand">{dashboard.hero.fullName.split(" ")[0]}</span>.
              You're preparing for {dashboard.hero.targetRole} at {dashboard.hero.targetCompany}.
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              {dashboard.hero.dailyRecommendation}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="sm"
                className="gap-1.5 gradient-brand text-white shadow-glow hover:opacity-95"
              >
                <Sparkles className="size-3.5" /> Start today's plan
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Plus className="size-3.5" /> Schedule mock
              </Button>
              <div className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-xs">
                <Flame className="size-3.5 text-amber-400" />
                <span className="font-medium">{dashboard.hero.currentStreak} day streak</span>
                <span className="text-muted-foreground">
                  · +{dashboard.hero.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <ProgressRing
              value={dashboard.hero.interviewReadiness}
              size={128}
              stroke={10}
              label="Ready"
              sub={`${dashboard.hero.targetCompany} ${dashboard.hero.targetRole}`}
            />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="ATS Score"
          value={dashboard.metrics.atsScore}
          suffix="/100"
          icon={FileText}
          tone="brand"
        />
        <StatCard
          label="Interview Ready"
          value={dashboard.metrics.interviewReadiness}
          suffix="%"
          icon={Target}
          tone="success"
        />
        <StatCard
          label="Problems Solved"
          value={dashboard.metrics.solvedQuestions}
          icon={Code2}
        />
        <StatCard
          label="Learning Hours"
          value={dashboard.metrics.learningHours}
          suffix="h"
          icon={Clock}
        />
        <StatCard
          label="Resume Quality"
          value={dashboard.metrics.resumeQuality}
          suffix="/100"
          icon={Award}
          tone="brand"
        />
        <StatCard
          label="Skill Coverage"
          value={dashboard.metrics.skillCoverage}
          suffix="%"
          icon={Layers}
          tone="warning"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Interview readiness trend"
          
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.readinessTrend} margin={{ left: -20, right: 8, top: 6 }}>
                <defs>
                  <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="readinessScore"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#area1)"
                  name="Score"
                />
                <Line
                  type="monotone"
                  dataKey="targetScore"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Skill coverage" description={`Radar vs. target for ${dashboard.hero.targetCompany}`}>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dashboard.skillRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" tick={{ ...chartAxis, fontSize: 10 }} />
                <Radar
                  name="You"
                  dataKey="score"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.15}
                />
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
              <BarChart data={dashboard.weeklyActivity} margin={{ left: -20, right: 8, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                />
                <Bar
                  dataKey="solvedProblems"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                  name="Problems"
                />
                <Bar
                  dataKey="mockInterviews"
                  fill="var(--chart-2)"
                  radius={[6, 6, 0, 0]}
                  name="Mocks"
                />
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
                    data={dashboard.topicDistribution}
                    dataKey="value"
                    nameKey="topic"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {dashboard.topicDistribution.map((t, index) => (
                      <Cell key={t.topic} fill={topicColors[index % topicColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1.5 pr-1 text-xs">
              {dashboard.topicDistribution.map((t, index) => (
                <div key={t.topic} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-sm"
                    style={{
                      background: topicColors[index % topicColors.length],
                    }}
                  />
                  <span className="text-muted-foreground">{t.topic}</span>
                  <span className="ml-auto font-medium tabular-nums">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
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
            {dashboard.activities.map((a) => (
              <li key={a.type} className="relative flex gap-3 py-2.5 pl-0">
                <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground">
                  {a.type[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{a.title}</span>
                    <Badge variant="outline" className="h-4 shrink-0 px-1.5 text-[10px]">
                      {a.type}
                    </Badge>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {a.description}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard
          title="Upcoming"
          description="Your prep for this week"
          actions={<CalendarClock className="size-4 text-muted-foreground" />}
        >
          <ul className="space-y-2">
            {dashboard.upcomingTasks.map((t, index) => (
              <li
                key={index}
                className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-2.5 transition-all hover:border-primary/40 hover:bg-primary/[0.04]"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Target className="size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.task}</div>
                  <div className="text-[11px] text-muted-foreground">Due {t.dueDate}</div>
                </div>

                <DifficultyPill
                  level={
                    t.priority === "High" ? "Hard" : t.priority === "Medium" ? "Medium" : "Easy"
                  }
                />
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weekly goal</span>
              <span className="font-medium tabular-nums">{dashboard.metrics.weeklyProgress}%</span>
            </div>
            <Progress value={dashboard.metrics.weeklyProgress} className="h-1.5" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
