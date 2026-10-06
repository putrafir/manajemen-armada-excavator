"use client";

import React, { useState, useMemo } from "react";
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
  Truck
} from "lucide-react";

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "sectors">("fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 52-unit fleet master asset list
  const fleetAssets = useMemo(() => {
    const list = [
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
      if (list.some(a => a.id === id)) continue;

      list.push({
        id,
        model: models[i % models.length],
        vin: `XCMG-AU-${8000 + i}-CN`,
        node: `EDGE-TC-${7000 + i}-HT`,
        mac: `00:1B:44:${(i*7)%90 + 10}:${(i*3)%90 + 10}:AA`,
        site: `Sector ${(i % 5) + 1} - Pit Floor`,
        status: i % 14 === 0 ? "MAINTENANCE" : "ACTIVE",
        tier: "Tier 4F",
        hours: 1200 + i * 140
      });
    }

    list.sort((a, b) => a.id.localeCompare(b.id));
    return list;
  }, []);

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
            Centralized provisioning ledger for all 52 mining shovels, IoT telemetry gateways, and open-pit geotechnical datums.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Provision New Asset
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Provisioned Fleet</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">52 <span className="text-xs font-normal text-slate-500">Excavators</span></div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">48 Active &bull; 4 Standby/PM</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">IoT Telemetry Gateways</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">52 / 52 <span className="text-xs font-normal text-slate-500">Nodes</span></div>
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
              <span>Fleet Asset Registry (52 Units)</span>
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

        {/* Tab 1: 52-Unit Fleet Table */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
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
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {asset.status}
                      </span>
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

      {/* Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Provision Asset to Fleet Ledger</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Asset Call Sign</label>
                <input type="text" placeholder="e.g. EX-53" className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Machine Heavy Model</label>
                <input type="text" placeholder="e.g. XCMG XE4000 Mining Shovel" className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Edge IoT Gateway MAC</label>
                <input type="text" placeholder="e.g. 00:1B:44:53:11:AB" className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono" />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 font-semibold">Cancel</button>
              <button onClick={() => { alert("Asset registered!"); setShowModal(false); }} className="px-4 py-1.5 bg-orange-600 text-white rounded-lg font-bold">Register Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
