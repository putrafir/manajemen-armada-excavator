"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sliders, 
  Plus, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ExternalLink,
  Edit2,
  HardHat,
  Upload,
  X,
  FileCheck
} from "lucide-react";

export default function SiteConfigPage() {
  const [activeSiteFilter, setActiveSiteFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New sector form state
  const [newSecCode, setNewSecCode] = useState("SEC-PIL-05");
  const [newSecName, setNewSecName] = useState("Pilbara Sector 5 - South Deep Cut");
  const [newSecDatum, setNewSecDatum] = useState("-160.00m RL");
  const [newSecStratum, setNewSecStratum] = useState("Dense Basalt / Hematite");
  const [newSecMpa, setNewSecMpa] = useState("192 MPa");
  const [newSecUnits, setNewSecUnits] = useState("EX-04, EX-12");

  const [sectorsList, setSectorsList] = useState([
    {
      id: "sec-1",
      siteGroup: "PILBARA",
      pitId: "pit-4",
      code: "SEC-PIL-04A • BENCH 12B",
      name: "Pilbara Sector 4 - North Pit",
      status: "ACTIVE",
      datum: "-140.40m RL",
      step: "Step interval: 12.0m",
      stratum: "Dense Basalt Sp",
      stratumRisk: "184 MPa (High Wear)",
      units: ["EX-04", "EX-08", "EX-12", "EX-27", "EX-31"],
      capacity: "14 Excavators • 92% Capacity",
      node: "Node-04 Starlink Mesh",
      latency: "42ms • 99.8% QOS"
    },
    {
      id: "sec-2",
      siteGroup: "PILBARA",
      pitId: "pit-4",
      code: "SEC-PIL-04B • BENCH 09A",
      name: "Pilbara Sector 4B - North Bench",
      status: "ACTIVE",
      datum: "-120.00m RL",
      step: "Step interval: 10.0m",
      stratum: "Banded Iron (BI)",
      stratumRisk: "208 MPa (Ultra-Hard)",
      units: ["EX-08", "EX-15", "EX-19", "EX-22"],
      capacity: "11 Excavators • 84% Capacity",
      node: "Node-04B Dual LTE / 5G",
      latency: "18ms • 99.9% QOS"
    },
    {
      id: "sec-3",
      siteGroup: "PILBARA",
      pitId: "pit-2",
      code: "SEC-PIL-02 • WALL BENCH 04",
      name: "Pilbara Sector 2 - West Wall",
      status: "ACTIVE",
      datum: "-80.50m RL",
      step: "Step interval: 15.0m",
      stratum: "Chert & Siderite",
      stratumRisk: "164 MPa (Moderate)",
      units: ["EX-02", "EX-10", "EX-14"],
      capacity: "9 Excavators • 75% Capacity",
      node: "Node-02 Mesh Substation",
      latency: "32ms • 99.4% QOS"
    },
    {
      id: "sec-4",
      siteGroup: "NEWMAN",
      pitId: "pit-2",
      code: "SEC-NWM-01 • DEEP SUMP",
      name: "Newman Sector 1 - Pit 2 Sump",
      status: "ACTIVE",
      datum: "-210.00m RL",
      step: "Step interval: 10.0m",
      stratum: "Hematite High Grade",
      stratumRisk: "172 MPa (Extreme)",
      units: ["EX-17", "EX-23", "EX-29"],
      capacity: "8 Excavators • 88% Capacity",
      node: "Node-01 Sump Gateway",
      latency: "28ms • 99.7% QOS"
    },
    {
      id: "sec-5",
      siteGroup: "NEWMAN",
      pitId: "pit-1",
      code: "SEC-NWM-03 • NORTH RIDGE",
      name: "Newman Sector 3 - Overburden Ridge",
      status: "ACTIVE",
      datum: "+80.20m RL",
      step: "Step interval: 18.0m",
      stratum: "Weathered Siltstone",
      stratumRisk: "82 MPa (Low)",
      units: ["EX-01", "EX-09", "EX-27"],
      capacity: "6 Excavators • 60% Capacity",
      node: "Node-03 Ridge Starlink",
      latency: "45ms • 99.2% QOS"
    },
    {
      id: "sec-6",
      siteGroup: "NEWMAN",
      pitId: "pit-1",
      code: "SEC-NWM-05 • EAST CUT",
      name: "Newman Sector 5 - East Flank",
      status: "INACTIVE",
      datum: "+15.00m RL",
      step: "Step interval: 12.0m",
      stratum: "Argillite Bed",
      stratumRisk: "115 MPa (Moderate)",
      units: ["EX-05", "EX-16"],
      capacity: "4 Excavators • 50% Capacity",
      node: "Node-05 Flank Mesh",
      latency: "36ms • 99.5% QOS"
    },
    {
      id: "sec-7",
      siteGroup: "GOLDFIELDS",
      pitId: "pit-3",
      code: "SEC-GLD-02 • HIGHWALL",
      name: "Goldfields Sector 2 - Pit 3 Highwall",
      status: "ACTIVE",
      datum: "-95.00m RL",
      step: "Step interval: 14.0m",
      stratum: "Quartz Vein & Granite",
      stratumRisk: "195 MPa (Extreme)",
      units: ["EX-15", "EX-33"],
      capacity: "7 Excavators • 70% Capacity",
      node: "Node-07 Highwall Mesh",
      latency: "34ms • 99.6% QOS"
    },
    {
      id: "sec-8",
      siteGroup: "GOLDFIELDS",
      pitId: "pit-3",
      code: "SEC-GLD-04 • DRAINAGE SUMP",
      name: "Goldfields Sector 4 - Drainage Basin",
      status: "ACTIVE",
      datum: "-210.40m RL",
      step: "Step interval: 8.0m",
      stratum: "Andesite Floor",
      stratumRisk: "135 MPa (Moderate)",
      units: ["EX-19", "EX-25"],
      capacity: "5 Excavators • 80% Capacity",
      node: "Node-08 Sump Node",
      latency: "40ms • 99.1% QOS"
    }
  ]);

  const filteredSectors = sectorsList.filter(s => {
    if (activeSiteFilter === "ALL") return true;
    return s.siteGroup === activeSiteFilter;
  });

  const handleAddSectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSec = {
      id: `sec-${Date.now()}`,
      siteGroup: activeSiteFilter === "ALL" ? "PILBARA" : activeSiteFilter,
      pitId: "pit-4",
      code: newSecCode,
      name: newSecName,
      status: "ACTIVE",
      datum: newSecDatum,
      step: "Step interval: 12.0m",
      stratum: newSecStratum,
      stratumRisk: `${newSecMpa} (Custom Spec)`,
      units: newSecUnits.split(",").map(u => u.trim()),
      capacity: `${newSecUnits.split(",").length * 2} Excavators • Allocated`,
      node: "Starlink Telemetry Node",
      latency: "35ms • 99.9% QOS"
    };

    setSectorsList([newSec, ...sectorsList]);
    setShowAddModal(false);
    setToastMessage(`Mining Sector ${newSec.code} provisioned successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImportGeoTiff = (e: React.FormEvent) => {
    e.preventDefault();
    setShowImportModal(false);
    setToastMessage("GeoTIFF elevation model & pit bench geometries imported successfully!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/70 p-6 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest font-sans">
            FLEET CONFIGURATION &bull; SITE GEOTECHNICAL REPOSITORY
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Site &amp; Sector Geotechnical Configuration
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Manage open-cut pit geometries, bench datum elevations, and excavator fleet allocations across active mining sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans text-xs">
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import GeoTIFF / Mine Plan</span>
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sector</span>
          </button>
        </div>
      </div>

      {/* 2. Top Banner Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
        <div className="flex items-center gap-2 text-orange-700 font-bold">
          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
          LEO MESH ACTIVE (Pilbara Hub 04)
        </div>
        <div className="text-slate-500">BENCH RESOLUTION: <strong>0.05m DEM</strong></div>
        <div className="text-slate-500">DATUM: <strong>AHD Newman Ref #09</strong></div>
        <div className="text-slate-500 flex items-center gap-1.5">
          <span className="text-emerald-600 font-bold">&bull;</span> GNSS RTK Constellation Lock: <strong>28 SVs</strong>
        </div>
      </div>

      {/* 3. Four KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 font-sans">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Active Mining Sites</div>
          <div className="text-3xl font-bold text-slate-900 my-1">3 <span className="text-sm font-normal text-slate-500">Operations</span></div>
          <div className="text-[11px] text-slate-500">Pilbara &bull; Newman &bull; Goldfields <strong className="text-emerald-600">(100% Up)</strong></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Configured Sectors</div>
          <div className="text-3xl font-bold text-slate-900 my-1">{sectorsList.length} <span className="text-sm font-normal text-slate-500">Pit Sectors</span></div>
          <div className="text-[11px] text-slate-500">Active Extraction &bull; Continuous Telemetry</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Excavator Allocation</div>
          <div className="text-3xl font-bold text-slate-900 my-1">48 / 52 <span className="text-sm font-normal text-slate-500">Units</span></div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-orange-600 h-full rounded-full" style={{ width: "92%" }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Geotechnical Monitoring</div>
          <div className="text-3xl font-bold text-emerald-600 my-1">100% <span className="text-sm font-normal text-slate-500">Synced</span></div>
          <div className="text-[11px] text-slate-500">In-situ Telemetry &bull; Latency: <strong>32ms</strong></div>
        </div>
      </div>

      {/* 4. Active Sector Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSiteFilter("ALL")}
            className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
              activeSiteFilter === "ALL" ? "bg-orange-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            All Sectors ({sectorsList.length})
          </button>
          <button 
            onClick={() => setActiveSiteFilter("PILBARA")}
            className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
              activeSiteFilter === "PILBARA" ? "bg-orange-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Pilbara Iron (3)
          </button>
          <button 
            onClick={() => setActiveSiteFilter("NEWMAN")}
            className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
              activeSiteFilter === "NEWMAN" ? "bg-orange-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Newman Ridge (3)
          </button>
          <button 
            onClick={() => setActiveSiteFilter("GOLDFIELDS")}
            className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
              activeSiteFilter === "GOLDFIELDS" ? "bg-orange-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Goldfields Basin (2)
          </button>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">Showing {filteredSectors.length} active sectors</div>
      </div>

      {/* 5. Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-sans text-xs">
        {filteredSectors.map((sec) => (
          <div key={sec.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1">
                <span className="font-mono">{sec.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sec.status === "ACTIVE" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>{sec.status}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">{sec.name}</h3>

              {/* Bench & Stratum Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 my-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Bench Elevation Datum</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{sec.datum}</div>
                  <div className="text-[10px] text-slate-500">{sec.step}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Rock Stratum / Geotech</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{sec.stratum}</div>
                  <div className={`text-[10px] font-semibold ${
                    sec.stratumRisk.includes("Extreme") || sec.stratumRisk.includes("High")
                      ? "text-red-600" 
                      : "text-amber-600"
                  }`}>{sec.stratumRisk}</div>
                </div>
              </div>

              {/* Assigned Fleet */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-semibold">
                  <span>ASSIGNED FLEET</span>
                  <span className="font-bold text-slate-700">{sec.capacity}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sec.units.map((u, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Node info & Working Link to Fleet Map */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px]">
              <div className="text-slate-500">
                <div>{sec.node}</div>
                <div className="text-[10px] text-slate-400">{sec.latency}</div>
              </div>
              <Link
                href={`/fleet-map?pit=${sec.pitId}`}
                className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <span>View Pit Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Sector Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Configure New Mining Sector</h3>
                  <p className="text-[11px] text-slate-500">Sets bench datum elevation and excavator quota.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSectorSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Sector Code</label>
                  <input
                    type="text"
                    required
                    value={newSecCode}
                    onChange={(e) => setNewSecCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Elevation Datum</label>
                  <input
                    type="text"
                    required
                    value={newSecDatum}
                    onChange={(e) => setNewSecDatum(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Sector Name</label>
                <input
                  type="text"
                  required
                  value={newSecName}
                  onChange={(e) => setNewSecName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Rock Stratum</label>
                  <input
                    type="text"
                    value={newSecStratum}
                    onChange={(e) => setNewSecStratum(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Strength (MPa)</label>
                  <input
                    type="text"
                    value={newSecMpa}
                    onChange={(e) => setNewSecMpa(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Allocated Excavators (comma separated)</label>
                <input
                  type="text"
                  value={newSecUnits}
                  onChange={(e) => setNewSecUnits(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Save Sector Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import GeoTIFF Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Import Mine Digital Elevation Model</h3>
                  <p className="text-[11px] text-slate-500">Supports GeoTIFF, Surpac .dtm, and Vulcan .00t</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleImportGeoTiff} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-orange-500 transition cursor-pointer bg-slate-50">
                <FileCheck className="w-8 h-8 text-orange-600 mx-auto" />
                <div className="font-bold text-slate-800">Drag &amp; Drop Mine Plan or GeoTIFF</div>
                <div className="text-[11px] text-slate-500">Coordinate reference system: GDA2020 / MGA Zone 50</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Parse &amp; Sync DEM Elevation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
