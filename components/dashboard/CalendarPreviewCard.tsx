import Card from "@/components/ui/Card";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPreviewCard() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Calendar preview</h2>
        <p className="text-sm text-slate-500">This week</p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center"
            key={day}
          >
            <p className="text-xs font-medium text-slate-500">{day}</p>
            <div className="mx-auto mt-3 h-2 w-2 rounded-full bg-slate-700" />
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Scheduled posts will populate this preview once post scheduling is
        connected.
      </p>
    </Card>
  );
}
