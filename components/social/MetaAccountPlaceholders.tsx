import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function MetaAccountPlaceholders() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Facebook Pages</h2>
          <Badge>Pending OAuth</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Connected Pages will appear here after Meta OAuth returns granted
          assets.
        </p>
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-500">
          No Pages connected yet.
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Instagram Business Account
          </h2>
          <Badge>Pending OAuth</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Instagram Business Accounts linked to selected Facebook Pages will be
          resolved here.
        </p>
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-500">
          No Instagram Business Account connected yet.
        </div>
      </Card>
    </div>
  );
}
