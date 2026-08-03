import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Github, Chrome } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · InterviewOS AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -left-16 top-1/3 size-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="size-5" />InterviewOS AI</div>
          <div className="max-w-md space-y-4">
            <p className="text-3xl font-semibold leading-tight">The AI-powered career OS for software engineers.</p>
            <p className="text-white/80">Resume analysis, personalized roadmaps, and realistic mock interviews — all in one premium workspace.</p>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} InterviewOS AI · Trusted by 12,000+ engineers</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center rounded-lg gradient-brand text-white shadow-glow"><Sparkles className="size-4" /></div>
            <span className="text-sm font-semibold">InterviewOS AI</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your prep.</p>

          <div className="mt-6 grid gap-2">
            <Button variant="outline" className="w-full gap-2"><Chrome className="size-4" />Continue with Google</Button>
            <Button variant="outline" className="w-full gap-2"><Github className="size-4" />Continue with GitHub</Button>
          </div>
          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Separator className="flex-1" /> or <Separator className="flex-1" />
          </div>
          <form className="space-y-3">
            <div className="space-y-1.5"><Label htmlFor="e">Email</Label><Input id="e" type="email" placeholder="you@work.com" /></div>
            <div className="space-y-1.5"><Label htmlFor="p">Password</Label><Input id="p" type="password" placeholder="••••••••" /></div>
            <Button type="submit" className="w-full gradient-brand text-white shadow-glow">Sign in</Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Don't have an account? <Link to="/" className="font-medium text-primary hover:underline">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}