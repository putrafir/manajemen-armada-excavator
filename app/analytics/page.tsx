"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Box, 
  Wrench, 
  Inbox, 
  Search, 
  Truck,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  Filter
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
  approved: boolean;
  assignedRig: string;
}

export default function CMMSDashboard() {
  const [activeTab, setActiveTab] = useState<"inbox" | "inventory">("inbox");
  const [inventorySearch, setInventorySearch] = useState("");

  const [copilotInbox, setCopilotInbox] = useState<WorkOrderItem[]>([
    {
      id: "WO-8841-HYD",
      unit: "EX-04",
      model: "XCMG XE4000 Mining Shovel",
      time: "12 mins ago",
      dtc: "SPN 1079 FMI 03 (Relief Vent Cavitation)",
      diagnosis: "142 Hz hydraulic micro-implosion in spool valve. Delta pressure drop >35 bar across distributor pump #2.",
      part: "Parker Spool Seal Kit #PS-902",
      partNumber: "SAP-PARK-902-KIT",
      inventory: "4 kits in Bay 03 (Bin B-04)",
      inventoryStatus: "ok",
      approved: false,
      assignedRig: "Mobile Rig 3 (Lead: D. Miller)"
    },
    {
      id: "WO-8839-SLW",
      unit: "EX-12",
      model: "XCMG XE7000 Mining Excavator",
      time: "48 mins ago",
      dtc: "SPN 2420 FMI 04 (Slew Bearing Harmonic Shock)",
      diagnosis: "88 Hz radial vibration on swing gear raceway. Accelerated raceway micro-pitting detected on -140m grade.",
      part: "Slew Ring Bearing Grease Flush & Purge Pack",
      partNumber: "SAP-LUBE-PURGE-08",
      inventory: "12 canisters in Bay 02 (Bin A-09)",
      inventoryStatus: "ok",
      approved: false,
      assignedRig: "Mobile Rig 1 (Lead: K. Johansen)"
    },
    {
      id: "WO-8835-CYL",
      unit: "EX-27",
      model: "XCMG XE2000 Mining Excavator",
      time: "2 hours ago",
      dtc: "SPN 1120 FMI 01 (Cylinder Internal Flow Bypass)",
      diagnosis: "12.4 L/min internal bypass flow detected on boom cylinder descent. Wiper lip abrasion suspected.",
      part: "Parker Wiper Lip & Head Pack #W-200",
      partNumber: "SAP-PARK-W200-HP",
      inventory: "Out of Stock (PO-9912 Dispatched)",
      inventoryStatus: "shortage",
      approved: false,
      assignedRig: "Workshop Bay 2 (Staging)"
    }
  ]);

  const inventoryItems = [
    {
      sapCode: "SAP-PARK-902-KIT",
      name: "Parker Spool Seal Kit #PS-902",
      fitment: "XCMG XE4000 Mining Shovel",
      location: "Warehouse Bay 03 (Bin B-04)",
      onHand: 4,
      minRequired: 2,
      unitCost: "$1,850",
      status: "In Stock - Ready",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      sapCode: "SAP-LUBE-PURGE-08",
      name: "Slew Bearing Grease Purge Pack #EP-2",
      fitment: "XCMG XE7000 Mining Excavator",
      location: "Warehouse Bay 02 (Bin A-09)",
      onHand: 12,
      minRequired: 5,
      unitCost: "$320",
      status: "In Stock - Ready",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      sapCode: "SAP-PARK-W200-HP",
      name: "Parker Boom Wiper Pack #W-200",
      fitment: "XCMG XE2000 Mining Excavator",
      location: "Warehouse Bay 01 (Bin C-14)",
      onHand: 0,
      minRequired: 3,
      unitCost: "$940",
      status: "PO-9912 In Transit (ETA 6h)",
      statusColor: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      sapCode: "SAP-FLT-HYD-440",
      name: "High-Pressure Return Filter Element #FLT-440",
      fitment: "Universal Heavy Shovel Fleet",
      location: "Warehouse Bay 02 (Bin B-18)",
      onHand: 18,
      minRequired: 6,
      unitCost: "$480",
      status: "In Stock - Ready",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      sapCode: "SAP-RAD-CORE-1250",
      name: "Hydraulic Oil Cooler Core #RAD-1250",
      fitment: "XCMG XE1250 Mining Excavator",
      location: "Warehouse Yard Staging (Pallet 04)",
      onHand: 2,
      minRequired: 1,
      unitCost: "$6,200",
      status: "In Stock - Ready",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      sapCode: "SAP-RLF-350-CARTRIDGE",
      name: "Main Relief Valve Cartridge 350-Bar",
      fitment: "XCMG XE4000 / XE7000 Heavy Fleet",
      location: "Warehouse Bay 03 (Bin A-02)",
      onHand: 3,
      minRequired: 2,
      unitCost: "$3,450",
      status: "In Stock - Ready",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  ];

  const handleApprove = (id: string) => {
    setCopilotInbox(prev => prev.map(item => item.id === id ? { ...item, approved: true } : item));
  };

  const filteredInventory = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.sapCode.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.fitment.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const kpis = [
    {
      title: "Pending AI Work Orders",
      value: copilotInbox.filter(i => !i.approved).length.toString(),
      icon: Inbox,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "Active Field Mobile Rigs",
      value: "3 / 4",
      icon: Truck,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-100"
    },
    {
      title: "SAP Suku Cadang Ready",
      value: "96.4%",
      icon: Box,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Mean Time to Dispatch (MTTD)",
      value: "14.2m",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
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
            Maintenance CMMS & Warehouse Parts Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Approval meja planner, integrasi API suku cadang SAP ERP, dan penugasan regu mekanik lapangan (*Mobile Service Rig*).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-700">SAP Plant Maintenance (PM) API: LIVE</span>
        </div>
      </div>

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
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{kpi.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200/70 bg-slate-50/50 px-3 pt-2">
          <button 
            onClick={() => setActiveTab("inbox")}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "inbox" 
                ? "border-indigo-600 text-indigo-700 bg-white rounded-t-xl" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" /> 
              <span>Copilot Work Order Inbox</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                {copilotInbox.filter(i => !i.approved).length}
              </span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "inventory" 
                ? "border-indigo-600 text-indigo-700 bg-white rounded-t-xl" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" /> 
              <span>SAP Warehouse Inventory API</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                {inventoryItems.length} Parts Staged
              </span>
            </div>
          </button>
        </div>

        {/* Tab Content: Inbox */}
        {activeTab === "inbox" && (
          <div className="divide-y divide-slate-100">
            {copilotInbox.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md border border-indigo-200/60 font-mono">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.unit} &bull; {item.model}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                    {item.approved && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DISPATCHED
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Hardware CAN-Bus DTC Trigger
                      </div>
                      <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.dtc}</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-100/60 p-3.5 rounded-xl">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                        AI Copilot RAG Engineering Diagnosis
                      </div>
                      <div className="text-xs font-medium text-slate-700 leading-relaxed">
                        {item.diagnosis}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned Mobile Crew: <strong>{item.assignedRig}</strong></span>
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
                    {item.approved ? (
                      <div className="w-full py-2 bg-emerald-50 text-emerald-800 text-center text-xs font-bold rounded-lg border border-emerald-200">
                        Crew Dispatched &bull; En Route
                      </div>
                    ) : item.inventoryStatus === "ok" ? (
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Approve & Dispatch Rig
                      </button>
                    ) : (
                      <button 
                        onClick={() => alert(`Purchase Order expedited to Perth Supplier for ${item.partNumber}`)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
                      >
                        Expedite Emergency PO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Real Warehouse Inventory Table */}
        {activeTab === "inventory" && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Staged Warehouse Parts Inventory</h3>
                <p className="text-xs text-slate-500">Live stock ledger queried by the AI Maintenance Agent to verify repair feasibility.</p>
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
                    <th className="py-3 px-4">Description & OEM Fitment</th>
                    <th className="py-3 px-4">Storage Location</th>
                    <th className="py-3 px-4">Stock on Hand</th>
                    <th className="py-3 px-4">Est. Unit Cost</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
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
                        <button
                          onClick={() => alert(`Part ${item.sapCode} staged to Mobile Rig dispatch bay.`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition text-[11px] cursor-pointer"
                        >
                          Stage Part
                        </button>
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
