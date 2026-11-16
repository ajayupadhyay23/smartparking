import React from "react";
import { cn } from "../../utils/cn";

/**
 * Badge Component - Used to display status indicators, tags, and EV charging speeds.
 */
export const Badge = ({
  children,
  variant = "emerald",
  size = "md",
  dot = false,
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors select-none";

  const variants = {
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    slate: "bg-slate-800 text-slate-300 border border-slate-700",
    glass: "bg-white/5 backdrop-blur-md text-slate-200 border border-white/10"
  };

  const dotColors = {
    emerald: "bg-emerald-400",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    slate: "bg-slate-400",
    glass: "bg-white"
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-2",
    lg: "text-sm px-3.5 py-1.5 gap-2"
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            dotColors[variant] || "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
};
