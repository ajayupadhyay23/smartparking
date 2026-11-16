import React from "react";
import { cn } from "../../utils/cn";

/**
 * Card Container Component - Premium Glassmorphism Container
 */
export const Card = React.forwardRef(
  ({ children, className, hoverEffect = false, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] text-slate-100 shadow-xl overflow-hidden transition-all duration-300",
          hoverEffect &&
            "hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1",
          glow && "border-emerald-500/40 shadow-glow-emerald",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-5 border-b border-white/[0.06]", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold tracking-tight text-white", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-slate-400 mt-1", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "px-6 py-4 bg-slate-950/40 border-t border-white/[0.06] flex items-center justify-between",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
