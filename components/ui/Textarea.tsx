import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./utils";

type TextareaVariant = "default" | "error";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: TextareaVariant;
};

const variants: Record<TextareaVariant, string> = {
  default: "border-slate-700 focus:border-blue-500 focus:ring-blue-500",
  error: "border-red-500 focus:border-red-400 focus:ring-red-500",
};

/**
 * Multi-line text input for captions, notes, and settings fields.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, variant = "default", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={variant === "error" || props["aria-invalid"] || undefined}
        className={cn(
          "w-full resize-y rounded-xl border bg-slate-800 px-4 py-3 text-sm text-white outline-none transition",
          "placeholder:text-slate-500 focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
