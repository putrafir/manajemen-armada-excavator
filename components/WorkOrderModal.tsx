"use client";

import React, { useState, useEffect } from "react";
import { Wrench, CheckCircle2, AlertTriangle, X, ShieldAlert, Package, Truck, Sparkles } from "lucide-react";

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
  initialValues?: {
    unit?: string;
    title?: string;
    category?: string;
    priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    partCode?: string;
    assignedRig?: string;
    notes?: string;
  };
}

export default function WorkOrderModal({ isOpen, onClose, unitId, initialValues }: WorkOrderModalProps) {
  const [targetUnit, setTargetUnit] = useState(unitId || "EX-04");
  const [priority, setPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("CRITICAL");
  const [title, setTitle] = useState("Hydraulic Spool Valve Cavitation Emergency Flush");
  const [category, setCategory] = useState("Hydraulic System");
  const [assignedRig, setAssignedRig] = useState("Mobile Rig 3 (Lead: D. Miller)");
  const [partCode, setPartCode] = useState("SAP-PARK-902-KIT");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("Technician to verify 142 Hz cavitation threshold and perform oil purity sampling.");
  
  const [registeredAssets, setRegisteredAssets] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load custom provisioned assets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("terracortex_registered_assets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRegisteredAssets(parsed.map((a: any) => a.id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.unit) setTargetUnit(initialValues.unit);
      if (initialValues.title) setTitle(initialValues.title);
      if (initialValues.category) setCategory(initialValues.category);
      if (initialValues.priority) setPriority(initialValues.priority);
      if (initialValues.partCode) setPartCode(initialValues.partCode);
      if (initialValues.assignedRig) setAssignedRig(initialValues.assignedRig);
      if (initialValues.notes) setNotes(initialValues.notes);
    } else if (unitId) {
      setTargetUnit(unitId);
    }
  }, [unitId, initialValues, isOpen]);

  if (!isOpen) return null;

  const sapPartsList = [
    { code: "SAP-PARK-902-KIT", name: "Parker Spool Seal Kit #PS-902", location: "Bay 03 (Bin B-04)" },
    { code: "SAP-LUBE-PURGE-08", name: "Slew Bearing Grease Purge Pack #EP-2", location: "Bay 02 (Bin A-09)" },
    { code: "SAP-PARK-W200-HP", name: "Parker Boom Wiper Pack #W-200", location: "Bay 01 (Bin C-14)" },
    { code: "SAP-FLT-HYD-440", name: "High-Pressure Return Filter Element #FLT-440", location: "Bay 02 (Bin B-18)" },
    { code: "SAP-RAD-CORE-1250", name: "Hydraulic Oil Cooler Core #RAD-1250", location: "Yard Pallet 04" },
    { code: "SAP-RLF-350-CARTRIDGE", name: "Main Relief Valve Cartridge 350-Bar", location: "Bay 03 (Bin A-02)" }
  ];

  const defaultUnits = [
    "EX-04 • XCMG XE4000 Mining Shovel (Pit 4)",
    "EX-12 • XCMG XE7000 Mining Excavator (Pit 2)",
    "EX-17 • XCMG XE4000 Mining Shovel (Pit 2)",
    "EX-27 • XCMG XE2000 Mining Excavator (Pit 1)",
    "EX-08 • XCMG XE1250 Mining Excavator (Pit 4)",
    "EX-15 • XCMG XE2000 Mining Excavator (Pit 3)",
    "EX-19 • XCMG XE950G Heavy Excavator (Pit 3)",
    "EX-31 • XCMG XE700D Heavy Excavator (Pit 1)",
    "EX-33 • XCMG XE7000 Mining Excavator (Pit 3)"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedPart = sapPartsList.find(p => p.code === partCode);
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit: targetUnit,
          model: targetUnit === "EX-04" ? "XCMG XE4000 Mining Shovel" : "XCMG Mining Heavy Rig",
          dtc: "MANUAL-DIRECTIVE-AUTH",
          diagnosis: notes || "Supervisor authorized manual maintenance directive.",
          part: selectedPart ? selectedPart.name : "Maintenance Consumables Pack",
          partNumber: partCode,
          assignedRig,
          category,
          priority,
          source: "MANUAL_SUPERVISOR"
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSubmitting(false);
          onClose();
        }, 1500);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Manual CMMS Work Order</h3>
              <p className="text-[11px] text-slate-500">Supervisor Service Authorisation &amp; Dispatch Form</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Work Order Created Successfully!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Work Order officially published to <strong>Maintenance CMMS Hub</strong>. 
              Notification sent to {assignedRig}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Row 1: Target Unit & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Target Machine Asset
                </label>
                <select
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
                >
                  {defaultUnits.map((item) => {
                    const uId = item.split(" ")[0];
                    return (
                      <option key={uId} value={uId}>
                        {item}
                      </option>
                    );
                  })}
                  {registeredAssets.filter(id => !defaultUnits.some(d => d.startsWith(id))).map((id) => (
                    <option key={id} value={id}>
                      {id} • Provisioned Excavator Asset
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Severity Priority Rating
                </label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:border-orange-500"
                >
                  <option value="CRITICAL">CRITICAL • Immediate Machine Stop</option>
                  <option value="HIGH">HIGH • Shift Swap Service Window</option>
                  <option value="MEDIUM">MEDIUM • 24-Hour Maintenance Cycle</option>
                  <option value="LOW">LOW • Next Scheduled PM Interval</option>
                </select>
              </div>
            </div>

            {/* Row 2: Title / Directive */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Operational Work Directive Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Emergency Spool Valve Replacement & Flush"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Row 3: Subsystem Category & Assigned Rig */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Machine Subsystem Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
                >
                  <option value="Hydraulic System">Hydraulic System &amp; Spool Valves</option>
                  <option value="Mechanical Transmission">Slew Bearing &amp; Swing Drive</option>
                  <option value="Hydraulic Actuators">Boom/Arm/Bucket Cylinder Seals</option>
                  <option value="Cooling & Heat Exchanger">Oil Cooler &amp; Radiator Package</option>
                  <option value="Engine & Powerpack">Diesel Powerpack &amp; Turbocharger</option>
                  <option value="Structural Integrity">Bucket Tooth Pack &amp; Track Linkage</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Assigned Field Crew / Mobile Rig
                </label>
                <select
                  value={assignedRig}
                  onChange={(e) => setAssignedRig(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
                >
                  <option value="Mobile Rig 3 (Lead: D. Miller)">Mobile Rig 3 (Lead: D. Miller • Bay 3)</option>
                  <option value="Mobile Rig 1 (Lead: K. Johansen)">Mobile Rig 1 (Lead: K. Johansen • Bay 1)</option>
                  <option value="Mobile Rig 2 (Lead: S. Tanaka)">Mobile Rig 2 (Lead: S. Tanaka • Bay 2)</option>
                  <option value="Workshop Bay 2 (Heavy Overhaul)">Workshop Bay 2 (Heavy Component Overhaul)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Required Spare Part from SAP Catalog */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold">
                <Package className="w-3.5 h-3.5 text-sky-600" />
                <span>Required Spare Part (SAP ERP Catalog)</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <select
                    value={partCode}
                    onChange={(e) => setPartCode(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:border-orange-500"
                  >
                    {sapPartsList.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name} — {p.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Notes */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Technician Notes &amp; Safety Instructions
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter specific torque values, safety isolation procedures..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Direct Sync with CMMS Inbox</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{submitting ? "Submitting..." : "Submit to CMMS Inbox"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
