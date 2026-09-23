"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  MapPin, 
  Layers, 
  Activity, 
  AlertTriangle, 
  HardHat, 
  Wrench,
  Radio,
  ArrowRight,
  Flame,
  Eye,
  CheckCircle2
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function FleetMapPage() {
  const [selectedUnit, setSelectedUnit] = useState("EX-04");
  
  // Layer toggles
  const [layerEdge, setLayerEdge] = useState(true);
  const [layerThermal, setLayerThermal] = useState(false);
  const [layerCavitation, setLayerCavitation] = useState(true);
  const [layerContours, setLayerContours] = useState(true);

  const { telemetry, isStreaming } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];

  const ex04Cmsi = ex04?.cmsi ?? 94.0;
  const ex04Status = ex04Cmsi >= 90 ? "critical" : ex04Cmsi >= 70 ? "warning" : "nominal";

  const unitsData = [
    { 
      id: "EX-04", 
      x: 440, 
      y: 390, 
      status: ex04Status, 
      cmsi: ex04Cmsi, 
      model: "Caterpillar 6040 FS", 
      sn: "TC-8829-PX",
      badge: ex04Status === "critical" ? "Critical Anomaly" : ex04Status === "warning" ? "Elevated Load" : "Nominal State",
      title: ex04Status === "critical" ? "Hydraulic Cavitation Detected" : ex04Status === "warning" ? "Elevated Hydraulic Load" : "Normal Hydraulic State",
      detail: ex04?.anomaly_detail || "Telemetry synced via live MQTT loop.", 
      boom: ex04?.kinematics.boom_angle ?? 34.8,
      arm: ex04?.kinematics.arm_reach ?? 9.2,
      pressure: ex04?.hydraulic_pressure_mpa ?? 34.8,
      temp: ex04?.manifold_temp_c ?? 96.4,
      isLive: true
    },
    { 
      id: "EX-12", 
      x: 500, 
      y: 340, 
      status: "warning", 
      cmsi: 83.1, 
      model: "Komatsu PC8000-11", 
      sn: "KM-7104-AZ",
      badge: "High Slew Shock",
      title: "Slew Bearing Harmonic Spike",
      detail: "88 Hz radial vibration on swing gear. High centrifugal torque on bench.",
      boom: 41.2,
      arm: 8.5,
      pressure: 29.4,
      temp: 78.5,
      isLive: false
    },
    { 
      id: "EX-08", 
      x: 530, 
      y: 280, 
      status: "nominal", 
      cmsi: 58.2, 
      model: "Caterpillar 6060", 
      sn: "TC-5512-KL",
      badge: "Thermal Watch",
      title: "Hydraulic Thermal Drift",
      detail: "Minor temperature rise in secondary cooler. Within safe operating limits.",
      boom: 28.5,
      arm: 9.8,
      pressure: 24.1,
      temp: 74.2,
      isLive: false
    },
    { 
      id: "EX-31", 
      x: 370, 
      y: 330, 
      status: "nominal", 
      cmsi: 38.6, 
      model: "Komatsu PC4000-6", 
      sn: "KM-4902-TX",
      badge: "Nominal State",
      title: "Nominal Operations",
      detail: "Standard cycle time. No harmonic spikes or hydraulic anomalies detected.",
      boom: 32.1,
      arm: 7.8,
      pressure: 21.0,
      temp: 65.4,
      isLive: false
    },
    { 
      id: "EX-19", 
      x: 620, 
      y: 440, 
      status: "nominal", 
      cmsi: 44.0, 
      model: "Liebherr R 9800", 
      sn: "LB-9210-WD",
      badge: "Nominal State",
      title: "Standard Digging Envelope",
      detail: "Digging in soft sandstone bench. Low wear velocity, all sensors healthy.",
      boom: 36.4,
      arm: 8.9,
      pressure: 22.8,
      temp: 68.1,
      isLive: false
    },
  ];

  const currentUnit = unitsData.find(u => u.id === selectedUnit) || unitsData[0];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Geotechnical Pit Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-widest">
            SECTOR 04 // GEOTECHNICAL TELEMETRY
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Fleet Positioning & Pit Stress Heatmap
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            GPS GNSS RTK 23°14'18.4"S 119°54'02.1"E • Pit Floor Datum: -140.40 m RL (12B Bench)
          </p>
        </div>

        {/* Quick Stratum & Atmosphere Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-500 text-[10px] block uppercase">PIT DATUM LEVEL</span>
            <span className="font-bold text-slate-900">-140.40 m RL</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-500 text-[10px] block uppercase">ROCK FORMATION</span>
            <span className="font-bold text-orange-600">Hard Basalt (184 MPa)</span>
          </div>
        </div>
      </div>

      {/* 2. Map Filter Layers Bar (INTERACTIVE TOGGLES) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mr-1">LAYERS:</span>
          
          <button 
            onClick={() => setLayerEdge(!layerEdge)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer flex items-center gap-1.5 ${
              layerEdge 
                ? "bg-orange-50 border-orange-300 text-orange-700 shadow-xs" 
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${layerEdge ? "bg-orange-500 animate-pulse" : "bg-slate-300"}`}></span>
            Edge Nodes Synced
          </button>

          <button 
            onClick={() => setLayerThermal(!layerThermal)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer flex items-center gap-1.5 ${
              layerThermal 
                ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs" 
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Thermal Stress Map {layerThermal && "(Active)"}
          </button>

          <button 
            onClick={() => setLayerCavitation(!layerCavitation)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer flex items-center gap-1.5 ${
              layerCavitation 
                ? "bg-red-50 border-red-300 text-red-700 shadow-xs" 
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            Cavitation Alerts (1)
          </button>

          <button 
            onClick={() => setLayerContours(!layerContours)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer flex items-center gap-1.5 ${
              layerContours 
                ? "bg-slate-100 border-slate-300 text-slate-800 shadow-xs" 
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            Elevation Contours
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
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

      {/* 3. Main Split View: Light Interactive SVG Pit Map vs Selected Machine Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (8 Cols): Topographical Pit Map SVG */}
        <div className="xl:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden shadow-2xl min-h-[560px]">
          {/* Top In-Map Stratum Bar */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-xs font-mono">
            <div className="bg-white/90 text-slate-800 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>ACTIVE ROCK FACE: <strong className="text-orange-600">Hardness 184 MPa</strong></span>
            </div>
            <div className="bg-white/90 text-slate-800 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 shadow-xs">
              AVG HAUL CYCLE: <strong>24.2 min</strong>
            </div>
            {layerEdge && (
              <div className="bg-emerald-50 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 font-bold shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                MESH 100% SYNC
              </div>
            )}
          </div>

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 800 560" className="w-full h-full select-none">
            <defs>
              <radialGradient id="pitGlow" cx="55%" cy="65%" r="60%">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#F1F5F9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="1.0" />
              </radialGradient>
              <radialGradient id="stressZoneEx04" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#EF4444" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="thermalHeatZone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.40" />
                <stop offset="70%" stopColor="#EA580C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Pit Texture */}
            <rect width="800" height="560" fill="url(#pitGlow)" />

            {/* Thermal Stress Overlay Layer */}
            {layerThermal && (
              <g id="thermalOverlay">
                <circle cx="450" cy="370" r="160" fill="url(#thermalHeatZone)" />
                <circle cx="520" cy="320" r="110" fill="url(#thermalHeatZone)" />
                <text x="420" y="230" fill="#D97706" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  [THERMAL HOTSPOT 96°C]
                </text>
              </g>
            )}

            {/* Elevation Contours Layer */}
            {layerContours && (
              <g stroke="#CBD5E1" strokeWidth="1" fill="none">
                <path d="M 40,80 Q 400,120 760,60" />
                <text x="60" y="70" fill="#64748B" fontSize="10" fontFamily="monospace">--40M BENCH SURFACE--</text>

                <path d="M 50,160 Q 410,220 750,170" />
                <text x="60" y="150" fill="#64748B" fontSize="10" fontFamily="monospace">--80M BENCH--</text>

                <path d="M 80,270 Q 430,340 730,300" strokeDasharray="4 4" />
                <text x="100" y="260" fill="#64748B" fontSize="10" fontFamily="monospace">--120M BENCH--</text>

                <path d="M 140,390 Q 450,470 690,420" strokeDasharray="4 4" />
                <text x="160" y="380" fill="#64748B" fontSize="10" fontFamily="monospace">--160M PIT FLOOR (HARD BASALT STRATUM)--</text>
              </g>
            )}

            {/* Cavitation Alerts Radar Layer */}
            {layerCavitation && (
              <g id="cavitationZone">
                <circle cx="440" cy="390" r="70" fill="url(#stressZoneEx04)" />
                <circle cx="440" cy="390" r="90" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              </g>
            )}

            {/* Machine Markers */}
            {unitsData.map((unit) => {
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
                  <circle cx={cx} cy={cy} r={isSelected ? 18 : 15} fill={color} stroke="#FFFFFF" strokeWidth="3" className="transition-all" />
                  
                  {/* Text inside node */}
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {unit.id.replace("EX-", "")}
                  </text>

                  {/* Active Tooltip Label */}
                  {isSelected && (
                    <g transform={`translate(${cx + 20}, ${cy - 20})`}>
                      <rect width="170" height="44" rx="8" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
                      <text x="12" y="18" fill={color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {unit.id} (SELECTED) • {unit.status.toUpperCase()}
                      </text>
                      <text x="12" y="33" fill="#475569" fontSize="10" fontFamily="monospace">
                        CMSI {unit.cmsi} • {unit.badge}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Scale and Compass */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2 bg-white/90 text-slate-800 px-2.5 py-1 rounded border border-slate-200 shadow-xs">
              <span>SCALE</span>
              <div className="w-16 h-1 bg-slate-500 rounded"></div>
              <span>100m</span>
            </div>
            <div className="bg-white/90 text-slate-800 px-2.5 py-1 rounded border border-slate-200 text-slate-700 shadow-xs">
              Pit Heading: 042° NNE
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Selected Machine Telemetry Inspector (DYNAMIC BINDING) */}
        <div className="xl:col-span-4 space-y-4">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 font-mono">{currentUnit.id}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                  currentUnit.status === "critical" 
                    ? "bg-red-100 border-red-200 text-red-700" 
                    : currentUnit.status === "warning"
                    ? "bg-amber-100 border-amber-200 text-amber-800"
                    : "bg-emerald-100 border-emerald-200 text-emerald-800"
                }`}>
                  {currentUnit.badge}
                </span>
                {currentUnit.isLive && (
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-700 text-[9px] font-bold font-mono">
                    LIVE SENSOR
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {currentUnit.model} • Sn: {currentUnit.sn}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Stress Index</div>
              <div className={`text-2xl font-black font-mono ${
                currentUnit.cmsi >= 90 ? "text-red-600" : currentUnit.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"
              }`}>
                {currentUnit.cmsi} <span className="text-xs text-slate-500 font-normal">CMSI</span>
              </div>
            </div>
          </div>

          {/* Anomaly / Status Warning Banner */}
          <div className={`p-4 rounded-r-xl border shadow-md ${
            currentUnit.status === "critical"
              ? "bg-red-50 border-l-4 border-red-500 border-slate-200"
              : currentUnit.status === "warning"
              ? "bg-amber-50 border-l-4 border-amber-500 border-slate-200"
              : "bg-emerald-50 border-l-4 border-emerald-500 border-slate-200"
          }`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                currentUnit.status === "critical" ? "text-red-600" : currentUnit.status === "warning" ? "text-amber-600" : "text-emerald-600"
              }`} />
              <div>
                <div className={`text-sm font-bold ${
                  currentUnit.status === "critical" ? "text-red-800" : currentUnit.status === "warning" ? "text-amber-800" : "text-emerald-800"
                }`}>
                  {currentUnit.title}
                </div>
                <div className={`text-xs mt-1 leading-relaxed ${
                  currentUnit.status === "critical" ? "text-red-700/80" : currentUnit.status === "warning" ? "text-amber-800/80" : "text-emerald-800/80"
                }`}>
                  {currentUnit.detail}
                </div>
              </div>
            </div>
          </div>

          {/* Live Kinematics Readout (IMU 200Hz) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 pb-2">
              <span className="text-slate-500 uppercase tracking-wider">Excavator Kinematics Readout</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {currentUnit.isLive ? "Live IMU (Echa ESP32)" : "Pit Telemetry Loop"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Boom Angle</div>
                <div className="text-base font-black text-slate-900 mt-1">
                  {currentUnit.boom}° <span className="text-xs text-slate-500 font-normal">±1.2°</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Arm Reach</div>
                <div className="text-base font-black text-slate-900 mt-1">
                  {currentUnit.arm}m <span className="text-xs text-slate-500 font-normal">Max 11.5m</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Hydraulic Relief</div>
                <div className={`text-base font-black mt-1 ${currentUnit.pressure >= 30 ? "text-red-600" : "text-slate-900"}`}>
                  {currentUnit.pressure} MPa
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Manifold Temp</div>
                <div className={`text-base font-black mt-1 ${currentUnit.temp >= 85 ? "text-amber-700" : "text-slate-900"}`}>
                  {currentUnit.temp}°C
                </div>
              </div>
            </div>

            {/* Direct Diagnostic Link */}
            <div className="pt-2">
              <Link
                href="/diagnostics"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                Open Full Neural Diagnostics ({currentUnit.id})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
