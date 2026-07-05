import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

export default function AccountsLoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 rounded-lg bg-slate-800" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-800" />
        </div>
        <Spinner label="Loading account connections" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-40 animate-pulse" />
        <Card className="h-40 animate-pulse" />
      </div>
    </div>
  );
}
