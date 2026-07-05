import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function RecentPostsCard() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Recent posts</h2>
        <Badge>Not connected</Badge>
      </div>

      <EmptyState
        className="mt-4 min-h-52 bg-slate-950/40"
        description="Posts will appear here after publishing workflows are connected."
        title="No posts yet"
      />
    </Card>
  );
}
