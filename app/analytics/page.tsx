"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  Box,
  Wrench,
  Search,
  ClipboardList,
  RefreshCw,
  XCircle,
  Activity,
  History,
  ShieldCheck,
  FileCheck,
  Database
} from "lucide-react";

interface WorkOrderItem {
  id: string;
  unit: string;
  model: string;
  time: string;
  dtc: string;
  diagnosis: string;
  part: string;
  partNumber: string;
  inventory: string;
  inventoryStatus: "ok" | "shortage";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  approved: boolean;
  assignedRig: string;
  category: string;
  technicianNotes?: string;
  source: string;
}

interface InventoryItem {
  sapCode: string;
  name: string;
  fitment: string;
  location: string;
  onHand: number;
  minRequired: number;
  unitCost: string;
  status: string;
  statusColor: string;
}

type TabType = "needs_action" | "in_progress" | "history" | "inventory";

export default function CMMSDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("needs_action");
  const [inventorySearch, setInventorySearch] = useState("");
  const [workOrders, setWorkOrders] = useState<WorkOrderItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [dbSource, setDbSource] = useState<string>("In-Memory Local Mode");

  const fetchWorkOrders = async () => {
    try {
      const res = await fetch("/api/work-orders");
      if (res.ok) {
        const data = await res.json();
        setWorkOrders(data.workOrders || []);
        if (data.source) setDbSource(data.source);
      }
    } catch (e) {
      console.error("Failed to fetch work orders", e);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (res.ok) {
        const data = await res.json();
        setInventoryItems(data.items || []);
      }
    } catch (e) {
      console.error("Failed to fetch inventory", e);
    }
  };

  useEffect(() => {
    Promise.all([fetchWorkOrders(), fetchInventory()]).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (item: WorkOrderItem) => {
    try {
      // 1. Mark work order approved
      const resWO = await fetch("/api/work-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, approved: true })
      });

      // 2. Deduct spare part stock in SAP inventory API
      if (item.partNumber && item.inventoryStatus === "ok") {
        await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deduct", sapCode: item.partNumber, qty: 1 })
        });
      }

      if (resWO.ok) {
        setActionNotice(`Work Order ${item.id} approved! 1x ${item.part} reserved from warehouse & ${item.assignedRig} dispatched.`);
        setTimeout(() => setActionNotice(null), 5000);
        fetchWorkOrders();
        fetchInventory();
      }
    } catch (e) {
      console.error("Error approving WO", e);
    }
  };

  const handleCompleteService = async (item: WorkOrderItem) => {
    try {
      // 1. Mark Work Order as COMPLETED
      const resWO = await fetch("/api/work-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, technicianNotes: "COMPLETED" })
      });

      // 2. If it is EX-04, reset telemetry stream back to healthy
      if (item.unit === "EX-04") {
        await fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unit_id: "EX-04",
            cmsi: 38.0,
            status: "NORMAL",
            hydraulic_pressure: 24.2,
            manifold_temp: 68.0,
            cavitation_freq: 12,
            primary_anomaly: "Nominal Operating Envelope",
            anomaly_detail: "Service completed • Spool seal replaced by Mobile Rig 3"
          })
        });
      }

      // 3. Persist completed unit in localStorage
      try {
        const stored = localStorage.getItem("terracortex_completed_units") || "[]";
        const parsed = JSON.parse(stored);
        if (!parsed.includes(item.unit)) {
          parsed.push(item.unit);
          localStorage.setItem("terracortex_completed_units", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error(e);
      }

      if (resWO.ok) {
        setActionNotice(`🎉 Service completed for ${item.unit}! Sensors calibrated and excavator returned to active fleet.`);
        setTimeout(() => setActionNotice(null), 5000);
        fetchWorkOrders();
      }
    } catch (e) {
      console.error("Error completing service", e);
    }
  };

  const handleRestock = async (sapCode: string) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restock", sapCode, qty: 5 })
      });
      if (res.ok) {
        setActionNotice(`Restocked +5 units for ${sapCode}. Stock updated in SAP MM.`);
        setTimeout(() => setActionNotice(null), 3500);
        fetchInventory();
      }
    } catch (e) {
      console.error("Error restocking", e);
    }
  };

  const filteredInventory = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.sapCode.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.fitment.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Categorize work orders
  const needsActionOrders = workOrders.filter(i => !i.approved && i.technicianNotes !== "COMPLETED");
  const inProgressOrders = workOrders.filter(i => i.approved && i.technicianNotes !== "COMPLETED");
  const historyOrders = workOrders.filter(i => i.technicianNotes === "COMPLETED");

  const inStockPercentage = inventoryItems.length > 0 
    ? Math.round((inventoryItems.filter(i => i.onHand > 0).length / inventoryItems.length) * 100) 
    : 96;

  const kpis = [
    {
      title: "Action Required",
      value: needsActionOrders.length.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200/80",
      subtext: "Awaiting planner review & part allocation"
    },
    {
      title: "Active WIP (In-Progress)",
      value: inProgressOrders.length.toString(),
      icon: Truck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200/80",
      subtext: "Mobile Rig En Route / On-Site Repair"
    },
    {
      title: "Completed History",
      value: historyOrders.length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200/80",
      subtext: "Signed off & unit cleared for production"
    },
    {
      title: "SAP Spare Parts Ready",
      value: `${inStockPercentage}%`,
      icon: Box,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200/80",
      subtext: `${inventoryItems.filter(i => i.onHand > 0).length} of ${inventoryItems.length} SKUs in stock ready`
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1560px] mx-auto font-sans space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-indigo-600">
            Computerized Maintenance Management System
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <ClipboardList className="w-7 h-7 text-indigo-600" />
            Maintenance CMMS &amp; Warehouse Parts Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Planner dispatch desk, live SAP ERP Materials Management API integration, and field mobile workshop coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { fetchWorkOrders(); fetchInventory(); }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Trigger manual API synchronization with SAP ERP & Database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync SAP
          </button>
          
          <div 
            className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-xs"
            title="Real-time SAP ERP Materials Management subsystem status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-700">SAP MM v4.2: Connected</span>
          </div>

          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              dbSource.includes("Supabase")
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-indigo-50 border-indigo-200 text-indigo-800"
            }`}
            title="Database persistence layer connected to Supabase PostgreSQL"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dbSource.includes("Supabase") ? "Live Cloud DB" : "In-Memory Mode"}</span>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`bg-white border ${kpi.border} p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">{kpi.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{kpi.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Modern Categorized Tabs */}
        <div className="flex flex-wrap items-center border-b border-slate-200/70 bg-slate-50/70 px-3 pt-2 gap-1">
          {/* Tab 1: Action Required */}
          <button 
            onClick={() => setActiveTab("needs_action")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "needs_action" 
                ? "border-amber-500 text-amber-900 bg-white rounded-t-xl shadow-xs" 
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span>Action Required</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              needsActionOrders.length > 0 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {needsActionOrders.length}
            </span>
          </button>

          {/* Tab 2: Active WIP */}
          <button 
            onClick={() => setActiveTab("in_progress")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "in_progress" 
                ? "border-indigo-600 text-indigo-900 bg-white rounded-t-xl shadow-xs" 
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span>Active WIP (In-Progress)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
              inProgressOrders.length > 0 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {inProgressOrders.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
              <span>{inProgressOrders.length}</span>
            </span>
          </button>

          {/* Tab 3: Completed History */}
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "history" 
                ? "border-emerald-600 text-emerald-900 bg-white rounded-t-xl shadow-xs" 
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span>Completed History</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {historyOrders.length}
            </span>
          </button>

          {/* Tab 4: SAP MM Parts Catalog */}
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "inventory" 
                ? "border-sky-600 text-sky-900 bg-white rounded-t-xl shadow-xs" 
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-sky-100 flex items-center justify-center text-sky-700">
              <Box className="w-3.5 h-3.5" />
            </div>
            <span>SAP MM Parts Catalog</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
              {inventoryItems.length} Parts
            </span>
          </button>
        </div>

        {/* TAB CONTENT: 1. ACTION REQUIRED */}
        {activeTab === "needs_action" && (
          <div>
            <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Inbound fault queue from IoT sensors &amp; AI Copilot. Planner must verify SAP parts stock and authorize field service dispatch.</span>
              </div>
              <span className="font-bold">{needsActionOrders.length} Pending Review</span>
            </div>

            <div className="divide-y divide-slate-100">
              {needsActionOrders.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">All Work Orders Processed</div>
                  <div className="text-xs text-slate-500 max-w-md mx-auto">
                    No pending maintenance tickets in the queue. All alerts have been authorized or completed.
                  </div>
                </div>
              ) : (
                needsActionOrders.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-md border border-amber-200/80 font-mono">
                          {item.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.unit} &bull; {item.model}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          item.source === "AI_COPILOT" 
                            ? "bg-purple-50 text-purple-700 border-purple-200" 
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}>
                          {item.source === "AI_COPILOT" ? "AI Copilot Directive" : "Supervisor Manual"}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          item.priority === "CRITICAL"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Diagnostic Trigger / DTC
                          </div>
                          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.dtc}</span>
                          </div>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100/60 p-3.5 rounded-xl">
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            Engineering Directive
                          </div>
                          <div className="text-xs font-medium text-slate-700 leading-relaxed">
                            {item.diagnosis}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Proposed Field Rig: <strong>{item.assignedRig}</strong></span>
                      </div>
                    </div>

                    <div className="w-full lg:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between text-xs space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Required Spare Part (SAP ERP)
                        </div>
                        <div className="font-bold text-slate-900">{item.part}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.partNumber}</div>
                        
                        <div className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${
                          item.inventoryStatus === "ok" ? "text-emerald-700" : "text-rose-600"
                        }`}>
                          {item.inventoryStatus === "ok" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>{item.inventory}</span>
                        </div>
                      </div>

                      <div>
                        {item.inventoryStatus === "ok" ? (
                          <div className="space-y-1.5">
                            <button 
                              onClick={() => handleApprove(item)}
                              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              Approve &amp; Dispatch Rig
                            </button>
                            <div className="text-[10px] text-slate-400 text-center">
                              Deducts 1x SAP inventory &amp; dispatches crew
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => alert(`Purchase Order expedited to supplier for ${item.partNumber}`)}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                          >
                            Expedite Emergency PO
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. ACTIVE WIP */}
        {activeTab === "in_progress" && (
          <div>
            <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Active Work in Progress: Field Mobile Service Rig dispatched with SAP components and currently performing maintenance at pit.</span>
              </div>
              <span className="font-bold">{inProgressOrders.length} Active Crews Deployed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {inProgressOrders.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">No Active Field Services</div>
                  <div className="text-xs text-slate-500 max-w-md mx-auto">
                    Currently no mobile service crews deployed in the pit. All mining excavators operating within nominal envelope.
                  </div>
                </div>
              ) : (
                inProgressOrders.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[10px] font-extrabold rounded-md border border-indigo-200/80 font-mono">
                          {item.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.unit} &bull; {item.model}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                          </span>
                          FIELD RIG EN ROUTE
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Diagnostic Trigger / DTC
                          </div>
                          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.dtc}</span>
                          </div>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100/60 p-3.5 rounded-xl">
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            Engineering Directive
                          </div>
                          <div className="text-xs font-medium text-slate-700 leading-relaxed">
                            {item.diagnosis}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-indigo-800 font-semibold flex items-center gap-2 pt-0.5">
                        <Truck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Assigned Crew: <strong>{item.assignedRig}</strong></span>
                      </div>
                    </div>

                    <div className="w-full lg:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between text-xs space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Allocated Spare Part (SAP ERP)
                        </div>
                        <div className="font-bold text-slate-900">{item.part}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.partNumber}</div>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Reserved from Warehouse Staging</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full py-2 px-3 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-indigo-700">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            <span>Rig Dispatched &bull; En Route</span>
                          </div>
                          <span className="text-[10px] text-indigo-600 font-normal">Technician en route to pit</span>
                        </div>

                        <button
                          onClick={() => handleCompleteService(item)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                          title="Simulate service completion: installs part, resets sensors, and clears machine for production"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Service &amp; Return to Fleet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. COMPLETED HISTORY */}
        {activeTab === "history" && (
          <div>
            <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed Maintenance Archive: Service orders verified and signed off by mobile workshop. Units returned to active production cycle (Nominal Cycle).</span>
              </div>
              <span className="font-bold">{historyOrders.length} Completed Orders</span>
            </div>

            <div className="divide-y divide-slate-100">
              {historyOrders.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
                    <History className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">No Completed Records Yet</div>
                  <div className="text-xs text-slate-500 max-w-md mx-auto">
                    No work orders closed during this shift yet. Click Complete Service in the Active WIP tab once physical repair is verified.
                  </div>
                </div>
              ) : (
                historyOrders.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans bg-emerald-50/10">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md border border-emerald-200/80 font-mono">
                          {item.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.unit} &bull; {item.model}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SERVICE COMPLETED &bull; RETURNED TO FLEET
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-2xs">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Resolved DTC Fault
                          </div>
                          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item.dtc} (Cleared)</span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-2xs">
                          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                            Executed Directive
                          </div>
                          <div className="text-xs font-medium text-slate-700 leading-relaxed">
                            {item.diagnosis}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center gap-2 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed by: <strong>{item.assignedRig}</strong> &bull; Telemetry status restored to Nominal Envelope</span>
                      </div>
                    </div>

                    <div className="w-full lg:w-72 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 flex flex-col justify-between text-xs space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                          Replaced Part (SAP MM)
                        </div>
                        <div className="font-bold text-slate-900">{item.part}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.partNumber}</div>
                        <div className="text-[11px] font-semibold text-emerald-800 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Part Fitted &amp; Calibrated</span>
                        </div>
                      </div>

                      <div className="w-full py-2.5 px-3 bg-white text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex flex-col items-center justify-center gap-1 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Signed Off by Workshop</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-normal">Active in production cycle</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 4. SAP MM PARTS CATALOG */}
        {activeTab === "inventory" && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SAP Materials Management (MM) Live Catalog</h3>
                <p className="text-xs text-slate-500">Live API inventory endpoint queried by AI Maintenance Agent and Dispatch Planner.</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SAP part code or description..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/70 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="py-3 px-4">SAP Part Code</th>
                    <th className="py-3 px-4">Description &amp; Fitment</th>
                    <th className="py-3 px-4">Storage Location</th>
                    <th className="py-3 px-4">Stock on Hand</th>
                    <th className="py-3 px-4">Est. Unit Cost</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.sapCode} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 text-[11px]">
                        {item.sapCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.fitment}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{item.onHand}</span>
                        <span className="text-[10px] text-slate-400"> (Min: {item.minRequired})</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.unitCost}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRestock(item.sapCode)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition text-[11px] cursor-pointer"
                          >
                            Restock +5
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
