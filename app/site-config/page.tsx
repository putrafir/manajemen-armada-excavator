"use client";

import React from "react";
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
  HardHat
} from "lucide-react";

export default function SiteConfigPage() {
  const sectors = [
    {
      code: "SEC-PIL-04A &bull; BENCH 12B",
      name: "Pilbara Sector 4 - North Pit",
      status: "ACTIVE EXTRACTION",
      statusColor: "bg-orange-100 text-orange-800",
      datum: "-140.40m RL",
      step: "Step interval: 12.0m",
      stratum: "Dense Basalt Sp",
      stratumRisk: "184 MPa (High Wear)",
      riskColor: "text-red-600",
      units: ["EX-04", "EX-09", "EX-12", "EX-27", "EX-31"],
      capacity: "14 Excavators &bull; 92% Capacity",
      node: "Node-04 Starlink Mesh",
      latency: "42ms &bull; 99.8% QOS"
    },
    {
      code: "SEC-PIL-04B &bull; BENCH 09A",
      name: "Pilbara Sector 4B - North Bench",
      status: "ACTIVE EXTRACTION",
      statusColor: "bg-orange-100 text-orange-800",
      datum: "-120.00m RL",
      step: "Step interval: 10.0m",
      stratum: "Banded Iron (BI)",
      stratumRisk: "208 MPa (Ultra-Hard)",
      riskColor: "text-red-700",
      units: ["EX-08", "EX-15", "EX-19", "EX-22"],
      capacity: "11 Excavators &bull; 84% Capacity",
      node: "Node-04B Dual LTE / 5G",
      latency: "18ms &bull; 99.9% QOS"
    },
    {
      code: "SEC-PIL-02 &bull; WALL BENCH 04",
      name: "Pilbara Sector 2 - West Wall",
      status: "OVERBURDEN STRIPPING",
      statusColor: "bg-blue-100 text-blue-800",
      datum: "-80.50m RL",
      step: "Step interval: 15.0m",
      stratum: "Chert &amp; Siderite",
      stratumRisk: "164 MPa (Moderate)",
      riskColor: "text-amber-700",
      units: ["EX-02", "EX-10", "EX-14"],
      capacity: "9 Excavators &bull; 75% Capacity",
      node: "Node-02 Starlink Hybrid",
      latency: "54ms &bull; 98.9% QOS"
    },
    {
      code: "SEC-NR-44B &bull; UPPER SILL",
      name: "Newman Ridge Bench 44-B",
      status: "HARD RIPPING / PRE-SPLIT",
      statusColor: "bg-amber-100 text-amber-800",
      datum: "+210.00m RL",
      step: "Step interval: 8.5m",
      stratum: "Basalt &amp; Gabbro",
      stratumRisk: "195 MPa (Extreme)",
      riskColor: "text-red-700",
      units: ["EX-03", "EX-11", "EX-24"],
      capacity: "8 Excavators &bull; 100% Capacity",
      node: "Node-NR01 Microwave Rel",
      latency: "12ms &bull; 99.9% QOS"
    },
    {
      code: "SEC-GF-01 &bull; VALLEY BASIN",
      name: "Goldfields Pit Valley East",
      status: "SECONDARY BENCHING",
      statusColor: "bg-slate-100 text-slate-800",
      datum: "-45.00m RL",
      step: "Step interval: 15.0m",
      stratum: "Mudstone Overburden",
      stratumRisk: "45 MPa (Soft Rip)",
      riskColor: "text-emerald-700",
      units: ["EX-07", "EX-16", "EX-29"],
      capacity: "6 Excavators &bull; 60% Capacity",
      node: "Goldfields Node-LTE",
      latency: "29ms &bull; 99.4% QOS"
    },
    {
      code: "FAC-DEPOT-03 &bull; MAIN WORKSHOP",
      name: "Staging Bay 03 &amp; Overhaul",
      status: "MAINTENANCE / STAGING",
      statusColor: "bg-rose-100 text-rose-800",
      datum: "+12.50m RL",
      step: "Reinforced Concrete Pad",
      stratum: "Heavy Depot Yard",
      stratumRisk: "500-Ton Gantry Crane",
      riskColor: "text-slate-700",
      units: ["EX-01 (1000h)", "EX-05 (Hydr)", "EX-21", "EX-33"],
      capacity: "4 Units in Maintenance",
      node: "High-Density Fiber Backbone",
      latency: "1ms &bull; 10Gbps"
    }
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans">
      {/* 1. Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-sans font-bold tracking-wider text-slate-400 uppercase mb-1">
            FLEET CONFIGURATION &bull; SITE CONFIGURATION
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Site &amp; Sector Configuration
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Manage open-cut pit geometries, bench datum elevations, and excavator fleet allocations across active mining sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans text-xs">
          <button className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition cursor-pointer">
            Import GeoTIFF / Mine Plan
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-bold rounded-lg shadow-sm transition cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Sector
          </button>
        </div>
      </div>

      {/* 2. Top Banner Telemetry Metrics */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
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
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Active Mining Sites</div>
          <div className="text-3xl font-bold text-slate-900 my-1">3 <span className="text-sm font-normal text-slate-500">Operations</span></div>
          <div className="text-[11px] text-slate-500">Pilbara &bull; Newman &bull; Goldfields <strong className="text-emerald-600">(100% Up)</strong></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Configured Sectors</div>
          <div className="text-3xl font-bold text-slate-900 my-1">8 <span className="text-sm font-normal text-slate-500">Pit Sectors</span></div>
          <div className="text-[11px] text-slate-500">6 Active Extraction &bull; 2 Haul/Strip</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Excavator Allocation</div>
          <div className="text-3xl font-bold text-slate-900 my-1">48 / 52 <span className="text-sm font-normal text-slate-500">Units</span></div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-orange-600 h-full rounded-full" style={{ width: "92%" }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Geotechnical Monitoring</div>
          <div className="text-3xl font-bold text-emerald-600 my-1">100% <span className="text-sm font-normal text-slate-500">Synced</span></div>
          <div className="text-[11px] text-slate-500">In-situ Telemetry &bull; Latency: <strong>32ms</strong></div>
        </div>
      </div>

      {/* 4. Sector Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-xs">All Sectors (8)</button>
          <button className="px-3 py-1.5 text-slate-700 hover:text-slate-900">Pilbara Iron (3)</button>
          <button className="px-3 py-1.5 text-slate-700 hover:text-slate-900">Newman Ridge (3)</button>
          <button className="px-3 py-1.5 text-slate-700 hover:text-slate-900">Goldfields Basin (2)</button>
        </div>
        <div className="text-slate-500">Sort: Datum Elevation</div>
      </div>

      {/* 5. Sector Cards Grid (Matching Site Configuration.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-sans text-xs">
        {sectors.map((sec, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1">
                <span>{sec.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sec.status === "ACTIVE" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>{sec.status}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">{sec.name}</h3>

              {/* Bench & Stratum Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 my-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Bench Elevation Datum</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{sec.datum}</div>
                  <div className="text-[10px] text-slate-500">{sec.step}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Rock Stratum / Geotech</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{sec.stratum}</div>
                  <div className={`text-[10px] font-semibold ${
                    sec.stratumRisk.includes("Extreme") 
                      ? "text-red-600" 
                      : sec.stratumRisk.includes("High") 
                      ? "text-amber-600" 
                      : "text-slate-500"
                  }`}>{sec.stratumRisk}</div>
                </div>
              </div>

              {/* Assigned Fleet */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                  <span>ASSIGNED FLEET</span>
                  <span className="font-bold text-slate-700">{sec.capacity}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sec.units.map((u, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Node info & Link */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px]">
              <div className="text-slate-500">
                <div>{sec.node}</div>
                <div className="text-[10px] text-slate-400">{sec.latency}</div>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer">
                View Fleet Live &gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
