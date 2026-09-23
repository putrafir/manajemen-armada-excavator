"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  HardHat,
  HeartPulse,
  ShieldAlert,
  Wrench,
  Activity,
  ArrowRight
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import WorkOrderModal from "@/components/WorkOrderModal";

export default function Dashboard() {
  const { telemetry } = useTelemetry();
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUnit, setTargetUnit] = useState("EX-04");

  const openWorkOrder = (unitId: string) => {
    setTargetUnit(unitId);
    setModalOpen(true);
  };

  const ex04 = telemetry?.units["EX-04"];
  const ex04Cmsi = ex04?.cmsi ?? 94.0;
  const ex04Pressure = ex04?.hydraulic_pressure_mpa ?? 34.8;
  const isEx04Critical = ex04Cmsi >= 90;

  const rawQueue = [
    {
      id: "EX-04",
      isLiveSimulation: true,
      model: "CAT 6040 FS",
      operator: "M. Kowalski",
      cmsi: ex04Cmsi,
      primaryAnomaly: isEx04Critical ? "Hydraulic Cavitation Anomaly" : "Normal Operation Envelope",
      anomalyDetail: isEx04Critical ? `Relief pressure spike (${ex04Pressure} MPa)` : `Nominal line pressure (${ex04Pressure} MPa)`,
      hours: "4,210",
      isCritical: isEx04Critical,
      dotColor: isEx04Critical ? "bg-red-500" : ex04Cmsi >= 70 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      id: "EX-12",
      model: "Komatsu PC8000-11",
      operator: "R. Chen",
      cmsi: 83.1,
      primaryAnomaly: "Slew Bearing Harmonic Spike",
      anomalyDetail: "Vibration peak 4.2 kHz harmonic",
      hours: "6,840",
      isCritical: false,
      dotColor: "bg-amber-500",
    },
    {
      id: "EX-27",
      model: "Hitachi EX5600-7",
      operator: "J. Botha",
      cmsi: 79.4,
      primaryAnomaly: "Cylinder Seal Bypass",
      anomalyDetail: "Flow bypass on boom descent",
      hours: "5,110",
      isCritical: false,
      dotColor: "bg-amber-500",
    },
    {
      id: "EX-08",
      model: "CAT 6060",
      operator: "S. Tanaka",
      cmsi: 58.2,
      primaryAnomaly: "Hydraulic Thermal Drift",
      anomalyDetail: "Exchanger efficiency down 8%",
      hours: "8,920",
      isCritical: false,
      dotColor: "bg-emerald-500",
    },
    {
      id: "EX-19",
      model: "Liebherr R9800",
      operator: "D. Vance",
      cmsi: 44.0,
      primaryAnomaly: "Nominal Wear Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "2,350",
      isCritical: false,
      dotColor: "bg-emerald-500",
    },
    {
      id: "EX-31",
      model: "Komatsu PC4000-11",
      operator: "K. Mensah",
      cmsi: 38.6,
      primaryAnomaly: "Nominal Wear Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "1,140",
      isCritical: false,
      dotColor: "bg-emerald-500",
    },
  ];

  // Auto-sort queue by CMSI descending so highest stress machine always jumps to Rank #1
  const queueData = [...rawQueue].sort((a, b) => b.cmsi - a.cmsi).map((item, idx) => ({
    ...item,
    rank: `#0${idx + 1}`
  }));

  const dummyQueueUnused = [
    {
      rank: "#02",
      dotColor: "bg-amber-500",
      id: "EX-12",
      model: "Komatsu PC8000-11",
      operator: "R. Chen",
      cmsi: 83.1,
      primaryAnomaly: "Slew Bearing Harmonic Spike",
      anomalyDetail: "Vibration peak 4.2 kHz harmonic",
      hours: "6,840",
      isCritical: false,
    },
    {
      rank: "#03",
      dotColor: "bg-amber-500",
      id: "EX-27",
      model: "Hitachi EX5600-7",
      operator: "J. Botha",
      cmsi: 79.4,
      primaryAnomaly: "Cylinder Seal Bypass",
      anomalyDetail: "Flow bypass on boom descent",
      hours: "5,110",
      isCritical: false,
    },
    {
      rank: "#04",
      dotColor: "bg-emerald-500",
      id: "EX-08",
      model: "CAT 6060",
      operator: "S. Tanaka",
      cmsi: 58.2,
      primaryAnomaly: "Hydraulic Thermal Drift",
      anomalyDetail: "Exchanger efficiency down 8%",
      hours: "8,920",
      isCritical: false,
    },
    {
      rank: "#05",
      dotColor: "bg-emerald-500",
      id: "EX-19",
      model: "Liebherr R9800",
      operator: "D. Vance",
      cmsi: 44.0,
      primaryAnomaly: "Nominal Wear Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "2,350",
      isCritical: false,
    },
    {
      rank: "#06",
      dotColor: "bg-emerald-500",
      id: "EX-31",
      model: "Komatsu PC4000-11",
      operator: "K. Mensah",
      cmsi: 38.6,
      primaryAnomaly: "Nominal Wear Envelope",
      anomalyDetail: "Baseline operational wear",
      hours: "1,140",
      isCritical: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">
            SECTOR 4 NORTHERN PIT
          </div>
          <h1 className="text-xl font-black text-black tracking-tight mt-0.5">
            Operations Overview & Priority Queue
          </h1>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Active Fleet • Night Shift
          </div>
        </div>


      </div>

      {/* 2. 4 Clean HUD Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">ACTIVE FLEET</span>
            <HardHat className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">48 <span className="text-sm text-slate-500 font-normal">/ 52</span></div>
          <div className="text-xs text-emerald-400 font-semibold mt-2">92.3% Utilization (Nominal)</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">FLEET HEALTH</span>
            <HeartPulse className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">88.4 <span className="text-sm text-slate-500 font-normal">/ 100</span></div>
          <div className="text-xs text-slate-400 mt-2">Target benchmark: 85.0+</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">ACTIVE ANOMALIES</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">14</div>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-bold">
            <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">2 Critical</span>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">5 High</span>
          </div>
        </div>

        <div className="bg-red-50/60 border border-red-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-red-400 text-xs mb-1.5">
            <span className="text-[10px] uppercase font-bold text-red-400">CRITICAL HOLD</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400">EX-04</div>
          <div className="text-xs text-red-700 font-sans mt-2">Cavitation failure risk (&lt;48h RUL)</div>
        </div>
      </div>

      {/* 3. Priority Maintenance Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden font-mono text-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 font-sans">
              Priority Maintenance Queue
            </h2>
            <div className="text-xs text-slate-400 font-sans mt-0.5">
              Ranked by Dynamic CMSI Score
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="bg-slate-50 text-[10px] text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Machine</th>
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
                      {row.id === "EX-04" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200">
                          LIVE SENSOR
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px]">{row.model} • {row.operator}</div>
                  </td>

                  {/* CMSI */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-black text-sm w-10 ${row.cmsi >= 90 ? "text-red-400" : row.cmsi >= 75 ? "text-amber-400" : "text-emerald-400"
                        }`}>
                        {row.cmsi}
                      </span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.cmsi >= 90 ? "bg-red-500" : row.cmsi >= 75 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          style={{ width: `${row.cmsi}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Anomaly */}
                  <td className="py-4 px-6 font-sans">
                    <div className="font-semibold text-slate-900">{row.primaryAnomaly}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{row.anomalyDetail}</div>
                  </td>

                  {/* Hours */}
                  <td className="py-4 px-6 text-slate-400">
                    {row.hours}h
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right font-sans">
                    {row.isCritical ? (
                      <button
                        onClick={() => openWorkOrder(row.id)}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition shadow-md shadow-orange-950/40 cursor-pointer inline-flex items-center gap-1.5 text-xs"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Work Order
                      </button>
                    ) : (
                      <button
                        onClick={() => openWorkOrder(row.id)}
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

      {/* Work Order Modal */}
      <WorkOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        unitId={targetUnit}
      />
    </div>
  );
}
