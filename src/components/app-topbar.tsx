import { useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type { ProfileResponse } from "@/features/profile/types";

const pageMeta: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  "/": {
    title: "Dashboard",
    subtitle: "Track your interview preparation progress.",
  },
  "/resume": {
    title: "Resume Analyzer",
    subtitle: "Improve your resume using AI insights.",
  },
  "/coding": {
    title: "Coding Practice",
    subtitle: "Master DSA with company-wise questions.",
  },
  "/behavioral": {
    title: "Behavioral Interviews",
    subtitle: "Practice HR and leadership questions.",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "View your learning insights and growth.",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Manage your personal information.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Customize your InterviewOS experience.",
  },
};

export function AppTopbar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const page = pageMeta[pathname] ?? {
    title: "InterviewOS",
    subtitle: "AI Career Coach",
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch("/auth/profile");

        if (!response.ok) throw new Error();

        const data = await response.json();

        setProfile(data);
      } catch {
        toast.error("Unable to load profile.");
      }
    };

    loadProfile();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-xl px-6">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="mr-4 h-9 w-9 rounded-lg" />

      {/* Page Info */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold tracking-tight">{page.title}</h1>

        <p className="text-sm text-muted-foreground">{page.subtitle}</p>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {profile
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-sm font-semibold text-white">
                {profile ? (
                  profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                ) : (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="min-w-0">
                {profile ? (
                  <>
                    <p className="truncate font-medium mb-0">{profile.name}</p>

                    <p className="truncate text-xs text-muted-foreground mb-0">{profile.email}</p>
                  </>
                ) : (
                  <div className="d-flex flex-column gap-1">
                    <div className="placeholder-glow" style={{ width: "100px" }}>
                      <span className="placeholder col-12 rounded"></span>
                    </div>

                    <div className="placeholder-glow" style={{ width: "140px" }}>
                      <span className="placeholder col-12 rounded"></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/login";
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
