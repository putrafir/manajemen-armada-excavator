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
  Navigation,
  ChevronDown
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

interface PitConfig {
  id: string;
  name: string;
  code: string;
  coords: string;
  elevationDatum: string;
  heading: string;
  rockStratum: string;
  rockMpa: number;
  baseColor: string;
  description: string;
  units: {
    id: string;
    x: number;
    y: number;
    status: "critical" | "warning" | "nominal";
    cmsi: number;
    model: string;
    sn: string;
    badge: string;
    title: string;
    detail: string;
    site: string;
    elevation: string;
    rock: string;
    rockRisk: string;
    slopeFos: string;
    operator: string;
    shift: string;
    vhfChannel: string;
    pairedTruck: string;
    cycleProgress: string;
  }[];
}

export default function FleetMapPage() {
  const [activePitId, setActivePitId] = useState<string>("pit-4");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("EX-04");
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  // Synchronize active pit and selected machine from URL query
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("pit");
      if (p) setActivePitId(p);
      const u = params.get("unit");
      if (u) setSelectedUnitId(u);
    }
  }, []);

  // Layer toggles
  const [layerThermal, setLayerThermal] = useState(false);
  const [layerCavitation, setLayerCavitation] = useState(true);
  const [layerContours, setLayerContours] = useState(true);

  const { telemetry, pitScope, setPitScope } = useTelemetry();

  // Sync with global pit scope if selected from header
  React.useEffect(() => {
    if (pitScope && pitScope !== "ALL" && pits[pitScope]) {
      setActivePitId(pitScope);
      const targetPit = pits[pitScope];
      if (targetPit && targetPit.units.length > 0) {
        setSelectedUnitId(targetPit.units[0].id);
      }
    }
  }, [pitScope]);
  const ex04Live = telemetry?.units["EX-04"];
  const ex04Cmsi = ex04Live?.cmsi ?? 94.0;
  const ex04Status: "critical" | "warning" | "nominal" = ex04Cmsi >= 90 ? "critical" : ex04Cmsi >= 70 ? "warning" : "nominal";

  const pits: Record<string, PitConfig> = {
    "pit-4": {
      id: "pit-4",
      name: "Pilbara Pit 4 — North Extraction Basin",
      code: "PIL-PIT-04",
      coords: "23°14'42\"S, 119°54'18\"E",
      elevationDatum: "-140.40m RL Floor",
      heading: "042° NNE",
      rockStratum: "Dense Basalt (184 MPa)",
      rockMpa: 184,
      baseColor: "#F8FAFC",
      description: "Deep open-cut basin with high compressive basalt strata and active loading benches.",
      units: [
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
          detail: ex04Live?.anomaly_detail || "Relief pressure spike on 184 MPa Basalt stratum.",
          site: "Pit 4 Bench 12B (Floor)",
          elevation: "-140.40m RL",
          rock: "Hard Basalt (184 MPa)",
          rockRisk: "Extreme Compressive Wear (+28% limit)",
          slopeFos: "1.42 (Within Geotech Margin)",
          operator: "M. Kowalski",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 04 (North Pit Dispatch)",
          pairedTruck: "Cat 797F (HT-18)",
          cycleProgress: "14 of 24 Target Dumps"
        },
        {
          id: "EX-08",
          x: 580,
          y: 270,
          status: "critical",
          cmsi: 91.5,
          model: "XCMG XE1250 Mining Excavator",
          sn: "XCMG-8910-MT",
          badge: "Thermal Excursion",
          title: "Oil Cooler Radiator Thermal Spike",
          detail: "Severe thermal excursion 98.4°C exceeding relief limit near upper bench dump.",
          site: "Pit 4 Upper Waste Dump",
          elevation: "-60.20m RL",
          rock: "Weathered Sandstone (92 MPa)",
          rockRisk: "High Thermal Drag",
          slopeFos: "1.55 (High Stability)",
          operator: "S. Tanaka",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 04 (North Pit Dispatch)",
          pairedTruck: "Cat 789D (HT-22)",
          cycleProgress: "11 of 20 Target Dumps"
        },
        {
          id: "EX-31",
          x: 350,
          y: 470,
          status: "critical",
          cmsi: 90.2,
          model: "XCMG XE700D Heavy Excavator",
          sn: "XCMG-3108-OP",
          badge: "Pressure Surge",
          title: "Main Pump Delivery Pressure Spike",
          detail: "33.8 MPa relief surge detected during hard breakout cycle.",
          site: "Pit 4 South Access Ramp",
          elevation: "-85.00m RL",
          rock: "Clay & Silt Bed (36 MPa)",
          rockRisk: "Elevated Breakout Stress",
          slopeFos: "1.60 (Stable Ramp Margin)",
          operator: "K. Mensah",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 04 (North Pit Dispatch)",
          pairedTruck: "Hitachi EH5000 (HT-04)",
          cycleProgress: "20 of 24 Target Dumps"
        }
      ]
    },
    "pit-2": {
      id: "pit-2",
      name: "Pilbara Pit 2 — West Wall & Sump",
      code: "PIL-PIT-02",
      coords: "23°15'11\"S, 119°53'44\"E",
      elevationDatum: "-110.00m RL Intermediate",
      heading: "285° WNW",
      rockStratum: "Banded Iron Formation (145 MPa)",
      rockMpa: 145,
      baseColor: "#F1F5F9",
      description: "Steep terraced west wall with dynamic grade transit and high centrifugal slew stresses.",
      units: [
        {
          id: "EX-12",
          x: 480,
          y: 340,
          status: "critical",
          cmsi: 93.8,
          model: "XCMG XE7000 Mining Excavator",
          sn: "XCMG-7104-AZ",
          badge: "Critical Slew Shock",
          title: "Slew Bearing Harmonic Spike",
          detail: "88 Hz radial vibration on swing gear with severe centrifugal torque on -140m grade.",
          site: "Pit 2 Bench 09A",
          elevation: "-110.00m RL",
          rock: "Banded Iron Formation (145 MPa)",
          rockRisk: "Critical Slew Fatigue",
          slopeFos: "1.38 (Monitor Grade Slump)",
          operator: "R. Chen",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 02 (West Wall Dispatch)",
          pairedTruck: "Komatsu 930E (HT-09)",
          cycleProgress: "18 of 24 Target Dumps"
        },
        {
          id: "EX-17",
          x: 410,
          y: 430,
          status: "critical",
          cmsi: 92.4,
          model: "XCMG XE4000 Mining Shovel",
          sn: "XCMG-4412-MK",
          badge: "Relief Pressure Surge",
          title: "Main Relief Valve Flutter (155 Hz)",
          detail: "Heavy stall oscillation against hard Quartzite vein in deep sump.",
          site: "Pit 2 Deep Sump Floor",
          elevation: "-168.20m RL",
          rock: "Quartz Basalt (178 MPa)",
          rockRisk: "Extreme Stall Hazard",
          slopeFos: "1.36 (Deep Sump Margin)",
          operator: "J. Botha",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 02 (West Wall Dispatch)",
          pairedTruck: "Cat 797F (HT-12)",
          cycleProgress: "9 of 24 Target Dumps"
        }
      ]
    },
    "pit-1": {
      id: "pit-1",
      name: "Pilbara Pit 1 — North Cut Pre-Strip",
      code: "PIL-PIT-01",
      coords: "23°13'55\"S, 119°55'02\"E",
      elevationDatum: "-85.00m RL Pre-Strip",
      heading: "010° NNE",
      rockStratum: "Quartzite Vein (138 MPa)",
      rockMpa: 138,
      baseColor: "#F8FAFC",
      description: "Upper bench pre-stripping sector preparing bench lines for deep extraction.",
      units: [
        {
          id: "EX-27",
          x: 460,
          y: 360,
          status: "critical",
          cmsi: 90.6,
          model: "XCMG XE2000 Mining Excavator",
          sn: "XCMG-2741-BK",
          badge: "Cylinder Bypass",
          title: "Boom Cylinder Bypass Flow Drop",
          detail: "12.4 L/min internal drop detected during descent. Wiper pack wear.",
          site: "Pit 1 Bench 06C",
          elevation: "-85.00m RL",
          rock: "Quartzite Vein (138 MPa)",
          rockRisk: "Moderate Abrasive Friction",
          slopeFos: "1.45 (Stable)",
          operator: "L. Henderson",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 01 (Pre-Strip Dispatch)",
          pairedTruck: "Komatsu 830E (HT-07)",
          cycleProgress: "15 of 24 Target Dumps"
        }
      ]
    },
    "pit-3": {
      id: "pit-3",
      name: "Pilbara Pit 3 — East Highwall Sump",
      code: "PIL-PIT-03",
      coords: "23°15'38\"S, 119°56'20\"E",
      elevationDatum: "-125.50m RL Highwall",
      heading: "115° ESE",
      rockStratum: "Pyrite Shale (162 MPa)",
      rockMpa: 162,
      baseColor: "#F1F5F9",
      description: "Highwall extraction zone with radar slope displacement monitoring.",
      units: [
        {
          id: "EX-33",
          x: 430,
          y: 380,
          status: "critical",
          cmsi: 91.0,
          model: "XCMG XE7000 Mining Excavator",
          sn: "XCMG-7733-PL",
          badge: "Pinion Shock",
          title: "Slew Pinion Gearbox Shockwave",
          detail: "138 Hz harmonic pinion shock on grade transition. High structural stress.",
          site: "Pit 3 Bench 10 East",
          elevation: "-125.50m RL",
          rock: "Pyrite Shale (162 MPa)",
          rockRisk: "High Geotechnical Impact",
          slopeFos: "1.34 (Slope Radar Watch)",
          operator: "P. O'Connor",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 03 (East Pit Dispatch)",
          pairedTruck: "Cat 793F (HT-29)",
          cycleProgress: "8 of 20 Target Dumps"
        },
        {
          id: "EX-19",
          x: 570,
          y: 430,
          status: "critical",
          cmsi: 91.2,
          model: "XCMG XE950G Heavy Excavator",
          sn: "XCMG-9210-WD",
          badge: "Nominal State",
          title: "Standard Digging Cycle",
          detail: "Digging soft overburden bench. All sensor baselines nominal.",
          site: "Pit 3 Overburden Terrace",
          elevation: "-100.00m RL",
          rock: "Soft Overburden (48 MPa)",
          rockRisk: "Nominal Baseline",
          slopeFos: "1.48 (Safe)",
          operator: "D. Vance",
          shift: "Shift Alpha (06:00 - 18:00)",
          vhfChannel: "Ch. 03 (East Pit Dispatch)",
          pairedTruck: "Komatsu 830E (HT-15)",
          cycleProgress: "16 of 24 Target Dumps"
        }
      ]
    }
  };

  const currentPit = pits[activePitId] || pits["pit-4"];
  const currentUnit = currentPit.units.find((u) => u.id === selectedUnitId) || currentPit.units[0];

  const handlePitChange = (pitId: string) => {
    setActivePitId(pitId);
    setPitScope(pitId as any);
    const targetPit = pits[pitId];
    if (targetPit && targetPit.units.length > 0) {
      setSelectedUnitId(targetPit.units[0].id);
    }
  };

  const handleRadioCall = () => {
    setDispatchAlert(`VHF Radio link opened on ${currentUnit.vhfChannel}. Operator ${currentUnit.operator} acknowledged.`);
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  const handleReroute = () => {
    setDispatchAlert(`Reroute instruction issued for ${currentUnit.id} to transition to lower-stress Bench.`);
    setTimeout(() => setDispatchAlert(null), 4500);
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Geotechnical Pit Header Bar with Pit Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
            <span>Geotechnical Spatial Telemetry</span>
            <span>&bull;</span>
            <span className="text-slate-400 font-mono">{currentPit.code}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-600" />
            {currentPit.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {currentPit.description}
          </p>
        </div>

        {/* Interactive Pit Switcher Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold px-1 text-[11px]">Active Pit:</span>
            <div className="flex items-center gap-1">
              {Object.values(pits).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePitChange(p.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    activePitId === p.id
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {p.code.replace("PIL-", "")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RTK Lock: <strong>&plusmn;2.4cm Fix</strong></span>
          </div>
        </div>
      </div>

      {/* Dispatch Action Notification Toast */}
      {dispatchAlert && (
        <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-medium flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-orange-700 font-bold hover:text-orange-950">
            ✕
          </button>
        </div>
      )}

      {/* 2. Map Filter Layers Bar */}
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
            <span>Bench Contours ({currentPit.elevationDatum})</span>
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

      {/* 3. Main Split View: Topographical Pit Map SVG vs Spatial Dispatch Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left (8 Cols): Topographical Pit Map SVG */}
        <div className="xl:col-span-8 bg-slate-100/80 border border-slate-200/70 rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] relative">
          {/* Subtle Map Coordinate Watermark */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/70 text-xs shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-semibold">{currentPit.name.split("—")[0]} Center ({currentPit.coords})</span>
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
            <rect width="1000" height="680" fill={currentPit.baseColor} />
            <rect width="1000" height="680" fill="url(#pitGrid)" />

            {/* Hard Rock Stress Overlay Layer */}
            {layerCavitation && (
              <circle cx="440" cy="390" r="160" fill="url(#stressHeatmap)" />
            )}

            {/* Elevation Contours Layer */}
            {layerContours && (
              <g stroke="#CBD5E1" fill="none" strokeWidth="1.2">
                <path d="M 50,220 C 180,90 820,90 950,220 C 990,360 920,580 800,640 C 600,680 280,680 120,620 C 20,530 10,320 50,220 Z" />
                <text x="70" y="240" fill="#94A3B8" fontSize="10" fontWeight="bold">-60m RL Outer Rim</text>

                <path d="M 160,260 C 280,180 720,180 840,260 C 880,380 820,520 720,570 C 560,600 320,600 210,540 C 130,470 120,340 160,260 Z" />
                <text x="180" y="280" fill="#94A3B8" fontSize="10" fontWeight="bold">-100m RL Intermediate</text>

                <path d="M 280,310 C 380,240 620,240 720,310 C 760,400 700,480 620,510 C 490,530 360,530 300,480 C 250,420 250,360 280,310 Z" stroke="#94A3B8" strokeWidth="1.5" />
                <text x="300" y="330" fill="#64748B" fontSize="10" fontWeight="bold">{currentPit.elevationDatum}</text>
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

            {/* Machine Markers for CURRENT PIT ONLY */}
            {currentPit.units.map((unit) => {
              const isSelected = unit.id === currentUnit.id;
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
                  onClick={() => setSelectedUnitId(unit.id)}
                  className="cursor-pointer group select-none"
                >
                  {/* Invisible enlarged hit area for effortless clicking without jumping */}
                  <circle cx={cx} cy={cy + 10} r="32" fill="transparent" />

                  {/* Stationary hover ring highlight */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 20 : 16}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    className="opacity-0 group-hover:opacity-60 transition-opacity duration-150"
                  />
                  {unit.status === "critical" && (
                    <circle cx={cx} cy={cy} r="24" fill={color} opacity="0.2" className="animate-ping" />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 16 : 13}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="shadow-lg"
                  />

                  {isSelected && (
                    <>
                      <circle cx={cx} cy={cy} r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
                      <circle cx={cx} cy={cy} r="28" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    </>
                  )}

                  <text x={cx} y={cy + 3.5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {unit.id.replace("EX-", "")}
                  </text>

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
              Pit Heading: <strong>{currentPit.heading}</strong>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): SPATIAL & DISPATCH CONTEXT INSPECTOR */}
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
                <span className="text-[10px] text-slate-500 font-mono">{currentUnit.elevation}</span>
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

            {/* Link to Deep-Dive Diagnostics */}
            <Link
              href={`/diagnostics?unit=${currentUnit.id}`}
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
