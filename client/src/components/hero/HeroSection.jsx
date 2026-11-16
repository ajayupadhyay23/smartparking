import React, { useState } from "react";
import {
  Zap,
  Search,
  MapPin,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  Cpu,
  Clock
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MiniatureCity } from "../3d/MiniatureCity";
import { CityTelemetryOverlay } from "../3d/CityTelemetryOverlay";

/**
 * HeroSection Component
 * Combines the 3D Miniature City canvas with search inputs, live telemetry metrics, and CTAs.
 */
export const HeroSection = ({ onReserveSlot }) => {
  const [isNightMode, setIsNightMode] = useState(true);
  const [selected3DSlot, setSelected3DSlot] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  const handleSelectSlot = (slotData) => {
    setSelected3DSlot(slotData);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    alert(
      `Searching hubs near "${searchLocation}". In Step 3, this triggers the Explore & Search geospatial query!`
    );
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* LEFT COLUMN: BRAND PROMISE & SEARCH BAR */}
        <div className="lg:col-span-5 space-y-6 z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL-TIME 3D DIGITAL TWIN MESH</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Smart Parking & EV Charging at the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Speed of Light.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate parking hunting and charging anxiety. Experience real-time bay availability,
            autonomous IoT telemetry, and ultra-fast EV reservations powered by WebGL and WebSockets.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-emerald-400 pointer-events-none" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter city, landmark, or charging hub..."
                className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-md shadow-xl"
              />
              <div className="absolute right-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Search className="w-3.5 h-3.5" />}
                >
                  Find Now
                </Button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <span className="font-medium text-slate-500">Popular:</span>
              {["Connaught Place", "Cyber City", "BKC Mumbai", "Indiranagar"].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setSearchLocation(city)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </form>

          {/* Live Telemetry KPI Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Live Slots</span>
              </div>
              <div className="text-lg font-black font-mono text-white">4,820+</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Ultra-Fast</span>
              </div>
              <div className="text-lg font-black font-mono text-cyan-400">150 kW</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Sync Latency</span>
              </div>
              <div className="text-lg font-black font-mono text-white">&lt;25ms</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D WEBGL MINIATURE CITY VIEWPORT */}
        <div className="lg:col-span-7 relative">
          <MiniatureCity
            onSelectSlot={handleSelectSlot}
            isNightMode={isNightMode}
          />
          <CityTelemetryOverlay
            isNightMode={isNightMode}
            onToggleNightMode={() => setIsNightMode(!isNightMode)}
            selectedSlot={selected3DSlot}
            onClearSelectedSlot={() => setSelected3DSlot(null)}
            onReserveSlot={(slot) => onReserveSlot(slot)}
          />
        </div>
      </div>
    </section>
  );
};
