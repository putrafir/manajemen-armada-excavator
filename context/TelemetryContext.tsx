"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);

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

  // Poll backend /api/telemetry periodically so external streams (Echa / MQTT Bridge) are reflected instantly
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
