import { NextResponse } from "next/server";

// In-memory telemetry state for TerraCortex Fleet Operations
let telemetryState = {
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
      model: "Caterpillar 6040 FS",
      serial: "TC-8829-PX",
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
      model: "Komatsu PC8000-11",
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
      model: "CAT 6040 FS",
      operator: "M. Kowalski",
      cmsi: 94,
      barColor: "bg-red-500",
      primaryAnomaly: "Critical Cavitation Anomaly",
      anomalyDetail: "Pump #2 differential spike (+34 bar)",
      anomalyColor: "text-red-500",
      hours: "4,210",
      actionType: "primary",
      actionLabel: "Work Order",
    },
    {
      rank: "#02",
      dotColor: "bg-amber-500",
      id: "EX-12",
      model: "Komatsu PC8000-11",
      operator: "R. Chen",
      cmsi: 83.1,
      barColor: "bg-amber-500",
      primaryAnomaly: "High Slew Bearing Spike",
      anomalyDetail: "Vibration harmonic 4.2 kHz harmonic",
      anomalyColor: "text-amber-500",
      hours: "6,840",
      actionType: "secondary",
      actionLabel: "Work Order",
    },
    {
      rank: "#03",
      dotColor: "bg-amber-500",
      id: "EX-27",
      model: "Hitachi EX5600-7",
      operator: "J. Botha",
      cmsi: 79.4,
      barColor: "bg-amber-500",
      primaryAnomaly: "Cylinder Seal Bypass",
      anomalyDetail: "Flow bypass detected on boom descent",
      anomalyColor: "text-amber-500",
      hours: "5,110",
      actionType: "secondary",
      actionLabel: "Work Order",
    },
    {
      rank: "#04",
      dotColor: "bg-emerald-500",
      id: "EX-08",
      model: "CAT 6060",
      operator: "S. Tanaka",
      cmsi: 58.2,
      barColor: "bg-emerald-500",
      primaryAnomaly: "Elevated Hydraulic Temp",
      anomalyDetail: "Heat exchanger efficiency down 8%",
      anomalyColor: "text-slate-500",
      hours: "8,920",
      actionType: "secondary",
      actionLabel: "Schedule",
    },
    {
      rank: "#05",
      dotColor: "bg-emerald-500",
      id: "EX-19",
      model: "Liebherr R9800",
      operator: "D. Vance",
      cmsi: 44.0,
      barColor: "bg-emerald-500",
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      anomalyColor: "text-slate-400",
      hours: "2,350",
      actionType: "secondary",
      actionLabel: "Monitor",
    },
    {
      rank: "#06",
      dotColor: "bg-emerald-500",
      id: "EX-31",
      model: "Komatsu PC4000-11",
      operator: "K. Mensah",
      cmsi: 38.6,
      barColor: "bg-emerald-500",
      primaryAnomaly: "Nominal Operating Envelope",
      anomalyDetail: "Baseline operational wear",
      anomalyColor: "text-slate-400",
      hours: "1,140",
      actionType: "secondary",
      actionLabel: "Monitor",
    },
  ],
};

export async function GET() {
  return NextResponse.json(telemetryState);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.unit_id && telemetryState.units[body.unit_id as keyof typeof telemetryState.units]) {
      const u = telemetryState.units[body.unit_id as keyof typeof telemetryState.units];
      if (body.hydraulic_pressure !== undefined) u.hydraulic_pressure_mpa = Number(body.hydraulic_pressure);
      if (body.manifold_temp !== undefined) u.manifold_temp_c = Number(body.manifold_temp);
      if (body.cavitation_freq !== undefined) u.cavitation_freq_hz = Number(body.cavitation_freq);
      if (body.cmsi !== undefined) u.cmsi = Number(body.cmsi);
      if (body.kinematics) u.kinematics = { ...u.kinematics, ...body.kinematics };
    }

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
