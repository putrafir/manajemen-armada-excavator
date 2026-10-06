"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Radio, 
  X,
  ExternalLink,
  MapPin,
  ChevronDown,
  Layers,
  Globe
} from "lucide-react";
import { useTelemetry, PIT_SCOPES, PitScope } from "@/context/TelemetryContext";

interface UnitSearchResult {
  id: string;
  model: string;
  site: string;
  status: "CRITICAL" | "HIGH" | "NOMINAL";
  cmsi: number;
}

const SEARCH_FLEET_INDEX: UnitSearchResult[] = [
  { id: "EX-04", model: "XCMG XE4000 Mining Shovel", site: "Pit 4 North Bench", status: "CRITICAL", cmsi: 94.0 },
  { id: "EX-12", model: "XCMG XE7000 Mining Excavator", site: "Pit 2 West Bench", status: "HIGH", cmsi: 83.1 },
  { id: "EX-17", model: "XCMG XE4000 Mining Shovel", site: "Pit 2 Deep Sump", status: "CRITICAL", cmsi: 92.4 },
  { id: "EX-27", model: "XCMG XE2000 Mining Excavator", site: "Pit 1 North Cut", status: "HIGH", cmsi: 79.4 },
  { id: "EX-33", model: "XCMG XE7000 Mining Excavator", site: "Pit 3 East Highwall", status: "CRITICAL", cmsi: 91.0 },
  { id: "EX-08", model: "XCMG XE1250 Mining Excavator", site: "Pit 4 Waste Dump", status: "HIGH", cmsi: 76.2 },
  { id: "EX-15", model: "XCMG XE2000 Mining Excavator", site: "Pit 3 South Ramp", status: "HIGH", cmsi: 74.5 },
  { id: "EX-19", model: "XCMG XE950G Heavy Excavator", site: "Pit 3 Overburden", status: "NOMINAL", cmsi: 44.0 },
  { id: "EX-31", model: "XCMG XE700D Heavy Excavator", site: "Pit 1 South Cut", status: "NOMINAL", cmsi: 38.6 },
];

