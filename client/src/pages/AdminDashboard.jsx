import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  DollarSign,
  Zap,
  Car,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  Layers
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

export const AdminDashboard = () => {
  const [adminSlots, setAdminSlots] = useState([
    { id: "s1", number: "G-EV-01", location: "Cyber City Hub", type: "150kW DC Fast", status: "available", rate: 120 },
    { id: "s2", number: "G-EV-02", location: "Cyber City Hub", type: "60kW DC Fast", status: "occupied", rate: 80 },
    { id: "s3", number: "G-PK-03", location: "Cyber City Hub", type: "Standard Bay", status: "occupied", rate: 40 },
    { id: "s4", number: "G-PK-04", location: "Cyber City Hub", type: "Standard Bay", status: "reserved", rate: 40 },
    { id: "s5", number: "B1-EV-01", location: "Connaught Place", type: "120kW DC Fast", status: "available", rate: 100 },
    { id: "s6", number: "B1-PK-02", location: "Connaught Place", type: "Standard Bay", status: "maintenance", rate: 40 },
    { id: "s7", number: "L1-EV-01", location: "BKC Supergrid", type: "250kW Ultra", status: "occupied", rate: 150 },
    { id: "s8", number: "L1-EV-02", location: "BKC Supergrid", type: "250kW Ultra", status: "available", rate: 150 }
  ]);

  const toggleSlotMaintenance = (slotId) => {
    setAdminSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const nextStatus = s.status === "maintenance" ? "available" : "maintenance";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const forceReleaseSlot = (slotId) => {
    setAdminSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: "available" } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 11: ADMIN & INFRASTRUCTURE CONTROLLER</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Admin Grid Operations Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor multi-city parking capacity, manage hardware maintenance, and track live gross revenue.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Connected Bays</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">415 Bays</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>↑ 99.4% Hardware Uptime</span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Grid Utilization</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">74.2%</div>
          <div className="text-[11px] text-slate-400">308 Bays currently occupied</div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">₹48,920</div>
          <div className="text-[11px] text-slate-400">Processed via Razorpay Webhook</div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Instant EV Load Demand</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">480 kW</div>
          <div className="text-[11px] text-slate-400">Phase-balanced across substations</div>
        </Card>
      </div>

      {/* Live Hardware Slot Management Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Physical Slot Management Matrix</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Override bay states, release stalled vehicles, or schedule offline maintenance
            </p>
          </div>
          <Badge variant="emerald" size="sm" dot>
            MQTT Node Gateway Active
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase font-mono text-[11px] text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5">Slot Code</th>
                <th className="px-6 py-3.5">Facility Location</th>
                <th className="px-6 py-3.5">Hardware Standard</th>
                <th className="px-6 py-3.5">Tariff</th>
                <th className="px-6 py-3.5">Current Status</th>
                <th className="px-6 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {adminSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-1.5">
                    {slot.type.includes("DC") ? (
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{slot.number}</span>
                  </td>
                  <td className="px-6 py-4">{slot.location}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{slot.type}</td>
                  <td className="px-6 py-4 font-mono text-white">₹{slot.rate}/hr</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        slot.status === "available"
                          ? "emerald"
                          : slot.status === "occupied"
                          ? "rose"
                          : slot.status === "reserved"
                          ? "amber"
                          : "slate"
                      }
                      size="sm"
                      dot
                    >
                      {slot.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleSlotMaintenance(slot.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] border font-medium transition-all ${
                        slot.status === "maintenance"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                      }`}
                    >
                      {slot.status === "maintenance" ? "Activate Bay" : "Maintenance"}
                    </button>

                    {slot.status === "occupied" && (
                      <button
                        type="button"
                        onClick={() => forceReleaseSlot(slot.id)}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 font-medium transition-all"
                      >
                        Force Release
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
