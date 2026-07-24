"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS, APP_NAME } from "@/lib/utils/constants";
import { useUIStore } from "@/stores/ui-store";
import { Bot, Video, Image, Music, Pen, Layout, TrendingUp, User, Languages, FolderOpen, Compass, ChevronLeft, Plus, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Bot, Video, Image, Music, Pen, Layout, TrendingUp, User, Languages, FolderOpen, Compass };

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <aside className={cn("flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300", sidebarCollapsed ? "w-[72px]" : "w-[240px]")}>
      <div className={cn("flex h-16 items-center border-b border-zinc-800 px-4", sidebarCollapsed ? "justify-center" : "justify-between")}>
        {!sidebarCollapsed && (
          <Link href="/agent" className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold">D</div>
            <span className="text-sm">{APP_NAME}</span>
          </Link>
        )}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
      {!sidebarCollapsed && (
        <div className="px-3 pt-4">
          <Link href="/canvas" className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-sm font-medium text-white hover:from-violet-500 hover:to-purple-500 transition-all">
            <Plus className="h-4 w-4" /> New Project
          </Link>
        </div>
      )}
      <nav className={cn("flex-1 space-y-1 overflow-y-auto py-4", sidebarCollapsed ? "px-2" : "px-3")}>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all group relative", sidebarCollapsed && "justify-center px-2", pathname === item.href ? "bg-violet-600/20 text-violet-400 font-medium" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white")} title={sidebarCollapsed ? item.label : undefined}>
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {!sidebarCollapsed && <span>{item.label}</span>}
              {item.badge && <span className={cn("ml-auto rounded-md bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold text-white", sidebarCollapsed && "absolute -right-1 -top-1 ml-0")}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>
      {!sidebarCollapsed && (
        <div className="border-t border-zinc-800 p-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-medium text-violet-300">{user.name?.[0]?.toUpperCase() ?? "U"}</div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-white truncate">{user.name ?? user.email}</p>
                <p className="text-xs text-zinc-500">{user.plan} · {user.credits} credits</p>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center justify-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">Sign In</Link>
          )}
        </div>
      )}
    </aside>
  );
}
