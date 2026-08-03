import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { behavioralQuestions } from "@/lib/mock-data";
import { MessagesSquare, Mic, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/behavioral")({
  head: () => ({ meta: [{ title: "Behavioral · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <BehavioralPage />
    </AppShell>
  ),
});

function BehavioralPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Behavioral"
        title="Master your story"
        description="Practice STAR-formatted answers to the most-asked behavioral questions with instant AI feedback."
        actions={<Button size="sm" className="gradient-brand text-white"><Sparkles className="mr-1.5 size-3.5" />AI feedback</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <SectionCard title="Question bank" description="Curated for senior IC roles" padded={false}>
          <ul className="divide-y divide-border/60">
            {behavioralQuestions.map((q, i) => (
              <li key={q.id} className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${i === 0 ? "bg-primary/[0.04]" : ""}`}>
                <span className="grid size-7 place-items-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-medium">{q.q}</div>
                  <div className="mt-0.5 flex items-center gap-1.5"><Badge variant="outline" className="h-4 px-1.5 text-[10px]">{q.tag}</Badge><span className="text-[10px] text-muted-foreground">{q.level}</span></div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Prompt" description="Answer using the STAR framework">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"><MessagesSquare className="size-3" /> Question</div>
              <p className="text-[15px] leading-relaxed">{behavioralQuestions[0].q}</p>
            </div>
            <div className="mt-4">
              <Textarea rows={8} placeholder="Situation — Task — Action — Result…" className="resize-none bg-background/60" />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5"><Mic className="size-3.5" /> Voice</Button>
                  <span>Auto-saved · 2s ago</span>
                </div>
                <Button size="sm" className="gradient-brand text-white"><Sparkles className="mr-1.5 size-3.5" />Get AI feedback</Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AI coach feedback" description="Sample evaluation of your last answer">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Structure", value: 8.4, hint: "Clear STAR" },
                { label: "Impact", value: 7.1, hint: "Add metrics" },
                { label: "Delivery", value: 8.8, hint: "Confident" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border/60 bg-background/60 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="mt-1 flex items-baseline gap-1"><span className="text-2xl font-semibold tabular-nums">{s.value}</span><span className="text-xs text-muted-foreground">/10</span></div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{s.hint}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}