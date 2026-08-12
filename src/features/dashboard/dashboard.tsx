import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  ChevronRight,
  CalendarClock,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  DifficultyPill,
  ProgressRing,
  SectionCard,
  StatCard,
} from "@/components/ui-kit";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardResponse } from "./types";
import { LoadingSpinner } from "@/routes/LoadingSpinner";

const chartAxis = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;

const topicColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[120px] rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
      {label !== undefined && (
        <div className="mb-2 font-medium text-foreground">
          {label}
        </div>
      )}

      <div className="space-y-1">
        {payload.map((item: any, index: number) => (
          <div
            key={`${item.dataKey}-${index}`}
            className="flex items-center gap-2"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: item.color || item.fill,
              }}
            />

            <span className="text-muted-foreground">
              {item.name}
            </span>

            <span className="ml-auto font-medium tabular-nums text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string | null | undefined) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/dashboard");

        if (!response.ok) {
          throw new Error(
            `Dashboard request failed: ${response.status}`
          );
        }

        const data: DashboardResponse = await response.json();

        if (mounted) {
          setDashboard(data);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (mounted) {
          setError("Unable to load your dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
            <FileText className="size-5" />
          </div>

          <h2 className="font-semibold text-foreground">
            Dashboard unavailable
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error ?? "No dashboard data was returned by the server."}
          </p>
        </div>
      </div>
    );
  }

  const hero = dashboard.hero;
  const metrics = dashboard.metrics;

  const readinessTrend = dashboard.readinessTrend ?? [];
  const skillRadar = dashboard.skillRadar ?? [];
  const weeklyActivity = dashboard.weeklyActivity ?? [];
  const topicDistribution = dashboard.topicDistribution ?? [];
  const activities = dashboard.activities ?? [];
  const upcomingTasks = dashboard.upcomingTasks ?? [];

  return (
    <div className="space-y-6">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">

          <div className="min-w-0 space-y-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="size-3.5" />
              Career preparation
            </div>

            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Welcome back,{" "}
              <span className="text-gradient-brand">
                {hero.fullName?.split(" ")[0] || "there"}
              </span>
              .
            </h2>

            <p className="max-w-2xl text-sm text-muted-foreground">
              You're preparing for{" "}
              <span className="font-medium text-foreground">
                {hero.targetRole || "your target role"}
              </span>{" "}
              at{" "}
              <span className="font-medium text-foreground">
                {hero.targetCompany || "your target company"}
              </span>
              .
            </p>

            {hero.dailyRecommendation && (
              <p className="max-w-xl text-sm text-muted-foreground">
                {hero.dailyRecommendation}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs">
                <Flame className="size-3.5 text-amber-500" />

                <span className="font-medium text-foreground">
                  {hero.currentStreak ?? 0} day streak
                </span>

                <span className="text-muted-foreground">
                  · +{(hero.xp ?? 0).toLocaleString()} XP
                </span>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <ProgressRing
              value={hero.interviewReadiness ?? 0}
              size={128}
              stroke={10}
              label="Ready"
              sub={`${hero.targetCompany || "Target"} · ${hero.targetRole || "Role"}`}
            />
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* METRICS */}
      {/* ========================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">

        <StatCard
          label="ATS Score"
          value={metrics.atsScore ?? 0}
          suffix="/100"
          icon={FileText}
          tone="brand"
        />

        <StatCard
          label="Interview Ready"
          value={metrics.interviewReadiness ?? 0}
          suffix="%"
          icon={Target}
          tone="success"
        />

        <StatCard
          label="Problems Solved"
          value={metrics.solvedQuestions ?? 0}
          icon={Code2}
        />

        <StatCard
          label="Learning Hours"
          value={metrics.learningHours ?? 0}
          suffix="h"
          icon={Clock}
        />

        <StatCard
          label="Resume Quality"
          value={metrics.resumeQuality ?? 0}
          suffix="/100"
          icon={Award}
          tone="brand"
        />

        <StatCard
          label="Skill Coverage"
          value={metrics.skillCoverage ?? 0}
          suffix="%"
          icon={Layers}
          tone="warning"
        />

      </div>

      {/* ========================================================= */}
      {/* READINESS + SKILLS */}
      {/* ========================================================= */}

      <div className="grid gap-4 lg:grid-cols-3">

        <SectionCard
          className="lg:col-span-2"
          title="Interview readiness trend"
          description="Your readiness compared with your target"
        >
          {readinessTrend.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No readiness data available yet.
            </div>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={readinessTrend}
                  margin={{
                    left: -20,
                    right: 8,
                    top: 6,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="readinessArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="100%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={chartAxis}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={chartAxis}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="readinessScore"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#readinessArea)"
                    name="Readiness"
                  />

                  <Area
                    type="monotone"
                    dataKey="targetScore"
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    fill="none"
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Skill coverage"
          description={`Your skills for ${hero.targetCompany || "your target company"}`}
        >
          {skillRadar.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No skill data available yet.
            </div>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadar}>
                  <PolarGrid stroke="var(--border)" />

                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{
                      ...chartAxis,
                      fontSize: 10,
                    }}
                  />

                  <Radar
                    name="Skill"
                    dataKey="score"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.3}
                  />

                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

      </div>

      {/* ========================================================= */}
      {/* WEEKLY ACTIVITY + TOPICS */}
      {/* ========================================================= */}

      <div className="grid gap-4 lg:grid-cols-3">

        <SectionCard
          title="Weekly practice"
          description="Problems solved, mock interviews and study hours"
        >
          {weeklyActivity.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No weekly activity yet.
            </div>
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyActivity}
                  margin={{
                    left: -20,
                    right: 8,
                    top: 6,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    tick={chartAxis}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={chartAxis}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      fill: "var(--muted)",
                      opacity: 0.35,
                    }}
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
          )}
        </SectionCard>

        <SectionCard
          title="Topic distribution"
          description="Your practice distribution"
        >
          {topicDistribution.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No topic activity yet.
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">

              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicDistribution}
                      dataKey="value"
                      nameKey="topic"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={2}
                      stroke="var(--card)"
                      strokeWidth={2}
                    >
                      {topicDistribution.map((topic, index) => (
                        <Cell
                          key={`${topic.topic}-${index}`}
                          fill={
                            topicColors[
                              index % topicColors.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex max-w-[150px] flex-col gap-2 pr-1 text-xs">
                {topicDistribution.map((topic, index) => (
                  <div
                    key={`${topic.topic}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="size-2 shrink-0 rounded-sm"
                      style={{
                        background:
                          topicColors[
                            index % topicColors.length
                          ],
                      }}
                    />

                    <span className="truncate text-muted-foreground">
                      {topic.topic}
                    </span>

                    <span className="ml-auto font-medium tabular-nums text-foreground">
                      {topic.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </SectionCard>

      </div>

      {/* ========================================================= */}
      {/* RECENT ACTIVITY + UPCOMING */}
      {/* ========================================================= */}

      <div className="grid gap-4 lg:grid-cols-3">

        <SectionCard
          className="lg:col-span-2"
          title="Recent activity"
          description="Your latest preparation activity"
          actions={
            activities.length > 0 ? (
              <Button
  variant="ghost"
  size="sm"
  onClick={() => navigate({ to: "/activity" })}
  className="text-primary hover:bg-primary/10"
>
  View All
  <ArrowRight className="ml-1 h-4 w-4" />
</Button>
            ) : undefined
          }
        >
          {activities.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No recent activity yet.
            </div>
          ) : (
            <ol className="relative space-y-0">
              <span className="pointer-events-none absolute bottom-2 left-[15px] top-2 w-px bg-border" />

              {activities.map((activity, index) => (
                <li
                  key={`${activity.createdAt}-${activity.title}-${index}`}
                  className="relative flex gap-3 py-2.5"
                >
                  <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-[10px] font-semibold uppercase text-muted-foreground">
                    {(activity.type || "A")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="truncate text-sm font-medium text-foreground">
                        {activity.title}
                      </span>

                      {activity.type && (
                        <Badge
                          variant="outline"
                          className="h-5 shrink-0 px-1.5 text-[10px]"
                        >
                          {activity.type}
                        </Badge>
                      )}

                      {activity.createdAt && (
                        <span className="text-[10px] text-muted-foreground">
                          {formatDateTime(activity.createdAt)}
                        </span>
                      )}

                    </div>

                    {activity.description && (
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {activity.description}
                      </div>
                    )}

                  </div>
                </li>
              ))}
            </ol>
          )}
        </SectionCard>

        <SectionCard
          title="Upcoming"
          description="Your preparation tasks"
          actions={
            <CalendarClock className="size-4 text-muted-foreground" />
          }
        >
          {upcomingTasks.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No upcoming tasks.
            </div>
          ) : (
            <ul className="space-y-2">
              {upcomingTasks.map((task, index) => (
                <li
                  key={`${task.task}-${index}`}
                  className="rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                >
                  <div className="flex items-start gap-3">

                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                      <Target className="size-4" />
                    </span>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-medium text-foreground">
                          {task.task}
                        </div>

                        {task.priority && (
                          <DifficultyPill
                            level={
                              task.priority.toLowerCase() === "high"
                                ? "Hard"
                                : task.priority.toLowerCase() === "medium"
                                  ? "Medium"
                                  : "Easy"
                            }
                          />
                        )}
                      </div>

                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Due {formatDate(task.dueDate)}
                      </div>

                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            Progress
                          </span>

                          <span className="font-medium tabular-nums text-foreground">
                            {task.progress ?? 0}%
                          </span>
                        </div>

                        <Progress
                          value={task.progress ?? 0}
                          className="h-1.5"
                        />
                      </div>

                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Weekly goal
              </span>

              <span className="font-medium tabular-nums text-foreground">
                {metrics.weeklyProgress ?? 0}%
              </span>
            </div>

            <Progress
              value={metrics.weeklyProgress ?? 0}
              className="h-1.5"
            />
          </div>
        </SectionCard>

      </div>

    </div>
  );
}