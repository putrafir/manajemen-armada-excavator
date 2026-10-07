"use client";

import React, { useState, useMemo } from "react";
import { 
  Cpu, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Wrench, 
  FileText, 
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import WorkOrderModal from "@/components/WorkOrderModal";
import CopilotAgentModal from "@/components/CopilotAgentModal";

export interface FleetUnitInfo {
  id: string;
  model: string;
  sn: string;
  site: string;
  rock: string;
  rockMpa: number;
  cmsi: number;
  status: "critical" | "high" | "nominal";
  component: string;
  faultSummary: string;
  peakHz: number;
  pressureMpa: number;
  tempC: number;
  hours: number;
}

// Generate the 52-unit fleet systematically
const generateFleet = (): FleetUnitInfo[] => {
  const units: FleetUnitInfo[] = [];

  // Top 3 Critical Units
  units.push({
    id: "EX-04",
    model: "XCMG XE4000 Mining Shovel",
    sn: "XCMG-8829-PX",
    site: "Pit 4 North Bench",
    rock: "Hard Basalt",
    rockMpa: 184,
    cmsi: 94.0,
    status: "critical",
    component: "Hydraulic Spool Valve",
    faultSummary: "142 Hz cavitation resonance & valve relief vent",
    peakHz: 142,
    pressureMpa: 34.8,
    tempC: 96.4,
    hours: 4210
  });

  units.push({
    id: "EX-17",
    model: "XCMG XE4000 Mining Shovel",
    sn: "XCMG-4412-MK",
    site: "Pit 2 Deep Sump",
    rock: "Quartz Basalt",
    rockMpa: 178,
    cmsi: 92.4,
    status: "critical",
    component: "Main Relief Valve",
    faultSummary: "155 Hz acoustic valve flutter & high-pressure surge",
    peakHz: 155,
    pressureMpa: 34.2,
    tempC: 94.1,
    hours: 3890
  });

  units.push({
    id: "EX-33",
    model: "XCMG XE7000 Mining Excavator",
    sn: "XCMG-7733-PL",
    site: "Pit 3 East Highwall",
    rock: "Banded Iron Formation",
    rockMpa: 162,
    cmsi: 91.0,
    status: "critical",
    component: "Slew Pinion Gearbox",
    faultSummary: "138 Hz harmonic pinion shock on steep ramp grade",
    peakHz: 138,
    pressureMpa: 32.5,
    tempC: 92.8,
    hours: 5120
  });

  // 5 Elevated / High Units
  units.push({
    id: "EX-12",
    model: "XCMG XE7000 Mining Excavator",
    sn: "XCMG-7104-AZ",
    site: "Pit 2 West Bench",
    rock: "Banded Iron Formation",
    rockMpa: 145,
    cmsi: 83.1,
    status: "high",
    component: "Slew Ring Bearing",
    faultSummary: "88 Hz raceway micro-pitting & grease starvation",
    peakHz: 88,
    pressureMpa: 29.4,
    tempC: 84.1,
    hours: 6840
  });

  units.push({
    id: "EX-27",
    model: "XCMG XE2000 Mining Excavator",
    sn: "XCMG-2741-BK",
    site: "Pit 1 North Cut",
    rock: "Quartzite Vein",
    rockMpa: 138,
    cmsi: 79.4,
    status: "high",
    component: "Boom Cylinder Pack",
    faultSummary: "42 Hz bypass flutter & 12.4 L/min internal drop",
    peakHz: 42,
    pressureMpa: 28.1,
    tempC: 81.3,
    hours: 5110
  });

  units.push({
    id: "EX-08",
    model: "XCMG XE1250 Mining Excavator",
    sn: "XCMG-8910-MT",
    site: "Pit 4 Waste Dump",
    rock: "Weathered Sandstone",
    rockMpa: 92,
    cmsi: 76.2,
    status: "high",
    component: "Oil Cooler Exchanger",
    faultSummary: "28 Hz aerodynamic drag & radiator dust clogging",
    peakHz: 28,
    pressureMpa: 26.5,
    tempC: 88.2,
    hours: 8920
  });

  units.push({
    id: "EX-15",
    model: "XCMG XE2000 Mining Excavator",
    sn: "XCMG-1520-QR",
    site: "Pit 3 South Ramp",
    rock: "Andesite",
    rockMpa: 122,
    cmsi: 74.5,
    status: "high",
    component: "Return Line Filter",
    faultSummary: "54 Hz differential pressure bypass alert",
    peakHz: 54,
    pressureMpa: 27.2,
    tempC: 82.5,
    hours: 4330
  });

  units.push({
    id: "EX-41",
    model: "XCMG XE1250 Mining Excavator",
    sn: "XCMG-4109-TX",
    site: "Pit 5 Overburden",
    rock: "Sandstone Bed",
    rockMpa: 88,
    cmsi: 71.8,
    status: "high",
    component: "Slew Motor Seal Pack",
    faultSummary: "64 Hz seal vibration & shaft seal seepage",
    peakHz: 64,
    pressureMpa: 25.8,
    tempC: 79.4,
    hours: 7400
  });

  // The remaining 44 units (Nominal / Healthy fleet)
  const models = [
    "XCMG XE4000 Mining Shovel",
    "XCMG XE7000 Mining Excavator",
    "XCMG XE2000 Mining Excavator",
    "XCMG XE1250 Mining Excavator",
    "XCMG XE950G Heavy Excavator",
    "XCMG XE700D Heavy Excavator"
  ];
  const rocks = ["Soft Overburden", "Shale & Silt", "Clay Bed", "Weathered Sandstone", "Alluvial Gravel"];

  for (let i = 1; i <= 52; i++) {
    const id = `EX-${i < 10 ? "0" + i : i}`;
    // skip already added
    if (units.some(u => u.id === id)) continue;

    const mod = models[i % models.length];
    const rock = rocks[i % rocks.length];
    const cmsi = Number((28.0 + (i * 3.7) % 28.0).toFixed(1));
    const hz = 12 + (i % 8);

    units.push({
      id,
      model: mod,
      sn: `XCMG-${8000 + i}-OP`,
      site: `Sector ${(i % 5) + 1} Bench`,
      rock,
      rockMpa: 35 + (i % 30),
      cmsi,
      status: "nominal",
      component: "Powerpack & Main Hydraulics",
      faultSummary: "Operating within nominal OEM baseline envelope",
      peakHz: hz,
      pressureMpa: Number((19.5 + (i % 4)).toFixed(1)),
      tempC: Number((66.0 + (i % 10)).toFixed(1)),
      hours: 1200 + i * 110
    });
  }

  // Sort by CMSI descending (highest risk first)
  units.sort((a, b) => b.cmsi - a.cmsi);
  return units;
};

const ALL_FLEET_UNITS = generateFleet();

interface AnomalyLog {
  id: string;
  time: string;
  unit: string;
  subsystem: string;
  description: string;
  severity: "critical" | "high" | "resolved";
  cmsi: number;
}

const mockLogs: AnomalyLog[] = [
  {
    id: "LOG-9921",
    time: "23:42:15",
    unit: "EX-04",
    subsystem: "Hydraulic Spool Valve",
    description: "142 Hz cavitation resonance (34.8 MPa)",
    severity: "critical",
    cmsi: 94
  },
  {
    id: "LOG-9918",
    time: "23:18:04",
    unit: "EX-04",
    subsystem: "Manifold Fluid Temp",
    description: "Thermal excursion 96.4°C (>85°C threshold)",
    severity: "high",
    cmsi: 91
  },
  {
    id: "LOG-9912",
    time: "23:05:40",
    unit: "EX-17",
    subsystem: "Main Relief Valve",
    description: "155 Hz pressure wave oscillation during hard stall",
    severity: "critical",
    cmsi: 92
  },
  {
    id: "LOG-9908",
    time: "22:58:19",
    unit: "EX-33",
    subsystem: "Slew Pinion Gearbox",
    description: "138 Hz harmonic shockwave on grade transition",
    severity: "critical",
    cmsi: 91
  },
  {
    id: "LOG-9905",
    time: "22:50:11",
    unit: "EX-12",
    subsystem: "Slew Gearbox Bearing",
    description: "Harmonic radial vibration 4.8 mm/s @ 88 Hz",
    severity: "high",
    cmsi: 83
  },
  {
    id: "LOG-9892",
    time: "21:30:45",
    unit: "EX-27",
    subsystem: "Distributor O-Ring",
    description: "Internal bypass flow drop 12.4 L/min @ 42 Hz",
    severity: "high",
    cmsi: 79
  },
  {
    id: "LOG-9870",
    time: "20:15:00",
    unit: "EX-08",
    subsystem: "Hydraulic Oil Cooler",
    description: "Radiator dust clogging, delta heat excursion",
    severity: "high",
    cmsi: 76
  },
  {
    id: "LOG-9852",
    time: "19:42:10",
    unit: "EX-15",
    subsystem: "Return Line Filter",
    description: "Filter delta P high warning, 54 Hz flutter",
    severity: "high",
    cmsi: 74
  },
  {
    id: "LOG-9844",
    time: "19:04:22",
    unit: "EX-31",
    subsystem: "Cooler Exchanger",
    description: "Debris blockage cleared, operating nominal",
    severity: "resolved",
    cmsi: 38
  }
];

export default function DiagnosticsPage() {
  const { telemetry } = useTelemetry();
  const [activeUnitId, setActiveUnitId] = useState<string>("EX-04");
  const [activeTab, setActiveTab] = useState<"telemetry" | "events">("telemetry");
  
  // Search and Filter controls for the 52 units
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "high" | "nominal">("all");
  const [fleetDrawerOpen, setFleetDrawerOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState<"all" | "critical" | "high" | "resolved">("all");

  // Modals & Navigation sync
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUnit, setModalUnit] = useState("EX-04");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotUnit, setCopilotUnit] = useState("EX-04");
  const [copilotPrefill, setCopilotPrefill] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customAssets, setCustomAssets] = useState<any[]>([]);

  // Synchronize unit from URL query param (e.g. /diagnostics?unit=EX-12)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("unit");
      if (u) {
        setActiveUnitId(u);
      }
    }
  }, []);

  // Ingest custom provisioned excavators from registry
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("terracortex_registered_assets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomAssets(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openWorkOrder = (unit: string) => {
    setModalUnit(unit);
    setModalOpen(true);
  };

  const openCopilot = (unit: string) => {
    setCopilotUnit(unit);
    setCopilotOpen(true);
  };

  // Sync live telemetry for EX-04 if present
  const ex04Live = telemetry?.units["EX-04"];
  const fleetList = useMemo(() => {
    const list = ALL_FLEET_UNITS.map(u => {
      if (u.id === "EX-04" && ex04Live) {
        return {
          ...u,
          cmsi: ex04Live.cmsi,
          status: ex04Live.cmsi >= 90 ? "critical" : ex04Live.cmsi >= 70 ? "high" : "nominal",
          pressureMpa: ex04Live.hydraulic_pressure_mpa,
          tempC: ex04Live.manifold_temp_c,
          peakHz: ex04Live.cavitation_freq_hz
        };
      }
      return u;
    });

    // Append custom registered assets
    customAssets.forEach(ca => {
      if (!list.some(u => u.id === ca.id)) {
        list.push({
          id: ca.id,
          model: ca.model,
          sn: ca.vin || "VIN-CUSTOM",
          site: ca.site || "Active Mining Sector",
          rock: "Overburden Sandstone",
          rockMpa: 85,
          cmsi: 42.0,
          status: "nominal",
          component: "OEM Baseline Powertrain",
          faultSummary: "Commissioned & synchronized with Edge Gateway",
          peakHz: 18,
          pressureMpa: 21.4,
          tempC: 72.0,
          hours: ca.hours || 0
        });
      }
    });

    return list;
  }, [ex04Live, customAssets]);

  // Filtered fleet list for selector
  const filteredFleet = useMemo(() => {
    return fleetList.filter(u => {
      const matchSearch = 
        u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.site.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSeverity = 
        severityFilter === "all" ? true : u.status === severityFilter;

      return matchSearch && matchSeverity;
    });
  }, [fleetList, searchQuery, severityFilter]);

  // Selected Unit info
  const selectedUnit = fleetList.find(u => u.id === activeUnitId) || fleetList[0];

  // Derive dynamic diagnostic profile for ANY selected unit
  const curr = useMemo(() => {
    const isCrit = selectedUnit.cmsi >= 90;
    const isHigh = selectedUnit.cmsi >= 70;
    const isEx04 = selectedUnit.id === "EX-04";

    // FFT visual coordinates calculation based on peakHz (range 0 to 200 Hz mapped to 0..380px)
    const spikeX = Math.min(350, Math.max(30, Math.round((selectedUnit.peakHz / 200) * 360) + 10));
    const spikeY = isCrit ? 24 : isHigh ? 42 : 108;
    const spikePath = isCrit
      ? `M 10,135 Q ${spikeX - 60},130 ${spikeX - 25},120 L ${spikeX},${spikeY} L ${spikeX + 25},122 Q ${spikeX + 60},128 370,135`
      : isHigh
      ? `M 10,135 Q ${spikeX - 50},130 ${spikeX - 20},122 L ${spikeX},${spikeY} L ${spikeX + 20},124 Q ${spikeX + 50},130 370,135`
      : `M 10,135 Q 40,130 55,124 L ${spikeX},${spikeY} L 80,126 L 180,131 L 280,133 L 370,135`;

    const rulHours = isCrit 
      ? Math.max(12, Math.round(48 - (selectedUnit.cmsi - 90) * 5)) 
      : isHigh 
      ? Math.round(180 + (85 - selectedUnit.cmsi) * 15) 
      : Math.round(3600 + (60 - selectedUnit.cmsi) * 80);

    const rootCauses = isCrit ? [
      { 
        title: "Mechanical Stress Peak", 
        val: `${selectedUnit.rockMpa} MPa Stratum Impact`, 
        sub: `Exceeds recommended rating (+${Math.round((selectedUnit.rockMpa / 144 - 1) * 100)}%)`, 
        crit: true 
      },
      { 
        title: "Harmonic Acoustic Anomaly", 
        val: `${selectedUnit.peakHz} Hz Peak Resonance`, 
        sub: `Component vibration: ${selectedUnit.component}`, 
        crit: true 
      },
      { 
        title: "Component Fatigue Risk", 
        val: `RUL < ${rulHours} Operating Hours`, 
        sub: "Immediate breakdown hazard if unmitigated", 
        crit: true 
      }
    ] : isHigh ? [
      { 
        title: "Elevated Load Anomaly", 
        val: `${selectedUnit.pressureMpa} MPa Operating Line`, 
        sub: `Secondary harmonic detected on ${selectedUnit.component}`, 
        crit: false 
      },
      { 
        title: "Thermal & Vibration Delta", 
        val: `${selectedUnit.tempC}°C Manifold Temperature`, 
        sub: "Accelerated wear envelope observed", 
        crit: false 
      },
      { 
        title: "Scheduled Maintenance Window", 
        val: `RUL ~ ${rulHours} Operating Hours`, 
        sub: "Service recommended at shift change", 
        crit: false 
      }
    ] : [
      { 
        title: "Hydraulic Integrity Nominal", 
        val: `${selectedUnit.pressureMpa} MPa Operating Pressure`, 
        sub: "Within standard manufacturer efficiency band", 
        crit: false 
      },
      { 
        title: "Laminar Fluid & Dynamics", 
        val: `${selectedUnit.peakHz} Hz Baseline Vibration`, 
        sub: "Zero cavitation or structural harmonic spikes", 
        crit: false 
      },
      { 
        title: "Asset Mechanical Health", 
        val: `RUL > ${rulHours} Operating Hours`, 
        sub: "Healthy continuous operation authorized", 
        crit: false 
      }
    ];

    const directives = isCrit ? [
      { 
        id: 1, 
        title: "Derate Digging Envelope Immediately", 
        desc: `Instruct operator to limit breakout angle & avoid full-stroke stall against ${selectedUnit.rock}`, 
        role: "Operator" as const 
      },
      { 
        id: 2, 
        title: `Pre-stage Service Pack for ${selectedUnit.component}`, 
        desc: `Prepare mobile workshop rig and replacement kits at workshop staging area`, 
        role: "Maintenance" as const 
      },
      { 
        id: 3, 
        title: `Issue Priority 1 CMMS Work Order (${selectedUnit.id})`, 
        desc: `Dispatch field mechanics before fatigue threshold crosses critical rupture limit`, 
        role: "Supervisor" as const 
      }
    ] : isHigh ? [
      { 
        id: 1, 
        title: "Limit Heavy Swing & Shock Cycle", 
        desc: `Operate at max 80% throttle to dampen dynamic shocks on ${selectedUnit.component}`, 
        role: "Operator" as const 
      },
      { 
        id: 2, 
        title: "Inspect Fluid Samples & Auto-Lube", 
        desc: `Check viscosity and inspect line filters during next 30-minute scheduled refuel break`, 
        role: "Maintenance" as const 
      },
      { 
        id: 3, 
        title: "Queue for Upcoming Shift Maintenance", 
        desc: `Log into shift handover ledger and assign workshop slot for detailed ultrasound check`, 
        role: "Supervisor" as const 
      }
    ] : [
      { 
        id: 1, 
        title: "Maintain Standard Production Rate", 
        desc: `Operating within standard parameters in ${selectedUnit.site}`, 
        role: "Operator" as const 
      },
      { 
        id: 2, 
        title: "Routine Daily Walkaround Greasing", 
        desc: `Standard daily pre-shift inspection protocol`, 
        role: "Maintenance" as const 
      },
      { 
        id: 3, 
        title: "Log Asset Telemetry to Fleet Ledger", 
        desc: `100% mechanical availability reported`, 
        role: "Supervisor" as const 
      }
    ];

    return {
      id: selectedUnit.id,
      model: selectedUnit.model,
      sn: selectedUnit.sn,
      site: selectedUnit.site,
      rock: selectedUnit.rock,
      rockMpa: `${selectedUnit.rockMpa} MPa`,
      anomalyScore: isCrit ? `MSE 115.3` : isHigh ? `MSE 64.2` : `MSE 12.4`,
      anomalyBadge: isCrit ? "Critical Outlier" : isHigh ? "Elevated Load" : "Nominal Envelope",
      accelWear: isCrit ? "3.4x Velocity" : isHigh ? "1.6x Velocity" : "1.0x Baseline",
      wearDelta: isCrit ? "+1,640 hrs OEM Delta" : isHigh ? "+420 hrs OEM Delta" : "+0 hrs Baseline",
      rul: `${rulHours} Operating Hrs`,
      rulBadge: isCrit ? "Immediate Service" : isHigh ? "Scheduled Service" : "Healthy Fleet Asset",
      cmsi: selectedUnit.cmsi,
      stage1: `100Hz Ingest • ${selectedUnit.pressureMpa} MPa`,
      stage2: `${selectedUnit.rock} • ${selectedUnit.rockMpa} MPa`,
      stage3: isCrit ? `MSE 115.3 • ${selectedUnit.peakHz} Hz Peak` : isHigh ? `MSE 64.2 • ${selectedUnit.peakHz} Hz Spike` : `MSE 12.4 • ${selectedUnit.peakHz} Hz Normal`,
      stage4: `CMSI ${selectedUnit.cmsi} • Priority Rank`,
      rootCauses,
      directives,
      fftPeakText: `${selectedUnit.peakHz} Hz (${selectedUnit.component.split(" ")[0]})`,
      transducer: `Transducer HYD-${selectedUnit.id.replace("EX-", "")}-ACC (${selectedUnit.component})`,
      peakHz: `Peak: ${selectedUnit.peakHz} Hz`,
      spikeX,
      spikeY,
      spikePath,
      hydraulicPressure: selectedUnit.pressureMpa,
      pressureLimitPct: Math.round((selectedUnit.pressureMpa / 35.0) * 100),
      manifoldTemp: selectedUnit.tempC,
      boom: isEx04 && ex04Live ? ex04Live.kinematics.boom_angle : 34.8 + (parseInt(selectedUnit.id.replace("EX-", "")) % 10),
      arm: isEx04 && ex04Live ? ex04Live.kinematics.arm_reach : 8.5 + ((parseInt(selectedUnit.id.replace("EX-", "")) % 5) * 0.2),
      bucket: isEx04 && ex04Live ? ex04Live.kinematics.bucket_angle : 82.0 + (parseInt(selectedUnit.id.replace("EX-", "")) % 15),
      slew: isEx04 && ex04Live ? ex04Live.kinematics.slew_speed : 6.8 + ((parseInt(selectedUnit.id.replace("EX-", "")) % 4) * 0.4),
      isLive: isEx04
    };
  }, [selectedUnit, ex04Live]);

  // Counts for filters
  const criticalCount = fleetList.filter(u => u.status === "critical").length;
  const highCount = fleetList.filter(u => u.status === "high").length;
  const nominalCount = fleetList.filter(u => u.status === "nominal").length;

  const filteredLogs = mockLogs.filter(log => {
    if (eventFilter === "all") return true;
    return log.severity === eventFilter;
  });

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto font-sans pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/70 p-5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600">
                Operations Intelligence Console
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Perception & DTC Diagnostics
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Deterministic sensor telemetry, FFT acoustic vibration analysis, and J1939 fault diagnosis across all 52 fleet assets.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Telemetry & FFT
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "events"
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>DTC Anomaly Feed</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold">
              {mockLogs.filter(l => l.severity === "critical").length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Enterprise Fleet Asset Selector (Supports All 52 Units) */}
      <div className="bg-white border border-slate-200/70 p-4 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans">
        {/* Top Control Bar: Active Target + Search + Filter Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Target: <span className="text-orange-600">{selectedUnit.id}</span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 border-l border-slate-200 pl-2.5">
              {selectedUnit.model} • {selectedUnit.site}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search 52 excavators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-orange-500 w-44 md:w-56"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70">
              <button
                onClick={() => setSeverityFilter("all")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  severityFilter === "all" ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All (52)
              </button>
              <button
                onClick={() => setSeverityFilter("critical")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  severityFilter === "critical" ? "bg-red-100 text-red-800 font-bold border border-red-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Crit ({criticalCount})
              </button>
              <button
                onClick={() => setSeverityFilter("high")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  severityFilter === "high" ? "bg-amber-100 text-amber-800 font-bold border border-amber-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Elevated ({highCount})
              </button>
              <button
                onClick={() => setSeverityFilter("nominal")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  severityFilter === "nominal" ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Nominal ({nominalCount})
              </button>
            </div>

            {/* Toggle Full Fleet Drawer Button */}
            <button
              onClick={() => setFleetDrawerOpen(!fleetDrawerOpen)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{fleetDrawerOpen ? "Hide Fleet Grid" : "All 52 Assets Grid"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${fleetDrawerOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Priority Quick-Select Strip (The 8 Units Requiring Attention) */}
        {!fleetDrawerOpen && (
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>High-Priority Escalation Strip</span>
              <span className="text-slate-400">(Immediate 1-Click Inspection)</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {fleetList.slice(0, 8).map((u) => {
                const isSelected = activeUnitId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setActiveUnitId(u.id)}
                    className={`px-3 py-2 rounded-xl border text-left shrink-0 transition cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? u.status === "critical"
                          ? "bg-red-50 border-red-400 text-red-950 ring-2 ring-red-400/30 shadow-xs"
                          : "bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/30 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.status === "critical"
                          ? "bg-red-500 animate-pulse"
                          : u.status === "high"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{u.id}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">({u.cmsi} CMSI)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {u.component.split(" ")[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Fleet Expandable Grid (52 Units Virtualized/Filtered View) */}
        {fleetDrawerOpen && (
          <div className="pt-1 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredFleet.length} of 52 Fleet Assets (Sorted by CMSI Stress Score)</span>
              <span className="text-[11px] text-slate-400">Click any card to load telemetry & FFT spectrum</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {filteredFleet.map((u) => {
                const isSelected = activeUnitId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveUnitId(u.id);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 shadow-xs"
                        : u.status === "critical"
                        ? "bg-red-50/50 border-red-200 hover:bg-red-50 text-slate-800"
                        : u.status === "high"
                        ? "bg-amber-50/50 border-amber-200 hover:bg-amber-50 text-slate-800"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{u.id}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === "critical"
                            ? "bg-red-500 animate-pulse"
                            : u.status === "high"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                    </div>
                    <div className="text-[9px] text-slate-500 truncate mt-1">{u.model.split(" ")[1]}</div>
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-200/50 text-[9px]">
                      <span className="font-semibold text-slate-600">{u.cmsi}</span>
                      <span className={`font-bold uppercase ${
                        u.status === "critical" ? "text-red-600" : u.status === "high" ? "text-amber-600" : "text-emerald-600"
                      }`}>
                        {u.status === "critical" ? "CRIT" : u.status === "high" ? "WARN" : "OK"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Top Summary KPI Row (4 Cards for the Active Target Unit) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-sans text-xs">
        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">TARGET UNIT</div>
          <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <span>{curr.id}</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-700 font-semibold truncate">{curr.model}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sn: {curr.sn} ({curr.site})</div>
        </div>

        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">ANOMALY RECONSTRUCTION</div>
          <div className={`text-sm font-bold mt-1 ${curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"}`}>
            {curr.anomalyScore}
          </div>
          <div className={`text-[10px] mt-0.5 font-bold ${curr.cmsi >= 90 ? "text-red-600/80" : curr.cmsi >= 70 ? "text-amber-600/80" : "text-emerald-600/80"}`}>
            {curr.anomalyBadge} (Threshold 0.0014)
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="text-[10px] text-slate-500 uppercase font-bold">CMSI STRESS INDEX</div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {curr.cmsi} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{curr.accelWear} ({curr.wearDelta})</div>
        </div>

        <div className={`border p-3.5 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] ${
          curr.cmsi >= 90 ? "bg-red-50 border-red-200" : curr.cmsi >= 70 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className={`text-[10px] uppercase font-bold ${
            curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-700" : "text-emerald-700"
          }`}>
            REMAINING USEFUL LIFE (RUL)
          </div>
          <div className={`text-base font-bold mt-1 ${
            curr.cmsi >= 90 ? "text-red-800" : curr.cmsi >= 70 ? "text-amber-900" : "text-emerald-900"
          }`}>
            {curr.rul}
          </div>
          <div className={`text-[10px] font-semibold ${
            curr.cmsi >= 90 ? "text-red-700" : curr.cmsi >= 70 ? "text-amber-800" : "text-emerald-800"
          }`}>
            {curr.rulBadge}
          </div>
        </div>
      </div>

      {/* 4. Main Body */}
      {activeTab === "telemetry" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column (7 cols) */}
          <div className="xl:col-span-7 space-y-5">
            {/* 4-Stage Reasoning Pipeline */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  Deterministic Reasoning Chain ({curr.id})
                </span>
                <span className="text-emerald-700 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Inference: 1.63ms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 01</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Signal Extraction</div>
                  <div className="text-[10px] text-sky-600 mt-1 font-sans">{curr.stage1}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="text-[9px] text-slate-500 uppercase">Stage 02</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Lithology 1D-CNN</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">{curr.stage2}</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  curr.cmsi >= 90 ? "bg-red-50/70 border-red-200" : curr.cmsi >= 70 ? "bg-amber-50/70 border-amber-200" : "bg-slate-50 border-slate-200/70"
                }`}>
                  <div className={`text-[9px] uppercase font-bold ${
                    curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-700" : "text-slate-500"
                  }`}>Stage 03</div>
                  <div className={`text-xs font-bold mt-1 ${
                    curr.cmsi >= 90 ? "text-red-800" : curr.cmsi >= 70 ? "text-amber-900" : "text-slate-800"
                  }`}>Autoencoder</div>
                  <div className={`text-[10px] mt-1 font-sans ${
                    curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-700" : "text-slate-500"
                  }`}>{curr.stage3}</div>
                </div>

                <div className="bg-orange-50/70 border border-orange-200 p-3 rounded-xl">
                  <div className="text-[9px] text-orange-600 uppercase font-bold">Stage 04</div>
                  <div className="text-xs font-bold text-orange-800 mt-1">CMSI Index</div>
                  <div className="text-[10px] text-orange-600 mt-1 font-sans">{curr.stage4}</div>
                </div>
              </div>
            </div>

            {/* Root-Cause Mechanical Summary */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 font-sans text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"}`} />
                  Root-Cause Mechanical Analysis
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-sans ${
                  curr.cmsi >= 90 ? "bg-red-100 border-red-200 text-red-700" : curr.cmsi >= 70 ? "bg-amber-100 border-amber-200 text-amber-800" : "bg-emerald-100 border-emerald-200 text-emerald-800"
                }`}>
                  {curr.cmsi >= 90 ? "CRITICAL FAULT" : curr.cmsi >= 70 ? "ELEVATED RISK" : "NOMINAL HEALTH"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {curr.rootCauses.map((rc, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${rc.crit ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200/70"}`}>
                    <div className={`font-bold text-[11px] uppercase font-sans ${rc.crit ? "text-red-700" : "text-slate-800"}`}>
                      {rc.title}
                    </div>
                    <div className="text-slate-800 mt-1 font-medium">{rc.val}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{rc.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptive Engineering Directives */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 font-sans text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-600" />
                  Prescriptive Operational Directives ({curr.id})
                </span>
                <span className="text-[10px] text-slate-500 font-sans">{curr.directives.length} Prescribed Actions</span>
              </div>

              <div className="space-y-2 text-xs">
                {curr.directives.map((dir) => (
                  <div key={dir.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-sans font-bold text-[10px] flex items-center justify-center border border-orange-200">
                        {dir.id}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{dir.title}</div>
                        <div className="text-[11px] text-slate-500">{dir.desc}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded border ${
                      dir.role === "Operator" 
                        ? "bg-blue-50 border-blue-200 text-blue-700" 
                        : dir.role === "Maintenance"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-purple-50 border-purple-200 text-purple-700"
                    }`}>
                      {dir.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Copilot & Work Order */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-sans text-xs">
                <button
                  onClick={() => openCopilot(curr.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask CMMS Copilot ({curr.id})
                </button>

                <button
                  onClick={() => openWorkOrder(curr.id)}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Manual Work Order
                </button>

                <button
                  onClick={() => alert(`Telemetry Diagnostic Report for ${curr.id} exported successfully!`)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition border border-slate-200/70 cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Export Telemetry Log
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Oscilloscope & Live Gauges */}
          <div className="xl:col-span-5 space-y-5">
            {/* Oscilloscope */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] font-sans text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                <div>
                  <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${curr.cmsi >= 90 ? "text-red-600" : curr.cmsi >= 70 ? "text-amber-600" : "text-emerald-600"}`} />
                    Acoustic FFT Spectrum
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{curr.transducer}</div>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  curr.cmsi >= 90 ? "bg-red-100 border-red-200 text-red-700" : curr.cmsi >= 70 ? "bg-amber-100 border-amber-200 text-amber-800" : "bg-emerald-100 border-emerald-200 text-emerald-800"
                }`}>
                  {curr.peakHz}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] text-slate-500 font-semibold">
                  BANDWIDTH: 0 - 200 Hz
                </div>
                
                <svg viewBox="0 0 380 150" className="w-full h-40">
                  <defs>
                    <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={curr.cmsi >= 90 ? "#EF4444" : curr.cmsi >= 70 ? "#F59E0B" : "#10B981"} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={curr.cmsi >= 90 ? "#EF4444" : curr.cmsi >= 70 ? "#F59E0B" : "#10B981"} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid */}
                  <line x1="0" y1="30" x2="380" y2="30" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="380" y2="70" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="380" y2="110" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="100" y1="0" x2="100" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="200" y1="0" x2="200" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <line x1="300" y1="0" x2="300" y2="150" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />

                  {/* Baseline */}
                  <path
                    d="M 10,130 Q 80,120 150,125 T 270,128 T 370,132"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />

                  {/* Harmonic Spike */}
                  <path
                    d={curr.spikePath}
                    fill="url(#specGrad)"
                  />
                  <path
                    d={curr.spikePath}
                    fill="none"
                    stroke={curr.cmsi >= 90 ? "#EF4444" : curr.cmsi >= 70 ? "#F59E0B" : "#10B981"}
                    strokeWidth="2.5"
                  />

                  <circle cx={curr.spikeX} cy={curr.spikeY} r="4" fill={curr.cmsi >= 90 ? "#EF4444" : curr.cmsi >= 70 ? "#F59E0B" : "#10B981"} />
                  <circle cx={curr.spikeX} cy={curr.spikeY} r="8" fill="none" stroke={curr.cmsi >= 90 ? "#EF4444" : curr.cmsi >= 70 ? "#F59E0B" : "#10B981"} strokeWidth="1.5" className="animate-ping" />
                  <text x={Math.max(10, curr.spikeX - 45)} y={curr.spikeY - 8} fill={curr.cmsi >= 90 ? "#DC2626" : curr.cmsi >= 70 ? "#D97706" : "#059669"} fontSize="10" fontWeight="bold">
                    {curr.fftPeakText}
                  </text>
                </svg>

                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0 Hz</span>
                  <span>50 Hz</span>
                  <span>100 Hz</span>
                  <span>150 Hz</span>
                  <span>200 Hz</span>
                </div>
              </div>
            </div>

            {/* Live Sensor Stream Gauges */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] font-sans text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Sensor Telemetry Stream ({curr.id})
                </span>
                <span className="text-emerald-700 text-[10px] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {curr.isLive ? "Live CAN-Bus (100Hz)" : "ECU Telemetry Line"}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Pressure Gauge */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Hydraulic Relief Pressure</span>
                    <span className={curr.hydraulicPressure >= 30 ? "text-red-600" : curr.hydraulicPressure >= 26 ? "text-amber-600" : "text-slate-900"}>
                      {curr.hydraulicPressure} MPa ({curr.pressureLimitPct}% of Relief Limit)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${curr.hydraulicPressure >= 30 ? "bg-red-500" : curr.hydraulicPressure >= 26 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, curr.pressureLimitPct)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Manifold Temp */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Manifold Oil Temperature</span>
                    <span className={curr.manifoldTemp >= 85 ? "text-amber-700" : "text-slate-900"}>
                      {curr.manifoldTemp}°C (Safe Threshold: 85°C)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${curr.manifoldTemp >= 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, (curr.manifoldTemp / 120) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Kinematics */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 mt-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">IMU Kinematics Readout</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Boom</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.boom}°</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Arm</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.arm}m</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Bucket</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.bucket}°</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] text-slate-500">Slew</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">{curr.slew} rpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Anomaly Event Feed */
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans text-xs">
          <div className="p-5 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Fleet Anomaly Event Feed (DTC Chronological Log)
              </h2>
              <div className="text-xs text-slate-500 font-sans mt-0.5">
                Real-time chronological sensor triggers & diagnostic trouble codes across the 52-unit fleet
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
              <button
                onClick={() => setEventFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "all" ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] border border-slate-200/70" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All ({mockLogs.length})
              </button>
              <button
                onClick={() => setEventFilter("critical")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "critical" ? "bg-red-100 text-red-800 font-bold border border-red-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Critical ({mockLogs.filter(l => l.severity === "critical").length})
              </button>
              <button
                onClick={() => setEventFilter("high")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "high" ? "bg-amber-100 text-amber-800 font-bold border border-amber-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Elevated ({mockLogs.filter(l => l.severity === "high").length})
              </button>
              <button
                onClick={() => setEventFilter("resolved")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  eventFilter === "resolved" ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Resolved ({mockLogs.filter(l => l.severity === "resolved").length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-700">
              <thead className="bg-slate-100 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Machine</th>
                  <th className="py-3.5 px-6">Subsystem</th>
                  <th className="py-3.5 px-6">Trigger Telemetry</th>
                  <th className="py-3.5 px-6">Severity</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{log.time}</span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      {log.unit}
                    </td>

                    <td className="py-4 px-6 font-sans text-slate-700 font-medium">
                      {log.subsystem}
                    </td>

                    <td className="py-4 px-6 font-sans text-[11px] text-slate-500">
                      {log.description}
                    </td>

                    <td className="py-4 px-6">
                      {log.severity === "critical" && (
                        <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold">
                          CRITICAL
                        </span>
                      )}
                      {log.severity === "high" && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                          ELEVATED
                        </span>
                      )}
                      {log.severity === "resolved" && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          RESOLVED
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveUnitId(log.unit);
                            setActiveTab("telemetry");
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition cursor-pointer text-xs"
                        >
                          View FFT
                        </button>
                        <button
                          onClick={() => openCopilot(log.unit)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Copilot
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

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-slideUp">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Work Order Published</div>
            <div className="text-slate-300 text-[11px] mt-0.5">{toastMessage}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Work Order Modal */}
      <WorkOrderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCopilotPrefill(null);
        }}
        unitId={modalUnit}
        initialValues={copilotPrefill || undefined}
      />

      {/* Copilot Agent Modal */}
      <CopilotAgentModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onApprove={(action, payload) => {
          if (action === "AUTO_DISPATCHED") {
            setToastMessage(`Work Order for ${copilotUnit} queued into CMMS Hub! Awaiting workshop dispatch.`);
            setTimeout(() => setToastMessage(null), 5000);
          } else if (action === "EDIT_MANUAL") {
            setCopilotPrefill(payload);
            setModalUnit(copilotUnit);
            setModalOpen(true);
          }
        }}
        unitId={copilotUnit}
      />
    </div>
  );
}
