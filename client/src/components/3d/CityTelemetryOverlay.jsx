import React from "react";
import {
  Sun,
  Moon,
  Zap,
  Car,
  Compass,
  CheckCircle2,
  Maximize2,
  X,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

/**
 * CityTelemetryOverlay
 * Heads-Up Display (HUD) overlay positioned directly over the 3D canvas viewport.
 */
export const CityTelemetryOverlay = ({
  isNightMode,
  onToggleNightMode,
  selectedSlot,
  onClearSelectedSlot,
  onReserveSlot
}) => {
  return (
    <>
      {/* Top-Right Control Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleNightMode}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium"
          title="Toggle Day/Night City Lighting"
        >
          {isNightMode ? (
            <>
              <Moon className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Cyber Night</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Daylight</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom-Left Controls Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/75 border border-white/5 backdrop-blur-md text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Digital Twin</span>
        </div>
        <span>•</span>
        <span>Left Click + Drag: Orbit</span>
        <span>•</span>
        <span>Scroll: Zoom</span>
      </div>

      {/* Selected Slot Floating Inspector Card (appears when clicking any 3D bay) */}
      {selectedSlot && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-30 p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-xl shadow-glow-emerald animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-mono font-bold text-lg text-white">
                  {selectedSlot.slotNumber}
                </h4>
                <Badge
                  variant={
                    selectedSlot.status === "available"
                      ? "emerald"
                      : selectedSlot.status === "occupied"
                      ? "rose"
                      : "amber"
                  }
                  size="sm"
                  dot
                >
                  {selectedSlot.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedSlot.type.startsWith("ev")
                  ? "EV High-Voltage Charging Hub"
                  : "Standard Parking Bay"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClearSelectedSlot}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs">
            {selectedSlot.kw > 0 && (
              <div className="flex justify-between items-center text-cyan-400 bg-cyan-950/30 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                <span className="flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> Charger Power:
                </span>
                <span className="font-mono font-bold">{selectedSlot.kw} kW CCS2</span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Hourly Tariff:</span>
              <span className="font-semibold text-white">₹{selectedSlot.rate} / hour</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">IoT Telemetry Node:</span>
              <span className="font-mono text-emerald-400 text-[11px]">MQTT / ESP32-Active</span>
            </div>
          </div>

          <div className="pt-2">
            {selectedSlot.status === "available" ? (
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onReserveSlot(selectedSlot)}
              >
                Book This 3D Slot
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                disabled
                className="w-full justify-center"
              >
                Slot Currently {selectedSlot.status}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
