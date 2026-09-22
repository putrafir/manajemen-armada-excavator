"use client";

import React from "react";
import { Bell, MapPin, Search, ShieldAlert } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Header() {
  const { isStreaming, toggleStreaming, telemetry } = useTelemetry();

  const activeUnits = telemetry?.active_units ?? 48;
  const latency = telemetry?.latency_ms ?? 42;
  const healthScore = telemetry?.fleet_health_score ?? 88.4;

  return (
    <header className="bg-[#0B111C]/90 backdrop-blur-md border-b border-white/5 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Left: Stream Toggle & Location */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
            isStreaming
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40"
              : "bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800"
          }`}
          title="Toggle live telemetry sync"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming ? "bg-emerald-500" : "bg-slate-500"}`}></span>
          </span>
          <span className="font-bold text-slate-200">{activeUnits} Units Active</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{latency}ms</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
            isStreaming ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
          }`}>
            {isStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>Sector 4 Northern Pit (Bench -140M)</span>
        </div>
      </div>

      {/* Right: Health KPI, Search & Profile */}
      <div className="flex items-center gap-3.5 text-xs font-mono">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1626] border border-white/5">
          <span className="text-slate-500 text-[10px]">FLEET HEALTH:</span>
          <strong className="text-emerald-400 text-xs">{healthScore}</strong>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <strong>EX-04 (CMSI 94)</strong>
        </div>

        <div className="relative w-56 hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machine ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0F1626] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-orange-500/80 transition"
          />
        </div>

        <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
