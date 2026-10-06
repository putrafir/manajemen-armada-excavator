"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  HardHat,
  HeartPulse,
  ShieldAlert,
  Wrench,
  Radio,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from "lucide-react";
import WorkOrderModal from "@/components/WorkOrderModal";
import CopilotAgentModal from "@/components/CopilotAgentModal";
import { Sparkles } from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Dashboard() {
  const { telemetry, isStreaming, pitScope, setPitScope } = useTelemetry();
  const [modalOpen, setModalOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [targetUnit, setTargetUnit] = useState("EX-04");
  const [copilotPrefill, setCopilotPrefill] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customAssetCount, setCustomAssetCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("terracortex_registered_assets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomAssetCount(parsed.length);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openWorkOrder = (unitId: string) => {
    setTargetUnit(unitId);
    setModalOpen(true);
  };

  const ex04 = telemetry?.units["EX-04"];
  const ex04Cmsi = ex04?.cmsi ?? 94.0;
  const ex04Pressure = ex04?.hydraulic_pressure_mpa ?? 34.8;
  const isEx04Critical = ex04?.status === "CRITICAL" || ex04Cmsi >= 80;

  interface QueueRow {
    id: string;
    pitId: "pit-4" | "pit-2" | "pit-1" | "pit-3";
    pitLabel: string;
    isLiveSimulation?: boolean;
    model: string;
    operator: string;
    cmsi: number;
    primaryAnomaly: string;
    anomalyDetail: string;
    hours: string;
    isCritical: boolean;
    dotColor: string;
  }

  const rawQueue: QueueRow[] = [
    {
      id: "EX-04",
      pitId: "pit-4",
      pitLabel: "Pit 4 Floor (-140m RL)",
      isLiveSimulation: true,
      model: "XCMG XE4000 Mining Shovel",
      operator: "M. Kowalski",
      cmsi: ex04Cmsi,
      primaryAnomaly: isEx04Critical
        ? "Hydraulic Cavitation Anomaly"
        : ex04Cmsi >= 70
          ? "Elevated Hydraulic Load"
          : "Normal Operating Envelope",
      anomalyDetail: ex04?.anomaly_detail || (isEx04Critical ? `Relief pressure spike (${ex04Pressure} MPa)` : `Nominal line pressure (${ex04Pressure} MPa)`),
      hours: "4,210",
      isCritical: isEx04Critical,
      dotColor: isEx04Critical ? "bg-red-500" : ex04Cmsi >= 70 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      id: "EX-08",
      pitId: "pit-4",
      pitLabel: "Pit 4 Waste Dump (-60m RL)",
      model: "XCMG XE1250 Mining Excavator",
      operator: "S. Tanaka",
      cmsi: 76.2,
      primaryAnomaly: "Oil Cooler Radiator Dust Load",
      anomalyDetail: "Thermal excursion 88.2°C at dump",
      hours: "8,920",
      isCritical: false,
      dotColor: "bg-amber-500",
    },
    {
      id: "EX-12",
      pitId: "pit-2",
      pitLabel: "Pit 2 West Bench (-45m RL)",
      model: "XCMG XE7000 Mining Excavator",
      operator: "R. Chen",
      cmsi: 83.1,
      primaryAnomaly: "Slew Bearing Harmonic Spike",
      anomalyDetail: "Vibration peak 4.2 kHz harmonic",
      hours: "6,840",
      isCritical: false,
      dotColor: "bg-amber-500",
    },
    {
      id: "EX-17",
      pitId: "pit-2",
      pitLabel: "Pit 2 Deep Sump (-45m RL)",
      model: "XCMG XE4000 Mining Shovel",
      operator: "A. Weber",
      cmsi: 92.4,
      primaryAnomaly: "Main Relief Valve Flutter",
      anomalyDetail: "155 Hz acoustic valve resonance",
      hours: "3,890",
      isCritical: true,
      dotColor: "bg-red-500",
    },
    {
      id: "EX-27",
      pitId: "pit-1",
      pitLabel: "Pit 1 North Cut (+80m RL)",
      model: "XCMG XE2000 Mining Excavator",
      operator: "J. Botha",
      cmsi: 79.4,
      primaryAnomaly: "Cylinder Flow Bypass Alert",
      anomalyDetail: "Internal leakage flow 12.4 L/min",
      hours: "5,110",
      isCritical: false,
      dotColor: "bg-amber-500",
    },
    {
      id: "EX-31",
      pitId: "pit-1",
      pitLabel: "Pit 1 South Cut (+80m RL)",
      model: "XCMG XE700D Heavy Excavator",
      operator: "K. Mensah",
      cmsi: 38.6,
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "1,140",
      isCritical: false,
      dotColor: "bg-emerald-500",
    },
    {
      id: "EX-33",
      pitId: "pit-3",
      pitLabel: "Pit 3 East Highwall (-210m RL)",
      model: "XCMG XE7000 Mining Excavator",
      operator: "P. Santos",
      cmsi: 91.0,
      primaryAnomaly: "Slew Pinion Gearbox Shock",
      anomalyDetail: "138 Hz harmonic pinion contact shock",
      hours: "5,120",
      isCritical: true,
      dotColor: "bg-red-500",
    },
    {
      id: "EX-19",
      pitId: "pit-3",
      pitLabel: "Pit 3 Overburden (-210m RL)",
      model: "XCMG XE950G Heavy Excavator",
      operator: "D. Vance",
      cmsi: 44.0,
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "2,350",
      isCritical: false,
      dotColor: "bg-emerald-500",
    },
  ];

  // Scope filtering & Auto-sort queue by CMSI descending
  const scopedRaw = pitScope === "ALL" 
    ? rawQueue 
    : rawQueue.filter(u => u.pitId === pitScope);

  const queueData = [...scopedRaw].sort((a, b) => b.cmsi - a.cmsi).map((item, idx) => ({
    ...item,
    rank: `#0${idx + 1}`
  }));

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-sans font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <span>OPERATIONS DISPATCH &bull; SEVERITY-WEIGHTED QUEUE</span>
            {pitScope !== "ALL" && (
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold">
                Scoped to {pitScope.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {pitScope === "ALL" ? "Site-Wide Fleet Overview & Priority Queue" : `Pit ${pitScope.replace("pit-", "")} Operations & Priority Queue`}
          </h1>
          <div className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-2">
            <span>{pitScope === "ALL" ? "Global Fleet Monitoring (52 Units across 4 Pits)" : `Focused Pit Domain • Managed by Sector Foreman`}</span>
            {pitScope !== "ALL" && (
              <button 
                onClick={() => setPitScope("ALL")}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                (Reset to Site-Wide &rarr;)
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans font-bold flex items-center gap-1.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Live Telemetry: {ex04Pressure} MPa
          </span>
        </div>
      </div>

      {/* 2. 4 Clean HUD Metric Cards with prominent icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Fleet */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fleet</span>
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
              <HardHat className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            48 <span className="text-sm text-slate-400 font-normal">/ 52 units</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            92.3% Nominal Utilization
          </div>
        </div>

        {/* Fleet Health */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Health</span>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <HeartPulse className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {isEx04Critical ? "84.2" : "88.4"} <span className="text-sm text-slate-400 font-normal">/ 100</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">Target baseline: 85.0+ index</div>
        </div>

        {/* Active Anomalies */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Anomalies</span>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[1.85]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {isEx04Critical ? "14" : "12"}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${isEx04Critical ? "text-rose-700 bg-rose-50 border-rose-200/70" : "text-slate-600 bg-slate-100 border-slate-200/70"
              }`}>
              {isEx04Critical ? "2 Critical" : "1 Critical"}
            </span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-amber-200/70">
              5 Elevated
            </span>
          </div>
        </div>

        {/* Dynamic Critical Hold / Live Status Card */}
        {isEx04Critical ? (
          <div className="bg-rose-50/70 border border-rose-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Critical Alert</span>
              <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                <ShieldAlert className="w-6 h-6 stroke-[1.85]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-900 tracking-tight">EX-04</div>
            <div className="text-xs text-rose-700 font-medium mt-2 line-clamp-1">
              {ex04?.anomaly_detail || "Cavitation risk (<48h RUL)"}
            </div>
            <div className="mt-4 pt-4 border-t border-rose-200/50 flex items-center justify-between">
              <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">AI Copilot</span>
              <button onClick={() => {setTargetUnit("EX-04"); setCopilotOpen(true);}} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold shadow-md hover:from-indigo-500 hover:to-purple-500 transition cursor-pointer">
                <Sparkles className="w-3.5 h-3.5" /> Ask Copilot
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Live Telemetry</span>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <HeartPulse className="w-6 h-6 stroke-[1.85]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 tracking-tight">EX-04 (OK)</div>
            <div className="text-xs text-emerald-700 font-medium mt-2">
              {ex04Pressure} MPa &bull; Normal Envelope
            </div>
          </div>
        )}
      </div>

      {/* 3. Priority Maintenance Queue Table */}
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans text-xs">
        <div className="p-5 border-b border-slate-200/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Priority Maintenance Queue
            </h2>
            <div className="text-xs text-slate-500 font-sans mt-0.5">
              Ranked dynamically by Live CMSI Score
            </div>
          </div>
          <span className="text-[10px] font-sans text-slate-500">
            Auto-sorts by Real-time Sensor Stress
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="bg-slate-50 text-[10px] text-slate-600 uppercase tracking-wider border-b border-slate-200/70">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Machine</th>
                <th className="py-3.5 px-6">Pit Sector</th>
                <th className="py-3.5 px-6">CMSI Score</th>
                <th className="py-3.5 px-6">Primary Anomaly</th>
                <th className="py-3.5 px-6">Hours</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  {/* Rank */}
                  <td className="py-4 px-6 font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${row.dotColor}`}></span>
                      <span>{row.rank}</span>
                    </div>
                  </td>

                  {/* Machine */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-sans text-sm">{row.id}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{row.model} • {row.operator}</div>
                  </td>

                  {/* Pit Sector */}
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                      {row.pitLabel}
                    </span>
                  </td>

                  {/* CMSI */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-bold text-sm w-10 ${row.cmsi >= 90 ? "text-red-600" : row.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"
                        }`}>
                        {row.cmsi}
                      </span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${row.cmsi >= 90 ? "bg-red-500" : row.cmsi >= 70 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          style={{ width: `${Math.min(100, row.cmsi)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Anomaly */}
                  <td className="py-4 px-6 font-sans">
                    <div className="font-semibold text-slate-900">{row.primaryAnomaly}</div>
                    <div className="text-[11px] text-slate-500 font-sans mt-0.5">{row.anomalyDetail}</div>
                  </td>

                  {/* Hours */}
                  <td className="py-4 px-6 text-slate-500">
                    {row.hours}h
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right font-sans">
                    {row.cmsi >= 70 ? (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/diagnostics?unit=${row.id}`}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition shadow-md shadow-orange-500/20 cursor-pointer inline-flex items-center gap-1.5 text-xs"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          Investigate
                        </Link>
                        <button
                          onClick={() => {setTargetUnit(row.id); setCopilotOpen(true);}}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition cursor-pointer inline-flex items-center gap-1.5 text-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Copilot
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Nominal Cycle
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Order Modal */}

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-slideUp">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Work Order Published</div>
            <div className="text-slate-300 text-[11px] mt-0.5">{toastMessage}</div>
          </div>
          <Link
            href="/analytics"
            className="ml-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-[11px] transition"
          >
            Open Inbox &rarr;
          </Link>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-1">✕</button>
        </div>
      )}

      {/* Copilot Modal */}
      <CopilotAgentModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        unitId={targetUnit}
        onApprove={(action, payload) => {
          if (action === "AUTO_DISPATCHED") {
            setToastMessage(`Copilot auto-dispatched official Work Order for ${targetUnit}!`);
            setTimeout(() => setToastMessage(null), 6000);
          } else if (action === "EDIT_MANUAL") {
            setCopilotPrefill(payload);
            setModalOpen(true);
          }
        }}
      />
      
      <WorkOrderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCopilotPrefill(null);
        }}
        unitId={targetUnit}
        initialValues={copilotPrefill || undefined}
      />
    </div>
  );
}
