import { type HTMLAttributes } from "react";
import { cn } from "./utils";

type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  size?: SpinnerSize;
};

const sizes: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
};

export default function Spinner({
  className,
  label = "Loading",
  size = "md",
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-blue-500",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
