import React, { useState, useEffect } from "react";
import { Sparkles, ShieldAlert, CheckCircle2, Wrench, X, Activity } from "lucide-react";

interface CopilotAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (action: string) => void;
  unitId: string;
}

export default function CopilotAgentModal({ isOpen, onClose, onApprove, unitId }: CopilotAgentModalProps) {
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      const timer = setTimeout(() => setAnalyzing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 flex flex-col transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between border-b border-indigo-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">TerraCortex Copilot</h2>
              <p className="text-[11px] font-medium text-indigo-600">Human-Supervised Agentic AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Unit</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">{unitId || "EX-04"}</span>
          </div>

          {analyzing ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                <Activity className="absolute inset-0 m-auto text-indigo-600 w-6 h-6 animate-pulse" />
              </div>
              <div className="text-sm font-medium text-slate-600 animate-pulse">Diagnostic & Risk Agent Analyzing Telemetry...</div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Agent Diagnosis */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-900">Critical Anomaly Detected</h3>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      1D-CNN Perception indicates an 85% probability of hydraulic cavitation in the main boom circuit. 
                      Vibration signature matches impending seal failure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent Recommendation */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Maintenance Agent Recommendation</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div className="text-xs font-medium text-slate-700">Send Critical Stop-Work Alert to Operator Tablet.</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100/50">
                    <Wrench className="w-5 h-5 text-orange-500" />
                    <div className="text-xs font-medium text-slate-700">Dispatch Mechanic with Seal Kit #SK-490 for urgent replacement.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Approval Actions */}
        <div className="p-6 pt-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
          <button 
            onClick={onClose}
            disabled={analyzing}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            Ignore
          </button>
          <button 
            onClick={() => onApprove("DISPATCH_AND_ALERT")}
            disabled={analyzing}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-200 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Dispatch & Alert
          </button>
        </div>

      </div>
    </div>
  );

}
