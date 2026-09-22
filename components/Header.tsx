"use client";

import React from "react";
import { Bell, ChevronDown, MapPin, Search, Activity, ShieldAlert, Cpu } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Header() {
  const { isStreaming, toggleStreaming, telemetry } = useTelemetry();

  const activeUnits = telemetry?.active_units ?? 48;
  const latency = telemetry?.latency_ms ?? 42;
  const healthScore = telemetry?.fleet_health_score ?? 88.4;

  return (
    <header className="bg-[#0B111C]/95 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Telemetry Ticker & Sector Selector */}
      <div className="flex items-center gap-3.5">
        {/* Stream Status Toggle Button */}
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
            isStreaming
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40"
              : "bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800"
          }`}
          title="Click to pause or resume live 100Hz telemetry stream"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            )}
          </span>
          <span className="font-semibold text-slate-300">
            {activeUnits} Units Active
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-medium text-[11px]">{latency}ms Latency</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest ${
            isStreaming ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-500"
          }`}>
            {isStreaming ? "LIVE 100Hz" : "PAUSED"}
          </span>
        </button>

        {/* Mining Pit Location */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0F1726] border border-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>Pilbara Iron • Sector 4 (Bench -140M)</span>
          <span className="text-[10px] text-slate-500 font-mono bg-black/30 px-1.5 py-0.5 rounded">Hard Basalt</span>
        </div>
      </div>

      {/* Right: Metrics, Search & Clearances */}
      <div className="flex items-center gap-3.5">
        {/* Quick Fleet Health Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0F1726] border border-white/5 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">FLEET HEALTH:</span>
          <span className="font-bold text-emerald-400">{healthScore}</span>
        </div>

        {/* Critical Alert Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-400">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="font-bold">EX-04</span>
          <span className="text-[10px] text-red-300/80">CMSI 94</span>
        </div>

        {/* Telemetry Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search telemetry, VIN, fault code..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0F1726] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-orange-500/80 transition"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
