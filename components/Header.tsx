"use client";

import React from "react";
import { Bell, ChevronDown, MapPin, Search } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Header() {
  const { isStreaming, toggleStreaming, telemetry } = useTelemetry();

  const activeUnits = telemetry?.active_units ?? 48;
  const latency = telemetry?.latency_ms ?? 42;

  return (
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left Telemetry Status */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2.5 border px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer ${
            isStreaming
              ? "bg-blue-50/80 border-blue-200/70 hover:bg-blue-100/70"
              : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-500"
          }`}
          title="Click to toggle live telemetry simulation"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
            )}
          </span>
          <span className="text-slate-600 font-semibold">
            Telemetry Stream: <strong className="text-slate-900 font-bold">{activeUnits} units live</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-medium">Low Latency {latency}ms</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isStreaming ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
            {isStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-medium text-slate-800 cursor-pointer transition">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Pilbara Iron Sector 4 - Northern Pit</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>

      {/* Right Search and Profile */}
      <div className="flex items-center gap-4">
        {/* Search Box */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Unit ID, fault code, pit site..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:bg-white text-slate-800 placeholder-slate-400 transition"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center">
            4
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-orange-400 font-bold text-xs flex items-center justify-center border border-slate-300">
            VA
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">Dr. V. Aris</div>
            <div className="text-[10px] text-slate-500 font-mono">Fleet Director</div>
          </div>
        </div>
      </div>
    </header>
  );
}
