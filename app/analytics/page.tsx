"use client";

import React from "react";
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Layers,
  Database,
  ArrowUpRight,
  Radio
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function AnalyticsPage() {
  const { telemetry } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];
  const cmsi = ex04?.cmsi ?? 94.0;
  const isCritical = cmsi >= 80 || ex04?.status === "CRITICAL";
  const isWarning = cmsi >= 65;

  const ex04DeltaHrs = isCritical ? "+1,640 hrs" : isWarning ? "+420 hrs" : "+0 hrs";
  const ex04EquivHrs = isCritical ? "4,880h (3.4x Accel)" : isWarning ? "3,660h (1.5x Accel)" : "3,240h (1.0x Nominal)";
  const ex04Badge = isCritical ? "CRITICAL" : isWarning ? "ELEVATED" : "OPTIMAL";
  const ex04Color = isCritical ? "text-red-600" : isWarning ? "text-amber-700" : "text-emerald-700";
  const ex04Bg = isCritical ? "bg-red-50 border-red-200" : isWarning ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200";
  const ex04BadgeBg = isCritical ? "bg-red-100 text-red-700" : isWarning ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800";
  const ex04BarColor = isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
  const fatigueIndex = isCritical ? "64.2" : isWarning ? "53.8" : "41.5";

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-sans text-orange-600 font-bold uppercase tracking-widest">
            FLEET ANALYTICS & WEAR PREDICTION
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Predictive Mechanical Wear & Degradation Curve
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Real-time multi-physics fatigue modeling vs linear OEM maintenance schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans font-bold flex items-center gap-1.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Live Stress Telemetry: CMSI {cmsi}
          </span>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards with prominent icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reliability Epoch</span>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <ShieldCheck className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            142.6 <span className="text-sm text-slate-400 font-normal">hrs</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            +18.4% Mean Time Between Failures
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Fatigue Index</span>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs border ${
              isCritical ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-sky-50 border-sky-100 text-sky-600"
            }`}>
              <Activity className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {fatigueIndex} <span className="text-sm text-slate-400 font-normal">/ 100</span>
          </div>
          <div className={`text-xs font-medium mt-2 ${isCritical ? "text-rose-700" : "text-slate-500"}`}>
            {isCritical ? "+9.2 elevation above baseline" : "Nominal fleet mechanical fatigue"}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intervention ROI</span>
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
              <TrendingUp className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            96.5 <span className="text-sm text-slate-400 font-normal">hrs</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">Downtime averted via prescriptive WO</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Pipeline</span>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Database className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            1.84 <span className="text-sm text-slate-400 font-normal">B pts/shift</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-2">99.98% Edge telemetry sync rate</div>
        </div>
      </div>

      {/* 3. Main Split View: Wear Curves vs Asset Ranking */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 Cols): Degradation Curve Chart */}
        <div className="xl:col-span-8 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Predictive Wear vs Linear OEM Schedules
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  OEM Linear (Grey) vs TerraCortex CMSI Reality (Orange/Red)
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-400"></span>
                  <span className="text-slate-500">Linear OEM (5,000h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-orange-600 rounded"></span>
                  <span className="text-orange-600 font-bold">TerraCortex Multi-Physics</span>
                </div>
              </div>
            </div>

            {/* SVG Wear Degradation Chart */}
            <div className="mt-4 pt-4 border-t border-slate-200/70">
              <svg viewBox="0 0 700 240" className="w-full h-64 font-sans text-xs select-none">
                {/* Horizontal Gridlines */}
                <line x1="40" y1="30" x2="660" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="80" x2="660" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="130" x2="660" y2="130" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="180" x2="660" y2="180" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="220" x2="660" y2="220" stroke="#E2E8F0" strokeWidth="1.5" />

                {/* Y-Axis Labels */}
                <text x="30" y="35" textAnchor="end" fill="#94A3B8" fontSize="10">100%</text>
                <text x="30" y="85" textAnchor="end" fill="#94A3B8" fontSize="10">75%</text>
                <text x="30" y="135" textAnchor="end" fill="#94A3B8" fontSize="10">50%</text>
                <text x="30" y="185" textAnchor="end" fill="#94A3B8" fontSize="10">25%</text>
                <text x="30" y="225" textAnchor="end" fill="#94A3B8" fontSize="10">0%</text>

                {/* Linear OEM Degradation (Grey Dashed) */}
                <line x1="50" y1="220" x2="650" y2="70" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />

                {/* TerraCortex CMSI Reality Curve (Dynamic Orange/Red Curve) */}
                <path
                  d={isCritical 
                    ? "M 50,220 Q 200,210 320,185 T 450,110 T 550,40" 
                    : isWarning 
                    ? "M 50,220 Q 200,210 320,195 T 450,140 T 550,75" 
                    : "M 50,220 Q 200,215 320,200 T 450,165 T 550,120"}
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="3"
                />

                {/* Divergence Gap Annotation */}
                <line 
                  x1="450" 
                  y1={isCritical ? "150" : isWarning ? "160" : "165"} 
                  x2="450" 
                  y2={isCritical ? "110" : isWarning ? "140" : "165"} 
                  stroke={isCritical ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981"} 
                  strokeWidth="1.5" 
                  strokeDasharray="2 2" 
                />
                <circle cx="450" cy={isCritical ? "110" : isWarning ? "140" : "165"} r="4" fill="#EA580C" />
                <text 
                  x="460" 
                  y={isCritical ? "110" : isWarning ? "135" : "160"} 
                  fill={isCritical ? "#DC2626" : isWarning ? "#D97706" : "#059669"} 
                  fontWeight="bold"
                >
                  EX-04 Wear Gap ({ex04DeltaHrs})
                </text>
              </svg>

              <div className="flex justify-between text-[11px] text-slate-500 font-sans mt-2 px-12">
                <span>0 Operating Hours</span>
                <span>1,250h</span>
                <span>2,500h</span>
                <span>3,750h</span>
                <span>5,000h (OEM Interval)</span>
              </div>
            </div>

            {/* Accelerated Stress Breakdown Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-sans text-xs">
              <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">{isCritical ? "+38%" : "+12%"}</div>
                <div className="text-slate-900 font-semibold mt-0.5">Hydraulic Shockwave</div>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Transient relief spikes in basalt strata.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">{isCritical ? "+42%" : "+18%"}</div>
                <div className="text-slate-900 font-semibold mt-0.5">Quartz Micro-Abrasives</div>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Quartz micro-abrasives on wiper seals.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl">
                <div className="text-orange-600 font-bold text-base">{isCritical ? "+20%" : "+8%"}</div>
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
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">RISK DISTRIBUTION</div>
              <h3 className="text-base font-bold text-slate-900 mt-1">Fleet Machine Wear Delta Gap</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Logged operating hours vs true mechanical fatigue.
              </p>
            </div>

            <div className="space-y-3">
              {/* EX-04 (DYNAMIC BINDING TO LIVE TELEMETRY) */}
              <div className={`p-3.5 rounded-xl border ${ex04Bg}`}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">EX-04</strong>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ex04BadgeBg}`}>{ex04Badge}</span>

                  </div>
                  <span className={`font-bold text-sm ${ex04Color}`}>{ex04DeltaHrs} Wear</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Actual: 3,240h • <strong className={ex04Color}>CMSI Equiv: {ex04EquivHrs}</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${ex04BarColor}`} 
                    style={{ width: `${Math.min(100, cmsi)}%` }}
                  ></div>
                </div>
              </div>

              {/* EX-12 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">EX-12</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">ELEVATED</span>
                  </div>
                  <span className="text-amber-700 font-bold text-sm">+840 hrs Wear</span>
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
                  <span className="text-amber-700 font-bold text-sm">+620 hrs Wear</span>
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

          {/* Subsystem Component Wear Lifecycle */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans text-xs">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">SUBSYSTEM LIFECYCLE</div>
            <h4 className="text-sm font-bold text-slate-900">Component Degradation Velocity</h4>

            <div className="space-y-2.5 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-900 font-bold">Main Hydraulic Spool Seal</span>
                  <span className="text-red-600 font-bold text-[11px]">3.4x Accel (EX-04)</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Fatigue: Critical (Cavitation)</span>
                  <span>RUL: &lt;48h</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-900 font-bold">Slew Ring Raceway Bearing</span>
                  <span className="text-amber-700 font-bold text-[11px]">1.8x Accel (EX-12)</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "72%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Fatigue: Harmonic Spike</span>
                  <span>RUL: 180h</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-900 font-bold">Boom Cylinder Wiper Ring</span>
                  <span className="text-emerald-700 font-bold text-[11px]">1.0x Nominal</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "32%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Fatigue: Healthy Envelope</span>
                  <span>RUL: 2,400h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
