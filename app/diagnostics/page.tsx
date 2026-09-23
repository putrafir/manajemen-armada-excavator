"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Wrench, 
  FileText, 
  Clock
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import WorkOrderModal from "@/components/WorkOrderModal";

interface AnomalyLog {
  id: string;
  time: string;
  unit: string;
  subsystem: string;
  description: string;
  severity: "critical" | "high" | "resolved";
  cmsi: number;
}

const mockLogs: AnomalyLog[] = [
  {
    id: "LOG-9921",
    time: "23:42:15",
    unit: "EX-04",
    subsystem: "Hydraulic Spool Valve",
    description: "142 Hz cavitation resonance (34.8 MPa)",
    severity: "critical",
    cmsi: 94
  },
  {
    id: "LOG-9918",
    time: "23:18:04",
    unit: "EX-04",
    subsystem: "Manifold Fluid Temp",
    description: "Thermal excursion 96.4°C (>85°C threshold)",
    severity: "high",
    cmsi: 91
  },
  {
    id: "LOG-9905",
    time: "22:50:11",
    unit: "EX-12",
    subsystem: "Slew Gearbox Bearing",
    description: "Harmonic radial vibration 4.8 mm/s @ 88 Hz",
    severity: "high",
    cmsi: 83
  },
  {
    id: "LOG-9892",
    time: "21:30:45",
    unit: "EX-27",
    subsystem: "Distributor O-Ring",
    description: "Internal bypass flow drop 12.4 L/min",
    severity: "high",
    cmsi: 78
  },
  {
    id: "LOG-9870",
    time: "20:15:00",
    unit: "EX-08",
    subsystem: "Cylinder Wiper Seal",
    description: "Quartz micro-scoring resolved via flush",
    severity: "resolved",
    cmsi: 58
  },
  {
    id: "LOG-9844",
    time: "19:04:22",
    unit: "EX-31",
    subsystem: "Cooler Exchanger",
    description: "Debris blockage cleared, operating nominal",
    severity: "resolved",
    cmsi: 38
  }
];

