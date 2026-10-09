import { NextResponse } from "next/server";

// In-memory telemetry state for TerraCortex Fleet Operations
let telemetryState: any = {
  status: "ONLINE",
  stream_status: "HEALTHY",
  latency_ms: 42,
  active_units: 48,
  total_units: 52,
  fleet_health_score: 88.4,
  active_anomalies: 14,
  escalation_units: ["EX-04", "EX-12", "EX-27"],
  last_updated: new Date().toISOString(),
  units: {
    "EX-04": {
      model: "XCMG XE4000 Mining Shovel",
      serial: "XCMG-8829-PX",
      operator: "M. Kowalski",
      status: "CRITICAL",
      cmsi: 94.0,
      hours: "4,210",
      primary_anomaly: "Critical Cavitation Anomaly",
      anomaly_detail: "Pump #2 differential spike (+34 bar)",
      hydraulic_pressure_mpa: 34.8,
      relief_threshold_pct: 94,
      manifold_temp_c: 96.4,
      cavitation_freq_hz: 142.0,
      kinematics: {
        boom_angle: 34.8,
        arm_reach: 9.2,
        bucket_angle: 91.4,
        slew_speed: 8.2,
      },
      work_zone: "Sector 4 North Bench (184 MPa Basalt)",
    },
    "EX-12": {
      model: "XCMG XE7000 Mining Excavator",
      serial: "TC-9102-KM",
      operator: "R. Chen",
      status: "WARNING",
      cmsi: 83.1,
      hours: "6,840",
      primary_anomaly: "High Slew Bearing Spike",
      anomaly_detail: "Vibration harmonic 4.2 kHz harmonic",
      hydraulic_pressure_mpa: 29.4,
      relief_threshold_pct: 78,
      manifold_temp_c: 84.1,
      cavitation_freq_hz: 48.0,
      kinematics: {
        boom_angle: 42.1,
        arm_reach: 8.6,
        bucket_angle: 78.2,
        slew_speed: 6.9,
      },
      work_zone: "Sector 2 West Bench (112 MPa Shale)",
    },
  },
  queue: [
    {
      rank: "#01",
      dotColor: "bg-red-500",
      id: "EX-04",
      model: "XCMG XE4000 Mining Shovel",
      operator: "M. Kowalski",
      cmsi: 94,
      barColor: "bg-red-500",
      primaryAnomaly: "Critical Cavitation Anomaly",
      anomalyDetail: "Pump #2 differential spike (+34 bar)",
      anomalyColor: "text-red-500",
      hours: "4,210",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
    {
      rank: "#02",
      dotColor: "bg-red-500",
      id: "EX-17",
      model: "XCMG XE4000 Mining Shovel",
      operator: "A. Weber",
      cmsi: 95.2,
      barColor: "bg-red-500",
      primaryAnomaly: "Main Relief Valve Flutter & Surge",
      anomalyDetail: "155 Hz acoustic valve resonance & pressure surge",
      anomalyColor: "text-red-500",
      hours: "3,890",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
    {
      rank: "#03",
      dotColor: "bg-red-500",
      id: "EX-33",
      model: "XCMG XE7000 Mining Excavator",
      operator: "P. Santos",
      cmsi: 94.4,
      barColor: "bg-red-500",
      primaryAnomaly: "Slew Pinion Gearbox Contact Shock",
      anomalyDetail: "138 Hz harmonic pinion contact shock & gear tooth stress",
      anomalyColor: "text-red-500",
      hours: "5,120",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
    {
      rank: "#04",
      dotColor: "bg-red-500",
      id: "EX-12",
      model: "XCMG XE7000 Mining Excavator",
      operator: "R. Chen",
      cmsi: 93.8,
      barColor: "bg-red-500",
      primaryAnomaly: "Slew Bearing Heavy Harmonic Shock",
      anomalyDetail: "Critical vibration peak 5.8 kHz harmonic on -140m grade",
      anomalyColor: "text-red-500",
      hours: "6,840",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
    {
      rank: "#05",
      dotColor: "bg-red-500",
      id: "EX-19",
      model: "XCMG XE950G Heavy Excavator",
      operator: "D. Vance",
      cmsi: 92.1,
      barColor: "bg-red-500",
      primaryAnomaly: "Hydraulic Return Line Pressure Wave",
      anomalyDetail: "Differential backpressure surge 31.4 MPa in overburden zone",
      anomalyColor: "text-red-500",
      hours: "2,350",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
    {
      rank: "#06",
      dotColor: "bg-red-500",
      id: "EX-08",
      model: "XCMG XE1250 Mining Excavator",
      operator: "S. Tanaka",
      cmsi: 91.5,
      barColor: "bg-red-500",
      primaryAnomaly: "Oil Cooler Radiator Thermal Spike",
      anomalyDetail: "Severe thermal excursion 98.4°C exceeding relief limit",
      anomalyColor: "text-red-500",
      hours: "8,920",
      actionType: "primary",
      actionLabel: "Work Order",
      isCritical: true,
    },
  ],
};

export async function GET() {
  // Apply realistic physical sensor micro-jitter when stream is online
  const now = new Date();
  const jitterP = (Math.sin(now.getTime() / 2500) * 0.4).toFixed(1);
  const jitterT = (Math.cos(now.getTime() / 3200) * 0.3).toFixed(1);
  const jitterF = Math.round(Math.sin(now.getTime() / 1800) * 2.5);
  const latencyJitter = Math.round(41 + Math.sin(now.getTime() / 4000) * 4);

  if (telemetryState.units["EX-04"]) {
    const u = telemetryState.units["EX-04"];
    const baseP = u.hydraulic_pressure_mpa ?? 18.0;
    const baseT = u.manifold_temp_c ?? 55.0;
    const baseF = u.cavitation_freq_hz ?? 18.0;
    u.hydraulic_pressure_mpa = Number((baseP + Number(jitterP) * 0.2).toFixed(1));
    u.manifold_temp_c = Number((baseT + Number(jitterT) * 0.2).toFixed(1));
    u.cavitation_freq_hz = Math.max(10, Math.round(baseF + jitterF * 0.3));
  }
  telemetryState.latency_ms = latencyJitter;
  telemetryState.last_updated = now.toISOString();

  return NextResponse.json(telemetryState);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetId = body.unit_id || "EX-04";

    if (telemetryState.units[targetId]) {
      const u = telemetryState.units[targetId];
      if (body.hydraulic_pressure !== undefined) u.hydraulic_pressure_mpa = Number(body.hydraulic_pressure);
      if (body.manifold_temp !== undefined) u.manifold_temp_c = Number(body.manifold_temp);
      if (body.cavitation_freq !== undefined) u.cavitation_freq_hz = Number(body.cavitation_freq);
      if (body.cmsi !== undefined) u.cmsi = Number(body.cmsi);
      if (body.status !== undefined) u.status = body.status;
      if (body.anomaly_detail) u.anomaly_detail = body.anomaly_detail;
      if (body.primary_anomaly) u.primary_anomaly = body.primary_anomaly;
      if (body.kinematics) u.kinematics = { ...u.kinematics, ...body.kinematics };

      // Update queue item for EX-04
      const qItem = telemetryState.queue.find((q: any) => q.id === targetId);
      if (qItem) {
        qItem.cmsi = u.cmsi;
        if (u.cmsi >= 90) {
          qItem.dotColor = "bg-red-500";
          qItem.barColor = "bg-red-500";
          qItem.isCritical = true;
          qItem.primaryAnomaly = "Hydraulic Cavitation Anomaly";
          qItem.anomalyDetail = u.anomaly_detail || `Relief pressure spike (${u.hydraulic_pressure_mpa} MPa)`;
        } else if (u.cmsi >= 70) {
          qItem.dotColor = "bg-amber-500";
          qItem.barColor = "bg-amber-500";
          qItem.isCritical = false;
          qItem.primaryAnomaly = "Elevated Hydraulic Load";
          qItem.anomalyDetail = u.anomaly_detail || `High line pressure (${u.hydraulic_pressure_mpa} MPa)`;
        } else {
          qItem.dotColor = "bg-emerald-500";
          qItem.barColor = "bg-emerald-500";
          qItem.isCritical = false;
          qItem.primaryAnomaly = "Normal Operating Envelope";
          qItem.anomalyDetail = u.anomaly_detail || `Nominal pressure (${u.hydraulic_pressure_mpa} MPa)`;
        }
      }
    }

    // Re-sort queue by CMSI descending
    telemetryState.queue.sort((a: any, b: any) => b.cmsi - a.cmsi);
    telemetryState.queue.forEach((q: any, i: number) => {
      q.rank = `#0${i + 1}`;
    });

    if (body.fleet_health_score !== undefined) telemetryState.fleet_health_score = Number(body.fleet_health_score);
    if (body.active_anomalies !== undefined) telemetryState.active_anomalies = Number(body.active_anomalies);
    telemetryState.last_updated = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "Telemetry ingested successfully",
      updated_at: telemetryState.last_updated,
      current: telemetryState,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
