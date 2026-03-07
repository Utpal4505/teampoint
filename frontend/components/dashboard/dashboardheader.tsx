"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[oklch(0.25_0.01_250)] bg-[oklch(0.17_0.01_250)/0.8] px-6 backdrop-blur-sm">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1 text-[oklch(0.5_0_0)] hover:text-[oklch(0.8_0_0)]" />

      <Separator orientation="vertical" className="h-5 bg-[oklch(0.28_0.01_250)]" />

      {/* Page title */}
      <h1 className="flex-1 font-[family-name:var(--display-family)] text-base font-bold tracking-tight text-[oklch(0.88_0_0)]">
        {title}
      </h1>

      {/* Notification bell */}
      <button className="relative flex h-9 w-9 items-center justify-center rounded-xl
        border border-[oklch(0.28_0.01_250)] bg-[oklch(0.2_0.01_250)]
        text-[oklch(0.55_0_0)] transition-all duration-150
        hover:border-[oklch(0.35_0.01_250)] hover:bg-[oklch(0.25_0.01_250)] hover:text-[oklch(0.85_0_0)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.16_262)]">
        <Bell size={16} />
        {/* Unread dot */}
        <span className="absolute right-[9px] top-[9px] h-[6px] w-[6px] rounded-full bg-[oklch(0.6_0.16_262)] ring-2 ring-[oklch(0.17_0.01_250)]" />
      </button>
    </header>
  );
}