export default function DiagnosticsPage() {
  const { telemetry } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];
  const [activeUnit, setActiveUnit] = useState("EX-04");
  const [activeTab, setActiveTab] = useState<"telemetry" | "events">("telemetry");
  const [eventFilter, setEventFilter] = useState<"all" | "critical" | "high" | "resolved">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUnit, setModalUnit] = useState("EX-04");

  const openWorkOrder = (unit: string) => {
    setModalUnit(unit);
    setModalOpen(true);
  };

  const filteredLogs = mockLogs.filter(log => {
    if (eventFilter === "all") return true;
    return log.severity === eventFilter;
  });

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-600">
                Operations Intelligence Console
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Neural Fault Diagnostics
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Deterministic signal extraction & rock strata anomaly analysis.
          </p>
        </div>

        {/* Navigation Tabs & Unit Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === "telemetry"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Telemetry & FFT
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "events"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Anomaly Feed</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-slate-900 text-[9px]">2</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveUnit("EX-04")}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                activeUnit === "EX-04"
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <strong>EX-04</strong>
            </button>

            <button
              onClick={() => setActiveUnit("EX-12")}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                activeUnit === "EX-12"
                  ? "bg-amber-100 border-amber-300 text-amber-800"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong>EX-12</strong>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Target Asset</div>
          <div className="text-sm font-bold text-slate-900 mt-1">CAT 6040 FS</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sn: TC-8829-PX</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Rock Formation</div>
          <div className="text-sm font-bold text-orange-600 mt-1">Hard Basalt</div>
          <div className="text-[10px] text-slate-500 mt-0.5">184 MPa (vs 144 limit)</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Anomaly Score</div>
          <div className="text-sm font-bold text-red-600 mt-1">MSE 115.33</div>
          <div className="text-[10px] text-red-600/80 mt-0.5">Critical Outlier</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Accelerated Wear</div>
          <div className="text-sm font-bold text-red-500 mt-1">3.4x Velocity</div>
          <div className="text-[10px] text-slate-500 mt-0.5">+1,640 hrs OEM Delta</div>
        </div>

        <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl col-span-2 sm:col-span-1">
          <div className="text-[10px] text-red-600 uppercase font-bold">Remaining Life (RUL)</div>
          <div className="text-base font-black text-red-800 mt-1">48 Operating Hrs</div>
          <div className="text-[10px] text-red-700 font-semibold">Immediate Service</div>
        </div>
      </div>

      {/* 3. Main Body */}
      {activeTab === "telemetry" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column (7 cols) */}
          <div className="xl:col-span-7 space-y-5">
            {/* 4-Stage Reasoning Pipeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  Deterministic Reasoning Chain
                </span>
                <span className="text-emerald-700 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                  Inference: 1.63ms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 01</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Signal Extraction</div>
                  <div className="text-[10px] text-sky-600 mt-1 font-sans">100Hz Ingestion • 34.8 MPa</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 02</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Lithology 1D-CNN</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">Hard Basalt • 184 MPa</div>
                </div>

                <div className="bg-red-50/70 border border-red-200 p-3 rounded-xl">
                  <div className="text-[9px] text-red-600 uppercase">Stage 03</div>
                  <div className="text-xs font-bold text-red-800 mt-1">Autoencoder</div>
                  <div className="text-[10px] text-red-600 mt-1 font-sans">MSE 115.3 • 142 Hz Peak</div>
                </div>

                <div className="bg-orange-50/70 border border-orange-200 p-3 rounded-xl">
                  <div className="text-[9px] text-orange-600 uppercase">Stage 04</div>
                  <div className="text-xs font-bold text-orange-200 mt-1">CMSI Index</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">Score 94 • Queue #1</div>
                </div>
              </div>
            </div>

            {/* Root-Cause Mechanical Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Root-Cause Mechanical Analysis
                </span>
                <span className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded border border-red-200 text-red-700 font-mono">
                  CRITICAL FAULT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-red-600 font-bold text-[11px] uppercase font-mono">Overpressure Load</div>
                  <div className="text-slate-800 mt-1 font-medium">184 MPa compressive stress</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Exceeds 144 MPa rating (+28%)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-red-600 font-bold text-[11px] uppercase font-mono">Fluid Cavitation</div>
                  <div className="text-slate-800 mt-1 font-medium">142 Hz acoustic resonance</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Micro-implosions in spool valve</div>
                </div>

                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-red-700 font-bold text-[11px] uppercase font-mono">Rupture Risk</div>
                  <div className="text-red-800 mt-1 font-medium">RUL &lt; 48 operating hours</div>
                  <div className="text-[11px] text-red-700/80 mt-0.5">Spool seal failure imminent</div>
                </div>
              </div>
            </div>

            {/* Prescriptive Engineering Directives */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-600" />
                  Prescriptive Operational Directives
                </span>
                <span className="text-[10px] text-slate-500">3 Immediate Actions</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-600 font-mono font-bold text-[10px] flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">Limit Bucket Breakout Angle to ≤ 38°</div>
                      <div className="text-[11px] text-slate-500">Prevents relief valve oil venting and temperature excursions</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-950/50 rounded">Operator</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-600 font-mono font-bold text-[10px] flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">Derate Relief Valve by -12% (350 ➔ 310 Bar)</div>
                      <div className="text-[11px] text-slate-500">Reduces peak pressure oscillation during hard stratum penetration</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-orange-600 font-semibold px-2 py-0.5 bg-orange-950/50 rounded">Maintenance</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-600 font-mono font-bold text-[10px] flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">Reroute EX-04 to Sector 2 (Soft Shale Bench)</div>
                      <div className="text-[11px] text-slate-500">Cuts wear rate by 65%; assign ripper dozer to basalt face</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sky-600 font-semibold px-2 py-0.5 bg-cyan-950/50 rounded">Dispatch</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
                <button
                  onClick={() => openWorkOrder("EX-04")}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-950/40 cursor-pointer flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Dispatch Work Order #WO-8841
                </button>

                <button
                  onClick={() => alert("Telemetry Report exported as PDF")}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition border border-slate-200 cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Export Telemetry Report
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="xl:col-span-5 space-y-5">
            {/* Oscilloscope */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div>
                  <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-600" />
                    Acoustic FFT Spectrum
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Transducer HYD-04B-ACC (Manifold)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-red-600 text-[10px] font-bold">
                  Peak: 142 Hz
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] text-slate-500">
                  BANDWIDTH: 0 - 200 Hz
                </div>
                
                <svg viewBox="0 0 380 150" className="w-full h-40">
                  <defs>
                    <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid */}
                  <line x1="0" y1="30" x2="380" y2="30" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="380" y2="70" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="380" y2="110" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="100" y1="0" x2="100" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="200" y1="0" x2="200" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="300" y1="0" x2="300" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />

                  {/* Baseline */}
                  <path
                    d="M 10,130 Q 80,120 150,125 T 270,128 T 370,132"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />

                  {/* Cavitation Spike */}
                  <path
                    d="M 10,135 Q 90,130 180,125 L 240,120 L 265,22 L 290,122 L 340,128 L 370,135"
                    fill="url(#specGrad)"
                  />
                  <path
                    d="M 10,135 Q 90,130 180,125 L 240,120 L 265,22 L 290,122 L 340,128 L 370,135"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                  />

                  <circle cx="265" cy="22" r="4" fill="#EF4444" />
                  <circle cx="265" cy="22" r="8" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" />
                  <text x="210" y="16" fill="#F87171" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    142 Hz (Cavitation Critical)
                  </text>
                </svg>

                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0 Hz</span>
                  <span>50 Hz</span>
                  <span>100 Hz</span>
                  <span className="text-red-600 font-bold">142 Hz</span>
                  <span>200 Hz</span>
                </div>
              </div>
            </div>

            {/* Live Sensor Stream */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  Live Sensor Stream
                </span>
                <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  100 Hz Ingestion
                </span>
              </div>

              {/* Hydraulic Pressure */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 text-[11px]">HYDRAULIC PRESSURE</span>
                  <span className="text-base font-black text-red-600">
                    {ex04?.hydraulic_pressure_mpa ?? 34.8} MPa
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((ex04?.hydraulic_pressure_mpa ?? 34.8) / 37.0) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Nominal: 28.0 MPa</span>
                  <span className="text-red-600 font-bold">94% of Relief Limit</span>
                </div>
              </div>

              {/* Oil Temp */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 text-[11px]">MANIFOLD OIL TEMP</span>
                  <span className="text-base font-black text-amber-700">
                    {ex04?.manifold_temp_c ?? 96.4} °C
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((ex04?.manifold_temp_c ?? 96.4) / 110.0) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Safe Limit: 85.0 °C</span>
                  <span className="text-amber-700 font-bold">Thermal High</span>
                </div>
              </div>

              {/* Kinematics */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">IMU Kinematics Readout</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Boom</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{ex04?.kinematics.boom_angle ?? 34.8}°</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Arm</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{ex04?.kinematics.arm_reach ?? 9.2}m</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded-lg border border-red-200 text-red-700">
                    <div className="text-[10px] text-red-600 font-bold">Bucket</div>
                    <div className="font-bold text-red-700 text-xs mt-0.5">{ex04?.kinematics.bucket_angle ?? 91.4}°</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Slew</div>
                    <div className="font-bold text-amber-700 text-xs mt-0.5">{ex04?.kinematics.slew_speed ?? 8.2} rpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Anomaly Event Feed */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden font-mono text-xs">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 font-sans">
                Fleet Anomaly Event Feed
              </h2>
              <div className="text-xs text-slate-500 font-sans mt-0.5">
                Real-time chronological sensor triggers & diagnostic incidents
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setEventFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "all" ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setEventFilter("critical")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "critical" ? "bg-red-100 text-red-800 font-bold border border-red-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Critical (1)
              </button>
              <button
                onClick={() => setEventFilter("high")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "high" ? "bg-amber-100 text-amber-800 font-bold border border-amber-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Elevated (3)
              </button>
              <button
                onClick={() => setEventFilter("resolved")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "resolved" ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Resolved (2)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-700">
              <thead className="bg-slate-100 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Machine</th>
                  <th className="py-3.5 px-6">Component</th>
                  <th className="py-3.5 px-6">Trigger Telemetry</th>
                  <th className="py-3.5 px-6">Severity</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{log.time}</span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      {log.unit}
                    </td>

                    <td className="py-4 px-6 font-sans text-slate-700 font-medium">
                      {log.subsystem}
                    </td>

                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                      {log.description}
                    </td>

                    <td className="py-4 px-6">
                      {log.severity === "critical" && (
                        <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold">
                          CRITICAL
                        </span>
                      )}
                      {log.severity === "high" && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                          ELEVATED
                        </span>
                      )}
                      {log.severity === "resolved" && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          RESOLVED
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right font-sans">
                      {log.severity === "critical" ? (
                        <button
                          onClick={() => openWorkOrder(log.unit)}
                          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition shadow-md shadow-orange-950/40 cursor-pointer inline-flex items-center gap-1.5 text-xs"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          Work Order
                        </button>
                      ) : (
                        <button
                          onClick={() => openWorkOrder(log.unit)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition cursor-pointer inline-flex items-center gap-1.5 text-xs"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Work Order Modal */}
      <WorkOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        unitId={modalUnit}
      />
    </div>
  );
}
