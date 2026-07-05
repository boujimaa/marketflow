import { requireUser } from "@/lib/auth/guards";
import { DashboardShell } from "@/components/dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser("/dashboard/accounts");

  return (
    <DashboardShell userEmail={user.email}>
      {children}
    </DashboardShell>
  );
}
