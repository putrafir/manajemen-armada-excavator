"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Wrench, 
  FileText, 
  Share2, 
  Radio, 
  ChevronRight,
  Gauge,
  Sliders,
  Flame,
  Zap
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function DiagnosticsPage() {
  const { telemetry, isStreaming } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];
  const [activeUnit, setActiveUnit] = useState("EX-04");
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handleDispatch = () => {
    setDispatchStatus("Work Order #WO-8841 Dispatched to Field Technician Tablet");
    setTimeout(() => setDispatchStatus(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar: Target Unit & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1626] border border-white/5 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400">
                Root-Cause Operations Intelligence Console
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">
                Neural Fault Diagnostic & Prescriptive Reasoning
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-10">
            Multi-sensor signal extraction, rock strata contextualization, and deterministic root-cause breakdown.
          </p>
        </div>

        {/* Unit Selector Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveUnit("EX-04")}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-2 ${
              activeUnit === "EX-04"
                ? "bg-red-950/60 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <strong>EX-04</strong>
            <span className="text-[10px] text-red-400">Cavitation (CMSI 94)</span>
          </button>

          <button
            onClick={() => setActiveUnit("EX-12")}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-2 ${
              activeUnit === "EX-12"
                ? "bg-amber-950/60 border-amber-500 text-amber-200"
                : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong>EX-12</strong>
            <span className="text-[10px] text-amber-400">Slew Harmonic</span>
          </button>

          <button
            onClick={() => setActiveUnit("EX-27")}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-2 ${
              activeUnit === "EX-27"
                ? "bg-amber-950/60 border-amber-500 text-amber-200"
                : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong>EX-27</strong>
            <span className="text-[10px] text-amber-400">Seal Bypass</span>
          </button>
        </div>
      </div>

      {/* 2. Critical Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-[#0F1626] border border-white/5 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Target Asset</div>
          <div className="text-sm font-bold text-white mt-1">CAT 6040 FS</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sn: TC-8829-PX</div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Rock Strata (1D-CNN)</div>
          <div className="text-sm font-bold text-orange-400 mt-1">Batu (Hard Basalt)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">184 MPa (vs 144 MPa rating)</div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Anomaly Score (Autoenc)</div>
          <div className="text-sm font-bold text-red-400 mt-1">MSE 115.33</div>
          <div className="text-[10px] text-red-400/80 mt-0.5">380,000x over threshold</div>
        </div>

        <div className="bg-[#0F1626] border border-white/5 p-3.5 rounded-xl">
          <div className="text-[10px] text-slate-500 uppercase">Accelerated Wear</div>
          <div className="text-sm font-bold text-red-500 mt-1">3.4x Velocity</div>
          <div className="text-[10px] text-slate-400 mt-0.5">+1,640 hrs OEM Delta</div>
        </div>

        <div className="bg-red-950/40 border border-red-500/40 p-3.5 rounded-xl col-span-2 lg:col-span-1">
          <div className="text-[10px] text-red-400 uppercase font-bold">Remaining Useful Life (RUL)</div>
          <div className="text-lg font-black text-red-200 mt-0.5">48 Operating Hrs</div>
          <div className="text-[10px] text-red-300/80 mt-0.5 font-sans font-semibold">Immediate Servicing Required</div>
        </div>
      </div>

      {/* 3. Main Split View: Inference Chain & Diagnostics vs Telemetry Instrumentation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (7 Cols): Neural Inference Chain & Prescriptive Directives */}
        <div className="xl:col-span-7 space-y-5">
          {/* Section A: Multi-Stage Neural Reasoning Pipeline */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                Deterministic AI Reasoning Pipeline
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                Inferensi Latency: 1.63 ms (Passed)
              </span>
            </div>

            {/* 4 Pipeline Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="bg-[#131D30] border border-white/5 p-4 rounded-xl relative">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>STAGE 01</span>
                  <span className="text-cyan-400">100 Hz Ingestion</span>
                </div>
                <div className="font-bold text-white text-sm">Sensor Signal Extraction</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                  Pressure transducer membaca lonjakan katup 35.2 MPa pada frekuensi 100 Hz, disinkronkan dengan getaran sasis 4.2 m/s² dari IMU.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#131D30] border border-white/5 p-4 rounded-xl relative">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>STAGE 02</span>
                  <span className="text-orange-400">1D-CNN + Bi-LSTM</span>
                </div>
                <div className="font-bold text-white text-sm">Lithological Strata Model</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                  Model mendeteksi pola penetrasi batuan keras (Hard Basalt, W_strata = 4.0) dengan akurasi 100% dan resistansi 184 MPa.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#131D30] border border-red-500/30 p-4 rounded-xl relative bg-gradient-to-br from-red-950/20 to-transparent">
                <div className="flex items-center justify-between text-[10px] text-red-400 mb-1">
                  <span>STAGE 03</span>
                  <span className="text-red-400 font-bold">Unsupervised Autoencoder</span>
                </div>
                <div className="font-bold text-red-200 text-sm">Hydraulic Anomaly Detection</div>
                <p className="text-[11px] text-slate-300 font-sans mt-1.5 leading-relaxed">
                  Reconstruction error melonjak drastis (MSE 115.33 vs ambang τ 0.0014). Sinyal anomali kavitasi fluida pompa #2 terkonfirmasi.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#131D30] border border-red-500/40 p-4 rounded-xl relative bg-gradient-to-br from-orange-950/20 to-transparent">
                <div className="flex items-center justify-between text-[10px] text-orange-400 mb-1">
                  <span>STAGE 04</span>
                  <span className="text-orange-400 font-bold">Contextual Stress Index</span>
                </div>
                <div className="font-bold text-orange-200 text-sm">CMSI Score: 94 / 100</div>
                <p className="text-[11px] text-slate-300 font-sans mt-1.5 leading-relaxed">
                  Stres nyata mesin melompat ke ranking #1 antrean servis tambang. Tingkat kerusakan akumulatif 3.4x lebih cepat dibanding estimasi OEM.
                </p>
              </div>
            </div>
          </div>

          {/* Section B: Root-Cause Mechanical Explanation */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-6 shadow-lg space-y-3 font-sans">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Root-Cause Mechanical Analysis
            </h3>
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-200 leading-relaxed">
              <p className="font-medium">
                Unit <strong>EX-04</strong> saat ini beroperasi di lapisan batuan basalt keras (Sector 4 North Bench, elevasi -140m). Tekanan kompresi batuan riil sebesar <strong>184 MPa</strong> (28% melampaui batas desain spesifikasi 144 MPa). 
              </p>
              <p className="mt-2 text-slate-300">
                Benturan berulang memicu lonjakan gaya breakout galian yang menyebabkan gelembung uap hidrolik pecah (kavitasi kavitasi frekuensi 142 Hz) pada katup distributor pompa utama. Jika dibiarkan beroperasi tanpa penyesuaian sudut gali dan derating katup relief, seal hidrolik diproyeksikan pecah dalam waktu kurang dari <strong>48 jam operasional</strong>.
              </p>
            </div>
          </div>

          {/* Section C: Prescriptive Operational Directives */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-6 shadow-lg space-y-4 font-sans">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              Prescriptive Engineering Directives (Operational Action)
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#131D30] border border-white/5">
                <span className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                  01
                </span>
                <div>
                  <div className="font-bold text-white">Batasi Sudut Breakout Bucket ke ≤ 38°</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Mencegah katup relief melepaskan oli bertekanan ekstrem yang memicu kavitasi dan pemanasan oli di atas 90°C.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#131D30] border border-white/5">
                <span className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                  02
                </span>
                <div>
                  <div className="font-bold text-white">Derating Tekanan Katup Relief Utama sebesar -12%</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Instruksikan tim mekanik untuk menurunkan ambang batas relief valve dari 350 bar ke 310 bar pada shift pergantian malam.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#131D30] border border-white/5">
                <span className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                  03
                </span>
                <div>
                  <div className="font-bold text-white">Rerouting Armada: Geser EX-04 ke Bench Batupasir Lunak</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Pindahkan unit EX-04 ke Sector 2 Soft Shale Bench (kekerasan 74 MPa) untuk mereduksi laju keausan sebesar 65%. Tugaskan dozer ripper terlebih dahulu untuk memecah basalt.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDispatch}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-950/40 cursor-pointer flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                Dispatch Work Order #WO-8841
              </button>

              <button className="px-4 py-2.5 bg-[#131D30] hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition border border-white/5 cursor-pointer flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Export Telemetry Report (PDF)
              </button>
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {dispatchStatus}
              </div>
            )}
          </div>
        </div>

        {/* Right (5 Cols): Live Waveform Oscilloscope & Multi-Sensor Instrumentation */}
        <div className="xl:col-span-5 space-y-5">
          {/* Waveform Card: Acoustic FFT Cavitation Spectrum */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-lg font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div>
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400" />
                  Acoustic FFT Spectrum (Live Sensor)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Transducer HYD-04B-ACC (Fluid Manifold)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-950/70 border border-red-500/40 text-red-400 text-[10px] font-bold">
                Peak: 142 Hz
              </span>
            </div>

            {/* Glowing SVG Oscilloscope */}
            <div className="bg-[#080C14] border border-white/5 rounded-xl p-3 relative overflow-hidden">
              <div className="absolute top-2 right-3 text-[10px] text-slate-500">
                BANDWIDTH: 0 - 200 Hz
              </div>
              
              <svg viewBox="0 0 380 150" className="w-full h-40">
                <defs>
                  <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background Grid */}
                <line x1="0" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="380" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="100" y1="0" x2="100" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="200" y1="0" x2="200" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="300" y1="0" x2="300" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Normal Baseline Wave (Green subtle dashed) */}
                <path
                  d="M 10,130 Q 80,120 150,125 T 270,128 T 370,132"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />

                {/* Cavitation Spike Curve with Glow Area */}
                <path
                  d="M 10,135 Q 90,130 180,125 L 240,120 L 265,22 L 290,122 L 340,128 L 370,135"
                  fill="url(#spectrumGradient)"
                />
                <path
                  d="M 10,135 Q 90,130 180,125 L 240,120 L 265,22 L 290,122 L 340,128 L 370,135"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />

                {/* Harmonic Marker Tag */}
                <circle cx="265" cy="22" r="4" fill="#EF4444" />
                <circle cx="265" cy="22" r="8" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" />
                <text x="220" y="16" fill="#F87171" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  142 Hz (Cavitation Critical)
                </text>
              </svg>

              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 Hz</span>
                <span>50 Hz</span>
                <span>100 Hz</span>
                <span className="text-red-400 font-bold">142 Hz</span>
                <span>200 Hz</span>
              </div>
            </div>
          </div>

          {/* Real-Time Sensor Telemetry Gauges */}
          <div className="bg-[#0F1626] border border-white/5 rounded-2xl p-5 shadow-lg font-mono text-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs">
                EX-04 Telemetry Instrumentation
              </span>
              <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STREAM 100Hz
              </span>
            </div>

            {/* Pressure Gauge */}
            <div className="p-3.5 rounded-xl bg-[#131D30] border border-white/5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-400 text-[11px]">HYDRAULIC RELIEF PRESSURE</span>
                <span className="text-base font-black text-red-400">
                  {ex04?.hydraulic_pressure_mpa ?? 34.8} MPa
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, ((ex04?.hydraulic_pressure_mpa ?? 34.8) / 37.0) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Nominal: 28.0 MPa</span>
                <span className="text-red-400 font-bold">94% of Relief Limit</span>
              </div>
            </div>

            {/* Temperature Gauge */}
            <div className="p-3.5 rounded-xl bg-[#131D30] border border-white/5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-400 text-[11px]">MANIFOLD FLUID OIL TEMP</span>
                <span className="text-base font-black text-amber-400">
                  {ex04?.manifold_temp_c ?? 96.4} °C
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, ((ex04?.manifold_temp_c ?? 96.4) / 110.0) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Max Safe: 85.0 °C</span>
                <span className="text-amber-400 font-bold">Thermal Envelope High</span>
              </div>
            </div>

            {/* Kinematics Grid */}
            <div className="p-3.5 rounded-xl bg-[#131D30] border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Kinematics Joint Tolerances (IMU)</div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-500">Boom</div>
                  <div className="font-bold text-white text-sm mt-0.5">{ex04?.kinematics.boom_angle ?? 34.8}°</div>
                </div>
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-500">Arm</div>
                  <div className="font-bold text-white text-sm mt-0.5">{ex04?.kinematics.arm_reach ?? 9.2}m</div>
                </div>
                <div className="bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                  <div className="text-[10px] text-red-400 font-bold">Bucket</div>
                  <div className="font-bold text-red-300 text-sm mt-0.5">{ex04?.kinematics.bucket_angle ?? 91.4}°</div>
                </div>
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-500">Slew</div>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">{ex04?.kinematics.slew_speed ?? 8.2} rpm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
