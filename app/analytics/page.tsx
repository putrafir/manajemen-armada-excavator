"use client";

import React from "react";
import { 
  Download, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Radio, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans">
      {/* 1. Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-orange-600 uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            ALGORITHMIC KINEMATICS DIAGNOSTICS
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fleet Stress & Predictive Telemetry Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Real-time CMSI fatigue modeling vs OEM baseline wear metrics across digging nodes.
          </p>
        </div>

        {/* Dropdowns & Export */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700">
            📅 Last 14 Days (Active Roster)
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700">
            🚜 Ultra 400t+ Shovels
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-bold rounded-lg shadow-sm transition cursor-pointer">
            <Download className="w-4 h-4" />
            Export Telemetry PDF/CSV
          </button>
        </div>
      </div>

      {/* 2. Four Reliability KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>Reliability Epoch</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="my-2">
            <div className="text-xs text-slate-500 font-mono">Mean Time Between Anomalies</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2 mt-1">
              142.6 <span className="text-xs text-emerald-600 font-bold font-mono">+18.4%</span>
              <span className="text-xs text-slate-400 font-normal font-mono">hrs</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            Target threshold: &gt;120 hrs across active basalt benches
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>Fatigue Index</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-xs text-slate-500 font-mono">Aggregate Fleet CMSI</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2 mt-1">
              64.2 <span className="text-xs text-slate-400 font-bold font-mono">/ 100</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">Benchmark: 55.0</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            Elevated baseline attributed to high-quartz vein in Pit 4
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>Intervention ROI</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-xs text-slate-500 font-mono">Unscheduled Downtime Prevented</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2 mt-1">
              96.5 <span className="text-xs text-slate-400 font-normal font-mono">hrs</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">~.42M Saved</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            12 early hydraulic shear warnings acknowledged
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>Data Pipeline</span>
            <Radio className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="text-xs text-slate-500 font-mono">Telemetry Throughput</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2 mt-1">
              1.84 <span className="text-xs text-slate-500 font-mono font-bold">Billion</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">Pts / Shift</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            99.98% packet synchronization over Private LTE mesh
          </div>
        </div>
      </div>

      {/* 3. Predictive Wear vs Linear OEM Schedule & Delta Gap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Wear Curve Chart & Vectors */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Predictive Intelligence Model • V3.4 Neural Kinematics
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                  Predictive Wear vs. Linear OEM Service Schedules
                </h2>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-slate-400 rounded"></span>
                  <span className="text-slate-600">Linear OEM (5,000h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-orange-600 rounded"></span>
                  <span className="text-slate-900 font-bold">TerraCortex CMSI Reality</span>
                </div>
              </div>
            </div>

            {/* SVG Divergence Chart */}
            <div className="relative h-64 w-full my-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100">
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(230, 81, 0, 0.25)" />
                    <stop offset="100%" stopColor="rgba(230, 81, 0, 0.0)" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="50" y1="170" x2="680" y2="170" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="50" y1="120" x2="680" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="50" y1="70" x2="680" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="50" y1="20" x2="680" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,4" />

                {/* Linear OEM Line (Dotted Gray) */}
                <line x1="50" y1="170" x2="680" y2="50" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,6" />

                {/* TerraCortex CMSI Reality Curve (Accelerated Non-linear Curve) */}
                <path
                  d="M50,170 Q250,155 420,105 T680,25"
                  fill="none"
                  stroke="#D84315"
                  strokeWidth="3.5"
                />
                <path
                  d="M50,170 Q250,155 420,105 T680,25 L680,170 L50,170 Z"
                  fill="url(#wearGrad)"
                />

                {/* Critical Divergence Annotation */}
                <circle cx="420" cy="105" r="5" fill="#D84315" />
                <text x="430" y="100" fill="#D84315" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  CRITICAL CMSI DIVERGENCE
                </text>

                {/* Overhaul Point */}
                <circle cx="680" cy="50" r="4" fill="#64748B" />
                <text x="540" y="185" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  5,000h (OEM Overhaul Point)
                </text>
              </svg>

              {/* X Axis labels */}
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-6">
                <span>0 Engine Hours</span>
                <span>1,250h</span>
                <span>2,500h (Midlife Check)</span>
                <span>3,750h</span>
                <span>5,000h (OEM Overhaul)</span>
              </div>
            </div>
          </div>

          {/* Stress Breakdown Vectors */}
          <div className="border-t border-slate-100 pt-5">
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase mb-3 flex items-center justify-between">
              <span>CMSI Accelerated Stress Breakdown Vectors</span>
              <span className="text-slate-400 font-normal">Neural decomposition of bucket strain telemetry</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Basalt Hardness</span>
                  <span className="text-orange-700 font-bold">+39%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  High cyclic compressive shock above 185 MPa
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Over-tonnage Shocks</span>
                  <span className="text-amber-700 font-bold">+24%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Bucket payload exceeding 108% limit ratings
                </div>
              </div>
              <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Thermal Cavitation</span>
                  <span className="text-red-700 font-bold">+37%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Hydraulic valve fluid temp delta exceeding 45°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fleet Machine Wear Delta Gap */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
              Risk Distribution
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
              Fleet Machine Wear Delta Gap
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Variance between logged operating hours and true mechanical structural fatigue.
            </p>

            {/* Machine Wear Delta Bars */}
            <div className="space-y-4 my-6 font-mono text-xs">
              {/* EX-04 */}
              <div className="p-3 rounded-lg bg-red-50/50 border border-red-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">EX-04 <span className="text-red-700 text-[10px] font-extrabold ml-1 uppercase bg-red-100 px-1.5 py-0.5 rounded">Critical</span></span>
                  <span className="font-bold text-red-700">+1,640 hrs Wear</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: "92%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Actual: 3,240h</span>
                  <span className="font-bold text-red-700">CMSI Equiv: 4,880h (3.4x Accel)</span>
                </div>
              </div>

              {/* EX-12 */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">EX-12 <span className="text-amber-700 text-[10px] font-extrabold ml-1 uppercase bg-amber-100 px-1.5 py-0.5 rounded">Elevated</span></span>
                  <span className="font-bold text-amber-700">+920 hrs Wear</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: "76%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Actual: 2,110h</span>
                  <span className="font-bold text-amber-700">CMSI Equiv: 3,030h</span>
                </div>
              </div>

              {/* EX-27 */}
              <div className="p-3 rounded-lg bg-amber-50/30 border border-amber-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">EX-27 <span className="text-amber-800 text-[10px] font-extrabold ml-1 uppercase bg-amber-100 px-1.5 py-0.5 rounded">Elevated</span></span>
                  <span className="font-bold text-amber-800">+640 hrs Wear</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-800 h-full rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Actual: 4,020h</span>
                  <span className="font-bold text-amber-800">CMSI Equiv: 4,660h</span>
                </div>
              </div>

              {/* EX-15 */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">EX-15 <span className="text-emerald-700 text-[10px] font-extrabold ml-1 uppercase bg-emerald-100 px-1.5 py-0.5 rounded">Optimal</span></span>
                  <span className="font-bold text-emerald-700">-120 hrs (Favorable)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "38%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Actual: 1,890h</span>
                  <span className="font-bold text-emerald-700">CMSI Equiv: 1,770h (Soft Mudstone)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Action Flag Banner */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Recommended Intervention Flag</div>
              <div className="text-slate-600 mt-0.5 leading-relaxed font-mono text-[11px]">
                EX-04 dispatched for structural ultrasonic weld check <strong>840 hours ahead</strong> of manufacturer baseline.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Work Zone Stress Analysis Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
              Cross-Domain Telemetry • Seismic & Kinematic Correlation
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
              Work Zone Stress Analysis
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Direct correlation between unconfined compressive strength (UCS in MPa), line spike pressure, and bucket GET tooth shroud erosion.
            </p>
          </div>

          {/* Pit Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-mono">
            <button className="px-3 py-1 bg-white font-bold text-slate-900 rounded shadow-xs">All Sectors</button>
            <button className="px-3 py-1 text-slate-600 hover:text-slate-900">Sector 4 North</button>
            <button className="px-3 py-1 text-slate-600 hover:text-slate-900">Sector 2 Sill</button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 font-mono text-xs">
          {/* Zone 1 */}
          <div className="p-4 rounded-xl border-l-4 border-red-600 bg-slate-50/70 border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">ZONE ALPHA (BENCH 240)</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Sector 4 - North Pit</div>
            <div className="space-y-1.5 my-3 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Avg. Load:</span><strong className="text-red-600">High</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Line Peak Pressure:</span><strong className="text-red-600">38.4 MPa (Spike)</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Tooth Wear Rate:</span><strong>4.2 mm / 100t</strong></div>
            </div>
            <div className="border-t border-slate-200/80 pt-2 flex justify-between text-[11px]">
              <span className="text-slate-400">Assigned Units:</span>
              <span className="font-bold text-red-700">EX-04, EX-09 (High Wear)</span>
            </div>
          </div>

          {/* Zone 2 */}
          <div className="p-4 rounded-xl border-l-4 border-amber-600 bg-slate-50/70 border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">ZONE BETA (BENCH 190)</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Bench 09A - Upper Sill</div>
            <div className="space-y-1.5 my-3 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Avg. Load:</span><strong className="text-amber-700">Medium</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Line Peak Pressure:</span><strong>31.2 MPa</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Tooth Wear Rate:</span><strong>2.8 mm / 100t</strong></div>
            </div>
            <div className="border-t border-slate-200/80 pt-2 flex justify-between text-[11px]">
              <span className="text-slate-400">Assigned Units:</span>
              <span className="font-bold text-amber-700">EX-12, EX-27 (Moderate)</span>
            </div>
          </div>

          {/* Zone 3 */}
          <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-slate-50/70 border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">ZONE GAMMA (BENCH 140)</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Sector 2 - West Wall</div>
            <div className="space-y-1.5 my-3 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Avg. Load:</span><strong className="text-slate-700">Low</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Line Peak Pressure:</span><strong>24.5 MPa</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Tooth Wear Rate:</span><strong>1.4 mm / 100t</strong></div>
            </div>
            <div className="border-t border-slate-200/80 pt-2 flex justify-between text-[11px]">
              <span className="text-slate-400">Assigned Units:</span>
              <span className="font-bold text-slate-700">EX-18, EX-22 (Normal)</span>
            </div>
          </div>

          {/* Zone 4 */}
          <div className="p-4 rounded-xl border-l-4 border-emerald-600 bg-slate-50/70 border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">ZONE DELTA (VALLEY EAST)</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Bench 12 - Overburden</div>
            <div className="space-y-1.5 my-3 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Avg. Load:</span><strong className="text-emerald-700">Low</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Line Peak Pressure:</span><strong>17.1 MPa</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Tooth Wear Rate:</span><strong>0.3 mm / 100t</strong></div>
            </div>
            <div className="border-t border-slate-200/80 pt-2 flex justify-between text-[11px]">
              <span className="text-slate-400">Assigned Units:</span>
              <span className="font-bold text-emerald-700">EX-15 (Minimal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
