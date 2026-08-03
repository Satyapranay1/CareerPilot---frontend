import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor, Shield, KeyRound } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Settings" title="Preferences" description="Customize how InterviewOS AI works for you." />
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <SectionCard title="Account">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Display name</Label><Input defaultValue="Alex Chen" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="alex.chen@interviewos.ai" /></div>
              <div className="space-y-1.5"><Label>Timezone</Label><Input defaultValue="America/Los_Angeles" /></div>
              <div className="space-y-1.5"><Label>Target role</Label><Input defaultValue="Google · L5 · Frontend" /></div>
            </div>
            <div className="mt-4 flex justify-end gap-2"><Button variant="outline" size="sm">Discard</Button><Button size="sm" className="gradient-brand text-white">Save changes</Button></div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <SectionCard title="Theme" description="Applies instantly across the app">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: "dark", label: "Dark", icon: Moon, hint: "Luxurious default" },
                { id: "light", label: "Light", icon: Sun, hint: "Clean daylight" },
                { id: "system", label: "System", icon: Monitor, hint: "Follows OS" },
              ].map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => t.id !== "system" && setTheme(t.id as "dark" | "light")}
                    className={`rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/[0.06] shadow-glow" : "border-border hover:border-primary/40"}`}
                  >
                    <t.icon className="size-4 text-primary" />
                    <div className="mt-2 text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.hint}</div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <SectionCard title="Delivery" description="Choose what reaches your inbox">
            {[
              { k: "Daily brief", d: "Every morning at 8am" },
              { k: "AI coach nudges", d: "When you're falling behind" },
              { k: "Mock reminders", d: "1 hour before scheduled" },
              { k: "Weekly report", d: "Sundays at 6pm" },
            ].map((n) => (
              <div key={n.k} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                <div><div className="text-sm font-medium">{n.k}</div><div className="text-xs text-muted-foreground">{n.d}</div></div>
                <Switch defaultChecked />
              </div>
            ))}
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <SectionCard title="Password" actions={<Shield className="size-4 text-muted-foreground" />}>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5"><Label>Current</Label><Input type="password" /></div>
              <div className="space-y-1.5"><Label>New</Label><Input type="password" /></div>
              <div className="space-y-1.5"><Label>Confirm</Label><Input type="password" /></div>
            </div>
            <div className="mt-4 flex justify-end"><Button size="sm" className="gradient-brand text-white">Update password</Button></div>
          </SectionCard>
          <SectionCard title="Two-factor auth" actions={<KeyRound className="size-4 text-muted-foreground" />}>
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-medium">Authenticator app</div><div className="text-xs text-muted-foreground">Adds an extra layer of security</div></div>
              <Switch />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}