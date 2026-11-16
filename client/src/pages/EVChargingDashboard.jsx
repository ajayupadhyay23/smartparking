import React, { useState, useEffect } from "react";
import {
  Zap,
  BatteryCharging,
  Clock,
  Activity,
  ShieldCheck,
  CheckCircle2,
  StopCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useParkVoltStore } from "../store/useParkVoltStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export const EVChargingDashboard = () => {
  const { activeChargingSession, updateChargingTelemetry, stopChargingSession, user } =
    useParkVoltStore();

  const [isCharging, setIsCharging] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(
    activeChargingSession ? activeChargingSession.batteryPercentage : 42
  );
  const [energyDelivered, setEnergyDelivered] = useState(
    activeChargingSession ? activeChargingSession.energyDeliveredKwh : 18.6
  );
  const [powerKw, setPowerKw] = useState(142.5);
  const [elapsedSeconds, setElapsedSeconds] = useState(840);

  // Live Telemetry Ticker Simulation
  useEffect(() => {
    if (!isCharging) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // Simulate energy accumulation
      setEnergyDelivered((prev) => Number((prev + 0.04).toFixed(2)));

      // Simulate gradual battery charge increase
      setBatteryLevel((prev) => {
        if (prev >= 100) {
          setIsCharging(false);
          return 100;
        }
        // Power tapers off above 80% (standard EV battery protection curve)
        if (prev > 80) {
          setPowerKw((p) => Math.max(35, Number((p * 0.98).toFixed(1))));
        }
        return Number((prev + 0.05).toFixed(1));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCharging]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}m ${secs < 10 ? "0" + secs : secs}s`;
  };

  const currentCost = (energyDelivered * 12).toFixed(2); // ₹12 per kWh

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 10: EV HIGH-VOLTAGE CHARGING TELEMETRY</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Live EV Fast Charging Telemetry Station
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor real-time voltage, delivered kWh, current battery SOC, and automated BMS tapering curves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LIVE BATTERY SOC & CHARGER STATUS */}
        <div className="lg:col-span-7 space-y-6">
          <Card glow className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan">
                  <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Bay EV-01 • CCS-2 Supercharger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connected to {user?.vehicleModel || "Electric Vehicle"} ({user?.vehicleNumber})
                  </p>
                </div>
              </div>

              <Badge variant={isCharging ? "emerald" : "amber"} size="md" dot>
                {isCharging ? "Fast Charging Active" : "Session Paused"}
              </Badge>
            </div>

            {/* Battery State of Charge (SOC) Progress Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Battery State of Charge (SOC)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-mono text-white">
                    {batteryLevel}%
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {isCharging ? "+0.4%/min" : "Idle"}
                  </span>
                </div>
              </div>

              {/* Progress Bar with Gradient */}
              <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 shadow-glow-emerald"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Initial: 22%</span>
                <span className="text-amber-400">80% Fast-Charge Cap</span>
                <span>Target: 100%</span>
              </div>
            </div>

            {/* Live Electrical Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400">Power Delivery</span>
                <div className="text-lg font-bold font-mono text-cyan-400">{powerKw} kW</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400">Delivered Energy</span>
                <div className="text-lg font-bold font-mono text-white">{energyDelivered} kWh</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400">Active Duration</span>
                <div className="text-lg font-bold font-mono text-white">
                  {formatTimer(elapsedSeconds)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400">Accrued Cost</span>
                <div className="text-lg font-bold font-mono text-emerald-400">₹{currentCost}</div>
              </div>
            </div>

            {/* Interactive Session Controls */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant={isCharging ? "outline" : "neon"}
                size="md"
                icon={isCharging ? <AlertCircle className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
                onClick={() => setIsCharging(!isCharging)}
              >
                {isCharging ? "Pause Charging Session" : "Resume Fast Charging"}
              </Button>

              <Button
                variant="danger"
                size="md"
                icon={<StopCircle className="w-4 h-4" />}
                onClick={() => {
                  setIsCharging(false);
                  stopChargingSession();
                  alert(
                    `Charging Session Completed! Total Energy Delivered: ${energyDelivered} kWh. Total Cost: ₹${currentCost}. Invoice dispatched to ${user.email}.`
                  );
                }}
              >
                Stop & Unlock Connector Gun
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: CHARGING CURVE INSIGHTS & BMS SPECS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Smart BMS Tapering Curve</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lithium iron phosphate (LFP) and NMC EV batteries accept high currents (up to 150 kW)
              until 80% SOC. The station then reduces power to prevent dendrite growth and thermal runaway.
            </p>

            {/* Simulated Curve Graph Blocks */}
            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">0% - 60% (CC Fast Mode):</span>
                  <span className="text-cyan-400 font-bold">140 - 150 kW</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 w-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">60% - 80% (Current Step-down):</span>
                  <span className="text-emerald-400 font-bold">90 - 120 kW</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-3/4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">80% - 100% (CV Trickle Mode):</span>
                  <span className="text-amber-400 font-bold">25 - 40 kW</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 w-1/4" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Supply Grid Voltage:</span>
                <span className="font-mono text-white">448.2 V DC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Charging Current:</span>
                <span className="font-mono text-white">318.4 A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hardware Controller:</span>
                <span className="font-mono text-emerald-400">OCPP 2.0.1 Compliant</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
