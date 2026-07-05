import Link from "next/link";
import Card from "@/components/ui/Card";

const actions = [
  { href: "/dashboard/posts", label: "Create post", description: "Draft content for Facebook and Instagram." },
  { href: "/dashboard/calendar", label: "Open calendar", description: "Review upcoming scheduled content." },
  { href: "/dashboard/accounts", label: "Connect account", description: "Prepare Meta account connections." },
];

export default function QuickActionsCard() {
  return (
    <Card className="h-full">
      <h2 className="text-lg font-semibold text-white">Quick actions</h2>
      <div className="mt-4 grid gap-3">
        {actions.map((action) => (
          <Link
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/60 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            href={action.href}
            key={action.href}
          >
            <p className="text-sm font-semibold text-white">{action.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
