import EmptyState from "@/components/ui/EmptyState";

export default function PostsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <EmptyState
        description="Post creation, drafts, and publishing workflows will be added after the dashboard foundation is complete."
        title="No posts yet"
      />
    </div>
  );
}
