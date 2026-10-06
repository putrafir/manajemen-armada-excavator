"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  X, 
  Activity, 
  Box, 
  Truck, 
  Clock, 
  ArrowRight,
  Send,
  FileEdit,
  Check
} from "lucide-react";

interface CopilotAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (action: string, payload?: any) => void;
  unitId: string;
}

interface UnitDiagnosticProfile {
  unit: string;
  model: string;
  dtc: string;
  component: string;
  freq: string;
  diagnosis: string;
  confidence: number;
  partName: string;
  partSapCode: string;
  partStock: string;
  inventoryLocation: string;
  assignedRig: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedDowntime: string;
  operatorAlert: string;
}

const UNIT_DIAGNOSTICS: Record<string, UnitDiagnosticProfile> = {
  "EX-04": {
    unit: "EX-04",
    model: "XCMG XE4000 Mining Shovel",
    dtc: "SPN 1079 FMI 03 (Relief Vent Cavitation)",
    component: "Hydraulic Spool Valve (Distributor Pump #2)",
    freq: "142 Hz Peak Acoustic Resonance",
    diagnosis: "1D-CNN Perception indicates micro-implosions in valve spool cavity. Differential pressure drop >35 bar across pump distributor manifold during high-tonnage basalt loading.",
    confidence: 96.4,
    partName: "Parker Spool Seal Kit #PS-902",
    partSapCode: "SAP-PARK-902-KIT",
    partStock: "4 Kits Available",
    inventoryLocation: "Warehouse Bay 03 (Bin B-04)",
    assignedRig: "Mobile Rig 3 (Lead: D. Miller)",
    category: "Hydraulic System",
    priority: "CRITICAL",
    estimatedDowntime: "2.5 Hours",
    operatorAlert: "Reroute bucket away from 184 MPa basalt wall; limit pump #2 flow to 70%."
  },
  "EX-12": {
    unit: "EX-12",
    model: "XCMG XE7000 Mining Excavator",
    dtc: "SPN 2420 FMI 04 (Slew Bearing Harmonic Shock)",
    component: "Slew Ring Bearing Raceway & Swing Drive",
    freq: "88 Hz Harmonic Radial Vibration (4.8 mm/s)",
    diagnosis: "Accelerometer telemetry indicates accelerated raceway micro-pitting caused by extreme swing inertia on steep -140m ramp grade. Boundary lubrication film thinning.",
    confidence: 93.8,
    partName: "Slew Bearing Grease Purge Pack #EP-2",
    partSapCode: "SAP-LUBE-PURGE-08",
    partStock: "12 Canisters Available",
    inventoryLocation: "Warehouse Bay 02 (Bin A-09)",
    assignedRig: "Mobile Rig 1 (Lead: K. Johansen)",
    category: "Mechanical Transmission",
    priority: "HIGH",
    estimatedDowntime: "1.8 Hours",
    operatorAlert: "Limit swing speed below 6.5 RPM until grease purge cycle is executed."
  },
  "EX-27": {
    unit: "EX-27",
    model: "XCMG XE2000 Mining Excavator",
    dtc: "SPN 1120 FMI 01 (Cylinder Internal Flow Bypass)",
    component: "Boom Cylinder Hydraulic Seal Assembly",
    freq: "42 Hz Valve Flutter Oscillation",
    diagnosis: "Pressure transducer detects 12.4 L/min internal bypass flow on boom descent. Piston wiper lip thermal abrasion following sustained quartzite vein extraction.",
    confidence: 91.2,
    partName: "Parker Boom Wiper Pack #W-200",
    partSapCode: "SAP-PARK-W200-HP",
    partStock: "PO-9912 Dispatched (ETA 6h)",
    inventoryLocation: "Warehouse Bay 01 (Bin C-14)",
    assignedRig: "Workshop Bay 2 (Heavy Overhaul)",
    category: "Hydraulic Actuators",
    priority: "HIGH",
    estimatedDowntime: "3.5 Hours",
    operatorAlert: "Avoid full-reach boom descent stalls; monitor boom drift rate."
  },
  "EX-17": {
    unit: "EX-17",
    model: "XCMG XE4000 Mining Shovel",
    dtc: "SPN 1079 FMI 00 (Main Relief Valve Acoustic Surge)",
    component: "Main Relief Valve Cartridge 350-Bar",
    freq: "155 Hz Pressure Wave Oscillation",
    diagnosis: "Acoustic emission sensor flags valve flutter during bucket stall against hard rock ledge. Spring fatigue detected in primary pilot cartridge.",
    confidence: 94.1,
    partName: "Main Relief Valve Cartridge 350-Bar",
    partSapCode: "SAP-RLF-350-CARTRIDGE",
    partStock: "3 Cartridges Available",
    inventoryLocation: "Warehouse Bay 03 (Bin A-02)",
    assignedRig: "Mobile Rig 2 (Lead: S. Tanaka)",
    category: "Hydraulic System",
    priority: "CRITICAL",
    estimatedDowntime: "2.0 Hours",
    operatorAlert: "Reduce digging relief pressure setting via in-cab display."
  },
  "EX-33": {
    unit: "EX-33",
    model: "XCMG XE7000 Mining Excavator",
    dtc: "SPN 2420 FMI 02 (Slew Pinion Gearbox Shockwave)",
    component: "Slew Pinion Gearbox & Upper Carriage",
    freq: "138 Hz Pinion Tooth Contact Shock",
    diagnosis: "High-frequency shock pulse detected on slew pinion tooth meshing under 162 MPa Banded Iron Formation load. Backlash clearance exceeding OEM limit.",
    confidence: 92.5,
    partName: "Slew Bearing Grease Purge Pack #EP-2",
    partSapCode: "SAP-LUBE-PURGE-08",
    partStock: "12 Canisters Available",
    inventoryLocation: "Warehouse Bay 02 (Bin A-09)",
    assignedRig: "Mobile Rig 1 (Lead: K. Johansen)",
    category: "Mechanical Transmission",
    priority: "CRITICAL",
    estimatedDowntime: "4.0 Hours",
    operatorAlert: "Engage slew brake gently; avoid sudden reverse slew motions."
  },
  "EX-08": {
    unit: "EX-08",
    model: "XCMG XE1250 Mining Excavator",
    dtc: "SPN 110 FMI 16 (Hydraulic Oil Heat Exchanger Derate)",
    component: "Oil Cooler Radiator Package & Fan Shroud",
    freq: "28 Hz Aerodynamic Fan Drag",
    diagnosis: "Thermal sensor indicates heat delta excursion to 88.2°C due to heavy sandstone dust accumulation across oil cooler radiator fins. Airflow drop 34%.",
    confidence: 89.7,
    partName: "Hydraulic Oil Cooler Core #RAD-1250",
    partSapCode: "SAP-RAD-CORE-1250",
    partStock: "2 Units Staged",
    inventoryLocation: "Warehouse Yard Staging (Pallet 04)",
    assignedRig: "Mobile Rig 3 (Lead: D. Miller)",
    category: "Cooling & Heat Exchanger",
    priority: "HIGH",
    estimatedDowntime: "1.5 Hours",
    operatorAlert: "Park in clean airflow zone for pneumatic radiator core blowdown."
  }
};

