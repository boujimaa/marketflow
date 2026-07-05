import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function ConnectedAccountsCard() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Connected accounts</h2>
        <Badge variant="warning">Setup needed</Badge>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
          <p className="text-sm font-medium text-white">Facebook Pages</p>
          <p className="mt-1 text-sm text-slate-400">No Pages connected.</p>
        </div>
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
          <p className="text-sm font-medium text-white">
            Instagram Business Account
          </p>
          <p className="mt-1 text-sm text-slate-400">No account connected.</p>
        </div>
      </div>

      <Link
        className="mt-4 inline-flex text-sm font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        href="/dashboard/accounts"
      >
        Manage accounts
      </Link>
    </Card>
  );
}
