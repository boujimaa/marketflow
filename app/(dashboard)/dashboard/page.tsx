import {
  CalendarPreviewCard,
  ConnectedAccountsCard,
  QuickActionsCard,
  RecentPostsCard,
  StatsCard,
} from "@/components/dashboard";

const stats = [
  {
    title: "Scheduled posts",
    value: "0",
    description: "Posts queued for Facebook and Instagram publishing.",
    tone: "blue" as const,
  },
  {
    title: "Published posts",
    value: "0",
    description: "Successfully published content will be tracked here.",
    tone: "emerald" as const,
  },
  {
    title: "Connected accounts",
    value: "0",
    description: "Meta accounts connected to this workspace.",
    tone: "amber" as const,
  },
  {
    title: "Failed posts",
    value: "0",
    description: "Publishing failures that need attention.",
    tone: "slate" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-medium text-blue-400">Welcome</p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Plan, schedule, and publish social content
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          MarketFlow V1 is focused on Facebook and Instagram publishing. Connect
          Meta accounts, prepare posts, and review your scheduling calendar from
          one workspace.
        </p>
      </section>

      <section
        aria-label="Dashboard statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <RecentPostsCard />
        <QuickActionsCard />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ConnectedAccountsCard />
        <CalendarPreviewCard />
      </section>
    </div>
  );
}
