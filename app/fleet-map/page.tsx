"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  MapPin, 
  Layers, 
  Maximize2, 
  Compass, 
  Activity, 
  AlertTriangle, 
  HardHat, 
  Wrench,
  Radio,
  RotateCcw,
  Zap,
  ArrowRight
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function FleetMapPage() {
  const [selectedUnit, setSelectedUnit] = useState("EX-04");
  const { telemetry, isStreaming } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];

  const units = [
    { id: "EX-04", x: 440, y: 390, status: "critical", cmsi: 94.0, model: "CAT 6040 FS" },
    { id: "EX-12", x: 500, y: 340, status: "warning", cmsi: 83.1, model: "Komatsu PC8000" },
    { id: "EX-08", x: 530, y: 280, status: "nominal", cmsi: 58.2, model: "CAT 6060" },
    { id: "EX-31", x: 370, y: 330, status: "nominal", cmsi: 38.6, model: "PC4000" },
    { id: "EX-19", x: 620, y: 440, status: "nominal", cmsi: 44.0, model: "Liebherr 9800" },
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Geotechnical Pit Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">
            SECTOR 04 // GEOTECHNICAL TELEMETRY
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Fleet Positioning & Pit Stress Heatmap
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            GPS GNSS RTK 23°14'18.4"S 119°54'02.1"E • Pit Floor Datum: -140.40 m RL (12B Bench)
          </p>
        </div>

        {/* Quick Stratum & Atmosphere Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-[#131D30] border border-white/5 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="text-slate-500 text-[10px] block uppercase">PIT DATUM LEVEL</span>
            <span className="font-bold text-white">-140.40 m RL</span>
          </div>

          <div className="bg-[#131D30] border border-white/5 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="text-slate-500 text-[10px] block uppercase">ROCK FORMATION</span>
            <span className="font-bold text-orange-400">Hard Basalt (184 MPa)</span>
          </div>

          <Link
            href="/diagnostics"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-950/40 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Neural Diagnostics
          </Link>
        </div>
      </div>

      {/* 2. Map Filter Layers Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mr-1">LAYERS:</span>
          <button className="px-3 py-1 rounded-lg bg-orange-950/60 border border-orange-500/40 text-orange-300 font-bold">
            ● Edge Nodes Synced
          </button>
          <button className="px-3 py-1 rounded-lg bg-[#0F1626] border border-white/5 text-slate-400 hover:text-slate-200">
            Thermal Stress Map
          </button>
          <button className="px-3 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
            Cavitation Alerts (1)
          </button>
          <button className="px-3 py-1 rounded-lg bg-[#0F1626] border border-white/5 text-slate-400 hover:text-slate-200">
            Elevation Contours
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500"></span>
            <span>Critical CMSI (&gt;90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>High CMSI (70–89)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Optimal (&lt;50)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Dark Interactive SVG Pit Map vs Selected Machine Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 Cols): Dark Topographical Pit Map SVG */}
        <div className="xl:col-span-8 bg-[#060A10] border border-white/5 rounded-2xl relative overflow-hidden shadow-2xl min-h-[560px]">
          {/* Top In-Map Stratum Bar */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-xs font-mono">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>ACTIVE ROCK FACE: <strong className="text-orange-400">Hardness 184 MPa</strong></span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-slate-300">
              AVG HAUL CYCLE: <strong>24.2 min</strong>
            </div>
            <div className="bg-emerald-950/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 font-bold">
              MESH 100% SYNC
            </div>
          </div>

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 800 560" className="w-full h-full select-none">
            <defs>
              <radialGradient id="pitGlow" cx="55%" cy="65%" r="60%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0B111C" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#060A10" stopOpacity="1.0" />
              </radialGradient>

              {/* Stress Heatmap Gradient for EX-04 */}
              <radialGradient id="stressZoneEx04" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#EF4444" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Base Fill */}
            <rect width="800" height="560" fill="url(#pitGlow)" />

            {/* Grid Lines */}
            <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 70} x2="800" y2={i * 70} />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 70} y1="0" x2={i * 70} y2="560" />
              ))}
            </g>

            {/* Bench Contours (Topographical lines) */}
            <g fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
              <path d="M 40,160 Q 400,220 760,190" strokeDasharray="4 4" />
              <text x="60" y="150" fill="#475569" fontSize="10" fontFamily="monospace">--80M BENCH--</text>

              <path d="M 80,270 Q 430,340 730,300" strokeDasharray="4 4" />
              <text x="100" y="260" fill="#475569" fontSize="10" fontFamily="monospace">--120M BENCH--</text>

              <path d="M 140,390 Q 450,470 690,420" strokeDasharray="4 4" />
              <text x="160" y="380" fill="#475569" fontSize="10" fontFamily="monospace">--160M PIT FLOOR (HARD BASALT STRATUM)--</text>
            </g>

            {/* Red Shockwave Heatmap circle around EX-04 */}
            <circle cx="440" cy="390" r="70" fill="url(#stressZoneEx04)" />
            <circle cx="440" cy="390" r="90" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

            {/* Machine Markers */}
            {units.map((unit) => {
              const cx = unit.x;
              const cy = unit.y;
              const isSelected = selectedUnit === unit.id;
              const color = unit.status === "critical" ? "#EF4444" : unit.status === "warning" ? "#F59E0B" : "#10B981";

              return (
                <g 
                  key={unit.id} 
                  className="cursor-pointer transition"
                  onClick={() => setSelectedUnit(unit.id)}
                >
                  {/* Pulsing ring for critical */}
                  {unit.status === "critical" && (
                    <circle cx={cx} cy={cy} r="24" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" opacity="0.75" />
                  )}

                  {/* Marker Node */}
                  <circle cx={cx} cy={cy} r="16" fill={color} stroke="#0B111C" strokeWidth="3" />
                  
                  {/* Text inside node */}
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {unit.id.replace("EX-", "")}
                  </text>

                  {/* Tooltip Label */}
                  {isSelected && (
                    <g transform={`translate(${cx + 20}, ${cy - 20})`}>
                      <rect width="170" height="44" rx="8" fill="#0F1626" stroke="#EF4444" strokeWidth="1.5" />
                      <text x="12" y="18" fill="#F87171" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {unit.id} (SELECTED) • CRIT
                      </text>
                      <text x="12" y="33" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                        CMSI {unit.cmsi} • CAVITATION 142Hz
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Scale and Compass */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded border border-white/10">
              <span>SCALE</span>
              <div className="w-16 h-1 bg-slate-500 rounded"></div>
              <span>100m</span>
            </div>
            <div className="bg-black/60 px-2.5 py-1 rounded border border-white/10 text-slate-300">
              Pit Heading: 042° NNE
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Selected Machine Telemetry Inspector */}
        <div className="xl:col-span-4 space-y-4">
          {/* Header Card */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-mono">EX-04</h3>
                <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-bold font-mono uppercase">
                  Critical Anomaly
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Caterpillar 6040 FS • Sn: TC-8829-PX
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Stress Index</div>
              <div className="text-2xl font-black text-red-400 font-mono">94.0 <span className="text-xs text-slate-500 font-normal">CMSI</span></div>
            </div>
          </div>

          {/* Hydraulic Cavitation Warning Banner */}
          <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-r-xl border border-white/5 shadow-md">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-red-200">Hydraulic Cavitation Detected</div>
                <div className="text-xs text-red-300/80 mt-1 leading-relaxed">
                  High-frequency pump oscillation at <strong>142 Hz</strong>. Immediate pressure shock on breakout cylinder distributor.
                </div>
              </div>
            </div>
          </div>

          {/* Live Kinematics Readout (IMU 200Hz) */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-2">
              <span className="text-slate-400 uppercase tracking-wider">Excavator Kinematics Readout</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live IMU 200Hz
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#131D30] p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase">Boom Angle</div>
                <div className="text-base font-black text-white mt-1">
                  {ex04?.kinematics.boom_angle ?? 34.8}° <span className="text-xs text-slate-500 font-normal">±1.2°</span>
                </div>
              </div>

              <div className="bg-[#131D30] p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase">Arm Reach</div>
                <div className="text-base font-black text-white mt-1">
                  {ex04?.kinematics.arm_reach ?? 9.2}m <span className="text-xs text-slate-500 font-normal">Max 11.5m</span>
                </div>
              </div>

              <div className="bg-[#131D30] p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase">Hydraulic Relief</div>
                <div className="text-base font-black text-red-400 mt-1">
                  {ex04?.hydraulic_pressure_mpa ?? 34.8} MPa
                </div>
              </div>

              <div className="bg-[#131D30] p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase">Manifold Temp</div>
                <div className="text-base font-black text-amber-400 mt-1">
                  {ex04?.manifold_temp_c ?? 96.4}°C
                </div>
              </div>
            </div>

            {/* Direct Diagnostic Link */}
            <div className="pt-2">
              <Link
                href="/diagnostics"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-950/40 flex items-center justify-center gap-2"
              >
                Open Full Neural Diagnostics
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
