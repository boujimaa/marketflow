import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./utils";

type CardVariant = "default" | "elevated" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: CardPadding;
};

const variants: Record<CardVariant, string> = {
  default: "border-slate-800 bg-slate-900",
  elevated: "border-slate-700 bg-slate-900 shadow-xl shadow-black/20",
  interactive:
    "border-slate-800 bg-slate-900 transition hover:border-slate-700 hover:bg-slate-800/70",
};

const paddings: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Surface primitive for grouping related content without owning layout behavior.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className, padding = "md", variant = "default", ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border text-slate-100",
          variants[variant],
          paddings[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
