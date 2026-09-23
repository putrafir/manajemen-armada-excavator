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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-widest">
            ALGORITHMIC KINEMATICS DIAGNOSTICS
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Fleet Stress & Predictive Telemetry Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Real-time CMSI fatigue modeling vs OEM baseline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
            Last 14 Days Active Roster
          </span>
          {/* <Link
            href="/diagnostics"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-950/40 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Neural Diagnostics
          </Link> */}
        </div>
      </div>

      {/* 2. KPI HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">RELIABILITY EPOCH</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">142.6</span>
            <span className="text-emerald-700 text-xs font-bold">+18.4% hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-sans">
            MTBA across active benches
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">FATIGUE INDEX</span>
            <Activity className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">64.2</span>
            <span className="text-slate-500 text-xs font-bold">/ 100</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-2 font-sans">
            Benchmark: 55.0 (+9.2 elevation)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">INTERVENTION ROI</span>
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">96.5</span>
            <span className="text-slate-500 text-xs font-semibold">hrs saved</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-sans">
            12 early fault mitigations
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">DATA PIPELINE</span>
            <Radio className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">1.84</span>
            <span className="text-sky-600 text-xs font-bold">Billion Pts/Shift</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-sans">
            99.98% edge sync rate
          </div>
        </div>
      </div>

      {/* 3. Main Analytics Grid: Predictive Wear vs OEM & Delta Gap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 Cols): Predictive Wear Chart & Stress Vectors */}
        <div className="xl:col-span-8 space-y-6">
          {/* High-Contrast Predictive Wear Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 font-mono">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Predictive Wear vs. Linear OEM Schedules
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  V3.4 Neural Kinematics Fatigue Modeling
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-500"></span>
                  <span className="text-slate-500">Linear OEM (5,000h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-orange-500 rounded"></span>
                  <span className="text-orange-600 font-bold">TerraCortex CMSI Reality</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
              <svg viewBox="0 0 700 240" className="w-full h-56 select-none font-mono text-[10px]">
                <defs>
                  <linearGradient id="wearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <line x1="50" y1="40" x2="680" y2="40" stroke="rgba(0,0,0,0.06)" />
                <line x1="50" y1="90" x2="680" y2="90" stroke="rgba(0,0,0,0.06)" />
                <line x1="50" y1="140" x2="680" y2="140" stroke="rgba(0,0,0,0.06)" />
                <line x1="50" y1="190" x2="680" y2="190" stroke="rgba(0,0,0,0.06)" />

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
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">+38%</div>
                <div className="text-slate-900 font-semibold mt-0.5">Hydraulic Shockwave</div>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Transient relief spikes in basalt strata.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">+42%</div>
                <div className="text-slate-900 font-semibold mt-0.5">Quartz Micro-Abrasives</div>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Quartz micro-abrasives on wiper seals.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">+20%</div>
                <div className="text-slate-900 font-semibold mt-0.5">Dynamic Slew Shock</div>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Centrifugal torque on -140m grade.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Fleet Machine Wear Delta Gap & Work Zone Index */}
        <div className="xl:col-span-4 space-y-6">
          {/* Machine Wear Delta Gap */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">RISK DISTRIBUTION</div>
              <h3 className="text-base font-black text-slate-900 mt-1">Fleet Machine Wear Delta Gap</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Logged operating hours vs true mechanical fatigue.
              </p>
            </div>

            <div className="space-y-3">
              {/* EX-04 */}
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">EX-04</strong>
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">CRITICAL</span>
                  </div>
                  <span className="text-red-600 font-black text-sm">+1,640 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Actual: 3,240h • <strong className="text-red-700">CMSI Equiv: 4,880h (3.4x Accel)</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              {/* EX-12 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">EX-12</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">ELEVATED</span>
                  </div>
                  <span className="text-amber-700 font-black text-sm">+840 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Actual: 6,840h • <strong className="text-amber-800">CMSI Equiv: 7,680h (1.8x Accel)</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              {/* EX-27 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">EX-27</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">ELEVATED</span>
                  </div>
                  <span className="text-amber-700 font-black text-sm">+620 hrs Wear</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Actual: 5,110h • <strong className="text-amber-800">CMSI Equiv: 5,730h (1.5x Accel)</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Zone Stress Index */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">GEOTECH EXPOSURE</div>
            <h4 className="text-sm font-bold text-slate-900">Work Zone Pit Stress Ranking</h4>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-slate-900 font-bold">Sector 4 (North Bench)</div>
                  <div className="text-[10px] text-slate-500">Hard Basalt (184 MPa)</div>
                </div>
                <span className="text-red-600 font-black text-sm">Index 92</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-slate-900 font-bold">Sector 1 (East Face)</div>
                  <div className="text-[10px] text-slate-500">Banded Iron Formation (145 MPa)</div>
                </div>
                <span className="text-amber-700 font-black text-sm">Index 74</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-slate-900 font-bold">Sector 2 (West Bench)</div>
                  <div className="text-[10px] text-slate-500">Soft Shale & Sandstone (74 MPa)</div>
                </div>
                <span className="text-emerald-700 font-black text-sm">Index 42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
