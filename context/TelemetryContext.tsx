"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PitScope = "ALL" | "pit-4" | "pit-2" | "pit-1" | "pit-3";

export interface PitScopeInfo {
  id: PitScope;
  name: string;
  code: string;
  elevation: string;
  supervisor: string;
}

export const PIT_SCOPES: PitScopeInfo[] = [
  { 
    id: "ALL", 
    name: "Site-Wide Fleet Overview (All Pits)", 
    code: "GLOBAL-FLEET", 
    elevation: "Consolidated RL", 
    supervisor: "Dr. V. Aris (Superintendent)" 
  },
  { 
    id: "pit-4", 
    name: "Pit 4 — North Extraction Basin", 
    code: "PIL-PIT-04", 
    elevation: "-140.40m RL Floor", 
    supervisor: "M. Kowalski (Foreman)" 
  },
  { 
    id: "pit-2", 
    name: "Pit 2 — Central Anthracite Basin", 
    code: "PIL-PIT-02", 
    elevation: "-45.20m RL Bench", 
    supervisor: "R. Chen (Foreman)" 
  },
  { 
    id: "pit-1", 
    name: "Pit 1 — North Ridge Overburden", 
    code: "PIL-PIT-01", 
    elevation: "+80.20m RL Crest", 
    supervisor: "T. Lindqvist (Foreman)" 
  },
  { 
    id: "pit-3", 
    name: "Pit 3 — Drainage Sump & Floor", 
    code: "PIL-PIT-03", 
    elevation: "-210.40m RL Sump", 
    supervisor: "G. Rossi (Foreman)" 
  },
];

export interface Kinematics {
  boom_angle: number;
  arm_reach: number;
  bucket_angle: number;
  slew_speed: number;
}

export interface UnitTelemetry {
  model: string;
  serial: string;
  operator: string;
  status: string;
  cmsi: number;
  hours: string;
  primary_anomaly: string;
  anomaly_detail: string;
  hydraulic_pressure_mpa: number;
  relief_threshold_pct: number;
  manifold_temp_c: number;
  cavitation_freq_hz: number;
  kinematics: Kinematics;
  work_zone: string;
}

export interface TelemetryState {
  status: string;
  stream_status: string;
  latency_ms: number;
  active_units: number;
  total_units: number;
  fleet_health_score: number;
  active_anomalies: number;
  escalation_units: string[];
  last_updated: string;
  units: Record<string, UnitTelemetry>;
}

interface TelemetryContextType {
  telemetry: TelemetryState | null;
  isStreaming: boolean;
  toggleStreaming: () => void;
  refreshTelemetry: () => Promise<void>;
  pitScope: PitScope;
  setPitScope: (scope: PitScope) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [pitScope, setPitScopeState] = useState<PitScope>("ALL");

  // Persist scope in localStorage for consistent session experience
  useEffect(() => {
    try {
      const savedScope = localStorage.getItem("terracortex_pit_scope") as PitScope | null;
      if (savedScope && PIT_SCOPES.some(s => s.id === savedScope)) {
        setPitScopeState(savedScope);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setPitScope = (scope: PitScope) => {
    setPitScopeState(scope);
    try {
      localStorage.setItem("terracortex_pit_scope", scope);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry");
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.error("Telemetry fetch error", e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Poll backend /api/telemetry periodically so external streams are reflected instantly
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      fetchTelemetry();
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const toggleStreaming = () => setIsStreaming((prev) => !prev);

  return (
    <TelemetryContext.Provider
      value={{
        telemetry,
        isStreaming,
        toggleStreaming,
        refreshTelemetry: fetchTelemetry,
        pitScope,
        setPitScope,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return ctx;
}
