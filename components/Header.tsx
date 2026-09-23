"use client";

import React from "react";
import { Bell, MapPin, Search, ShieldAlert, Sun } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Header() {
  const { isStreaming, toggleStreaming, telemetry } = useTelemetry();

  const activeUnits = telemetry?.active_units ?? 48;
  const latency = telemetry?.latency_ms ?? 42;
  const healthScore = telemetry?.fleet_health_score ?? 88.4;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 font-sans shadow-xs">
      {/* Left: Stream Toggle & Location */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${isStreaming
            ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70"
            : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          title="Toggle live telemetry sync"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming ? "bg-emerald-600" : "bg-slate-400"}`}></span>
          </span>
          <span className="font-bold text-slate-800">{activeUnits} Units Active</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{latency}ms</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${isStreaming ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
            }`}>
            {isStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Sector 4 Northern Pit (Bench -140M)</span>
        </div>
      </div>

      {/* Right: Sunlight High-Visibility Badge, Health KPI, Search & Profile */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Daylight High-Contrast Mode</span>
        </div> */}

        {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[10px]">FLEET HEALTH:</span>
          <strong className="text-emerald-700 text-xs">{healthScore}</strong>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <strong>EX-04 (CMSI 94)</strong>
        </div> */}

        <div className="relative w-56 hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machine ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-orange-500 transition"
          />
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
