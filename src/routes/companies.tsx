import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CompanyLogo, PageHeader } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/lib/mock-data";
import { Search, Filter, Star, Users, ArrowUpRight, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/companies")({
  head: () => ({ meta: [{ title: "Companies · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <CompaniesPage />
    </AppShell>
  ),
});

function CompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Explore"
        title="Companies"
        description="Curated interview intelligence for 400+ engineering orgs. See difficulty, focus areas, and open roles."
        actions={<Button size="sm" variant="outline"><Filter className="mr-1.5 size-3.5" />Filters</Button>}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search companies, tiers, focus areas…" className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["All", "FAANG", "Top Startup", "AI"].map((t, i) => (
            <Button key={t} size="sm" variant={i === 0 ? "default" : "outline"} className={i === 0 ? "gradient-brand text-white" : ""}>{t}</Button>
          ))}
          <Button size="icon" variant="outline" className="size-9"><SlidersHorizontal className="size-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((c) => (
          <div key={c.id} className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/60 p-4 shadow-elevated transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
            <div className="flex items-start gap-3">
              <CompanyLogo name={c.name} color={c.color} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <Badge variant="outline" className="h-4 px-1.5 text-[10px]">{c.tier}</Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5"><Star className="size-3 text-amber-400" />{c.rating}</span>
                  <span>·</span>
                  <span>Difficulty {c.difficulty}</span>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.focus.map((f) => (
                <span key={f} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{f}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Users className="size-3" />{c.openRoles} open roles</span>
              <span className="font-medium text-primary">View path →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}