import { type ReactNode } from "react";
import Button from "./Button";
import { cn } from "./utils";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

/**
 * Standard empty state for dashboards, tables, calendars, and media lists.
 */
export default function EmptyState({
  actionLabel,
  children,
  className,
  description,
  icon,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 text-slate-400" aria-hidden="true">
          {icon}
        </div>
      ) : null}

      <h2 id="empty-state-title" className="text-lg font-semibold text-white">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          {description}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}

      {children}
    </section>
  );
}
