import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Code2,
  Target,
  Activity as ActivityIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui-kit";
import { LoadingSpinner } from "@/routes/LoadingSpinner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/activity")({
  component: Activity,
});

type ActivityItem = {
  type: string;
  title: string;
  description: string;
  createdAt: string;
};

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case "resume":
      return FileText;

    case "coding":
      return Code2;

    case "interview":
      return Target;

    default:
      return ActivityIcon;
  }
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown date";
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Activity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadActivities() {
      try {
        const response = await apiFetch("/dashboard");

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("DASHBOARD RESPONSE:", data);
console.log("ACTIVITIES:", data.activities);
console.log("ACTIVITY DATES:", data.activities?.map((a: ActivityItem) => ({
  title: a.title,
  createdAt: a.createdAt,
  type: a.type,
})));
        if (mounted) {
          setActivities(data.activities ?? []);
        }
      } catch (error) {
        console.error("Activity loading error:", error);

        if (mounted) {
          setError("Unable to load your activity.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading activity..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
            <CalendarClock className="size-5" />
          </div>

          <h2 className="text-base font-semibold text-foreground">Activity unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          {/* Top row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left side */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <CalendarClock className="size-3.5" />
                Preparation history
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Activity
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                A record of your resume analysis, completed interviews, and coding problems solved
                in CareerPilot.
              </p>
            </div>

            {/* Right side */}
            <Link
              to="/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Date */}
          <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
            <CalendarClock className="size-4 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">Today</span>

            <span className="text-sm font-medium text-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVITY */}
      {/* ========================================================= */}

      <SectionCard
        title="Your activity"
        description={
          activities.length > 0
            ? `${activities.length} recent activities`
            : "No activity recorded yet"
        }
      >
        {activities.length === 0 ? (
          <div className="py-14 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <CalendarClock className="size-6" />
            </div>

            <h3 className="text-sm font-semibold text-foreground">No activity yet</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your resume analysis, completed interviews, and solved coding problems will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);

              return (
                <div
                  key={`${activity.createdAt}-${activity.title}-${index}`}
                  className="group rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="shrink-0">
                      <div className="grid size-10 place-items-center rounded-xl border border-border bg-card text-primary">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground">
                              {activity.title}
                            </h3>

                            <Badge variant="outline" className="text-[10px]">
                              {activity.type}
                            </Badge>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="shrink-0 sm:text-right">
                          <p className="text-xs font-medium text-foreground">
                            {formatDate(activity.createdAt)}
                          </p>

                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {formatTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Activity information */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Type
                          </span>

                          <span className="text-xs font-medium text-foreground">
                            {activity.type}
                          </span>
                        </div>

                        <div className="hidden h-3 w-px bg-border sm:block" />

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Date
                          </span>

                          <span className="text-xs text-foreground">
                            {formatDate(activity.createdAt)}
                          </span>
                        </div>

                        <div className="hidden h-3 w-px bg-border sm:block" />

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Status
                          </span>

                          <span className="text-xs font-medium text-primary">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
