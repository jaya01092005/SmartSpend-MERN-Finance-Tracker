import { forwardRef } from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={twMerge(
          clsx(
            "flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
