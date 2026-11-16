import React from "react";
import { cn } from "../../utils/cn";

/**
 * Button Component - Fundamental interactive component for ParkVolt.
 *
 * Supports various aesthetic variants, sizes, loading spinners, and icon slots.
 */
export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      icon,
      iconRight,
      ...props
    },
    ref
  ) => {
    // Base styles shared across every button
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080C14] disabled:opacity-50 disabled:pointer-events-none select-none";

    // Style variants tailored for the ParkVolt dark / cyber-emerald theme
    const variants = {
      primary:
        "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 focus:ring-emerald-400",
      secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 shadow-sm focus:ring-slate-500",
      neon:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-400 shadow-glow-emerald focus:ring-emerald-400",
      outline:
        "bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800/60 hover:text-white focus:ring-slate-600",
      ghost:
        "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 focus:ring-slate-700",
      danger:
        "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-400 shadow-sm focus:ring-rose-400"
    };

    // Size variants
    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex shrink-0">{icon}</span>}
            <span>{children}</span>
            {iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
