import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard, StatCard, ProgressRing, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resumeHistory } from "@/lib/mock-data";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Zap,
  Target,
  Type,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "Resume · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <ResumePage />
    </AppShell>
  ),
});

const strengths = [
  "Strong quantified impact statements",
  "Excellent action verbs and clarity",
  "Modern layout, high ATS compatibility",
  "Skills section matches target role",
];
const weaknesses = [
  "Missing keywords: Kubernetes, gRPC",
  "Summary is too generic for L5",
  "One bullet exceeds two lines",
];
const matched = ["React", "TypeScript", "System Design", "AWS", "GraphQL", "Node.js", "CI/CD"];
const missing = ["Kubernetes", "gRPC", "Distributed Systems"];

function ResumePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resume"
        title="Resume analysis"
        description="Upload your resume and let the AI grade it against your target role, ATS filters and industry benchmarks."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 size-3.5" /> Export report</Button>
            <Button size="sm" className="gradient-brand text-white shadow-glow"><Sparkles className="mr-1.5 size-3.5" /> Re-analyze</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Upload zone */}
        <SectionCard title="Upload new resume" description="PDF or DOCX up to 10 MB" padded={false}>
          <div className="m-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/60 hover:bg-primary/[0.04]">
            <div className="grid size-12 place-items-center rounded-full gradient-brand text-white shadow-glow">
              <UploadCloud className="size-5" />
            </div>
            <div className="mt-3 text-sm font-semibold">Drag & drop your resume here</div>
            <div className="mt-1 text-xs text-muted-foreground">or click to browse — PDF, DOCX · 10MB max</div>
            <Button size="sm" variant="outline" className="mt-4">Browse files</Button>
          </div>
        </SectionCard>

        <SectionCard title="ATS Score" description="Resume v7 — Senior FE">
          <div className="flex flex-col items-center gap-3">
            <ProgressRing value={87} size={132} stroke={10} label="ATS" sub="/100" />
            <div className="text-center">
              <div className="text-sm font-medium">Great · above 82nd percentile</div>
              <div className="text-xs text-muted-foreground">4 quick wins to reach 95</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Impact Score" value={82} suffix="/100" delta={9} icon={Zap} tone="brand" />
        <StatCard label="Keyword Match" value={78} suffix="%" delta={12} icon={Target} tone="success" />
        <StatCard label="Readability" value={91} suffix="/100" delta={4} icon={Type} />
        <StatCard label="Grammar" value={99} suffix="/100" delta={1} icon={Award} tone="success" />
      </div>

      <Tabs defaultValue="insights">
        <TabsList>
          <TabsTrigger value="insights">AI insights</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Strengths" description="What's working">
              <ul className="space-y-2.5">
                {strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success"><Check className="size-3" /></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Weaknesses" description="Fix these to boost your score">
              <ul className="space-y-2.5">
                {weaknesses.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-warning/20 text-warning"><AlertTriangle className="size-3" /></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Matched keywords" description={`${matched.length} of ${matched.length + missing.length}`}>
              <div className="flex flex-wrap gap-1.5">
                {matched.map((k) => (
                  <Badge key={k} variant="outline" className="border-success/30 bg-success/10 text-success"><Check className="mr-1 size-3" />{k}</Badge>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-muted-foreground">Match rate</span><span className="font-medium">78%</span></div>
                <Progress value={78} className="h-1.5" />
              </div>
            </SectionCard>
            <SectionCard title="Missing keywords" description="Add naturally where relevant">
              <div className="flex flex-wrap gap-1.5">
                {missing.map((k) => (
                  <Badge key={k} variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive"><X className="mr-1 size-3" />{k}</Badge>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard padded={false}>
            <div className="divide-y divide-border/60">
              {resumeHistory.map((r) => (
                <div key={r.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><FileText className="size-4" /></span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.uploaded} · {r.size} · {r.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="tabular-nums">ATS {r.ats}</Badge>
                    <Button size="icon" variant="ghost" className="size-7"><Eye className="size-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="size-7"><Download className="size-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}