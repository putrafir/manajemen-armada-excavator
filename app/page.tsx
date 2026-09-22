"use client";

import React from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  HardHat, 
  HeartPulse, 
  Radio, 
  ShieldAlert, 
  SlidersHorizontal, 
  TrendingDown, 
  TrendingUp, 
  Wrench,
  ChevronRight,
  Zap,
  Activity
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function Dashboard() {
  const { telemetry } = useTelemetry();

  const queueData = [
    {
      rank: "#01",
      dotColor: "bg-red-500 shadow-sm shadow-red-500",
      id: "EX-04",
      model: "CAT 6040 FS",
      operator: "M. Kowalski",
      cmsi: 94.0,
      primaryAnomaly: "Critical Cavitation Anomaly",
      anomalyDetail: "Pump #2 differential spike (+34 bar)",
      anomalyColor: "text-red-400 bg-red-950/40 border border-red-500/30",
      hours: "4,210",
      actionType: "primary",
      actionLabel: "Work Order",
    },
    {
      rank: "#02",
      dotColor: "bg-amber-500 shadow-sm shadow-amber-500",
      id: "EX-12",
      model: "Komatsu PC8000-11",
      operator: "R. Chen",
      cmsi: 83.1,
      primaryAnomaly: "High Slew Bearing Spike",
      anomalyDetail: "Vibration harmonic 4.2 kHz harmonic",
      anomalyColor: "text-amber-400 bg-amber-950/40 border border-amber-500/30",
      hours: "6,840",
      actionType: "secondary",
      actionLabel: "Work Order",
    },
    {
      rank: "#03",
      dotColor: "bg-amber-500 shadow-sm shadow-amber-500",
      id: "EX-27",
      model: "Hitachi EX5600-7",
      operator: "J. Botha",
      cmsi: 79.4,
      primaryAnomaly: "Cylinder Seal Bypass",
      anomalyDetail: "Flow bypass detected on boom descent",
      anomalyColor: "text-amber-400 bg-amber-950/40 border border-amber-500/30",
      hours: "5,110",
      actionType: "secondary",
      actionLabel: "Work Order",
    },
    {
      rank: "#04",
      dotColor: "bg-emerald-500",
      id: "EX-08",
      model: "CAT 6060",
      operator: "S. Tanaka",
      cmsi: 58.2,
      primaryAnomaly: "Elevated Hydraulic Temp",
      anomalyDetail: "Heat exchanger efficiency down 8%",
      anomalyColor: "text-slate-400 bg-slate-800/40 border border-white/5",
      hours: "8,920",
      actionType: "secondary",
      actionLabel: "Schedule",
    },
    {
      rank: "#05",
      dotColor: "bg-emerald-500",
      id: "EX-19",
      model: "Liebherr R9800",
      operator: "D. Vance",
      cmsi: 44.0,
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      anomalyColor: "text-slate-400 bg-slate-800/40 border border-white/5",
      hours: "2,350",
      actionType: "secondary",
      actionLabel: "Monitor",
    },
    {
      rank: "#06",
      dotColor: "bg-emerald-500",
      id: "EX-31",
      model: "Komatsu PC4000-11",
      operator: "K. Mensah",
      cmsi: 38.6,
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      anomalyColor: "text-slate-400 bg-slate-800/40 border border-white/5",
      hours: "1,140",
      actionType: "secondary",
      actionLabel: "Monitor",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* Shift & Operations Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>OPEN-CAST TELEMETRY NODE</span>
            <span>•</span>
            <span className="text-orange-400 font-bold">SECTOR 4 NORTH BENCH</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Northern Pit Sector 4 Operations Overview
          </h1>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
              Shift B • Night Crew
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
              Class: Ultra 400t+ Shovels
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <Link
            href="/diagnostics"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-950/40 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            Neural Diagnostics
          </Link>
          <button className="px-4 py-2 bg-[#131D30] hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition border border-white/5 flex items-center gap-2 cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Shift Report
          </button>
        </div>
      </div>

      {/* 4 HUD Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Metric 1 */}
        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">TOTAL ACTIVE FLEET</span>
            <HardHat className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">48</span>
            <span className="text-slate-500 text-sm font-semibold">/ 52 Units</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <span>Utilization: 92.3%</span>
            <span className="text-[10px] text-emerald-500">↑ +4.1%</span>
          </div>
          {/* Subtle sparkline */}
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Private LTE Mesh</span>
            <span className="text-cyan-400">100% Synced</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">FLEET HEALTH SCORE</span>
            <HeartPulse className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">88.4</span>
            <span className="text-slate-500 text-sm">/ 100</span>
          </div>
          <div className="text-xs text-amber-400 font-semibold mt-2 flex items-center gap-1">
            <span>Composite CMSI</span>
            <span className="text-[10px] text-amber-400">↓ -1.8 pts</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full" style={{ width: "88.4%" }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">ACTIVE ANOMALIES</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">14</span>
            <span className="text-slate-500 text-sm font-semibold">Detected</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400">2 Crit</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">5 High</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">7 Mod</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-gradient-to-br from-red-950/30 to-[#0F1626] border border-red-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-red-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">IMMEDIATE ESCALATION</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-400">3</span>
            <span className="text-slate-400 text-sm font-semibold">Intervention Units</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
            <Link href="/diagnostics" className="px-2 py-0.5 rounded bg-red-900/60 border border-red-500/40 text-red-200 hover:bg-red-800 transition">
              EX-04
            </Link>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">EX-12</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">EX-27</span>
          </div>
          <div className="text-[10px] text-red-400 font-sans mt-2">
            ● Maintenance hold requested for EX-04
          </div>
        </div>
      </div>

      {/* Priority Maintenance Queue Table (Severity-Weighted CMSI) */}
      <div className="bg-[#0F1626] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Priority Maintenance Queue
              </h2>
              <span className="px-2.5 py-0.5 rounded bg-orange-950/60 border border-orange-500/40 text-orange-400 text-[10px] font-bold">
                Severity-Weighted CMSI Ranking
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Urutan pemeliharaan berbasis akumulasi stres hidrolik aktual & resistansi batuan (S_index), bukan sekadar jam kerja mesin biasa.
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-black/30 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            <span>Sort: Highest Machine Stress Index</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B111C]/80 font-mono text-[11px] text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Rank</th>
                <th className="py-3.5 px-6 font-semibold">Machine / Class</th>
                <th className="py-3.5 px-6 font-semibold">CMSI Score</th>
                <th className="py-3.5 px-6 font-semibold">Primary Anomaly Signature</th>
                <th className="py-3.5 px-6 font-semibold">Engine Hours</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {queueData.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition">
                  {/* Rank */}
                  <td className="py-4 px-6 font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${row.dotColor}`}></span>
                      <span className="text-slate-200">{row.rank}</span>
                    </div>
                  </td>

                  {/* Machine & Operator */}
                  <td className="py-4 px-6">
                    <Link href={`/fleet-map?unit=${row.id}`} className="hover:text-orange-400 transition">
                      <div className="font-bold text-white text-sm">{row.id}</div>
                      <div className="text-slate-500 text-[11px]">
                        {row.model} • Op: {row.operator}
                      </div>
                    </Link>
                  </td>

                  {/* CMSI Score & Bar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className={`font-extrabold text-sm w-10 ${
                        row.cmsi >= 90 ? "text-red-400" : row.cmsi >= 75 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {row.cmsi}
                      </span>
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.cmsi >= 90 ? "bg-red-500" : row.cmsi >= 75 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${row.cmsi}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Primary Anomaly */}
                  <td className="py-4 px-6 font-sans">
                    <div className="font-semibold text-white">{row.primaryAnomaly}</div>
                    <div className={`text-[11px] font-mono px-2 py-0.5 rounded inline-block mt-1 ${row.anomalyColor}`}>
                      {row.anomalyDetail}
                    </div>
                  </td>

                  {/* Engine Hours */}
                  <td className="py-4 px-6 text-slate-400">
                    {row.hours} hrs
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-right">
                    {row.actionType === "primary" ? (
                      <Link
                        href="/diagnostics"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md shadow-orange-950/40 transition cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        {row.actionLabel}
                      </Link>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#131D30] hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-lg border border-white/5 transition cursor-pointer">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
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
