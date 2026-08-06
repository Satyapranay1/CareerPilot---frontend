import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/mock-data";
import { Award, Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

const experience = [
  { role: "Senior Frontend Engineer", company: "Stripe", period: "2022 — Present" },
  { role: "Software Engineer", company: "Airbnb", period: "2019 — 2022" },
  { role: "Software Engineer", company: "Shopify", period: "2016 — 2019" },
];
const education = [
  { degree: "M.S. Computer Science", school: "Stanford University", period: "2014 — 2016" },
  { degree: "B.S. Computer Science", school: "University of Waterloo", period: "2010 — 2014" },
];
const skills = ["TypeScript", "React", "Node.js", "GraphQL", "System Design", "AWS", "PostgreSQL", "Redis", "Kubernetes"];

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Profile" title="Your career OS" description="Everything the AI knows about you." />

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl gradient-brand text-xl font-bold text-white shadow-glow">{currentUser.avatarInitials}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{currentUser.name}</h2>
              <Badge className="gradient-brand text-white">{currentUser.plan}</Badge>
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">{currentUser.role}</div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-3" />San Francisco, CA</span>
              <span className="inline-flex items-center gap-1"><Sparkles className="size-3" />Targeting Google L5</span>
            </div>
          </div>
          <Button variant="outline" size="sm">Edit profile</Button>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Experience" description="Roles that shape your résumé">
          <ul className="space-y-3">
            {experience.map((e) => (
              <li key={e.role} className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Briefcase className="size-4" /></span>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{e.role}</div>
                  <div className="text-xs text-muted-foreground">{e.company} · {e.period}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Education">
          <ul className="space-y-3">
            {education.map((e) => (
              <li key={e.degree} className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><GraduationCap className="size-4" /></span>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{e.degree}</div>
                  <div className="text-xs text-muted-foreground">{e.school} · {e.period}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Skills" description="AI-verified against your resume & practice">
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <Badge key={s} variant="outline" className="gap-1"><Award className="size-3 text-primary" />{s}</Badge>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Bio">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="fn">Full name</Label><Input id="fn" defaultValue={currentUser.name} /></div>
          <div className="space-y-1.5"><Label htmlFor="em">Email</Label><Input id="em" defaultValue={currentUser.email} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="bio">Short bio</Label><Textarea id="bio" rows={4} defaultValue="Product-minded senior engineer focused on developer tools and design systems." /></div>
        </div>
      </SectionCard>
    </div>
  );
}