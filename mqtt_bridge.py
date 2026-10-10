import os
"""
TerraCortex — MQTT to Next.js Web Bridge
Menghubungkan data live dari ESP32 Echa & Python AI Pipeline (test.mosquitto.org)
ke Web Portal Nafis (http://localhost:3000/api/telemetry).
Mendukung penuh:
- terracortex/dashboard (Hasil lengkap Python AI Pipeline Echa)
- terracortex/telemetry (Data langsung ESP32)
- terracortex/ai_results (Backup compatibility)
"""

import json
import urllib.request
import urllib.error
import paho.mqtt.client as mqtt

BROKER = os.environ.get("MQTT_BROKER", "localhost")
PORT = 1883
TOPICS = [
    "terracortex/dashboard",
    "terracortex/telemetry"
]
WEB_API = "http://localhost:3000/api/telemetry"

# Accumulator for gradual stress monitoring
cumulative_bridge_state = {}

def forward_to_web(payload, topic):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        WEB_API,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=2) as resp:
            print(f"[{topic} -> WEB OK] {payload['unit_id']} | Pressure: {payload['hydraulic_pressure']} MPa ({payload.get('pressure_bar', 0)} bar) | CMSI: {payload['cmsi']} | RPM: {payload['kinematics'].get('engine_rpm', 0)} | Status: {payload['status']}")
    except Exception as e:
        print(f"[{topic} -> WEB ERR] Gagal kirim ke web Next.js: {e}")

def on_connect(client, userdata, flags, rc, properties=None):
    print(f"\n[OK] Terhubung ke Broker MQTT: {BROKER}:{PORT}")
    for t in TOPICS:
        client.subscribe(t)
        print(f"     Subscribed to: '{t}'")
    print("[OK] Siap menerima data dari ESP32 & Python AI Pipeline...")

