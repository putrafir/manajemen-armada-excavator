"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Wrench, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertTriangle
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
  const [activeUnit, setActiveUnit] = useState<"EX-04" | "EX-12">("EX-04");
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

  // Machine profiles
  const isEx04Crit = (ex04?.cmsi ?? 94.0) >= 90;
  const isEx04Warn = (ex04?.cmsi ?? 94.0) >= 70;

  const unitProfiles = {
    "EX-04": {
      id: "EX-04",
      model: "XCMG XE4000 Mining Shovel",
      sn: "XCMG-8829-PX",
      rock: "Hard Basalt",
      rockMpa: "184 MPa (vs 144 limit)",
      anomalyScore: isEx04Crit ? "MSE 115.33" : isEx04Warn ? "MSE 54.10" : "MSE 11.20",
      anomalyBadge: isEx04Crit ? "Critical Outlier" : isEx04Warn ? "Elevated Load" : "Nominal Envelope",
      accelWear: isEx04Crit ? "3.4x Velocity" : isEx04Warn ? "1.6x Velocity" : "1.0x Velocity",
      wearDelta: isEx04Crit ? "+1,640 hrs OEM Delta" : isEx04Warn ? "+420 hrs OEM Delta" : "+0 hrs Baseline",
      rul: isEx04Crit ? "48 Operating Hrs" : isEx04Warn ? "340 Operating Hrs" : "4,200 Operating Hrs",
      rulBadge: isEx04Crit ? "Immediate Service" : isEx04Warn ? "Scheduled Check" : "Healthy Envelope",
      cmsi: ex04?.cmsi ?? 94.0,
      stage1: `100Hz Ingestion • ${ex04?.hydraulic_pressure_mpa ?? 34.8} MPa`,
      stage2: "Hard Basalt • 184 MPa",
      stage3: isEx04Crit ? "MSE 115.3 • 142 Hz Peak" : isEx04Warn ? "MSE 54.1 • 68 Hz Spike" : "MSE 11.2 • 18 Hz Baseline",
      stage4: `Score ${ex04?.cmsi ?? 94} • Priority Queue`,
      rootCauses: isEx04Crit ? [
        { title: "Overpressure Load", val: "184 MPa compressive stress", sub: "Exceeds 144 MPa rating (+28%)", crit: true },
        { title: "Fluid Cavitation", val: "142 Hz acoustic resonance", sub: "Micro-implosions in spool valve", crit: true },
        { title: "Rupture Risk", val: "RUL < 48 operating hours", sub: "Spool seal failure imminent", crit: true },
      ] : [
        { title: "Hydraulic Load", val: `${ex04?.hydraulic_pressure_mpa ?? 22.0} MPa operating line`, sub: "Within standard relief envelope", crit: false },
        { title: "Fluid Dynamics", val: "Laminar Flow (No Cavitation)", sub: "Acoustic baseline stable", crit: false },
        { title: "Component Health", val: "RUL > 4,000 operating hours", sub: "Zero immediate mechanical fatigue", crit: false },
      ],
      directives: isEx04Crit ? [
        { id: 1, title: "Limit Bucket Breakout Angle to ≤ 38°", desc: "Prevents relief valve oil venting and temperature excursions", role: "Operator" },
        { id: 2, title: "Derate Relief Valve by -12% (350 ➔ 310 Bar)", desc: "Reduces peak pressure oscillation during hard stratum penetration", role: "Maintenance" },
        { id: 3, title: "Dispatch Mobile Rig for Spool Valve Replacement", desc: "High cavitation risk. Pre-stage Parker seal kit #PS-902 in Bay 3", role: "Supervisor" },
      ] : [
        { id: 1, title: "Maintain Standard Digging Envelope", desc: "Operating within nominal OEM power band", role: "Operator" },
        { id: 2, title: "Routine Fluid Sampling at 250h Interval", desc: "Inspect hydraulic oil viscosity during standard scheduled PM", role: "Maintenance" },
        { id: 3, title: "Log Telemetry into Production Fleet Ledger", desc: "Normal duty cycle logged into shift report", role: "Supervisor" },
      ],
      fftPeakText: isEx04Crit ? "142 Hz (Cavitation Critical)" : "18 Hz (Nominal Acoustic)",
      transducer: "Transducer HYD-04B-ACC (Manifold)",
      peakHz: isEx04Crit ? "Peak: 142 Hz" : "Peak: 18 Hz",
      spikeX: isEx04Crit ? 265 : 85,
      spikeY: isEx04Crit ? 22 : 110,
      spikePath: isEx04Crit 
        ? "M 10,135 Q 90,130 180,125 L 240,120 L 265,22 L 290,122 L 340,128 L 370,135"
        : "M 10,135 Q 50,130 85,110 L 120,130 L 200,132 L 280,133 L 370,135",
      hydraulicPressure: ex04?.hydraulic_pressure_mpa ?? 34.8,
      pressureLimitPct: 94,
      manifoldTemp: ex04?.manifold_temp_c ?? 96.4,
      vibRms: 4.8,
      spoolBypass: 14.2,
      boom: ex04?.kinematics.boom_angle ?? 34.8,
      arm: ex04?.kinematics.arm_reach ?? 9.2,
      bucket: ex04?.kinematics.bucket_angle ?? 91.4,
      slew: ex04?.kinematics.slew_speed ?? 8.2,
      isLive: true
    },
    "EX-12": {
      id: "EX-12",
      model: "XCMG XE7000 Mining Excavator",
      sn: "XCMG-7104-AZ",
      rock: "Banded Iron Formation",
      rockMpa: "145 MPa (vs 140 limit)",
      anomalyScore: "MSE 84.10",
      anomalyBadge: "Elevated Harmonic",
      accelWear: "1.8x Velocity",
      wearDelta: "+840 hrs OEM Delta",
      rul: "180 Operating Hrs",
      rulBadge: "Scheduled Maintenance",
      cmsi: 83.1,
      stage1: "100Hz Ingestion • 29.4 MPa",
      stage2: "Banded Iron • 145 MPa",
      stage3: "MSE 84.1 • 88 Hz Peak",
      stage4: "Score 83.1 • Queue #2",
      rootCauses: [
        { title: "Slew Gear Stress", val: "88 Hz radial resonance", sub: "Dynamic slew shock on -140m grade", crit: false },
        { title: "Bearing Fatigue", val: "4.8 mm/s RMS vibration", sub: "Raceway micro-pitting detected", crit: false },
        { title: "Grease Starvation", val: "Auto-lube pressure drop", sub: "Inspect injector block 4", crit: false },
      ],
      directives: [
        { id: 1, title: "Limit Slew Swing Velocity to ≤ 70%", desc: "Dampens centrifugal torque on slew ring bearing raceway", role: "Operator" },
        { id: 2, title: "Flush & Purge Slew Bearing Grease Line", desc: "Clear blocked injector nozzle 4 and sample grease for metallic filings", role: "Maintenance" },
        { id: 3, title: "Ultrasonic Crack Inspection during Shift Change", desc: "Verify raceway integrity prior to 200h heavy excavation cycle", role: "Supervisor" },
      ],
      fftPeakText: "88 Hz (Slew Bearing Harmonic)",
      transducer: "Transducer SLW-12A-ACC (Slew Ring)",
      peakHz: "Peak: 88 Hz",
      spikeX: 165,
      spikeY: 38,
      spikePath: "M 10,135 Q 90,130 140,122 L 165,38 L 190,120 L 250,125 L 320,130 L 370,135",
      hydraulicPressure: 29.4,
      pressureLimitPct: 79,
      manifoldTemp: 78.5,
      vibRms: 4.8,
      spoolBypass: 4.2,
      boom: 41.2,
      arm: 8.5,
      bucket: 78.0,
      slew: 6.8,
      isLive: false
    }
  };

  const curr = unitProfiles[activeUnit];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600">
                Operations Intelligence Console
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Neural Fault Diagnostics
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Deterministic signal extraction & rock strata anomaly analysis for fleet assets.
          </p>
        </div>

        {/* Navigation Tabs & Unit Badges */}
        <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === "telemetry"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Telemetry & FFT
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "events"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Anomaly Feed</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold">2</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveUnit("EX-04")}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                activeUnit === "EX-04"
                  ? "bg-red-100 border-red-300 text-red-800 font-bold shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                  : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <strong>EX-04 (Critical)</strong>
            </button>

            <button
              onClick={() => setActiveUnit("EX-12")}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                activeUnit === "EX-12"
                  ? "bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                  : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong>EX-12 (Elevated)</strong>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Row (4 Streamlined Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-sans text-xs">
        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">TARGET UNIT</div>
          <div className="text-sm font-bold text-slate-900 mt-1">{curr.id} &bull; {curr.model}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sn: {curr.sn}</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">ANOMALY RECONSTRUCTION</div>
          <div className="text-sm font-bold text-red-600 mt-1">{curr.anomalyScore}</div>
          <div className="text-[10px] text-red-600/80 mt-0.5 font-bold">{curr.anomalyBadge} (Threshold 0.0014)</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">CMSI STRESS INDEX</div>
          <div className="text-sm font-bold text-slate-900 mt-1">{curr.cmsi} <span className="text-xs font-normal text-slate-500">/ 100</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{curr.accelWear} ({curr.wearDelta})</div>
        </div>

        <div className={`border p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] ${
          curr.cmsi >= 90 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
        }`}>
          <div className={`text-[10px] uppercase font-bold ${curr.cmsi >= 90 ? "text-red-600" : "text-amber-700"}`}>
            REMAINING USEFUL LIFE (RUL)
          </div>
          <div className={`text-base font-bold mt-1 ${curr.cmsi >= 90 ? "text-red-800" : "text-amber-900"}`}>
            {curr.rul}
          </div>
          <div className={`text-[10px] font-semibold ${curr.cmsi >= 90 ? "text-red-700" : "text-amber-800"}`}>
            {curr.rulBadge}
          </div>
        </div>
      </div>

      {/* 3. Main Body */}
      {activeTab === "telemetry" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column (7 cols) */}
          <div className="xl:col-span-7 space-y-5">
            {/* 4-Stage Reasoning Pipeline */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  Deterministic Reasoning Chain ({curr.id})
                </span>
                <span className="text-emerald-700 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Inference: 1.63ms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 01</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Signal Extraction</div>
                  <div className="text-[10px] text-sky-600 mt-1 font-sans">{curr.stage1}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 02</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Lithology 1D-CNN</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">{curr.stage2}</div>
                </div>

                <div className={`p-3 rounded-xl border ${curr.cmsi >= 90 ? "bg-red-50/70 border-red-200" : "bg-amber-50/70 border-amber-200"}`}>
                  <div className={`text-[9px] uppercase font-bold ${curr.cmsi >= 90 ? "text-red-600" : "text-amber-700"}`}>Stage 03</div>
                  <div className={`text-xs font-bold mt-1 ${curr.cmsi >= 90 ? "text-red-800" : "text-amber-900"}`}>Autoencoder</div>
                  <div className={`text-[10px] mt-1 font-sans ${curr.cmsi >= 90 ? "text-red-600" : "text-amber-700"}`}>{curr.stage3}</div>
                </div>

                <div className="bg-orange-50/70 border border-orange-200 p-3 rounded-xl">
                  <div className="text-[9px] text-orange-600 uppercase font-bold">Stage 04</div>
                  <div className="text-xs font-bold text-orange-800 mt-1">CMSI Index</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">{curr.stage4}</div>
                </div>
              </div>
            </div>

            {/* Root-Cause Mechanical Summary */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 font-sans text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${curr.cmsi >= 90 ? "text-red-600" : "text-amber-600"}`} />
                  Root-Cause Mechanical Analysis
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-sans ${
                  curr.cmsi >= 90 ? "bg-red-100 border-red-200 text-red-700" : "bg-amber-100 border-amber-200 text-amber-800"
                }`}>
                  {curr.cmsi >= 90 ? "CRITICAL FAULT" : "ELEVATED RISK"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {curr.rootCauses.map((rc, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${rc.crit ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200/70"}`}>
                    <div className={`font-bold text-[11px] uppercase font-sans ${rc.crit ? "text-red-700" : "text-slate-800"}`}>
                      {rc.title}
                    </div>
                    <div className="text-slate-800 mt-1 font-medium">{rc.val}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{rc.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptive Engineering Directives */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 font-sans text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-600" />
                  Prescriptive Operational Directives ({curr.id})
                </span>
                <span className="text-[10px] text-slate-500 font-sans">3 Immediate Actions</span>
              </div>

              <div className="space-y-2 text-xs">
                {curr.directives.map((dir) => (
                  <div key={dir.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-sans font-bold text-[10px] flex items-center justify-center border border-orange-200">
                        {dir.id}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{dir.title}</div>
                        <div className="text-[11px] text-slate-500">{dir.desc}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded border ${
                      dir.role === "Operator" 
                        ? "bg-blue-50 border-blue-200 text-blue-700" 
                        : dir.role === "Maintenance"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-purple-50 border-purple-200 text-purple-700"
                    }`}>
                      {dir.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-sans text-xs">
                <button
                  onClick={() => openWorkOrder(curr.id)}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Dispatch Work Order ({curr.id})
                </button>

                <button
                  onClick={() => alert(`Telemetry Report for ${curr.id} exported successfully!`)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition border border-slate-200/70 cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Export Telemetry Report
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Oscilloscope & Live Gauges */}
          <div className="xl:col-span-5 space-y-5">
            {/* Oscilloscope */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] font-sans text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                <div>
                  <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${curr.cmsi >= 90 ? "text-red-600" : "text-amber-600"}`} />
                    Acoustic FFT Spectrum
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{curr.transducer}</div>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  curr.cmsi >= 90 ? "bg-red-100 border-red-200 text-red-700" : "bg-amber-100 border-amber-200 text-amber-800"
                }`}>
                  {curr.peakHz}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] text-slate-500">
                  BANDWIDTH: 0 - 200 Hz
                </div>
                
                <svg viewBox="0 0 380 150" className="w-full h-40">
                  <defs>
                    <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={curr.cmsi >= 90 ? "#EF4444" : "#F59E0B"} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={curr.cmsi >= 90 ? "#EF4444" : "#F59E0B"} stopOpacity="0.0" />
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

                  {/* Harmonic Spike */}
                  <path
                    d={curr.spikePath}
                    fill="url(#specGrad)"
                  />
                  <path
                    d={curr.spikePath}
                    fill="none"
                    stroke={curr.cmsi >= 90 ? "#EF4444" : "#F59E0B"}
                    strokeWidth="2.5"
                  />

                  <circle cx={curr.spikeX} cy={curr.spikeY} r="4" fill={curr.cmsi >= 90 ? "#EF4444" : "#F59E0B"} />
                  <circle cx={curr.spikeX} cy={curr.spikeY} r="8" fill="none" stroke={curr.cmsi >= 90 ? "#EF4444" : "#F59E0B"} strokeWidth="1.5" className="animate-ping" />
                  <text x={curr.spikeX - 45} y={curr.spikeY - 8} fill={curr.cmsi >= 90 ? "#DC2626" : "#D97706"} fontSize="10" fontWeight="bold" fontFamily="Poppins, Montserrat, sans-serif">
                    {curr.fftPeakText}
                  </text>
                </svg>

                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0 Hz</span>
                  <span>50 Hz</span>
                  <span>100 Hz</span>
                  <span>150 Hz</span>
                  <span>200 Hz</span>
                </div>
              </div>
            </div>

            {/* Live Sensor Stream Gauges */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] font-sans text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Live Sensor Stream ({curr.id})
                </span>
                <span className="text-emerald-700 text-[10px] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {curr.isLive ? "Live 100Hz Ingest" : "Calibrated Sim"}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Pressure Gauge */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Hydraulic Relief Pressure</span>
                    <span className={curr.hydraulicPressure >= 30 ? "text-red-600" : "text-slate-900"}>
                      {curr.hydraulicPressure} MPa ({curr.pressureLimitPct}% of Relief Limit)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${curr.hydraulicPressure >= 30 ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${Math.min(100, curr.pressureLimitPct)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Manifold Temp */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Manifold Oil Temperature</span>
                    <span className={curr.manifoldTemp >= 85 ? "text-amber-700" : "text-slate-900"}>
                      {curr.manifoldTemp}°C (Safe Limit: 85°C)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${curr.manifoldTemp >= 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, (curr.manifoldTemp / 120) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Kinematics */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 mt-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">IMU Kinematics Readout</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Boom</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.boom}°</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Arm</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.arm}m</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Bucket</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.bucket}°</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Slew</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.slew} rpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Anomaly Event Feed */
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans text-xs">
          <div className="p-5 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Fleet Anomaly Event Feed
              </h2>
              <div className="text-xs text-slate-500 font-sans mt-0.5">
                Real-time chronological sensor triggers & diagnostic incidents
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
              <button
                onClick={() => setEventFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "all" ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] border border-slate-200/70" : "text-slate-500 hover:text-slate-800"
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
              <thead className="bg-slate-100 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
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

                    <td className="py-4 px-6 font-sans text-[11px] text-slate-500">
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
                          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition shadow-md shadow-orange-500/20 cursor-pointer inline-flex items-center gap-1.5 text-xs"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          Work Order
                        </button>
                      ) : (
                        <button
                          onClick={() => openWorkOrder(log.unit)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200/70 transition cursor-pointer inline-flex items-center gap-1.5 text-xs"
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