export default function Header() {
  const router = useRouter();
  const { isStreaming, toggleStreaming, telemetry, pitScope, setPitScope } = useTelemetry();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [customAssetCount, setCustomAssetCount] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);
  const scopeContainerRef = useRef<HTMLDivElement>(null);

  // Load custom provisioned assets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("terracortex_registered_assets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomAssetCount(parsed.length);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (scopeContainerRef.current && !scopeContainerRef.current.contains(event.target as Node)) {
        setShowScopeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeUnits = (telemetry?.active_units ?? 48) + customAssetCount;
  const latency = telemetry?.latency_ms ?? 42;

  const currentScopeObj = PIT_SCOPES.find(s => s.id === pitScope) || PIT_SCOPES[0];

  // Search matches
  const filteredUnits = searchQuery.trim() === "" ? [] : SEARCH_FLEET_INDEX.filter(u => 
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredUnits.length > 0) {
      router.push(`/diagnostics?unit=${filteredUnits[0].id}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleSelectUnit = (unitId: string) => {
    router.push(`/diagnostics?unit=${unitId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const alarms = [
    {
      unit: "EX-04",
      severity: "CRITICAL",
      msg: "142 Hz Cavitation resonance & differential pressure drop >35 bar",
      pit: "Pit 4 North Bench (-140m RL)",
      time: "4 mins ago"
    },
    {
      unit: "EX-17",
      severity: "CRITICAL",
      msg: "155 Hz Main relief valve acoustic flutter during hard stall",
      pit: "Pit 2 Deep Sump",
      time: "18 mins ago"
    },
    {
      unit: "EX-12",
      severity: "HIGH",
      msg: "88 Hz Slew bearing harmonic shock & boundary film breakdown",
      pit: "Pit 2 West Bench",
      time: "32 mins ago"
    },
    {
      unit: "EX-27",
      severity: "HIGH",
      msg: "12.4 L/min Boom cylinder bypass flow detected on descent",
      pit: "Pit 1 North Cut",
      time: "1 hour ago"
    }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-8 py-3 flex items-center justify-between sticky top-0 z-40 font-sans shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      {/* Left: Stream Toggle & GLOBAL PIT SCOPE SELECTOR */}
      <div className="flex items-center gap-3">
        {/* Stream Toggle */}
        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
            isStreaming
              ? "bg-emerald-50/80 border-emerald-200/70 text-emerald-800 hover:bg-emerald-100/60"
              : "bg-slate-100/80 border-slate-200/70 text-slate-700 hover:bg-slate-200/60"
          }`}
          title="Toggle live telemetry sync"
        >
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming ? "bg-emerald-600" : "bg-slate-400"
              }`}
            ></span>
          </span>
          <span className="font-semibold text-slate-800">{activeUnits} Units Active</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-500 tabular-nums">{latency}ms</span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              isStreaming ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {isStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>

        {/* Global Operational Scope Switcher (All Pits vs Specific Pit) */}
        <div ref={scopeContainerRef} className="relative">
          <button
            onClick={() => setShowScopeDropdown(!showScopeDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 transition cursor-pointer shadow-2xs"
            title="Switch Operational View between Global Site or Specific Pit"
          >
            {pitScope === "ALL" ? (
              <Globe className="w-3.5 h-3.5 text-orange-600" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
            )}
            <span className="truncate max-w-[190px]">{currentScopeObj.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showScopeDropdown && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn text-xs">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Managerial Scope</div>
                  <div className="font-bold text-sm">Select Monitoring Domain</div>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                  {pitScope === "ALL" ? "Global" : "Pit Level"}
                </span>
              </div>

              <div className="p-1.5 divide-y divide-slate-100">
                {PIT_SCOPES.map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => {
                      setPitScope(scope.id);
                      setShowScopeDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                      pitScope === scope.id 
                        ? "bg-orange-50 text-orange-950 font-bold border border-orange-200/70" 
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        {scope.id === "ALL" ? (
                          <Globe className={`w-3.5 h-3.5 ${pitScope === scope.id ? "text-orange-600" : "text-slate-400"}`} />
                        ) : (
                          <MapPin className={`w-3.5 h-3.5 ${pitScope === scope.id ? "text-orange-600" : "text-slate-400"}`} />
                        )}
                        <span>{scope.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 ml-5">
                        {scope.elevation} &bull; {scope.supervisor}
                      </div>
                    </div>

                    {pitScope === scope.id && (
                      <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Search & Notifications */}
      <div className="flex items-center gap-3 text-xs">
        {/* Real Quick-Search Input */}
        <div ref={searchContainerRef} className="relative w-64 hidden lg:block">
          <form onSubmit={handleSearchSubmit}>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search machine (e.g. EX-04)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200/70 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-orange-400 transition shadow-xs"
            />
          </form>

          {/* Quick-Search Results Dropdown */}
          {showSearchResults && filteredUnits.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Excavators ({filteredUnits.length})
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {filteredUnits.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUnit(u.id)}
                    className="w-full text-left p-3 hover:bg-orange-50/60 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="font-mono text-orange-600">{u.id}</span>
                        <span className="text-xs text-slate-700 font-medium">{u.model}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{u.site}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : u.status === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        CMSI {u.cmsi}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real Notification Center Dropdown */}
        <div ref={notifContainerRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition cursor-pointer border relative ${
              showNotifications
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 border-transparent hover:border-slate-200/60"
            }`}
            title="Operational Anomaly Alarms"
          >
            <Bell className="w-4 h-4 stroke-[1.75]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn text-xs">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                  <span className="font-bold">Live Mining Alarms Center</span>
                </div>
                <span className="bg-red-500/30 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/40">
                  4 Active
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {alarms.map((al, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-slate-50 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${al.severity === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`}></span>
                        <span className="font-bold text-slate-900 font-mono">{al.unit}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          al.severity === "CRITICAL" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {al.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{al.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {al.msg}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{al.pit}</span>
                      <Link
                        href={`/diagnostics?unit=${al.unit}`}
                        onClick={() => setShowNotifications(false)}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        Investigate &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  href="/analytics"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-slate-700 hover:text-orange-600 transition"
                >
                  View All CMMS Work Orders &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
