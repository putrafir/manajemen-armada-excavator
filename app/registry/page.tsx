"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  HardHat, 
  Plus, 
  Search, 
  CheckCircle2, 
  QrCode, 
  SlidersHorizontal, 
  X, 
  Radio, 
  Cpu, 
  AlertCircle,
  ChevronDown,
  Layers,
  Mountain,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Truck,
  Trash2,
  Check
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
  { id: "EX-04", model: "XCMG XE4000 Mining Shovel", vin: "XCMG-902-CN-64", node: "EDGE-XCMG-8829-PX", mac: "00:1A:2B:3C:4D:5E", site: "Sector 4 - North Pit", status: "ACTIVE", tier: "Tier 4F", hours: 4210 },
  { id: "EX-12", model: "XCMG XE7000 Mining Excavator", vin: "XCMG-XE700-12", node: "EDGE-TC-9024-KM", mac: "00:25:96:FF:FE:12", site: "Sector 2 - West Wall", status: "ACTIVE", tier: "Tier 4F", hours: 6840 },
  { id: "EX-17", model: "XCMG XE4000 Mining Shovel", vin: "XCMG-902-CN-17", node: "EDGE-TC-4412-MK", mac: "00:1A:2B:3C:4D:17", site: "Sector 2 - Deep Sump", status: "ACTIVE", tier: "Tier 4F", hours: 3890 },
  { id: "EX-27", model: "XCMG XE2000 Mining Excavator", vin: "XCMG-XE200-27", node: "EDGE-TC-3312-LH", mac: "00:1B:44:33:12:AA", site: "Sector 1 - North Cut", status: "ACTIVE", tier: "Tier 4F", hours: 5110 },
  { id: "EX-08", model: "XCMG XE1250 Mining Excavator", vin: "XCMG-XE1250-08", node: "EDGE-TC-7711-HT", mac: "00:1B:44:77:11:08", site: "Sector 4 - Waste Dump", status: "STANDBY", tier: "Tier 4F", hours: 8920 },
  { id: "EX-15", model: "XCMG XE2000 Mining Excavator", vin: "XCMG-XE200-15", node: "EDGE-TC-1520-QR", mac: "00:1B:44:15:20:QR", site: "Sector 3 - South Ramp", status: "ACTIVE", tier: "Tier 4F", hours: 4330 },
  { id: "EX-19", model: "XCMG XE950G Heavy Excavator", vin: "XCMG-XE950-19", node: "EDGE-TC-4402-HT", mac: "00:1B:44:02:89:94", site: "Sector 3 - Overburden", status: "ACTIVE", tier: "Tier 4", hours: 2350 },
  { id: "EX-31", model: "XCMG XE700D Heavy Excavator", vin: "XCMG-XE700-31", node: "EDGE-TC-4902-TX", mac: "00:1B:44:49:02:TX", site: "Sector 1 - South Cut", status: "ACTIVE", tier: "Tier 4F", hours: 1140 },
  { id: "EX-33", model: "XCMG XE7000 Mining Excavator", vin: "XCMG-XE700-33", node: "EDGE-TC-7733-PL", mac: "00:1B:44:77:33:PL", site: "Sector 3 - East Highwall", status: "ACTIVE", tier: "Tier 4F", hours: 5120 },
  { id: "EX-41", model: "XCMG XE1250 Mining Excavator", vin: "XCMG-XE1250-41", node: "EDGE-TC-4109-TX", mac: "00:1B:44:41:09:TX", site: "Sector 5 - Overburden", status: "ACTIVE", tier: "Tier 4F", hours: 7400 },
];

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "sectors">("fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for provisioning asset
  const [newId, setNewId] = useState("EX-53");
  const [newModel, setNewModel] = useState("XCMG XE4000 Mining Shovel");
  const [newVin, setNewVin] = useState("XCMG-AU-8053-CN");
  const [newSite, setNewSite] = useState("Sector 4 - North Pit");
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

    for (let i = 1; i <= 52; i++) {
      const id = `EX-${i < 10 ? "0" + i : i}`;
      if (base.some(a => a.id === id)) continue;

      base.push({
        id,
        model: models[i % models.length],
        vin: `XCMG-AU-${8000 + i}-CN`,
        node: `EDGE-TC-${7000 + i}-HT`,
        mac: `00:1B:44:${(i*7)%90 + 10}:${(i*3)%90 + 10}:AA`,
        site: `Sector ${(i % 4) + 1} - Pit Floor`,
        status: i % 14 === 0 ? "MAINTENANCE" : "ACTIVE",
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

    // Auto-increment next ID
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
      units: ["EX-04", "EX-09", "EX-12", "EX-27", "EX-31"],
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
      units: ["EX-12", "EX-17", "EX-22"],
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
      units: ["EX-27", "EX-31", "EX-35"],
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

  const filteredAssets = fleetAssets.filter(a => 
    a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = fleetAssets.filter(a => a.status === "ACTIVE").length;

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
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">{activeCount} Active &bull; {fleetAssets.length - activeCount} Standby/PM</div>
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
        <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/50 px-4 pt-2">
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

          {activeTab === "fleet" && (
            <div className="relative pb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search unit, model, VIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-orange-500 w-56"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Fleet Table */}
        {activeTab === "fleet" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="py-3 px-5">Asset ID</th>
                  <th className="py-3 px-5">Model Specification</th>
                  <th className="py-3 px-5">Chassis VIN</th>
                  <th className="py-3 px-5">Assigned Sector</th>
                  <th className="py-3 px-5">IoT Edge Node (MAC)</th>
                  <th className="py-3 px-5">Op Hours</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.status === "ACTIVE" ? "bg-emerald-500" : asset.status === "STANDBY" ? "bg-amber-500" : "bg-red-500"
                      }`} />
                      <span>{asset.id}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">{asset.model}</div>
                      <div className="text-[10px] text-slate-400">{asset.tier} Emission Standard</div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 text-[11px]">
                      {asset.vin}
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium">
                      {asset.site}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-mono text-indigo-700 text-[10px] font-semibold">{asset.node}</div>
                      <div className="font-mono text-[9px] text-slate-400">{asset.mac}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-mono">
                      {asset.hours}h
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        asset.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : asset.status === "STANDBY"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        title="Decommission Asset"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[11px] font-bold border border-slate-200 shadow-2xs">
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
                  <option value="Sector 4 - North Pit">Sector 4 - North Pit Floor (-140m RL)</option>
                  <option value="Sector 2 - West Wall">Sector 2 - West Wall Bench (-110m RL)</option>
                  <option value="Sector 1 - North Cut">Sector 1 - North Pre-Strip (-85m RL)</option>
                  <option value="Sector 3 - South Ramp">Sector 3 - Deep East Highwall (-168m RL)</option>
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
