"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  HardHat, 
  Plus, 
  Search, 
  CheckCircle2, 
  X, 
  Radio, 
  Cpu, 
  AlertCircle,
  Mountain,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Truck,
  Trash2,
  Check,
  Eye,
  SlidersHorizontal,
  Activity,
  Filter
} from "lucide-react";

export interface AssetRecord {
  id: string;
  model: string;
  vin: string;
  node: string;
  mac: string;
  site: string;
  status: "ACTIVE" | "STANDBY" | "MAINTENANCE";
  tier: string;
  hours: number;
}

const INITIAL_ASSETS: AssetRecord[] = [
  { id: "EX-04", model: "XCMG XE4000 Mining Shovel", vin: "XCMG-902-CN-64", node: "EDGE-XCMG-8829-PX", mac: "00:1A:2B:3C:4D:5E", site: "Sector 4 - North Pit Floor", status: "ACTIVE", tier: "Tier 4F", hours: 4210 },
  { id: "EX-12", model: "XCMG XE7000 Mining Excavator", vin: "XCMG-XE700-12", node: "EDGE-TC-9024-KM", mac: "00:25:96:FF:FE:12", site: "Sector 2 - West Wall Bench", status: "ACTIVE", tier: "Tier 4F", hours: 6840 },
  { id: "EX-17", model: "XCMG XE4000 Mining Shovel", vin: "XCMG-902-CN-17", node: "EDGE-TC-4412-MK", mac: "00:1A:2B:3C:4D:17", site: "Sector 2 - Deep Sump", status: "MAINTENANCE", tier: "Tier 4F", hours: 3890 },
  { id: "EX-27", model: "XCMG XE2000 Mining Excavator", vin: "XCMG-XE200-27", node: "EDGE-TC-3312-LH", mac: "00:1B:44:33:12:AA", site: "Sector 1 - North Pre-Strip", status: "ACTIVE", tier: "Tier 4F", hours: 5110 },
  { id: "EX-08", model: "XCMG XE1250 Mining Excavator", vin: "XCMG-XE1250-08", node: "EDGE-TC-7711-HT", mac: "00:1B:44:77:11:08", site: "Sector 4 - Waste Dump", status: "STANDBY", tier: "Tier 4F", hours: 8920 },
  { id: "EX-15", model: "XCMG XE2000 Mining Excavator", vin: "XCMG-XE200-15", node: "EDGE-TC-1520-QR", mac: "00:1B:44:15:20:QR", site: "Sector 3 - South Ramp", status: "ACTIVE", tier: "Tier 4F", hours: 4330 },
  { id: "EX-19", model: "XCMG XE950G Heavy Excavator", vin: "XCMG-XE950-19", node: "EDGE-TC-4402-HT", mac: "00:1B:44:02:89:94", site: "Sector 3 - Overburden", status: "ACTIVE", tier: "Tier 4", hours: 2350 },
  { id: "EX-31", model: "XCMG XE700D Heavy Excavator", vin: "XCMG-XE700-31", node: "EDGE-TC-4902-TX", mac: "00:1B:44:49:02:TX", site: "Sector 1 - South Cut", status: "ACTIVE", tier: "Tier 4F", hours: 1140 },
  { id: "EX-33", model: "XCMG XE7000 Mining Excavator", vin: "XCMG-XE700-33", node: "EDGE-TC-7733-PL", mac: "00:1B:44:77:33:PL", site: "Sector 3 - Deep East Highwall", status: "MAINTENANCE", tier: "Tier 4F", hours: 5120 },
  { id: "EX-41", model: "XCMG XE1250 Mining Excavator", vin: "XCMG-XE1250-41", node: "EDGE-TC-4109-TX", mac: "00:1B:44:41:09:TX", site: "Sector 4 - North Pit Floor", status: "ACTIVE", tier: "Tier 4F", hours: 7400 },
];

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "sectors">("fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "STANDBY" | "MAINTENANCE">("ALL");
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for provisioning asset
  const [newId, setNewId] = useState("EX-53");
  const [newModel, setNewModel] = useState("XCMG XE4000 Mining Shovel");
  const [newVin, setNewVin] = useState("XCMG-AU-8053-CN");
  const [newSite, setNewSite] = useState("Sector 4 - North Pit Floor");
  const [newTier, setNewTier] = useState("Tier 4F");
  const [newNode, setNewNode] = useState("EDGE-TC-7053-HT");
  const [newMac, setNewMac] = useState("00:1B:44:53:11:AA");

  const [fleetAssets, setFleetAssets] = useState<AssetRecord[]>(() => {
    // Generate base 52 units
    const base: AssetRecord[] = [...INITIAL_ASSETS];
    const models = [
      "XCMG XE4000 Mining Shovel",
      "XCMG XE7000 Mining Excavator",
      "XCMG XE2000 Mining Excavator",
      "XCMG XE1250 Mining Excavator",
      "XCMG XE950G Heavy Excavator",
      "XCMG XE700D Heavy Excavator"
    ];
    const sites = [
      "Sector 4 - North Pit Floor",
      "Sector 2 - West Wall Bench",
      "Sector 1 - North Pre-Strip",
      "Sector 3 - Deep East Highwall"
    ];

    for (let i = 1; i <= 52; i++) {
      const id = `EX-${i < 10 ? "0" + i : i}`;
      if (base.some(a => a.id === id)) continue;

      base.push({
        id,
        model: models[i % models.length],
        vin: `XCMG-AU-${8000 + i}-CN`,
        node: `EDGE-TC-${7000 + i}-HT`,
        mac: `00:1B:44:${(i * 7) % 90 + 10}:${(i * 3) % 90 + 10}:AA`,
        site: sites[i % sites.length],
        status: i % 12 === 0 ? "MAINTENANCE" : i % 7 === 0 ? "STANDBY" : "ACTIVE",
        tier: "Tier 4F",
        hours: 1200 + i * 140
      });
    }

    base.sort((a, b) => a.id.localeCompare(b.id));
    return base;
  });

  // Load and save from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("terracortex_registered_assets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFleetAssets(parsed);
        }
      }
    } catch (e) {
      console.error("Local storage load error", e);
    }
  }, []);

  const saveAssets = (updated: AssetRecord[]) => {
    setFleetAssets(updated);
    try {
      localStorage.setItem("terracortex_registered_assets", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage save error", e);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newId.trim()) return;

    if (fleetAssets.some(a => a.id.toLowerCase() === newId.trim().toLowerCase())) {
      alert(`Asset callsign ${newId} already exists in registry!`);
      return;
    }

    const createdRecord: AssetRecord = {
      id: newId.trim().toUpperCase(),
      model: newModel,
      vin: newVin.trim() || `XCMG-AU-${Math.floor(1000 + Math.random() * 9000)}-CN`,
      node: newNode.trim() || `EDGE-TC-${Math.floor(1000 + Math.random() * 9000)}-HT`,
      mac: newMac.trim() || "00:1B:44:AA:BB:CC",
      site: newSite,
      status: "ACTIVE",
      tier: newTier,
      hours: 0
    };

    const nextList = [createdRecord, ...fleetAssets];
    saveAssets(nextList);

    setSuccessToast(`Excavator ${createdRecord.id} provisioned and connected to ${createdRecord.node}!`);
    setTimeout(() => setSuccessToast(null), 4000);

    const nextNum = parseInt(newId.replace(/[^0-9]/g, "")) || 53;
    setNewId(`EX-${nextNum + 1}`);
    setNewVin(`XCMG-AU-${8000 + nextNum + 1}-CN`);
    setNewNode(`EDGE-TC-${7000 + nextNum + 1}-HT`);
    setShowModal(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm(`Decommission and remove excavator ${id} from fleet registry?`)) {
      const filtered = fleetAssets.filter(a => a.id !== id);
      saveAssets(filtered);
      setSuccessToast(`Excavator ${id} decommissioned.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const sectors = [
    {
      code: "SEC-PIL-04A • BENCH 12B",
      name: "Pilbara Sector 4 - North Pit Floor",
      status: "ACTIVE EXTRACTION",
      statusColor: "bg-emerald-100 text-emerald-800",
      datum: "-140.40m RL",
      step: "Step interval: 12.0m",
      stratum: "Dense Basalt",
      stratumRisk: "184 MPa (High Compressive Wear)",
      units: ["EX-04", "EX-08", "EX-41"],
      capacity: "14 Excavators • 92% Capacity",
      node: "Node-04 Starlink Mesh",
      latency: "42ms • 99.8% Link"
    },
    {
      code: "SEC-PIL-02B • BENCH 09A",
      name: "Pilbara Sector 2 - West Wall Bench",
      status: "ACTIVE EXTRACTION",
      statusColor: "bg-emerald-100 text-emerald-800",
      datum: "-110.00m RL",
      step: "Step interval: 12.0m",
      stratum: "Banded Iron Formation",
      stratumRisk: "145 MPa (Elevated Radial Shock)",
      units: ["EX-12", "EX-17"],
      capacity: "8 Excavators • 75% Capacity",
      node: "Node-02 Starlink Mesh",
      latency: "38ms • 99.9% Link"
    },
    {
      code: "SEC-PIL-01A • BENCH 06C",
      name: "Pilbara Sector 1 - North Pre-Strip",
      status: "ACTIVE EXTRACTION",
      statusColor: "bg-emerald-100 text-emerald-800",
      datum: "-85.00m RL",
      step: "Step interval: 10.0m",
      stratum: "Quartzite Vein & Siltstone",
      stratumRisk: "138 MPa (Moderate Wear)",
      units: ["EX-27", "EX-31"],
      capacity: "10 Excavators • 60% Capacity",
      node: "Node-01 Starlink Mesh",
      latency: "35ms • 100% Link"
    },
    {
      code: "SEC-PIL-03C • SUMP 15",
      name: "Pilbara Sector 3 - Deep East Highwall",
      status: "MONITORED",
      statusColor: "bg-amber-100 text-amber-800",
      datum: "-168.20m RL",
      step: "Step interval: 15.0m",
      stratum: "Pyrite Shale & Chert",
      stratumRisk: "162 MPa (Geotech Slope Watch)",
      units: ["EX-15", "EX-19", "EX-33"],
      capacity: "6 Excavators • 50% Capacity",
      node: "Node-03 Starlink Mesh",
      latency: "44ms • 99.4% Link"
    }
  ];

  // Filtering Logic
  const filteredAssets = useMemo(() => {
    return fleetAssets.filter(a => {
      const matchSearch =
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.site.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
      const matchSector = sectorFilter === "ALL" || a.site.toLowerCase().includes(sectorFilter.toLowerCase());

      return matchSearch && matchStatus && matchSector;
    });
  }, [fleetAssets, searchQuery, statusFilter, sectorFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  const activeCount = fleetAssets.filter(a => a.status === "ACTIVE").length;
  const standbyCount = fleetAssets.filter(a => a.status === "STANDBY").length;
  const maintenanceCount = fleetAssets.filter(a => a.status === "MAINTENANCE").length;

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600">
            Enterprise Fleet Master Data &amp; Mine Geometry
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-orange-600" />
            Fleet Assets &amp; Pit Sector Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Centralized provisioning ledger for heavy mining shovels, IoT telemetry gateways, and open-pit geotechnical datums.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Provision New Excavator
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Provisioned Fleet</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{fleetAssets.length} <span className="text-xs font-normal text-slate-500">Excavators</span></div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">{activeCount} Active &bull; {standbyCount} Standby &bull; {maintenanceCount} PM</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">IoT Telemetry Gateways</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{fleetAssets.length} / {fleetAssets.length} <span className="text-xs font-normal text-slate-500">Nodes</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">100% CAN-Bus J1939 Edge Synced</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Active Mining Pits &amp; Sectors</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">4 <span className="text-xs font-normal text-slate-500">Sectors</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">Pilbara Iron Complex (-168m RL Max)</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Starlink LEO Mesh Uplink</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">99.8% <span className="text-xs font-normal text-slate-500">Uptime</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">Mean Telemetry Latency: 42ms</div>
        </div>
      </div>

      {/* 3. Main Master View: Tabs Navigation */}
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/70 bg-slate-50/50 px-4 pt-2 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("fleet")}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "fleet"
                  ? "border-orange-600 text-orange-700 bg-white rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Fleet Asset Registry ({fleetAssets.length} Units)</span>
            </button>

            <button
              onClick={() => setActiveTab("sectors")}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "sectors"
                  ? "border-orange-600 text-orange-700 bg-white rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>Pit Geometry &amp; Geotech Sectors (4)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Fleet Table with Filters and Pagination */}
        {activeTab === "fleet" && (
          <div>
            {/* Filter and Search Bar */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => { setStatusFilter("ALL"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      statusFilter === "ALL" ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({fleetAssets.length})
                  </button>
                  <button
                    onClick={() => { setStatusFilter("ACTIVE"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      statusFilter === "ACTIVE" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-emerald-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Active ({activeCount})</span>
                  </button>
                  <button
                    onClick={() => { setStatusFilter("STANDBY"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      statusFilter === "STANDBY" ? "bg-amber-500 text-white shadow-2xs" : "text-slate-600 hover:text-amber-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                    <span>Standby ({standbyCount})</span>
                  </button>
                  <button
                    onClick={() => { setStatusFilter("MAINTENANCE"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      statusFilter === "MAINTENANCE" ? "bg-rose-600 text-white shadow-2xs" : "text-slate-600 hover:text-rose-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-300"></span>
                    <span>Maintenance ({maintenanceCount})</span>
                  </button>
                </div>

                {/* Sector Selector */}
                <select
                  value={sectorFilter}
                  onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                >
                  <option value="ALL">All Sectors &amp; Pits</option>
                  <option value="Sector 1">Sector 1 (North Pre-Strip)</option>
                  <option value="Sector 2">Sector 2 (West Wall Bench)</option>
                  <option value="Sector 3">Sector 3 (Deep East Highwall)</option>
                  <option value="Sector 4">Sector 4 (North Pit Floor)</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search callsigh, model, VIN..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-orange-500 w-64 shadow-2xs"
                />
              </div>
            </div>

            {/* Streamlined Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="py-3.5 px-5">Machine ID</th>
                    <th className="py-3.5 px-5">OEM Model &amp; Emission</th>
                    <th className="py-3.5 px-5">Assigned Pit Sector</th>
                    <th className="py-3.5 px-5">Operating Hours</th>
                    <th className="py-3.5 px-5">Operating Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No fleet assets matched your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              asset.status === "ACTIVE" ? "bg-emerald-500" : asset.status === "STANDBY" ? "bg-amber-500" : "bg-red-500"
                            }`} />
                            <span className="font-mono text-sm">{asset.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-slate-900">{asset.model}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{asset.tier} Emission &bull; VIN: {asset.vin}</div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{asset.site}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-mono font-semibold">
                          {asset.hours.toLocaleString("en-US")}h
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-flex items-center gap-1.5 shadow-2xs ${
                            asset.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : asset.status === "STANDBY"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              asset.status === "ACTIVE" ? "bg-emerald-500" : asset.status === "STANDBY" ? "bg-amber-500" : "bg-rose-500"
                            }`}></span>
                            <span>{asset.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedAsset(asset)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="View complete telemetry, edge gateway, and chassis specifications"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              title="Decommission Asset"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200/70 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong>{filteredAssets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredAssets.length)}</strong> of <strong>{filteredAssets.length}</strong> assets
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((pageNum, idx, arr) => (
                    <React.Fragment key={pageNum}>
                      {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-orange-600 text-white shadow-2xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  ))
                }

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pit Sectors Grid */}
        {activeTab === "sectors" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {sectors.map((sec, idx) => (
              <div key={idx} className="bg-slate-50/50 rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>{sec.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sec.statusColor}`}>
                    {sec.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-sans">{sec.name}</h3>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200/70 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Bench Elevation Datum</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{sec.datum}</div>
                    <div className="text-[10px] text-slate-500">{sec.step}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Rock Stratum / Geotech</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{sec.stratum}</div>
                    <div className="text-[10px] font-semibold text-orange-600">{sec.stratumRisk}</div>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>ALLOCATED EXCAVATOR ASSETS</span>
                    <span className="font-bold text-slate-700">{sec.capacity}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.units.map((u, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[11px] font-bold border border-slate-200 shadow-2xs font-mono">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{sec.node} &bull; {sec.latency}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mesh Synced
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASSET SPECIFICATION & TELEMETRY DETAILS MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl w-full shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm font-mono">
                  {selectedAsset.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{selectedAsset.id} &bull; Asset Master Specification</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      selectedAsset.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : selectedAsset.status === "STANDBY"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {selectedAsset.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedAsset.model}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Spec Sections */}
            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              {/* 1. Mechanical & Chassis Identity */}
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Mechanical Chassis &amp; Powertrain</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Chassis VIN / Serial</span>
                    <span className="font-bold font-mono text-slate-900">{selectedAsset.vin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cumulative Engine Hours</span>
                    <span className="font-bold font-mono text-slate-900">{selectedAsset.hours.toLocaleString("en-US")} Operating Hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Emission Compliance</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.tier} (EPA Clean Tier)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Payload Capacity</span>
                    <span className="font-semibold text-slate-800">Mining Shovel Duty Cycle</span>
                  </div>
                </div>
              </div>

              {/* 2. Geotechnical Pit Assignment */}
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Geotechnical Pit Allocation</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assigned Sector</span>
                    <span className="font-bold text-slate-900">{selectedAsset.site}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Elevation Datum Reference</span>
                    <span className="font-semibold text-slate-800">-140.40m to -168.0m RL</span>
                  </div>
                </div>
              </div>

              {/* 3. IoT Edge Gateway Hardware */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl space-y-2">
                <div className="text-[10px] uppercase font-bold text-indigo-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>IoT Edge Telemetry Gateway (SAE J1939 CAN-Bus)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-indigo-400 text-[10px] block">Edge Gateway Node ID</span>
                    <span className="font-bold font-mono text-indigo-950">{selectedAsset.node}</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 text-[10px] block">Hardware MAC Address</span>
                    <span className="font-bold font-mono text-indigo-950">{selectedAsset.mac}</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 text-[10px] block">Telemetry Ingestion Rate</span>
                    <span className="font-semibold text-indigo-900">10 Hz Wavelet Telemetry Stream</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 text-[10px] block">Satellite Link</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Starlink LEO Mesh Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={`/diagnostics?unit=${selectedAsset.id}`}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Open Diagnostics</span>
                </Link>
                <Link
                  href="/fleet-map"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Pit Map</span>
                </Link>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL FUNCTIONAL PROVISIONING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Provision Asset into Fleet Ledger</h3>
                  <p className="text-[11px] text-slate-500">Registers machine chassis, engine tier, and binds IoT telemetry node.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Asset Call Sign</label>
                  <input
                    type="text"
                    required
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="e.g. EX-53"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Emission Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    <option value="Tier 4F">Tier 4 Final (EPA / EU Stage V)</option>
                    <option value="Tier 4">Tier 4 Interim</option>
                    <option value="Tier 2">Tier 2 Heavy Mine Duty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Machine Heavy Model</label>
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                >
                  <option value="XCMG XE4000 Mining Shovel">XCMG XE4000 Mining Shovel (400 Ton)</option>
                  <option value="XCMG XE7000 Mining Excavator">XCMG XE7000 Mining Excavator (700 Ton)</option>
                  <option value="XCMG XE2000 Mining Excavator">XCMG XE2000 Mining Excavator (200 Ton)</option>
                  <option value="XCMG XE1250 Mining Excavator">XCMG XE1250 Mining Excavator (125 Ton)</option>
                  <option value="XCMG XE950G Heavy Excavator">XCMG XE950G Heavy Excavator (95 Ton)</option>
                  <option value="XCMG XE700D Heavy Excavator">XCMG XE700D Heavy Excavator (70 Ton)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Assigned Mining Sector</label>
                <select
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                >
                  <option value="Sector 4 - North Pit Floor">Sector 4 - North Pit Floor (-140m RL)</option>
                  <option value="Sector 2 - West Wall Bench">Sector 2 - West Wall Bench (-110m RL)</option>
                  <option value="Sector 1 - North Pre-Strip">Sector 1 - North Pre-Strip (-85m RL)</option>
                  <option value="Sector 3 - Deep East Highwall">Sector 3 - Deep East Highwall (-168m RL)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Chassis VIN Number</label>
                  <input
                    type="text"
                    value={newVin}
                    onChange={(e) => setNewVin(e.target.value)}
                    placeholder="XCMG-AU-8053-CN"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Edge IoT Node Identifier</label>
                  <input
                    type="text"
                    value={newNode}
                    onChange={(e) => setNewNode(e.target.value)}
                    placeholder="EDGE-TC-7053-HT"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-indigo-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Edge Hardware MAC Address</label>
                <input
                  type="text"
                  value={newMac}
                  onChange={(e) => setNewMac(e.target.value)}
                  placeholder="00:1B:44:53:11:AA"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Provision &amp; Save Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
