"use client";

import React from "react";
import Link from "next/link";
import { 
  Download, 
  FileText, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Clock,
  ShieldAlert,
  HardHat,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const queueData = [
    {
      rank: "#01",
      dotColor: "bg-red-500",
      id: "EX-04",
      model: "CAT 6040 FS",
      operator: "M. Kowalski",
      cmsi: 94.0,
      barColor: "bg-red-600",
      primaryAnomaly: "Critical Cavitation Anomaly",
      anomalyDetail: "Pump #2 differential spike (+34 bar)",
      anomalyColor: "text-red-600",
      hours: "4,210",
      actionType: "primary",
      actionLabel: "Work Order"
    },
    {
      rank: "#02",
      dotColor: "bg-amber-500",
      id: "EX-12",
      model: "Komatsu PC8000-11",
      operator: "R. Chen",
      cmsi: 83.1,
      barColor: "bg-amber-600",
      primaryAnomaly: "High Slew Bearing Spike",
      anomalyDetail: "Vibration harmonic 4.2 kHz harmonic",
      anomalyColor: "text-amber-700",
      hours: "6,840",
      actionType: "outline",
      actionLabel: "Work Order"
    },
    {
      rank: "#03",
      dotColor: "bg-amber-700",
      id: "EX-27",
      model: "Liebherr R 9800 G6",
      operator: "S. Ndlovu",
      cmsi: 79.4,
      barColor: "bg-amber-800",
      primaryAnomaly: "Boom Cylinder Leakage Decay",
      anomalyDetail: "Seal pressure decay rate -1.2 bar/min",
      anomalyColor: "text-slate-600",
      hours: "5,120",
      actionType: "outline",
      actionLabel: "Diagnostics"
    },
    {
      rank: "#04",
      dotColor: "bg-slate-400",
      id: "EX-08",
      model: "Hitachi EX5600-7",
      operator: "T. Brennan",
      cmsi: 61.2,
      barColor: "bg-slate-500",
      primaryAnomaly: "Air Intake Delta Pressure",
      anomalyDetail: "Filter blockage index within 82% margin",
      anomalyColor: "text-slate-600",
      hours: "2,340",
      actionType: "outline",
      actionLabel: "Inspection"
    }
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* 1. Page Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            OPEN-CAST TELEMETRY NODE • WESTERN RIDGE BENCH
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Northern Pit Sector 4 Operations Overview
          </h1>
          <div className="flex items-center gap-2.5 mt-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 font-mono">
              • Shift B • Night Crew
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 font-mono">
              Class: Ultra 400t+
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition cursor-pointer">
            <FileText className="w-4 h-4 text-slate-500" />
            Shift Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E65100] hover:bg-[#D84315] rounded-lg shadow-sm shadow-orange-950/20 transition cursor-pointer">
            <Download className="w-4 h-4" />
            Export Telemetry
          </button>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Active Fleet */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Total Active Fleet
            </span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <HardHat className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">48</span>
              <span className="text-slate-400 font-bold text-lg">/ 52</span>
              <span className="text-xs text-slate-500 ml-1 font-mono">Units</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-1 font-mono">
              <span>Utilization: 92.3%</span>
              <span>↑+4.1%</span>
            </div>
          </div>
          {/* Sparkline Graphic */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full text-amber-700" viewBox="0 0 100 25" fill="none">
              <path
                d="M0 20 L20 18 L35 15 L50 19 L70 12 L85 14 L100 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Fleet Health Score */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Fleet Health Score
            </span>
            <span className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">88.4</span>
              <span className="text-slate-400 font-bold text-sm">/ 100</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span>Composite CMSI</span>
              <span className="text-amber-700 font-bold flex items-center">↓-1.8 pts</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-800 h-2 rounded-full" style={{ width: "88.4%" }}></div>
          </div>
        </div>

        {/* Card 3: Active Anomalies */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Active Anomalies
            </span>
            <span className="p-1.5 bg-red-50 text-red-600 rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">14</span>
              <span className="text-xs text-slate-500 font-mono">Detected</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">2 Crit</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">5 High</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">7 Mod</span>
            </div>
          </div>
          {/* Segmented Color Line */}
          <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-1">
            <div className="bg-red-600 w-1/4 rounded-full"></div>
            <div className="bg-amber-500 w-2/5 rounded-full"></div>
            <div className="bg-blue-300 w-1/3 rounded-full"></div>
          </div>
        </div>

        {/* Card 4: Immediate Escalation */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Immediate Escalation
            </span>
            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-md">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight text-orange-600">3</span>
              <span className="text-xs text-slate-600 font-mono font-bold">Intervention Units</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-xs font-bold">
              <span className="px-2 py-0.5 bg-orange-600 text-white rounded">EX-04</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-300">EX-12</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-300">EX-27</span>
            </div>
          </div>
          <div className="text-[11px] text-red-600 font-medium font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            Maintenance hold requested
          </div>
        </div>
      </div>

      {/* 3. Priority Maintenance Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Section */}
        <div className="p-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Priority Maintenance Queue
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-100 text-[#E65100] font-mono">
                Realtime Priority Ranking
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ranked by Critical Machine Stress Index (CMSI) variance against baseline hydraulic/kinematic envelopes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200/80 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-700 shrink-0 cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort: Highest Stress Index</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Rank</th>
                <th className="py-3.5 px-6 font-semibold">Machine / Class</th>
                <th className="py-3.5 px-6 font-semibold">CMSI Score</th>
                <th className="py-3.5 px-6 font-semibold">Primary Anomaly</th>
                <th className="py-3.5 px-6 font-semibold">Hours</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {queueData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  {/* Rank */}
                  <td className="py-4 px-6 font-mono font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.dotColor}`}></span>
                      <span>{row.rank}</span>
                    </div>
                  </td>

                  {/* Machine & Operator */}
                  <td className="py-4 px-6">
                    <Link href={`/fleet-map?unit=${row.id}`} className="hover:underline">
                      <div className="font-bold text-slate-900 text-sm">{row.id}</div>
                      <div className="text-slate-500 text-[11px] font-mono">
                        {row.model} • Op: {row.operator}
                      </div>
                    </Link>
                  </td>

                  {/* CMSI Score & Bar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-sm w-8">{row.cmsi}</span>
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.cmsi >= 90 ? "bg-red-500" : row.cmsi >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${row.cmsi}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Primary Anomaly */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{row.primaryAnomaly}</div>
                    <div className={`text-[11px] font-mono ${row.anomalyColor}`}>
                      {row.anomalyDetail}
                    </div>
                  </td>

                  {/* Engine Hours */}
                  <td className="py-4 px-6 font-mono text-slate-600 font-semibold">
                    {row.hours}
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-right">
                    {row.actionType === "primary" ? (
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold rounded-md shadow-xs transition cursor-pointer">
                        <Wrench className="w-3.5 h-3.5" />
                        {row.actionLabel}
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-md transition cursor-pointer">
                        <Activity className="w-3.5 h-3.5 text-slate-500" />
                        {row.actionLabel}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
