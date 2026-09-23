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

BROKER = "test.mosquitto.org"
PORT = 1883
TOPICS = [
    "terracortex/dashboard",
    "terracortex/telemetry",
    "terracortex/ai_results"
]
WEB_API = "http://localhost:3000/api/telemetry"

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
    
    is_hard_strata = "HARD" in soil_strata.upper() or "BASALT" in soil_strata.upper()
    is_critical = (
        inference.get("is_anomaly") is True or 
        pressure_bar >= 285.0 or 
        is_hard_strata or 
        vibration >= 3.0
    )

    # Formula Kontinu Spektrum Penuh Realistis CMSI (Skala 0 - 100):
    if is_critical or is_hard_strata or pressure_bar >= 285.0:
        status = "CRITICAL"
        excess = max(0.0, pressure_bar - 285.0)
        calc_cmsi = round(min(96.5, 88.0 + excess * 0.12 + (vibration - 1.0) * 1.5), 1)
        calc_cavitation = 142.0
        primary_anomaly = "Hydraulic Cavitation Anomaly"
        anomaly_detail = f"Cavitation surge ({pressure_mpa} MPa / {int(pressure_bar)} bar) in {soil_strata}"
        default_bucket = 91.4
        boom_angle = 34.8
    elif pressure_bar >= 240.0:
        status = "WARNING"
        calc_cmsi = round(65.0 + (pressure_bar - 240.0) * 0.42, 1)
        calc_cavitation = 68.0
        primary_anomaly = "Elevated Hydraulic Load"
        anomaly_detail = f"Elevated line pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        default_bucket = 55.0
        boom_angle = 36.5
    elif pressure_bar >= 130.0:
        status = "NOMINAL"
        calc_cmsi = round(29.0 + ((pressure_bar - 130.0) / 110.0) * 35.0, 1)
        calc_cavitation = 18.0
        primary_anomaly = "Normal Operating Envelope"
        anomaly_detail = f"Nominal pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        default_bucket = 36.0
        boom_angle = 38.0
    else:
        status = "NOMINAL"
        ratio = max(0.0, pressure_bar / 130.0)
        calc_cmsi = round(max(15.0, 15.0 + ratio * 13.5), 1)
        calc_cavitation = 12.0
        primary_anomaly = "Idle / Low Stress Standby"
        anomaly_detail = f"Low circuit pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        default_bucket = 30.0
        boom_angle = 40.0

    # Gunakan cmsi_score & cavitation_hz langsung dari inference jika pipeline AI menyediakannya
    final_cmsi = float(inference.get("cmsi_score")) if "cmsi_score" in inference else calc_cmsi
    final_cavitation = float(inference.get("cavitation_hz")) if "cavitation_hz" in inference else calc_cavitation
    action_advisory = inference.get("action_advisory") or anomaly_detail
    bucket_angle = float(raw_bucket) if raw_bucket is not None else default_bucket

    web_payload = {
        "unit_id": "EX-04",
        "source_id": source_id,
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
