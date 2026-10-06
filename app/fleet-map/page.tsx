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
  Radio,
  Truck,
  Compass,
  ArrowUpRight,
  Mountain,
  CheckCircle2,
  PhoneCall,
  Navigation
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function FleetMapPage() {
  const [selectedUnit, setSelectedUnit] = useState("EX-04");
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

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
      model: "XCMG XE4000 Mining Shovel",
      sn: "XCMG-8829-PX",
      badge: ex04Status === "critical" ? "Critical Anomaly" : ex04Status === "warning" ? "Elevated Load" : "Nominal State",
      title: ex04Status === "critical" ? "Hydraulic Cavitation Detected" : ex04Status === "warning" ? "Elevated Hydraulic Load" : "Normal Hydraulic State",
      detail: ex04?.anomaly_detail || "Relief pressure spike on 184 MPa Basalt stratum.",
      site: "Sector 4 North Bench",
      elevation: "-140.40m RL",
      rock: "Hard Basalt (184 MPa)",
      rockRisk: "Extreme Compressive Wear (+28% limit)",
      slopeFos: "1.42 (Within Geotech Margin)",
      operator: "M. Kowalski",
      shift: "Shift Alpha (06:00 - 18:00)",
      vhfChannel: "Ch. 04 (North Pit Dispatch)",
      pairedTruck: "Cat 797F (HT-18)",
      cycleProgress: "14 of 24 Target Dumps",
      isLive: true
    },
    {
      id: "EX-12",
      x: 500,
      y: 340,
      status: "warning",
      cmsi: 83.1,
      model: "XCMG XE7000 Mining Excavator",
      sn: "XCMG-7104-AZ",
      badge: "High Slew Shock",
      title: "Slew Bearing Harmonic Spike",
      detail: "88 Hz radial vibration on swing gear. High centrifugal torque on bench slope.",
      site: "Sector 2 West Bench",
      elevation: "-110.00m RL",
      rock: "Banded Iron Formation (145 MPa)",
      rockRisk: "Elevated Micro-Pitting Wear",
      slopeFos: "1.38 (Monitor Grade Slump)",
      operator: "R. Chen",
      shift: "Shift Alpha (06:00 - 18:00)",
      vhfChannel: "Ch. 02 (West Wall Dispatch)",
      pairedTruck: "Komatsu 930E (HT-09)",
      cycleProgress: "18 of 24 Target Dumps",
      isLive: false
    },
    {
      id: "EX-08",
      x: 530,
      y: 280,
      status: "nominal",
      cmsi: 58.2,
      model: "XCMG XE1250 Mining Excavator",
      sn: "XCMG-5512-KL",
      badge: "Thermal Watch",
      title: "Hydraulic Thermal Drift",
      detail: "Minor radiator dust load. Within safe operating limits.",
      site: "Sector 4 Waste Dump",
      elevation: "-60.20m RL",
      rock: "Weathered Sandstone (92 MPa)",
      rockRisk: "Low Wear Velocity",
      slopeFos: "1.55 (High Stability)",
      operator: "S. Tanaka",
      shift: "Shift Alpha (06:00 - 18:00)",
      vhfChannel: "Ch. 04 (North Pit Dispatch)",
      pairedTruck: "Cat 789D (HT-22)",
      cycleProgress: "11 of 20 Target Dumps",
      isLive: false
    },
    {
      id: "EX-31",
      x: 370,
      y: 330,
      status: "nominal",
      cmsi: 38.6,
      model: "XCMG XE700D Heavy Excavator",
      sn: "XCMG-4902-TX",
      badge: "Nominal State",
      title: "Nominal Earthmoving",
      detail: "Standard cycle time. No harmonic spikes or hydraulic anomalies detected.",
      site: "Sector 1 South Cut",
      elevation: "-85.00m RL",
      rock: "Clay & Silt Bed (36 MPa)",
      rockRisk: "Nominal Baseline",
      slopeFos: "1.60 (Stable Highwall)",
      operator: "K. Mensah",
      shift: "Shift Alpha (06:00 - 18:00)",
      vhfChannel: "Ch. 01 (South Pit Dispatch)",
      pairedTruck: "Hitachi EH5000 (HT-04)",
      cycleProgress: "20 of 24 Target Dumps",
      isLive: false
    },
    {
      id: "EX-19",
      x: 620,
      y: 440,
      status: "nominal",
      cmsi: 44.0,
      model: "XCMG XE950G Heavy Excavator",
      sn: "XCMG-9210-WD",
      badge: "Nominal State",
      title: "Standard Digging Envelope",
      detail: "Digging in soft sandstone bench. Low wear velocity, all sensors healthy.",
      site: "Sector 3 Overburden",
      elevation: "-125.50m RL",
      rock: "Soft Overburden (48 MPa)",
      rockRisk: "Nominal Baseline",
      slopeFos: "1.48 (Safe Bench Margin)",
      operator: "D. Vance",
      shift: "Shift Alpha (06:00 - 18:00)",
      vhfChannel: "Ch. 03 (East Sump Dispatch)",
      pairedTruck: "Komatsu 830E (HT-15)",
      cycleProgress: "16 of 24 Target Dumps",
      isLive: false
    },
  ];

  const currentUnit = unitsData.find((u) => u.id === selectedUnit) || unitsData[0];

  const handleRadioCall = () => {
    setDispatchAlert(`Radio channel opened on ${currentUnit.vhfChannel}. Operator ${currentUnit.operator} acknowledged.`);
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  const handleReroute = () => {
    setDispatchAlert(`Reroute instruction issued for ${currentUnit.id} to transition to lower-stress Bench 09.`);
    setTimeout(() => setDispatchAlert(null), 4500);
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Geotechnical Pit Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600">
            Geotechnical Spatial Telemetry
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-600" />
            Pilbara Pit 4 &bull; GPS Dispatch & Geotechnical Map
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Real-time RTK spatial tracking, pit bench elevation contours, and hauler loading dispatch.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RTK Base Lock: <strong>±2.4cm Fix</strong></span>
          </div>
          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            Active Excavators: <strong className="text-slate-900">{unitsData.length} Units</strong>
          </div>
        </div>
      </div>

      {/* Dispatch Action Notification Toast */}
      {dispatchAlert && (
        <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-medium flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-orange-700 font-bold hover:text-orange-950">
            ✕
          </button>
        </div>
      )}

      {/* 2. Map Filter Layers Bar (INTERACTIVE TOGGLES) */}
      <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-slate-900">Map Geospatial Layers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLayerContours(!layerContours)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              layerContours
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Bench Contours (RL Elevation)</span>
          </button>

          <button
            onClick={() => setLayerCavitation(!layerCavitation)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              layerCavitation
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hard Stratum Stress Radar</span>
          </button>

          <button
            onClick={() => setLayerThermal(!layerThermal)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              layerThermal
                ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>Hauler Haul Roads</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Critical Stress (&gt;90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Elevated Load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Nominal</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Topographical Pit Map vs Spatial Dispatch Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left (8 Cols): Topographical Pit Map SVG */}
        <div className="xl:col-span-8 bg-slate-100/80 border border-slate-200/70 rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] relative">
          {/* Subtle Map Coordinate Watermark */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/70 text-xs shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-semibold">Bench 12B Center (23°14&apos;42&quot;S, 119°54&apos;18&quot;E)</span>
          </div>

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 1000 680" className="w-full h-auto select-none">
            <defs>
              <pattern id="pitGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
              </pattern>

              <radialGradient id="stressHeatmap" cx="44%" cy="58%" r="35%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Base Pit Texture */}
            <rect width="1000" height="680" fill="#F8FAFC" />
            <rect width="1000" height="680" fill="url(#pitGrid)" />

            {/* Hard Rock Stress Overlay Layer */}
            {layerCavitation && (
              <circle cx="440" cy="390" r="160" fill="url(#stressHeatmap)" />
            )}

            {/* Elevation Contours Layer */}
            {layerContours && (
              <g stroke="#CBD5E1" fill="none" strokeWidth="1.2">
                {/* Outer Rim Bench (-60m RL) */}
                <path d="M 50,220 C 180,90 820,90 950,220 C 990,360 920,580 800,640 C 600,680 280,680 120,620 C 20,530 10,320 50,220 Z" />
                <text x="70" y="240" fill="#94A3B8" fontSize="10" fontWeight="bold">-60m RL</text>

                {/* Intermediate Bench (-100m RL) */}
                <path d="M 160,260 C 280,180 720,180 840,260 C 880,380 820,520 720,570 C 560,600 320,600 210,540 C 130,470 120,340 160,260 Z" />
                <text x="180" y="280" fill="#94A3B8" fontSize="10" fontWeight="bold">-100m RL</text>

                {/* Working Pit Floor (-140m RL) */}
                <path d="M 280,310 C 380,240 620,240 720,310 C 760,400 700,480 620,510 C 490,530 360,530 300,480 C 250,420 250,360 280,310 Z" stroke="#94A3B8" strokeWidth="1.5" />
                <text x="300" y="330" fill="#64748B" fontSize="10" fontWeight="bold">-140m RL (Active Pit Floor)</text>
              </g>
            )}

            {/* Haul Roads Layer */}
            <path 
              d="M 120,620 Q 300,500 500,430 T 800,280" 
              fill="none" 
              stroke="#E2E8F0" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />
            <path 
              d="M 120,620 Q 300,500 500,430 T 800,280" 
              fill="none" 
              stroke="#94A3B8" 
              strokeWidth="2" 
              strokeDasharray="6 6" 
            />

            {/* Machine Markers on Pit Canvas */}
            {unitsData.map((unit) => {
              const isSelected = unit.id === selectedUnit;
              const cx = unit.x;
              const cy = unit.y;

              const color =
                unit.status === "critical"
                  ? "#EF4444"
                  : unit.status === "warning"
                  ? "#F59E0B"
                  : "#10B981";

              return (
                <g
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Pulsing ring for critical status */}
                  {unit.status === "critical" && (
                    <circle cx={cx} cy={cy} r="24" fill={color} opacity="0.2" className="animate-ping" />
                  )}

                  {/* Marker Node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 16 : 13}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="shadow-lg"
                  />

                  {/* Selected locator beacon */}
                  {isSelected && (
                    <>
                      <circle cx={cx} cy={cy} r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
                      <circle cx={cx} cy={cy} r="28" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    </>
                  )}

                  {/* Text inside node */}
                  <text x={cx} y={cy + 3.5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {unit.id.replace("EX-", "")}
                  </text>

                  {/* Clean Unit Badge Label Below Node */}
                  <g transform={`translate(${cx}, ${cy + 22})`}>
                    <rect 
                      x="-24" 
                      y="0" 
                      width="48" 
                      height="16" 
                      rx="5" 
                      fill={isSelected ? "#0F172A" : "rgba(255, 255, 255, 0.95)"} 
                      stroke={isSelected ? "#0F172A" : "#E2E8F0"} 
                      strokeWidth="1" 
                    />
                    <text 
                      x="0" 
                      y="11.5" 
                      textAnchor="middle" 
                      fill={isSelected ? "#FFFFFF" : "#475569"} 
                      fontSize="9.5" 
                      fontWeight="bold"
                    >
                      {unit.id}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Scale and Compass */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-2 bg-white/90 text-slate-800 px-2.5 py-1 rounded border border-slate-200/70 shadow-xs">
              <span className="font-semibold">SCALE</span>
              <div className="w-16 h-1 bg-slate-500 rounded"></div>
              <span>100m</span>
            </div>
            <div className="bg-white/90 px-2.5 py-1 rounded border border-slate-200/70 text-slate-700 shadow-xs">
              Pit Heading: <strong>042° NNE</strong>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): SPATIAL & DISPATCH CONTEXT INSPECTOR (Clean & Non-Redundant) */}
        <div className="xl:col-span-4 space-y-4 font-sans text-xs">
          {/* Header Card: Identity & Status */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentUnit.id}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  currentUnit.status === "critical"
                    ? "bg-red-100 border-red-200 text-red-700"
                    : currentUnit.status === "warning"
                    ? "bg-amber-100 border-amber-200 text-amber-800"
                    : "bg-emerald-100 border-emerald-200 text-emerald-800"
                }`}>
                  {currentUnit.badge}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {currentUnit.model} • Sn: {currentUnit.sn}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Stress Index</div>
              <div className={`text-2xl font-bold ${
                currentUnit.cmsi >= 90 ? "text-red-600" : currentUnit.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"
              }`}>
                {currentUnit.cmsi} <span className="text-xs text-slate-500 font-normal">CMSI</span>
              </div>
            </div>
          </div>

          {/* Anomaly / Status Alert Banner */}
          <div className={`p-4 rounded-xl border shadow-xs ${
            currentUnit.status === "critical"
              ? "bg-red-50/80 border-red-200 text-red-900"
              : currentUnit.status === "warning"
              ? "bg-amber-50/80 border-amber-200 text-amber-900"
              : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
          }`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                currentUnit.status === "critical" ? "text-red-600" : currentUnit.status === "warning" ? "text-amber-600" : "text-emerald-600"
              }`} />
              <div>
                <div className="text-xs font-bold">{currentUnit.title}</div>
                <div className="text-[11px] mt-0.5 leading-relaxed opacity-90">{currentUnit.detail}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Geotechnical Ground & Stratum Risk */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3">
            <div className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-orange-600" />
              <span>Geotechnical Pit Environment</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-500 uppercase block">Active Bench & RL</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentUnit.site}</span>
                <span className="text-[10px] text-slate-500">{currentUnit.elevation}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-500 uppercase block">Rock Stratum</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentUnit.rock}</span>
                <span className="text-[10px] text-slate-500">{currentUnit.rockRisk}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Slope Stability (Factor of Safety)</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{currentUnit.slopeFos}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  PASS
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Cabin Operator & Hauler Dispatch */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3">
            <div className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>Cabin & Hauler Fleet Dispatch</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500">Operator On-Duty</span>
                <span className="font-bold text-slate-900">{currentUnit.operator} ({currentUnit.shift})</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500">Fleet Comms VHF</span>
                <span className="font-semibold text-orange-600 font-mono">{currentUnit.vhfChannel}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500">Paired Haul Truck</span>
                <span className="font-bold text-slate-900">{currentUnit.pairedTruck} &bull; {currentUnit.cycleProgress}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Actionable Dispatch Controls & Deep-Dive Link */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-2.5">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Dispatcher Operational Actions
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRadioCall}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                <span>Call VHF Cab</span>
              </button>

              <button
                onClick={handleReroute}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                <span>Reroute Bench</span>
              </button>
            </div>

            {/* Seamless Link to Deep-Dive Diagnostics (Explainable AI / Forensics) */}
            <Link
              href="/diagnostics"
              className="w-full mt-1 p-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Activity className="w-4 h-4" />
              <span>Investigate Sensor Forensics (FFT)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
