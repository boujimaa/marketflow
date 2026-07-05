import NavigationItem from "./NavigationItem";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: "D" },
  { href: "/dashboard/posts", label: "Posts", icon: "P" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "C" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "A" },
  { href: "/dashboard/settings", label: "Settings", icon: "S" },
];

export default function Sidebar() {
  return (
    <>
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950/70 px-4 py-5 lg:block">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white"
            >
              MF
            </div>
            <div>
              <p className="text-base font-bold text-white">MarketFlow</p>
              <p className="text-xs text-slate-500">Social publishing</p>
            </div>
          </div>
        </div>

        <nav aria-label="Dashboard navigation" className="space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem key={item.href} {...item} />
          ))}
        </nav>
      </aside>

      <nav
        aria-label="Mobile dashboard navigation"
        className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-1 rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur lg:hidden"
      >
        {navigationItems.map((item) => (
          <NavigationItem compact key={item.href} {...item} />
        ))}
      </nav>
    </>
  );
}
