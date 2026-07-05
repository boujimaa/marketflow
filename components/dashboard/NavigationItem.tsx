"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/utils";

export type NavigationItemProps = {
  href: string;
  label: string;
  icon: string;
  compact?: boolean;
};

export default function NavigationItem({
  href,
  icon,
  label,
  compact = false,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      aria-label={compact ? label : undefined}
      className={cn(
        "flex items-center rounded-xl text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        compact ? "justify-center px-2 py-2" : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
          : "text-slate-400 hover:bg-slate-900 hover:text-white",
      )}
      href={href}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold",
          isActive ? "bg-white/15 text-white" : "bg-slate-900 text-slate-400",
        )}
      >
        {icon}
      </span>
      {compact ? <span className="sr-only">{label}</span> : label}
    </Link>
  );
}
