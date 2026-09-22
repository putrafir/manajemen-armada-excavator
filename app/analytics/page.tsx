"use client";

import React from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Radio, 
  FileText, 
  Sliders, 
  Layers, 
  Flame,
  Zap,
  ArrowRight
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">
            ALGORITHMIC KINEMATICS DIAGNOSTICS
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Fleet Stress & Predictive Telemetry Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time CMSI fatigue modeling vs OEM baseline wear metrics across digging nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/5">
            Last 14 Days Active Roster
          </span>
          <Link
            href="/diagnostics"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-950/40 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Neural Diagnostics
          </Link>
        </div>
      </div>

      {/* 2. KPI HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">RELIABILITY EPOCH</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">142.6</span>
            <span className="text-emerald-400 text-xs font-bold">+18.4% hrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-sans">
            Mean Time Between Anomalies across basalt benches
          </div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">FATIGUE INDEX</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">64.2</span>
            <span className="text-slate-500 text-xs font-bold">/ 100</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-2 font-sans">
            Baseline benchmark: 55.0 (+9.2 pt elevation)
          </div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">INTERVENTION ROI</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">96.5</span>
            <span className="text-slate-400 text-xs font-semibold">hrs saved</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-sans">
            12 early hydraulic shear warnings acknowledged
          </div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">DATA PIPELINE</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">1.84</span>
            <span className="text-cyan-400 text-xs font-bold">Billion Pts/Shift</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-sans">
            99.98% packet synchronization over Private LTE
          </div>
        </div>
      </div>

      {/* 3. Main Analytics Grid: Predictive Wear vs OEM & Delta Gap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 Cols): Predictive Wear Chart & Stress Vectors */}
        <div className="xl:col-span-8 space-y-6">
          {/* High-Contrast Predictive Wear Chart */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3 font-mono">
              <div>
                <h3 className="text-base font-black text-white">
                  Predictive Wear vs. Linear OEM Schedules
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  V3.4 Neural Kinematics Fatigue Modeling
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-500"></span>
                  <span className="text-slate-400">Linear OEM (5,000h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-orange-500 rounded"></span>
                  <span className="text-orange-400 font-bold">TerraCortex CMSI Reality</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="bg-[#080C14] border border-white/5 rounded-xl p-4 relative overflow-hidden">
              <svg viewBox="0 0 700 240" className="w-full h-56 select-none font-mono text-[10px]">
                <defs>
                  <linearGradient id="wearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <line x1="50" y1="40" x2="680" y2="40" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="90" x2="680" y2="90" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="140" x2="680" y2="140" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="190" x2="680" y2="190" stroke="rgba(255,255,255,0.05)" />

                {/* Y Axis Labels */}
                <text x="10" y="45" fill="#64748B">100%</text>
                <text x="10" y="95" fill="#64748B">75%</text>
                <text x="10" y="145" fill="#64748B">50%</text>
                <text x="10" y="195" fill="#64748B">25%</text>

                {/* Linear OEM Line (Dashed Slate) */}
                <line x1="60" y1="200" x2="660" y2="70" stroke="#64748B" strokeWidth="2" strokeDasharray="5 5" />

                {/* TerraCortex Exponential Stress Curve with Glow Fill */}
                <path
                  d="M 60,200 Q 300,195 450,150 T 660,35 L 660,200 Z"
                  fill="url(#wearGradient)"
                />
                <path
                  d="M 60,200 Q 300,195 450,150 T 660,35"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="3"
                />

                {/* Divergence Gap Annotation */}
                <line x1="450" y1="150" x2="450" y2="110" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="450" cy="150" r="4" fill="#EA580C" />
                <text x="460" y="130" fill="#F87171" fontWeight="bold">EX-04 Wear Gap (+1,640 hrs)</text>
              </svg>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2 px-12">
                <span>0 Operating Hours</span>
                <span>1,250h</span>
                <span>2,500h</span>
                <span>3,750h</span>
                <span>5,000h (OEM Interval)</span>
              </div>
            </div>

            {/* Accelerated Stress Breakdown Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="bg-[#131D30] border border-white/5 p-3.5 rounded-xl">
                <div className="text-orange-400 font-bold text-base">+38%</div>
                <div className="text-white font-semibold mt-0.5">Hydraulic Shockwave</div>
                <div className="text-[11px] text-slate-400 font-sans mt-1">
                  Transient pressure relief spikes during basalt breakout penetration.
                </div>
              </div>

              <div className="bg-[#131D30] border border-white/5 p-3.5 rounded-xl">
                <div className="text-orange-400 font-bold text-base">+42%</div>
                <div className="text-white font-semibold mt-0.5">Quartz Micro-Abrasives</div>
                <div className="text-[11px] text-slate-400 font-sans mt-1">
                  High mineral hardness eroding cylinder wiper seals and spool valve walls.
                </div>
              </div>

              <div className="bg-[#131D30] border border-white/5 p-3.5 rounded-xl">
                <div className="text-orange-400 font-bold text-base">+20%</div>
                <div className="text-white font-semibold mt-0.5">Dynamic Slew Shock</div>
                <div className="text-[11px] text-slate-400 font-sans mt-1">
                  Centrifugal torque resistance on uneven -140m bench grades.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Fleet Machine Wear Delta Gap & Work Zone Index */}
        <div className="xl:col-span-4 space-y-6">
          {/* Machine Wear Delta Gap */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">RISK DISTRIBUTION</div>
              <h3 className="text-base font-black text-white mt-1">Fleet Machine Wear Delta Gap</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Variance between logged operating hours and true mechanical structural fatigue.
              </p>
            </div>

            <div className="space-y-3">
              {/* EX-04 */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">EX-04</strong>
                    <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 text-[10px] font-bold">CRITICAL</span>
                  </div>
                  <span className="text-red-400 font-black text-sm">+1,640 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 3,240h • <strong className="text-red-300">CMSI Equiv: 4,880h (3.4x Accel)</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              {/* EX-12 */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">EX-12</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px] font-bold">ELEVATED</span>
                  </div>
                  <span className="text-amber-400 font-black text-sm">+840 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 6,840h • <strong className="text-amber-300">CMSI Equiv: 7,680h (1.8x Accel)</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              {/* EX-27 */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">EX-27</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px] font-bold">ELEVATED</span>
                  </div>
                  <span className="text-amber-400 font-black text-sm">+620 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 5,110h • <strong className="text-amber-300">CMSI Equiv: 5,730h (1.5x Accel)</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Zone Stress Index */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">GEOTECH EXPOSURE</div>
            <h4 className="text-sm font-bold text-white">Work Zone Pit Stress Ranking</h4>
            
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between p-2.5 bg-[#131D30] rounded-lg border border-white/5">
                <div>
                  <div className="text-white font-bold">Sector 4 (North Bench)</div>
                  <div className="text-[10px] text-slate-400">Hard Basalt (184 MPa)</div>
                </div>
                <span className="text-red-400 font-black text-sm">Index 92</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#131D30] rounded-lg border border-white/5">
                <div>
                  <div className="text-white font-bold">Sector 1 (East Face)</div>
                  <div className="text-[10px] text-slate-400">Banded Iron Formation (145 MPa)</div>
                </div>
                <span className="text-amber-400 font-black text-sm">Index 74</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#131D30] rounded-lg border border-white/5">
                <div>
                  <div className="text-white font-bold">Sector 2 (West Bench)</div>
                  <div className="text-[10px] text-slate-400">Soft Shale & Sandstone (74 MPa)</div>
                </div>
                <span className="text-emerald-400 font-black text-sm">Index 42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
