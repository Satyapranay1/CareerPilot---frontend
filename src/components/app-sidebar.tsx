import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Code2,
  MessagesSquare,
  BarChart3,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const dashboard: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
];

const features: NavItem[] = [
  {
    to: "/resume",
    label: "Resume",
    icon: FileText,
    badge: "AI",
  },
  {
    to: "/coding",
    label: "Coding Practice",
    icon: Code2,
  },
  {
    to: "/interview",
    label: "Interview",
    icon: MessagesSquare,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

const account: NavItem[] = [
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (to: string) =>
    to === "/"
      ? pathname === "/"
      : pathname === to || pathname.startsWith(to + "/");

  const renderItems = (items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.to)}
                tooltip={item.label}
                className="
                  group
                  relative
                  h-11
                  rounded-xl
                  transition-all
                  duration-200
                  hover:bg-sidebar-accent/70
                  data-[active=true]:bg-sidebar-accent
                  data-[active=true]:font-semibold
                "
              >
                <Link
                  to={item.to}
                  className="flex items-center gap-3 w-full"
                >
                  <item.icon className="size-4 transition-transform duration-200 group-hover:scale-110" />

                  <span className="truncate">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>

              {item.badge && !collapsed && (
                <SidebarMenuBadge className="rounded-full bg-violet-600 text-white text-[10px] font-semibold px-2">
                  {item.badge}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="px-3 py-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">
                InterviewOS
              </p>

              <p className="text-xs text-sidebar-foreground/60">
                AI Career Coach
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="py-2">
        {renderItems(dashboard)}

        <SidebarSeparator className="my-2" />

        {renderItems(features)}

        <SidebarSeparator className="my-2" />

        {renderItems(account)}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="rounded-xl border bg-sidebar-accent/30 p-3">
            <p className="text-sm font-semibold">
              InterviewOS
            </p>

            <p className="text-xs text-sidebar-foreground/60">
              Build your dream career with AI.
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}