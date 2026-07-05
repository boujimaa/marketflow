import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export type DashboardShellProps = {
  children: React.ReactNode;
  userEmail?: string;
};

export default function DashboardShell({
  children,
  userEmail,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar email={userEmail} />
          <main className="flex-1 px-4 py-6 pb-24 lg:px-6 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
