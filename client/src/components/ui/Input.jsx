import React from "react";
import { cn } from "../../utils/cn";

/**
 * Input Component - Accessible, modern dark-themed input with icons and validation support.
 */
export const Input = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      icon,
      iconRight,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate fallback id for label association
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500",
              "text-sm px-4 py-2.5 transition-all duration-200 outline-none",
              "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-slate-900",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-11",
              iconRight && "pr-11",
              error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {iconRight}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
