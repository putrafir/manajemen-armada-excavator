"use client";

import React from "react";
import { X, CheckCircle2, Wrench, Clock, AlertTriangle, ShieldAlert, User, Package } from "lucide-react";

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
}

export default function WorkOrderModal({ isOpen, onClose, unitId = "EX-04" }: WorkOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-sans text-xs">
      <div className="bg-[#0F1626] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Condition-Based Maintenance</div>
              <h3 className="text-base font-black text-white font-sans">Work Order #WO-8841-HYD</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Target & Urgency */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Target Asset</span>
              <div className="text-sm font-bold text-white font-sans mt-0.5">{unitId} — CAT 6040 FS</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-900/60 border border-red-500/40 text-red-200 text-[10px] font-bold uppercase">
              Critical • Immediate Hold
            </span>
          </div>

          {/* Issue Summary */}
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Operational Directive</div>
            <div className="text-sm font-bold text-white font-sans">
              Emergency Spool Valve Replacement & High-Pressure Hydraulic Flush
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
              Cavitation harmonic confirmed at 142 Hz. Main differential pressure drop &gt;35 bar across pump distributor valve.
            </div>
          </div>

          {/* Crew & Parts Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#131D30] rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold mb-1">
                <User className="w-3 h-3 text-orange-400" />
                Assigned Field Crew
              </div>
              <div className="text-white font-bold font-sans">Team Alpha (Mobile Rig 3)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Lead: D. Miller • ETA: 8 Mins</div>
            </div>

            <div className="p-3 bg-[#131D30] rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold mb-1">
                <Package className="w-3 h-3 text-cyan-400" />
                Required Parts Kit
              </div>
              <div className="text-white font-bold font-sans">Parker Spool Seal Kit #PS-902</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Staged in Bay 03 • Ready</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/5 bg-black/20 flex items-center justify-between">
          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Dispatched via Private LTE Mesh
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-950/40 cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
