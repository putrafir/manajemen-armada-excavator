"use client";

import React from "react";
import { X, Wrench, User, Package } from "lucide-react";

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
}

export default function WorkOrderModal({ isOpen, onClose, unitId = "EX-04" }: WorkOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn font-sans text-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Condition-Based Maintenance</div>
              <h3 className="text-base font-bold text-slate-900 font-sans">Work Order #WO-8841-HYD</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Target & Urgency */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 border border-red-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Target Asset</span>
              <div className="text-sm font-bold text-slate-900 font-sans mt-0.5">{unitId} — XCMG XE4000 Mining Shovel</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-100 border border-red-300 text-red-800 text-[10px] font-bold uppercase">
              Critical • Immediate Hold
            </span>
          </div>

          {/* Issue Summary */}
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Operational Directive</div>
            <div className="text-sm font-bold text-slate-900 font-sans">
              Emergency Spool Valve Replacement & High-Pressure Hydraulic Flush
            </div>
            <div className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">
              Cavitation harmonic confirmed at 142 Hz. Main differential pressure drop &gt;35 bar across pump distributor valve.
            </div>
          </div>

          {/* Crew & Parts Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold mb-1">
                <User className="w-3 h-3 text-orange-600" />
                Assigned Field Crew
              </div>
              <div className="text-slate-900 font-bold font-sans">Team Alpha (Mobile Rig 3)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Lead: D. Miller • ETA: 8 Mins</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold mb-1">
                <Package className="w-3 h-3 text-sky-600" />
                Required Parts Kit
              </div>
              <div className="text-slate-900 font-bold font-sans">Parker Spool Seal Kit #PS-902</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Staged in Bay 03 • Ready</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Dispatched via Private LTE Mesh
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