export default function CopilotAgentModal({ isOpen, onClose, onApprove, unitId }: CopilotAgentModalProps) {
  const [analyzing, setAnalyzing] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [submittingAuto, setSubmittingAuto] = useState(false);
  const [autoSuccess, setAutoSuccess] = useState(false);

  const diag = UNIT_DIAGNOSTICS[unitId] || {
    unit: unitId || "EX-04",
    model: "XCMG Mining Excavator",
    dtc: "SPN 1079 FMI 03 (Hydraulic Line Anomaly)",
    component: "Main Hydraulic Circuit",
    freq: "Dynamic FFT Vibration Signature",
    diagnosis: `Telemetry telemetry anomaly identified on unit ${unitId}. Vibration and hydraulic sensors indicate elevated mechanical load exceeding baseline envelope.`,
    confidence: 91.0,
    partName: "Parker Spool Seal Kit #PS-902",
    partSapCode: "SAP-PARK-902-KIT",
    partStock: "4 Kits in Warehouse",
    inventoryLocation: "Warehouse Bay 03",
    assignedRig: "Mobile Rig 3 (Lead: D. Miller)",
    category: "Hydraulic System",
    priority: "HIGH" as const,
    estimatedDowntime: "2.0 Hours",
    operatorAlert: "Inspect fluid levels and relief pressure before resuming heavy duty cycle."
  };

  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      setAutoSuccess(false);
      setActiveStep(0);

      const s1 = setTimeout(() => setActiveStep(1), 400);
      const s2 = setTimeout(() => setActiveStep(2), 900);
      const s3 = setTimeout(() => setActiveStep(3), 1400);
      const s4 = setTimeout(() => setAnalyzing(false), 1900);

      return () => {
        clearTimeout(s1);
        clearTimeout(s2);
        clearTimeout(s3);
        clearTimeout(s4);
      };
    }
  }, [isOpen, unitId]);

  if (!isOpen) return null;

  // Direct 1-Click Dispatch via API
  const handleAutoDispatch = async () => {
    setSubmittingAuto(true);
    try {
      const payload = {
        unit: diag.unit,
        model: diag.model,
        dtc: diag.dtc,
        diagnosis: diag.diagnosis,
        part: diag.partName,
        partNumber: diag.partSapCode,
        assignedRig: diag.assignedRig,
        category: diag.category,
        priority: diag.priority,
        source: "AI_COPILOT"
      };

      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setAutoSuccess(true);
        if (onApprove) {
          onApprove("AUTO_DISPATCHED", payload);
        }
        setTimeout(() => {
          setSubmittingAuto(false);
          onClose();
        }, 1800);
      } else {
        setSubmittingAuto(false);
      }
    } catch (err) {
      console.error("Auto dispatch error", err);
      setSubmittingAuto(false);
    }
  };

  const handleEditManually = () => {
    if (onApprove) {
      onApprove("EDIT_MANUAL", {
        unit: diag.unit,
        title: `Copilot Directive: ${diag.component} Repair`,
        category: diag.category,
        priority: diag.priority,
        partCode: diag.partSapCode,
        assignedRig: diag.assignedRig,
        notes: `AI Diagnostic: ${diag.diagnosis}

DTC: ${diag.dtc}
Frequency: ${diag.freq}`
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">TerraCortex Agentic CMMS Copilot</h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  v4.2 RAG
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80 font-medium">
                Autonomous Telemetry Reasoning • SAP MM &amp; Field Dispatch Orchestrator
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Asset Ribbon */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Analyzing Machine:</span>
            <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs font-mono">
              {diag.unit}
            </span>
            <span className="text-slate-600 font-medium">{diag.model}</span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            diag.priority === "CRITICAL"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}>
            {diag.priority} Priority
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {analyzing ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                <Activity className="absolute inset-0 m-auto text-indigo-600 w-6 h-6 animate-pulse" />
              </div>
              
              <div className="space-y-2 text-center w-full max-w-sm">
                <div className="text-sm font-bold text-slate-800">
                  Synthesizing Multi-Agent Telemetry Stream...
                </div>
                <div className="space-y-1 text-[11px] text-slate-500 text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className={`flex items-center gap-2 ${activeStep >= 1 ? "text-emerald-700 font-semibold" : "opacity-40"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>In-situ FFT Vibration &amp; Pressure Ingestion</span>
                  </div>
                  <div className={`flex items-center gap-2 ${activeStep >= 2 ? "text-emerald-700 font-semibold" : "opacity-40"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Cross-matching OEM DTC Fault Patterns (SAE J1939)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${activeStep >= 3 ? "text-emerald-700 font-semibold" : "opacity-40"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Checking SAP Materials Stock &amp; Mobile Crew Rigs</span>
                  </div>
                </div>
              </div>
            </div>
          ) : autoSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Work Order Dispatched to CMMS!</h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                Work order officially published to <strong>Maintenance CMMS Hub</strong>. 
                Field notification broadcast to <strong>{diag.assignedRig}</strong> and operator alert dispatched to cab.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* 1. Diagnostic Findings Card */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Agent Diagnosis &bull; {diag.component}</span>
                  </div>
                  <span className="text-[10px] bg-rose-200/80 text-rose-900 font-bold px-2 py-0.5 rounded-full font-mono">
                    {diag.confidence}% Confidence
                  </span>
                </div>

                <div className="text-slate-800 text-[11px] leading-relaxed">
                  {diag.diagnosis}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200/60 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">SAE DTC Code</span>
                    <span className="font-mono font-bold text-rose-800">{diag.dtc}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">Sensor Anomaly</span>
                    <span className="font-bold text-slate-900">{diag.freq}</span>
                  </div>
                </div>
              </div>

              {/* 2. Coordinated Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* SAP Part Allocation */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <Box className="w-3.5 h-3.5 text-sky-600" />
                    <span>Verified SAP MM Spare Part</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{diag.partName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Code: {diag.partSapCode}</div>
                  </div>
                  <div className="text-[10px] bg-sky-50 text-sky-800 p-2 rounded-lg border border-sky-100 flex items-center justify-between">
                    <span>{diag.inventoryLocation}</span>
                    <span className="font-bold">{diag.partStock}</span>
                  </div>
                </div>

                {/* Dispatch Crew & RUL */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <Truck className="w-3.5 h-3.5 text-orange-600" />
                    <span>Assigned Mobile Workshop Rig</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{diag.assignedRig}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Estimated Service Downtime: {diag.estimatedDowntime}</div>
                  </div>
                  <div className="text-[10px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Shift Window: Immediate Work Stop Required</span>
                  </div>
                </div>
              </div>

              {/* 3. In-Cab Operator Directive */}
              <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-indigo-950 text-xs">Automated In-Cab Tablet Directive</div>
                  <div className="text-[11px] text-indigo-900/90 leading-relaxed">
                    {diag.operatorAlert}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        {!autoSuccess && !analyzing && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Dismiss
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleEditManually}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Open Manual Form with these details pre-filled"
              >
                <FileEdit className="w-3.5 h-3.5 text-slate-600" />
                <span>Customize in Manual Form</span>
              </button>

              <button
                onClick={handleAutoDispatch}
                disabled={submittingAuto}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submittingAuto ? "Dispatching..." : "Auto-Authorize & Dispatch Work Order"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
