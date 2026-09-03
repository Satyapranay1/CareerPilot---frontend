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

const pageMeta: Record<
  string,
  { title: string; subtitle: string }
> = {
  "/": {
    title: "Dashboard",
    subtitle: "Track your interview preparation progress.",
  },
  "/dashboard": {
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
  "/interview": {
    title: "Interview",
    subtitle: "Practice technical and behavioural interviews.",
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

type User = {
  name: string;
  email: string;
};

export function AppTopbar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const { theme, toggle } = useTheme();

  const user: User = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  })();

  const page = pageMeta[pathname] ?? {
    title: "InterviewOS",
    subtitle: "AI Career Coach",
  };

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-xl">
      <SidebarTrigger className="mr-4 h-9 w-9 rounded-lg" />

      <div className="flex flex-col">
        <h1 className="text-lg font-semibold tracking-tight">
          {page.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          {page.subtitle}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-sm font-semibold text-white">
              {initials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-sm font-semibold text-white">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium">
                  {user.name || "User"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email || ""}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                (window.location.href = "/profile")
              }
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                (window.location.href = "/settings")
              }
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("profileImage");
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