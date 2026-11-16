import React from "react";
import { Zap, Car, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "../../utils/cn";
import { Badge } from "./Badge";

/**
 * SlotIndicator Component
 * Custom domain component visualizing a parking bay or EV charging slot with live status.
 */
export const SlotIndicator = ({
  slotNumber,
  status = "available",
  isEV = false,
  powerKw,
  pricePerHour,
  onClick,
  isSelected = false,
  className
}) => {
  // Status style maps
  const statusStyles = {
    available: {
      card: "border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/40 text-emerald-300",
      dot: "emerald",
      label: "Available",
      icon: isEV ? <Zap className="w-4 h-4 text-emerald-400" /> : <Car className="w-4 h-4 text-emerald-400" />
    },
    occupied: {
      card: "border-slate-800 bg-slate-900/60 opacity-60 cursor-not-allowed text-slate-400",
      dot: "slate",
      label: "Occupied",
      icon: <Car className="w-4 h-4 text-slate-500" />
    },
    reserved: {
      card: "border-amber-500/30 bg-amber-950/20 text-amber-300",
      dot: "amber",
      label: "Reserved",
      icon: <Clock className="w-4 h-4 text-amber-400" />
    },
    maintenance: {
      card: "border-rose-500/30 bg-rose-950/20 opacity-60 text-rose-300",
      dot: "rose",
      label: "Offline",
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
    }
  };

  const currentStatus = statusStyles[status] || statusStyles.available;

  return (
    <div
      onClick={status === "available" ? onClick : undefined}
      className={cn(
        "relative rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between gap-3 select-none",
        currentStatus.card,
        status === "available" && "cursor-pointer active:scale-95",
        isSelected && "ring-2 ring-emerald-400 border-emerald-400 shadow-glow-emerald bg-emerald-950/50",
        className
      )}
    >
      {/* Top row: Slot Code & Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-white">
          {currentStatus.icon}
          <span>{slotNumber}</span>
        </div>
        <Badge variant={currentStatus.dot} size="sm" dot>
          {currentStatus.label}
        </Badge>
      </div>

      {/* Middle row: EV Specs if applicable */}
      {isEV && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md border border-white/5 font-mono">
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap className="w-3 h-3" />
            {powerKw ? `${powerKw} kW` : "Fast Charger"}
          </span>
          <span className="text-slate-300 font-semibold">CCS2 / Type 2</span>
        </div>
      )}

      {/* Bottom row: Pricing */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
        <span className="text-slate-400">Rate</span>
        <span className="font-semibold text-white">₹{pricePerHour}/hr</span>
      </div>
    </div>
  );
};
