import Card from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <Card className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Workspace settings
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            UI-only placeholder for future workspace configuration.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input
              disabled
              id="workspace-name"
              placeholder="MarketFlow Workspace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input disabled id="timezone" placeholder="Workspace timezone" />
          </div>
        </div>
      </Card>
    </div>
  );
}
