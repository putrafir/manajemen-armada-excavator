"use client";

import React, { useState } from "react";
import { useTelemetry } from "@/context/TelemetryContext";
import { 
  Bot, 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Zap, 
  Sliders, 
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function CopilotPage() {
  const { telemetry } = useTelemetry();
  const ex04 = telemetry?.units["EX-04"];
  const [messages, setMessages] = useState([
    {
      role: "user",
      sender: "Dispatch Chief • 14:02 AWST",
      text: "Why does EX-04 have the highest maintenance priority despite having 800 fewer engine hours than EX-15?"
    },
    {
      role: "assistant",
      latency: "240ms",
      ingestionNote: "EX-04 wear acceleration model updated with latest bench lithology assay (Sector 4 Borehole Assay #8841-B).",
      alertTitle: "Direct Lithological Stress Differential Found",
      alertDesc: "EX-04 is operating in Sector 4 North bench where basalt rock compressive resistance is 28% higher than projected (184 MPa actual vs. 144 MPa baseline design load). Breakout force spikes have initiated rapid micro-pitting in the primary distributor valve block.",
      wearVelocity: "3.4x",
      cavitationPeak: "142 Hz",
      comparativeTarget: "0.82x",
      directive: "To arrest irreversible micro-pitting before 400-hour breakdown envelope, copilot recommends automated actuation adjustments:"
    }
  ]);

  const [inputVal, setInputVal] = useState("");

  const quickPrompts = [
    "Why does EX-04 have the highest maintenance priority?",
    "Simulate shifting EX-04 to soft sandstone bench",
    "Calculate haul route fuel penalty for Sector 2",
    "Draft shift handover diagnostic summary"
  ];

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        sender: "Dispatch Chief • Just now",
        text: inputVal
      },
      {
        role: "assistant",
        latency: "180ms",
        ingestionNote: "Analyzing real-time kinematics telemetry and unconfined rock compressive strength...",
        alertTitle: "Operational Recommendation Generated",
        alertDesc: "EX-04 hydraulic cavitation signature at 128 Hz exceeds safe structural damping threshold by 2.8x. Immediate relief valve recalibration recommended.",
        wearVelocity: "2.8x",
        cavitationPeak: "128 Hz",
        comparativeTarget: "0.95x",
        directive: "Action parameters dispatched to dispatch controller."
      }
    ]);
    setInputVal("");
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans">
      {/* 1. Neural Engine Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-slate-500">Neural Reasoning Engine</span>
          <span className="text-slate-300">/</span>
          <span className="flex items-center gap-1.5 text-orange-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
            Active Node: Pilbara Ridge Node-09
          </span>
          <span className="text-slate-400 text-[11px]">Telemetry Ingestion: 100 Hz (Real-time Stream Sync: 100%)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-orange-100 text-[#E65100] font-bold text-[11px]">
            TerraCortex Geotech Engine
          </span>
          <button className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition">
            Past Handover Sessions
          </button>
          <button className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition">
            Inference Controls
          </button>
        </div>
      </div>

      {/* 2. Main Split Grid: Chat (Left) & Live Inspector (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Interactive AI Copilot Chat Window */}
        <div className="xl:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs h-[780px]">
          {/* Copilot Header */}
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">TerraCortex Copilot</h2>
                <div className="text-[11px] text-slate-500 font-mono">Geotechnical & Fleet Operations Assistant</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1 rounded-md font-mono font-bold">
              EX-04 Ground Sensor Focus
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-mono">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setInputVal(qp)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-orange-500" />
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 font-sans">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  /* User Message */
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-2xl bg-blue-50/90 border border-blue-200 p-4 rounded-2xl rounded-tr-xs text-sm text-slate-900 font-medium shadow-2xs">
                      <div className="text-[10px] font-mono font-bold text-slate-500 mb-1 text-right">{msg.sender}</div>
                      {msg.text}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
                      VA
                    </div>
                  </div>
                ) : (
                  /* AI Copilot Response */
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E65100] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="max-w-3xl space-y-3">
                      {/* Top Response Badges */}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-slate-900">TerraCortex Reasoning Matrix</span>
                        <span className="bg-orange-100 text-[#E65100] px-2 py-0.5 rounded font-bold text-[10px]">Real-time Stream Analyzed</span>
                        <span className="text-slate-400 text-[11px]">Response latency: {msg.latency}</span>
                      </div>

                      {/* Ingestion Note */}
                      <div className="bg-blue-50 border border-blue-200/80 p-3 rounded-lg text-xs text-blue-900 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        {msg.ingestionNote}
                      </div>

                      {/* Main Insight Box */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          {msg.alertTitle}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {msg.alertDesc}
                        </p>

                        {/* 3 Metric Stat Boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono">
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Contextual Wear Velocity</div>
                            <div className="text-xl font-black text-red-600 my-1">{msg.wearVelocity} <span className="text-xs font-normal text-slate-500">vs std engine hr</span></div>
                            <div className="text-[10px] text-red-700 font-bold">Severe kinematic load</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Acoustic Cavitation Peak</div>
                            <div className="text-xl font-black text-orange-600 my-1">{msg.cavitationPeak}</div>
                            <div className="text-[10px] text-slate-500">Discharge port #04B</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Comparative Target (EX-15)</div>
                            <div className="text-xl font-black text-emerald-600 my-1">{msg.comparativeTarget} <span className="text-xs font-normal text-slate-500">in Alluvial Silt</span></div>
                            <div className="text-[10px] text-slate-500">Nominal wear curve</div>
                          </div>
                        </div>

                        {/* Prescriptive Directives & CTA */}
                        <div className="border-t border-slate-200 pt-3 mt-3">
                          <div className="text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                            Prescriptive Operational Directives
                          </div>
                          <div className="text-xs text-slate-700 mb-3">
                            {msg.directive}
                          </div>
                          <button className="px-4 py-2 bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition cursor-pointer font-mono">
                            <Send className="w-3.5 h-3.5" />
                            Send Alert to Operator Tablet
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="border border-slate-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition bg-slate-50/50">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Ask TerraCortex Geotech AI about machine kinematics, bench lithology, or fleet cycle delays..."
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden resize-none placeholder-slate-400 font-medium"
              />
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 mt-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <button className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Mic className="w-4 h-4" /></button>
                  <span className="text-[10px] font-mono text-slate-400 ml-2 hidden sm:inline">Press ⌘+Enter to execute inference</span>
                </div>
                <button
                  onClick={handleSend}
                  className="px-4 py-1.5 bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer font-mono"
                >
                  Execute Analysis
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Diagnostic & Waveform Inspector */}
        <div className="xl:col-span-4 space-y-4">
          {/* Card 1: Unit EX-04 Sensor Diagnostic */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs font-mono text-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div>
                <div className="font-bold text-slate-900 text-sm">Unit EX-04 Sensor Diagnostic</div>
                <div className="text-[10px] text-slate-400">Connected Heavy Excavator • CAT 390F Retrospective</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                14 Cavitation Cycles
              </span>
            </div>

            {/* Gauges */}
            <div className="space-y-3">
              {/* Pressure */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">HYDRAULIC PRESSURE #HYD-04B</span>
                  <strong className="text-slate-900 text-sm">{ex04?.hydraulic_pressure_mpa ?? 34.8} MPa</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1.5">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
                <div className="text-[10px] text-red-600 font-bold">94% of relief threshold</div>
              </div>

              {/* Manifold Temp */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">MANIFOLD TEMP</span>
                  <strong className="text-slate-900 text-sm">{ex04?.manifold_temp_c ?? 96.4} °C</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1.5">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="text-[10px] text-amber-700 font-bold">Thermal envelope high</div>
              </div>

              {/* Kinematics Joint Tolerances */}
              <div className="border-t border-slate-100 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  <span>Kinematics Joint Tolerances</span>
                  <span className="text-red-600 font-mono">Delta: σ 2.8</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div className="bg-slate-100 p-1.5 rounded"><div className="text-slate-400">Boom</div><strong className="text-slate-800">{ex04?.kinematics.boom_angle ?? 34.8}°</strong></div>
                  <div className="bg-slate-100 p-1.5 rounded"><div className="text-slate-400">Arm</div><strong className="text-slate-800">7.8 m</strong></div>
                  <div className="bg-red-100 text-red-800 p-1.5 rounded"><div>Bucket</div><strong className="font-bold">{ex04?.kinematics.bucket_angle ?? 91.4}°</strong></div>
                  <div className="bg-slate-100 p-1.5 rounded"><div className="text-slate-400">Slew</div><strong className="text-slate-800">8.2 rpm</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Acoustic FFT Waveform Spectrum */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-slate-900">Acoustic FFT Waveform Spectrum</div>
                <div className="text-[10px] text-slate-400">Sensor HYD-04B-ACC (Fluid Manifold Transducer)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                Harmonic Peak: 142 Hz
              </span>
            </div>

            {/* FFT Spectrum Curve */}
            <div className="relative h-36 w-full bg-slate-900 rounded-lg p-3 my-3">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <line x1="0" y1="85" x2="300" y2="85" stroke="#334155" strokeWidth="1" />
                {/* Spectrum Curve with sharp spike at 142 Hz (~x=180) */}
                <path
                  d="M0,80 Q30,75 60,82 T120,78 L150,72 L180,15 L195,85 L240,82 Q270,80 300,85"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />
                <circle cx="180" cy="15" r="4" fill="#EF4444" />
                <text x="150" y="10" fill="#F87171" fontSize="9" fontWeight="bold">142 Hz (Cavitation Critical)</text>
              </svg>
              <div className="flex justify-between text-[9px] text-slate-400 border-t border-slate-800 pt-1">
                <span>0 Hz</span>
                <span>50 Hz</span>
                <span>100 Hz</span>
                <span>200 Hz</span>
                <span>250 Hz</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-100 pb-2 mb-2">
              <span>Harmonic Energy Floor: <strong>-48 dBV</strong></span>
              <span className="text-red-600 font-bold">Spike: -12.4 dBV @ Micro-implosion</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span>Acoustic signature matches spool valve seat micro-erosion</span>
              <a href="#" className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                Inspect Raw Log <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
