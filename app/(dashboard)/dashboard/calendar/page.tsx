import EmptyState from "@/components/ui/EmptyState";

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <EmptyState
        description="Scheduled Facebook and Instagram posts will appear here once scheduling is implemented."
        title="Calendar is empty"
      />
    </div>
  );
}