def on_message(client, userdata, msg):
    raw = msg.payload.decode("utf-8", errors="ignore")
    
    try:
        data = json.loads(raw)
    except Exception:
        print(f"[{msg.topic} RAW NON-JSON]: {raw}")
        return

    # Parse struktur JSON Echa & Arifah Contract
    sensors = data.get("sensors") or {}
    inference = data.get("cortex_inference") or {}

    raw_pressure = (
        sensors.get("hydraulic_pressure_bar") or 
        sensors.get("pressure_bar") or 
        sensors.get("pressure") or 
        data.get("hydraulic_pressure") or 
        data.get("pressure") or 
        220.0
    )
    pressure_bar = float(raw_pressure)
    pressure_mpa = round(pressure_bar / 10.0, 1)

    oil_temp = float(sensors.get("oil_temperature_c") or sensors.get("temp") or data.get("manifold_temp") or 24.0)
    vibration = float(sensors.get("imu_vibration") or sensors.get("vibration") or data.get("vibration") or 1.0)
    soil_strata = inference.get("soil_strata") or data.get("soil_strata") or "NORMAL_SOFT"
    source_id = data.get("excavator_id") or data.get("unit_id") or "XCMG-EX-01"

    # Support tambahan field dari request tablet Arifah & pipeline AI:
    engine_rpm = int(sensors.get("engine_rpm") or (1850 if pressure_bar >= 250 else 1250))
    raw_bucket = sensors.get("bucket_angle")
    
    dtc_code = data.get("dtc_code") or inference.get("dtc_code") or "0x00"
    is_hard_strata = "HARD" in soil_strata.upper() or "BASALT" in soil_strata.upper()
    is_explicit_anomaly = inference.get("is_anomaly") is True or (dtc_code != "0x00" and dtc_code != "0")

    raw_cav = (
        sensors.get("cavitation_freq_hz") or 
        sensors.get("cavitation_hz") or 
        inference.get("cavitation_hz") or 
        data.get("cavitation_freq_hz")
    )

    # 1. Tentukan Skor CMSI
    if "cmsi_score" in inference:
        final_cmsi = float(inference["cmsi_score"])
        cumulative_bridge_state[source_id] = final_cmsi
    elif is_explicit_anomaly or oil_temp >= 90.0 or (raw_cav and float(raw_cav) >= 100.0):
        calc_cmsi = round(min(96.5, 91.0 + max(0.0, pressure_bar - 300.0) * 0.1), 1)
        final_cmsi = calc_cmsi
        cumulative_bridge_state[source_id] = final_cmsi
    elif is_hard_strata or pressure_bar >= 240.0:
        calc_cmsi = round(68.0 + max(0.0, pressure_bar - 240.0) * 0.12, 1)
        final_cmsi = calc_cmsi
        cumulative_bridge_state[source_id] = final_cmsi
    else:
        calc_cmsi = round(28.0 + max(0.0, pressure_bar - 130.0) * 0.12, 1)
        final_cmsi = calc_cmsi
        cumulative_bridge_state[source_id] = final_cmsi

    # 2. Tentukan Status & Anomaly Label
    if final_cmsi >= 88.0 or is_explicit_anomaly or oil_temp >= 90.0:
        status = "CRITICAL"
        is_critical = True
        default_bucket = 85.0
        boom_angle = 34.8
        if oil_temp >= 90.0 or "520301" in dtc_code:
            primary_anomaly = "Radiator Thermal Overheat"
        elif "520210" in dtc_code or (raw_cav and float(raw_cav) >= 150.0):
            primary_anomaly = "Main Relief Valve Flutter"
        elif "520198" in dtc_code or vibration >= 4.0:
            primary_anomaly = "Slew Pinion Gearbox Shock"
        elif "520144" in dtc_code or (pressure_bar <= 145.0 and oil_temp >= 80.0):
            primary_anomaly = "Internal Cylinder Bypass Leakage"
        elif "520150" in dtc_code:
            primary_anomaly = "Main Pump Failure & Stockout"
        else:
            primary_anomaly = "Hydraulic Cavitation Anomaly"
    elif final_cmsi >= 65.0 or is_hard_strata:
        status = "WARNING"
        is_critical = False
        default_bucket = 65.0
        boom_angle = 36.5
        primary_anomaly = "Elevated Hydraulic Load (Hard Strata)"
    else:
        status = "NOMINAL"
        is_critical = False
        default_bucket = 35.0
        boom_angle = 38.0
        primary_anomaly = "Normal Operating Envelope"

    # 3. Frekuensi Kavitasi (Prioritaskan nilai sensor asli)
    if raw_cav is not None:
        final_cavitation = float(raw_cav)
    elif status == "CRITICAL":
        final_cavitation = 142.0
    elif status == "WARNING":
        final_cavitation = 35.0
    else:
        final_cavitation = 20.0

    bucket_angle = float(raw_bucket) if raw_bucket is not None else default_bucket
    action_advisory = inference.get("agent_directive") or inference.get("action_advisory")
    if not action_advisory:
        if status == "CRITICAL":
            action_advisory = f"{primary_anomaly} ({pressure_mpa} MPa / {int(pressure_bar)} bar, {oil_temp}°C)"
        elif status == "WARNING":
            action_advisory = f"High breakout force ({pressure_mpa} MPa) in Hard Strata - Derate 30%"
        else:
            action_advisory = f"Nominal pressure ({pressure_mpa} MPa)"

    raw_id = (data.get("excavator_id") or data.get("unit_id") or "EX-04").replace("XCMG-", "").strip().upper()
    target_unit_id = raw_id if raw_id else "EX-04"

    web_payload = {
        "unit_id": target_unit_id,
        "source_id": source_id,
        "dtc_code": dtc_code,
        "hydraulic_pressure": pressure_mpa,
        "pressure_bar": int(pressure_bar),
        "manifold_temp": oil_temp if oil_temp > 40 else round(oil_temp + (pressure_bar / 4.0), 1),
        "cavitation_freq": final_cavitation,
        "cmsi": final_cmsi,
        "status": status,
        "primary_anomaly": primary_anomaly,
        "anomaly_detail": action_advisory,
        "soil_strata": soil_strata,
        "kinematics": {
            "boom_angle": boom_angle,
            "arm_reach": 9.2,
            "bucket_angle": bucket_angle,
            "slew_speed": round(8.2 if is_critical else 6.5, 1),
            "engine_rpm": engine_rpm
        }
    }

    forward_to_web(web_payload, msg.topic)

if __name__ == "__main__":
    print("=" * 65)
    print(" TerraCortex — Multi-Topic MQTT to Web Portal Live Bridge")
    print(f" Broker : {BROKER}:{PORT}")
    print(f" Topics : {', '.join(TOPICS)}")
    print(f" Target : {WEB_API}")
    print("=" * 65)

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(BROKER, PORT, 60)
        client.loop_forever()
    except KeyboardInterrupt:
        print("\n[STOPPED] Bridge dihentikan.")
