"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Header() {
  const { isStreaming, toggleStreaming, telemetry } = useTelemetry();

  const activeUnits = telemetry?.active_units ?? 48;
  const latency = telemetry?.latency_ms ?? 42;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 font-sans shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      {/* Left: Stream Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
            isStreaming
              ? "bg-emerald-50/80 border-emerald-200/70 text-emerald-800 hover:bg-emerald-100/60"
              : "bg-slate-100/80 border-slate-200/70 text-slate-700 hover:bg-slate-200/60"
          }`}
          title="Toggle live telemetry sync"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming ? "bg-emerald-600" : "bg-slate-400"
              }`}
            ></span>
          </span>
          <span className="font-semibold text-slate-800">{activeUnits} Units Active</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-500 tabular-nums">{latency}ms</span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              isStreaming ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {isStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>
      </div>

      {/* Right: Search & Notifications */}
      <div className="flex items-center gap-3 text-xs">
        <div className="relative w-64 hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
          <input
            type="text"
            placeholder="Search unit (e.g. EX-04)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200/70 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-orange-400 transition shadow-xs"
          />
        </div>

        <button
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100/70 transition cursor-pointer border border-transparent hover:border-slate-200/60"
          title="System Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
}
