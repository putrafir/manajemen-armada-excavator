"use client";

import React, { useState } from "react";
import { useTelemetry } from "@/context/TelemetryContext";
import { 
  Compass, 
  MapPin, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Radio, 
  RotateCw, 
  ShieldAlert, 
  Wrench, 
  ChevronRight, 
  UserCheck,
  Maximize2
} from "lucide-react";

export default function FleetMapPage() {
  const [selectedUnit, setSelectedUnit] = useState("EX-04");
  const { telemetry } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];

  const unitsOnMap = [
    { id: "EX-04", x: 42, y: 55, status: "critical", cmsi: 94, name: "CAT 6040 FS", zone: "Dig Face 12B" },
    { id: "EX-12", x: 55, y: 46, status: "high", cmsi: 83, name: "Komatsu PC4000", zone: "-120M Bench" },
    { id: "EX-27", x: 48, y: 68, status: "high", cmsi: 79, name: "Hitachi EX5600", zone: "-140M Bench" },
    { id: "EX-08", x: 62, y: 38, status: "moderate", cmsi: 61, name: "Cat 6040 FS", zone: "-80M Bench" },
    { id: "EX-15", x: 58, y: 72, status: "optimal", cmsi: 42, name: "Cat 6060 FS", zone: "Extraction Dock" },
    { id: "EX-31", x: 35, y: 44, status: "optimal", cmsi: 38, name: "Liebherr R9800", zone: "West Wall" },
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto">
      {/* 1. Header Geotechnical Positioning */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 mb-1">
            SECTOR 04
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Geotechnical Fleet Positioning & Pit Stress Heatmap
          </h1>
        </div>

        {/* Top telemetry specs */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Pit Datum Level</div>
            <div className="text-slate-900 font-bold text-sm">
              -140.40 <span className="text-xs text-slate-500 font-normal">m RL (12B Bench)</span>
            </div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold">GPS GNSS RTK</div>
            <div className="text-slate-800 font-semibold">23°14'18.4"S 119°54'02.1"E</div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Atmospheric Vis</div>
            <div className="text-slate-800 font-semibold">Clear // 38°C Pit Floor</div>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer ml-auto xl:ml-2">
            <Maximize2 className="w-3.5 h-3.5" />
            Recenter Fleet
          </button>
        </div>
      </div>

      {/* 2. Layer Filter Chips & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 uppercase font-bold text-[11px] mr-1">Layers:</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8C3A00] text-white font-semibold">
            <Radio className="w-3 h-3 text-orange-400 animate-pulse" />
            Edge Nodes Synced
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 border border-blue-200/80 transition">
            Thermal Stress
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 border border-blue-200/80 transition">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            Cavitation Alerts (1)
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 border border-blue-200/80 transition">
            Elevation Contours
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 border border-blue-200/80 transition">
            Bench Incline Grade
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-slate-700 font-semibold">Critical CMSI (&gt;90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-semibold">High CMSI (70-89)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="text-slate-700 font-semibold">Optimal (&lt;50)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Pit Map (Left) & Inspector (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Interactive Pit Contour Map Canvas */}
        <div className="xl:col-span-8 bg-[#111827] rounded-xl border border-slate-800 relative h-[720px] overflow-hidden flex flex-col justify-between shadow-lg">
          {/* Map Top Left Telemetry Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-xs font-mono">
            <div className="bg-[#1E293B]/90 backdrop-blur-sm border border-slate-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>ACTIVE ROCK FACE: <strong className="text-orange-400">Hardness: 184 MPa</strong></span>
            </div>
            <div className="bg-[#1E293B]/90 backdrop-blur-sm border border-slate-700 text-slate-300 px-3 py-1.5 rounded-md font-mono">
              AVG HAUL CYCLE: <strong className="text-white">24.2 min</strong>
            </div>
            <div className="bg-[#1E293B]/90 backdrop-blur-sm border border-slate-700 text-slate-300 px-3 py-1.5 rounded-md font-mono">
              DROP RATE: <strong className="text-white">0.002%</strong>
            </div>
            <div className="bg-[#1E293B]/90 backdrop-blur-sm border border-slate-700 text-emerald-400 px-3 py-1.5 rounded-md font-mono font-bold">
              MESH 100%
            </div>
          </div>

          {/* SVG Pit Topography & Contours */}
          <svg className="w-full h-full absolute inset-0 cursor-crosshair" viewBox="0 0 800 700">
            <defs>
              <radialGradient id="stressGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(220, 38, 38, 0.4)" />
                <stop offset="60%" stopColor="rgba(220, 38, 38, 0.15)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
              </radialGradient>
            </defs>

            {/* Geological Pit Bench Contour Lines */}
            <path d="M-50,120 Q300,80 850,150" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" fill="none" />
            <text x="30" y="115" fill="#64748B" fontSize="10" fontFamily="monospace">-80M BENCH</text>

            <path d="M-50,280 Q250,220 850,300" stroke="#334155" strokeWidth="1.5" fill="none" />
            <text x="80" y="275" fill="#64748B" fontSize="10" fontFamily="monospace">-120M BENCH</text>

            <path d="M-50,460 Q320,380 850,490" stroke="#475569" strokeWidth="2" fill="none" />
            <text x="110" y="455" fill="#E65100" fontSize="11" fontWeight="bold" fontFamily="monospace">
              -140M ACTIVE DIG FACE [ZONE 4B]
            </text>

            <path d="M-50,620 Q400,560 850,630" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" fill="none" />
            <text x="160" y="615" fill="#64748B" fontSize="10" fontFamily="monospace">-160M EXTRACTION DOCK</text>

            {/* Stress Heatmap Radiance on EX-04 */}
            <circle cx="340" cy="390" r="110" fill="url(#stressGlow)" />
            <circle cx="340" cy="390" r="65" fill="rgba(220, 38, 38, 0.2)" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" />

            {/* Excavator Markers */}
            {unitsOnMap.map((unit) => {
              const cx = (unit.x / 100) * 800;
              const cy = (unit.y / 100) * 700;
              const isSelected = unit.id === selectedUnit;
              const color = unit.status === "critical" ? "#DC2626" : unit.status === "high" ? "#D97706" : "#64748B";

              return (
                <g 
                  key={unit.id} 
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedUnit(unit.id)}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="24" fill="none" stroke="#EF4444" strokeWidth="2" className="animate-ping opacity-60" />
                  )}

                  {/* Marker Node */}
                  <circle cx={cx} cy={cy} r="16" fill={color} stroke="#FFFFFF" strokeWidth="2.5" />
                  
                  {/* Icon Representation */}
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {unit.id.replace("EX-", "")}
                  </text>

                  {/* Label Tooltip */}
                  {isSelected && (
                    <g transform={`translate(${cx + 20}, ${cy - 20})`}>
                      <rect width="170" height="42" rx="6" fill="#1E293B" stroke="#475569" />
                      <text x="10" y="16" fill="#F87171" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {unit.id} (SELECTED) •
                      </text>
                      <text x="10" y="32" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
                        CMSI {unit.cmsi} • CAVITATION 142Hz
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Bottom Scale and Compass */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 bg-[#1E293B]/80 px-2 py-1 rounded border border-slate-700">
              <span>SCALE</span>
              <div className="w-16 h-1 bg-slate-500 rounded"></div>
              <span>100m</span>
            </div>
            <div className="bg-[#1E293B]/80 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
              Pit Heading: 042° NNE
            </div>
          </div>
        </div>

        {/* Right: Selected Unit Inspector Panel (EX-04) */}
        <div className="xl:col-span-4 space-y-4">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight">EX-04</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold font-mono uppercase">
                  Critical
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Caterpillar 6040 FS • Sn: TC-8829-PX
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Stress Index</div>
              <div className="text-2xl font-black text-red-600 font-mono">94 <span className="text-xs text-slate-400 font-normal">CMSI</span></div>
            </div>
          </div>

          {/* Hydraulic Cavitation Warning Banner */}
          <div className="bg-red-50/80 border-l-4 border-red-600 p-4 rounded-r-xl shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-red-900">Hydraulic Cavitation Detected</div>
                <div className="text-xs text-red-800 mt-1 leading-relaxed">
                  High-frequency pump oscillation at <strong>142 Hz</strong>. Immediate pressure shock on breakout cylinder.
                </div>
              </div>
            </div>
          </div>

          {/* Excavator Kinematics Readout (Live IMU 200Hz) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold">
              <span className="text-slate-500 uppercase tracking-wider">Excavator Kinematics Readout</span>
              <span className="text-emerald-600">Live IMU 200Hz</span>
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Boom Angle</div>
                <div className="text-base font-bold text-slate-900">{ex04?.kinematics.boom_angle ?? 34.8}° <span className="text-xs text-slate-400 font-normal">±1.2°</span></div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Arm Reach</div>
                <div className="text-base font-bold text-slate-900">9.2m <span className="text-xs text-slate-400 font-normal">Max 11.5m</span></div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Slew Velocity</div>
                <div className="text-base font-bold text-amber-700">4.8 <span className="text-xs font-normal">RPM (HIGH)</span></div>
              </div>
              <div className="bg-red-50/70 p-3 rounded-lg border border-red-200">
                <div className="text-[10px] text-red-700 uppercase font-bold">Hydraulic Temp</div>
                <div className="text-base font-bold text-red-600">{ex04?.manifold_temp_c ?? 96.4}°C <span className="text-xs font-normal text-red-500">&gt;90° Max</span></div>
              </div>
            </div>
          </div>

          {/* Bucket Payload Real-Time */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold uppercase">Bucket Payload Real-Time</span>
              <span className="text-red-600 font-bold">+7.0% Over-Tonnage Shock</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl font-black text-slate-900">42.8</span>
              <span className="text-xs text-slate-500">Tons (Threshold: 40.0 T Max)</span>
            </div>
            {/* Payload Slider */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[65%]"></div>
              <div className="bg-amber-500 h-full w-[25%]"></div>
              <div className="bg-red-600 h-full w-[10%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 T</span>
              <span>26.0 T</span>
              <span>40.0 T (Rated)</span>
              <span className="text-red-600 font-bold">45.0 T</span>
            </div>
          </div>

          {/* Pump Frequency Harmonic Spectrum */}
          <div className="bg-[#111827] rounded-xl border border-slate-800 p-4 shadow-xs text-white font-mono">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 uppercase">Pump Frequency Harmonic</span>
              <span className="text-red-400 font-bold text-[11px]">142 Hz Harmonic Spike</span>
            </div>
            {/* Waveform Canvas Simulation */}
            <div className="h-20 w-full flex items-end gap-1 pt-2">
              <svg className="w-full h-full text-red-500" viewBox="0 0 200 60" fill="none">
                <path
                  d="M0 45 Q30 40 60 48 T100 52 L120 48 L135 10 L145 55 L160 50 Q180 48 200 45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="135" cy="10" r="4" fill="#EF4444" />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-1 mt-1">
              <span>20 Hz</span>
              <span>Sensor: MAIN_PUMP_TR1</span>
              <span>250 Hz</span>
            </div>
          </div>

          {/* Dispatch Pit Tech CTA */}
          <button className="w-full py-3 bg-[#131A26] hover:bg-[#1E2838] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer">
            <Wrench className="w-4 h-4 text-orange-500" />
            Dispatch Pit Tech
          </button>

          {/* Standby Units Sub-Sector 4 */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-2">
              <span>Sub-Sector 4 Standby Units</span>
              <span className="text-slate-400">6 Monitored</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <span className="font-bold text-slate-800">EX-12 <span className="text-slate-500 font-normal">Komatsu PC4000</span></span>
                <span className="text-amber-700 font-bold">83 CMSI &gt;</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <span className="font-bold text-slate-800">EX-27 <span className="text-slate-500 font-normal">Hitachi EX5600</span></span>
                <span className="text-amber-700 font-bold">79 CMSI &gt;</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <span className="font-bold text-slate-800">EX-08 <span className="text-slate-500 font-normal">Cat 6040 FS</span></span>
                <span className="text-slate-600 font-bold">61 CMSI &gt;</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <span className="font-bold text-slate-800">EX-15 <span className="text-slate-500 font-normal">Cat 6060 FS</span></span>
                <span className="text-emerald-600 font-bold">42 CMSI &gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
