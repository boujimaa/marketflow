import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "./utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

/**
 * Form label primitive with an optional visual required marker.
 */
const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium leading-none text-slate-200",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {children}
        {required ? (
          <span className="ml-1 text-red-400" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
    );
  },
);

Label.displayName = "Label";

export default Label;
