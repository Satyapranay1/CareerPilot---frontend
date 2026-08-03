import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard, StatCard } from "@/components/ui-kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Briefcase, Sparkles, Server } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <AdminPage />
    </AppShell>
  ),
});

const users = [
  { name: "Priya Sharma", email: "priya@acme.com", plan: "Pro", status: "Active", role: "Admin" },
  { name: "Marcus Lee", email: "marcus@acme.com", plan: "Team", status: "Active", role: "Member" },
  { name: "Dana Kim", email: "dana@acme.com", plan: "Free", status: "Invited", role: "Member" },
  { name: "Wen Huang", email: "wen@acme.com", plan: "Pro", status: "Active", role: "Member" },
  { name: "Jamal Ali", email: "jamal@acme.com", plan: "Team", status: "Suspended", role: "Member" },
];

const logs = [
  { at: "09:41", event: "User signed up", who: "olivia@acme.com" },
  { at: "09:22", event: "Resume analyzed", who: "alex@acme.com" },
  { at: "08:58", event: "Mock interview completed", who: "priya@acme.com" },
  { at: "08:31", event: "Company profile updated", who: "admin@acme.com" },
];

function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="System dashboard" description="Manage users, catalog and monitor platform activity." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Users" value="12,480" delta={4} icon={Users} tone="brand" />
        <StatCard label="Companies" value="418" delta={2} icon={Building2} />
        <StatCard label="Roles" value="132" delta={1} icon={Briefcase} />
        <StatCard label="AI credits used" value="1.2M" delta={12} icon={Sparkles} tone="success" />
      </div>

      <SectionCard title="Users" description="Recently active accounts" padded={false}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Plan</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.email} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{u.plan}</Badge></TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Badge className={u.status === "Active" ? "bg-success/15 text-success" : u.status === "Suspended" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="ghost">Manage</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Audit log" description="Recent platform events">
          <ul className="space-y-2 text-sm">
            {logs.map((l, i) => (
              <li key={i} className="flex items-center gap-3 border-b border-border/60 pb-2 last:border-0">
                <span className="font-mono text-[11px] text-muted-foreground">{l.at}</span>
                <span className="min-w-0 flex-1 truncate">{l.event}</span>
                <span className="truncate text-xs text-muted-foreground">{l.who}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="System health" description="Live" actions={<Server className="size-4 text-muted-foreground" />}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "API p95", v: "142ms", tone: "success" },
              { k: "Error rate", v: "0.03%", tone: "success" },
              { k: "Uptime", v: "99.99%", tone: "success" },
              { k: "Queue depth", v: "12", tone: "warning" },
            ].map((m) => (
              <div key={m.k} className="rounded-lg border border-border/60 bg-background/60 p-3">
                <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{m.k}</div>
                <div className={`mt-1 text-lg font-semibold tabular-nums ${m.tone === "success" ? "text-success" : "text-warning"}`}>{m.v}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}