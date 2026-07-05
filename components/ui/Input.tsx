import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./utils";

type InputVariant = "default" | "error";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: InputVariant;
};

const variants: Record<InputVariant, string> = {
  default: "border-slate-700 focus:border-blue-500 focus:ring-blue-500",
  error: "border-red-500 focus:border-red-400 focus:ring-red-500",
};

/**
 * Accessible text input primitive. Pair with Label and error text via aria-describedby.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={variant === "error" || props["aria-invalid"] || undefined}
        className={cn(
          "h-11 w-full rounded-xl border bg-slate-800 px-4 py-3 text-sm text-white outline-none transition",
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

Input.displayName = "Input";

export default Input;
