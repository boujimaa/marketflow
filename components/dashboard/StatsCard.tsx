import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  tone?: "blue" | "emerald" | "amber" | "slate";
};

const toneClasses = {
  blue: "bg-blue-500/10 text-blue-300",
  emerald: "bg-emerald-500/10 text-emerald-300",
  amber: "bg-amber-500/10 text-amber-300",
  slate: "bg-slate-800 text-slate-300",
};

export default function StatsCard({
  description,
  title,
  tone = "blue",
  value,
}: StatsCardProps) {
  return (
    <Card className="min-h-36">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        <Badge className={toneClasses[tone]}>V1</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{description}</p>
    </Card>
  );
}
