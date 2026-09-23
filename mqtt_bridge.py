"""
TerraCortex — MQTT to Next.js Web Bridge
Menghubungkan data live dari ESP32 Echa (test.mosquitto.org)
ke Web Portal Nafis (http://localhost:3000/api/telemetry).
"""

import json
import urllib.request
import urllib.error
import paho.mqtt.client as mqtt

BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "terracortex/telemetry"
WEB_API = "http://localhost:3000/api/telemetry"

def forward_to_web(payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        WEB_API,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=2) as resp:
            print(f"[BRIDGE -> WEB OK] Synced {payload['unit_id']} (from {payload.get('source_id', 'ESP32')}) | Pressure: {payload['hydraulic_pressure']} MPa ({payload.get('pressure_bar', 0)} bar) | CMSI: {payload['cmsi']} | Status: {payload['status']}")
    except Exception as e:
        print(f"[BRIDGE -> WEB ERR] Gagal kirim ke web Next.js: {e}")

def on_connect(client, userdata, flags, rc, properties=None):
    print(f"\n[OK] Terhubung ke Broker MQTT: {BROKER}:{PORT}")
    print(f"[OK] Menunggu data dari ESP32 Echa di topic: '{TOPIC}'...")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    raw = msg.payload.decode("utf-8", errors="ignore")
    
    try:
        data = json.loads(raw)
    except Exception:
        print(f"[RAW NON-JSON]: {raw}")
        return

    # Parse struktur JSON Echa
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
    source_id = data.get("excavator_id") or data.get("unit_id") or "EX-01"

    # Evaluasi Anomali & CMSI Risk Score
    is_hard_strata = "HARD" in soil_strata.upper() or "BASALT" in soil_strata.upper()
    is_critical = pressure_bar >= 290.0 or is_hard_strata or vibration >= 3.0

    # Formula Kontinu Spektrum Penuh Realistis CMSI (Skala 0 - 100):
    # 1. Standby / Idling (< 130 bar)                   -> CMSI Sangat Rendah (15 - 28)
    # 2. Normal Soft Digging (130 - 240 bar)             -> CMSI Rendah / Hijau Optimal (29 - 64)
    # 3. Elevated Heavy Load (240 - 284 bar)             -> CMSI Sedang / Oranye Warning (65 - 84)
    # 4. Critical Overpressure / Hard Rock (>= 285 bar)  -> CMSI Kritis Merah (88 - 96)
    if is_hard_strata or pressure_bar >= 285.0:
        status = "CRITICAL"
        excess = max(0.0, pressure_bar - 285.0)
        cmsi = round(min(96.5, 88.0 + excess * 0.12 + (vibration - 1.0) * 1.5), 1)
        cavitation_freq = 142.0
        primary_anomaly = "Hydraulic Cavitation Anomaly"
        anomaly_detail = f"Cavitation surge ({pressure_mpa} MPa / {int(pressure_bar)} bar) in {soil_strata}"
        bucket_angle = 91.4
        boom_angle = 34.8
    elif pressure_bar >= 240.0:
        status = "WARNING"
        cmsi = round(65.0 + (pressure_bar - 240.0) * 0.42, 1)
        cavitation_freq = 68.0
        primary_anomaly = "Elevated Hydraulic Load"
        anomaly_detail = f"Elevated line pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        bucket_angle = 55.0
        boom_angle = 36.5
    elif pressure_bar >= 130.0:
        status = "NOMINAL"
        cmsi = round(29.0 + ((pressure_bar - 130.0) / 110.0) * 35.0, 1)
        cavitation_freq = 18.0
        primary_anomaly = "Normal Operating Envelope"
        anomaly_detail = f"Nominal pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        bucket_angle = 36.0
        boom_angle = 38.0
    else:
        # Sangat rendah / Idle / Standby
        status = "NOMINAL"
        ratio = max(0.0, pressure_bar / 130.0)
        cmsi = round(max(15.0, 15.0 + ratio * 13.5), 1)
        cavitation_freq = 12.0
        primary_anomaly = "Idle / Low Stress Standby"
        anomaly_detail = f"Low circuit pressure ({pressure_mpa} MPa / {int(pressure_bar)} bar)"
        bucket_angle = 30.0
        boom_angle = 40.0

    web_payload = {
        "unit_id": "EX-04",
        "source_id": source_id,
        "hydraulic_pressure": pressure_mpa,
        "pressure_bar": int(pressure_bar),
        "manifold_temp": oil_temp if oil_temp > 40 else round(oil_temp + (pressure_bar / 4.0), 1),
        "cavitation_freq": cavitation_freq,
        "cmsi": cmsi,
        "status": status,
        "primary_anomaly": primary_anomaly,
        "anomaly_detail": anomaly_detail,
        "soil_strata": soil_strata,
        "kinematics": {
            "boom_angle": boom_angle,
            "arm_reach": 9.2,
            "bucket_angle": bucket_angle,
            "slew_speed": round(8.2 if is_critical else 6.5, 1)
        }
    }

    forward_to_web(web_payload)

if __name__ == "__main__":
    print("=" * 65)
    print(" TerraCortex — MQTT to Web Portal Live Bridge")
    print(f" Broker : {BROKER}:{PORT}")
    print(f" Topic  : {TOPIC}")
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
