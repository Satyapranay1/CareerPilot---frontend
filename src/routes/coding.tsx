import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DifficultyPill, PageHeader, SectionCard, StatusPill } from "@/components/ui-kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { problems } from "@/lib/mock-data";
import { Search, Bookmark, Play, Filter, Download, Plus } from "lucide-react";

export const Route = createFileRoute("/coding")({
  head: () => ({ meta: [{ title: "Coding Practice · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <CodingPage />
    </AppShell>
  ),
});

function CodingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Practice"
        title="Coding problems"
        description="Track your progress across topics, difficulties and companies. Bookmark favorites and export reports."
        actions={
          <>
            <Button size="sm" variant="outline"><Download className="mr-1.5 size-3.5" />Export</Button>
            <Button size="sm" className="gradient-brand text-white"><Plus className="mr-1.5 size-3.5" />Add problem</Button>
          </>
        }
      />

      <SectionCard padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by title, topic, tag…" className="h-8 pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Easy", "Medium", "Hard"].map((f, i) => (
              <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className={i === 0 ? "h-7 gradient-brand text-white" : "h-7"}>{f}</Button>
            ))}
            <Button size="sm" variant="outline" className="h-7"><Filter className="mr-1 size-3" />More</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/40 backdrop-blur">
              <TableRow>
                <TableHead className="w-10"><Checkbox /></TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="tabular-nums">Time</TableHead>
                <TableHead className="tabular-nums">Acceptance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell><Badge variant="outline">{p.topic}</Badge></TableCell>
                  <TableCell><DifficultyPill level={p.difficulty} /></TableCell>
                  <TableCell><StatusPill status={p.status} /></TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{p.time}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{p.acceptance}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7"><Bookmark className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-primary"><Play className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Showing 1–{problems.length} of 342</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7">Previous</Button>
            <Button size="sm" variant="outline" className="h-7">Next</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}