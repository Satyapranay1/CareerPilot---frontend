import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard, StatCard } from "@/components/ui-kit";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { readinessTrend, weeklyActivity, heatmap } from "@/lib/mock-data";
import { Clock, Code2, Award, Flame } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <AnalyticsPage />
    </AppShell>
  ),
});

const axis = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Learning analytics"
        description="Track velocity, heatmaps, and cross-skill progress across your prep window."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Hours coded" value="128" delta={14} icon={Clock} tone="brand" />
        <StatCard label="Problems / week" value="68" delta={9} icon={Code2} />
        <StatCard label="Longest streak" value="34d" delta={4} icon={Flame} tone="warning" />
        <StatCard label="Achievements" value="19" delta={2} icon={Award} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Learning velocity" description="Time invested per day">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ left: -20, top: 6 }}>
                <defs>
                  <linearGradient id="v1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="minutes" stroke="var(--chart-1)" strokeWidth={2} fill="url(#v1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Readiness vs target" description="30-day trailing">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readinessTrend} margin={{ left: -20, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="target" stroke="var(--chart-2)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Activity heatmap" description="Last 7 days · hourly focus">
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] gap-1" style={{ gridTemplateColumns: "repeat(24,minmax(0,1fr))" }}>
            {heatmap.map((c, i) => {
              const alpha = Math.min(1, c.v / 18);
              return (
                <div
                  key={i}
                  className="h-4 rounded-sm transition-transform hover:scale-125"
                  style={{
                    background: `color-mix(in oklab, var(--primary) ${Math.round(alpha * 100)}%, var(--muted))`,
                  }}
                  title={`${c.v} min`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Topic breakdown" description="Problems by topic this month">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { t: "Arrays", n: 78 }, { t: "Trees", n: 58 }, { t: "Graphs", n: 42 },
              { t: "DP", n: 36 }, { t: "Design", n: 24 }, { t: "Strings", n: 31 }, { t: "Math", n: 18 },
            ]} margin={{ left: -20, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="t" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Bar dataKey="n" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}