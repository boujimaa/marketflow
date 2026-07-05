"use client";

import { usePathname } from "next/navigation";
import Input from "@/components/ui/Input";
import { cn } from "@/components/ui/utils";
import type { UserMenuProps } from "./UserMenu";
import UserMenu from "./UserMenu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/posts": "Posts",
  "/dashboard/calendar": "Calendar",
  "/dashboard/accounts": "Accounts",
  "/dashboard/settings": "Settings",
};

export default function Topbar({ email }: UserMenuProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0b1120]/95 px-4 py-4 backdrop-blur lg:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-blue-400">
            MarketFlow
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <label className="sr-only" htmlFor="dashboard-search">
              Search dashboard
            </label>
            <Input
              className="pl-10"
              id="dashboard-search"
              placeholder="Search posts, accounts, dates"
              type="search"
            />
            <span
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
            >
              /
            </span>
          </div>

          <button
            aria-label="Notifications"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition",
              "hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            )}
            type="button"
          >
            <span aria-hidden="true" className="text-sm font-bold">
              N
            </span>
          </button>

          <UserMenu email={email} />
        </div>
      </div>
    </header>
  );
}
