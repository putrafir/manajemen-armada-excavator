"use client";

import React, { useState } from "react";
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
  ChevronDown
} from "lucide-react";

export default function RegistryPage() {
  const [showModal, setShowModal] = useState(false);

  const fleetAssets = [
    { id: "EX-04", model: "XCMG XE4000 Mining Shovel", vin: "XCMG-902-CN-64", node: "EDGE-XCMG-8829-PX", mac: "00:1A:2B:3C:4D:5E", site: "Sector 4 - North Pit", status: "ACTIVE", tier: "Tier 4F" },
    { id: "EX-12", model: "XCMG XE700D Heavy Excavator", vin: "XCMG-XE700-12", node: "EDGE-TC-9024-KM", mac: "00:25:96:FF:FE:12", site: "Bench 09A - Upper Sill", status: "ACTIVE", tier: "Tier 4F" },
    { id: "EX-19", model: "XCMG XE490D Mining Excavator", vin: "XCMG-XE490-19", node: "EDGE-TC-4402-HT", mac: "00:1B:44:02:89:94", site: "Sector 2 - West Wall", status: "ACTIVE", tier: "Tier 4" },
    { id: "EX-27", model: "XCMG XE950G Heavy Excavator", vin: "XCMG-XE950-27", node: "EDGE-TC-3312-LH", mac: "00:1B:44:33:12:AA", site: "Sector 4 - North Pit", status: "ACTIVE", tier: "Tier 4F" },
    { id: "EX-08", model: "XCMG XE2000 Mining Excavator", vin: "XCMG-XE1250-08", node: "EDGE-TC-7711-HT", mac: "00:1B:44:77:11:08", site: "Bench 12 - Overburden", status: "STANDBY", tier: "Tier 4F" },
  ];

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans">
      {/* 1. Top Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-sans font-bold tracking-wider text-slate-400 uppercase mb-1">
            FLEET CONFIGURATION &bull; ASSET REGISTRY
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Fleet Registry &amp; Hardware Mesh
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Hardware provisioning, Edge-AI node telemetry binding, and excavator assignment across mining sectors.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E65100] hover:bg-[#D84315] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer font-sans shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Asset
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between font-sans">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">TOTAL PROVISIONED ASSETS</div>
            <div className="text-3xl font-bold text-slate-900 my-1">52 <span className="text-sm text-slate-500 font-normal">Units</span></div>
            <div className="text-xs text-emerald-600 font-semibold">48 Active <span className="text-slate-400 font-normal">/ 4 Standby</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <HardHat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between font-sans">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">EDGE-AI NODE MESH</div>
            <div className="text-3xl font-bold text-slate-900 my-1">50 / 52 <span className="text-sm text-slate-500 font-normal">Bound</span></div>
            <div className="text-xs text-amber-700 font-semibold">&bull; 2 Unassigned Hardware Nodes</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Filter & Asset Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter Unit ID, Model, or MAC..." 
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-hidden focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">CLASS:</span>
            <select className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md font-semibold text-slate-700">
              <option>All Classes (XCMG Mining Fleet Classes)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 uppercase text-[11px] text-slate-400 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Unit ID</th>
                <th className="py-3.5 px-6">Machine Class &amp; Model</th>
                <th className="py-3.5 px-6">Edge-AI Node ID / MAC</th>
                <th className="py-3.5 px-6">Sector Assignment</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {fleetAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-orange-100 text-orange-800 flex items-center justify-center font-extrabold">
                        {asset.id.replace("EX-", "")}
                      </span>
                      <span>{asset.id}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{asset.tier}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-sans">
                    <div className="font-bold text-slate-900">{asset.model}</div>
                    <div className="text-[11px] text-slate-400 font-sans">VIN: {asset.vin}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{asset.node}</div>
                    <div className="text-[10px] text-slate-400">{asset.mac}</div>
                  </td>
                  <td className="py-4 px-6 font-sans font-medium text-slate-700">
                    {asset.site}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-sans ${
                      asset.status === "ONLINE_MESH"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    <button className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer">
                      Configure Node &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Register New Asset Modal (Matching Fleet Registry.png) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-sans font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5" />
                  PROVISIONING WIZARD
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                  Register New Asset
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Provision heavy excavator and bind physical Edge-AI node.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 font-sans text-xs">
              {/* Unit Identifier */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>UNIT IDENTIFIER (FLEET TAG)</span>
                  <span className="text-slate-400">Format: EX-##</span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="EX-33" 
                    className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg font-bold text-slate-900 focus:ring-1 focus:ring-orange-500 focus:outline-hidden"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Telemetry and dispatch will resolve to this slug.</span>
              </div>

              {/* Machine Class */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 mb-1">MACHINE CLASS &amp; HEAVY MODEL</div>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                  <option>XCMG XE4000 Mining Shovel</option>
                  <option>XCMG XE7000 Mining Excavator</option>
                  <option>XCMG XE950G Heavy Excavator</option>
                </select>
              </div>

              {/* Chassis VIN */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 mb-1">CHASSIS SERIAL NUMBER / VIN</div>
                <input 
                  type="text" 
                  defaultValue="XCMG-XE4000-8829-CN" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                />
              </div>

              {/* Physical Edge-AI Node */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-orange-700">
                    <Cpu className="w-4 h-4 text-orange-600" />
                    Physical Edge-AI Hardware Node
                  </span>
                  <button className="text-orange-600 hover:underline flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> Scan QR Code
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    defaultValue="EDGE-TC-9410-NX (00:1B:44:11:3A:B7)" 
                    className="flex-1 p-2 bg-white border border-slate-200 rounded text-[11px] font-sans text-slate-800"
                  />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Node Validated
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Hardware specs: Nvidia Jetson Orin Industrial 64GB &bull; <strong>500 TOPS</strong> &bull; Dual CAN-bus
                </div>
              </div>

              {/* Site & Sector */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 mb-1">MINING SITE &amp; OPERATIONAL SECTOR</div>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                  <option>Pilbara Iron Sector 4 - Northern Pit</option>
                  <option>Newman Ridge Bench 44-B</option>
                  <option>Goldfields Pit Valley East</option>
                </select>
              </div>

              {/* Status Radio */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-slate-500 mb-2">INITIAL DEPLOYMENT STATUS</div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="p-3 rounded-lg border-2 border-orange-500 bg-orange-50/40 cursor-pointer block">
                    <input type="radio" name="deploy_status" defaultChecked className="hidden" />
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-600"></span> Active Roster
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                      Bind immediately to dispatch scheduler and RTK live tracking.
                    </div>
                  </label>
                  <label className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer block">
                    <input type="radio" name="deploy_status" className="hidden" />
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> Calibration Bay
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                      Holding state for geotechnical sensor calibration and sweep.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs font-sans transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-[#E65100] hover:bg-[#D84315] text-white font-bold rounded-lg text-xs font-sans shadow-sm transition cursor-pointer"
              >
                Complete Registration &amp; Bind Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
