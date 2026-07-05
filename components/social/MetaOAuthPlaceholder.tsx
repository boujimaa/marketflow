import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

/**
 * Documents the future OAuth handoff without introducing backend behavior.
 */
export default function MetaOAuthPlaceholder() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Meta OAuth flow</h2>
          <p className="mt-1 text-sm text-slate-400">
            Placeholder for Facebook Login permissions and account selection.
          </p>
        </div>
        <Badge variant="info">Frontend only</Badge>
      </div>

      <ol className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          Request Meta permissions
        </li>
        <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          Select Facebook Pages
        </li>
        <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          Resolve Instagram Business Account
        </li>
      </ol>
    </Card>
  );
}
