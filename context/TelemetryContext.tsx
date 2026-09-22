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

  // Periodic micro-pulse simulation when isStreaming is active
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (!prev || !prev.units["EX-04"]) return prev;

        const ex04 = prev.units["EX-04"];
        // Subtle realistic variations in kinematics & pressures
        const pJitter = Number(((Math.random() - 0.5) * 0.4).toFixed(2));
        const newPressure = Math.max(33.5, Math.min(35.5, Number((34.8 + pJitter).toFixed(1))));
        
        const bJitter = Number(((Math.random() - 0.5) * 0.6).toFixed(1));
        const newBoom = Number((34.8 + bJitter).toFixed(1));

        const bucketJitter = Number(((Math.random() - 0.5) * 1.2).toFixed(1));
        const newBucket = Number((91.4 + bucketJitter).toFixed(1));

        const tempJitter = Number(((Math.random() - 0.5) * 0.3).toFixed(1));
        const newTemp = Number((96.4 + tempJitter).toFixed(1));

        const newUnits = {
          ...prev.units,
          "EX-04": {
            ...ex04,
            hydraulic_pressure_mpa: newPressure,
            manifold_temp_c: newTemp,
            kinematics: {
              ...ex04.kinematics,
              boom_angle: newBoom,
              bucket_angle: newBucket,
            },
          },
        };

        return {
          ...prev,
          last_updated: new Date().toISOString(),
          units: newUnits,
        };
      });
    }, 1500);

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
