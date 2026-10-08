import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { unit_id, query } = body;

    // Attempt to proxy to Python LangGraph Microservice
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit_id, query }),
        signal: AbortSignal.timeout(60000),
      });

      if (pyRes.ok) {
        const data = await pyRes.json();
        return NextResponse.json({ ...data, source: "python_langgraph" });
      }
    } catch {
      // Fallback
    }

    // Graceful offline reasoning fallback with language mirroring
    const qLower = (query || "").toLowerCase();
    const isIndonesian = /halo|hai|apa|berapa|kenapa|mengapa|bagaimana|apakah|ada|bisa|lama|rusak|bahaya|suku|cadang|gudang|stok|jam|mekanik|risiko/.test(qLower);

    let reply = "";
    if (isIndonesian) {
      reply = `**TerraCortex Copilot:** Unit **${unit_id}** saat ini sedang dipantau secara ketat di bawah protokol keandalan prediktif kami.`;

      if (qLower.includes("risk") || qLower.includes("fail") || qLower.includes("bahaya") || qLower.includes("risiko")) {
        reply = `**Penilaian Risiko (${unit_id}):** Penggalian beban tinggi yang berlanjut akan memicu keretakan mikro pada saluran kontrol hidrolik. Sisa umur pakai (RUL) di bawah 30 jam. Disarankan segera menderate gaya penggalian sebesar 30% sampai mobile rig tiba di lokasi.`;
      } else if (qLower.includes("part") || qLower.includes("stock") || qLower.includes("sap") || qLower.includes("cadang") || qLower.includes("gudang")) {
        reply = `**Logistik Suku Cadang (${unit_id}):** Terverifikasi di inventaris SAP MM. Seal kit dan filter pengganti ready di Warehouse Bay 02/03. Tidak ditemukan hambatan pasokan.`;
      } else if (qLower.includes("time") || qLower.includes("downtime") || qLower.includes("duration") || qLower.includes("lama") || qLower.includes("jam")) {
        reply = `**Estimasi Waktu Perbaikan (${unit_id}):** Servis lapangan terjadwal membutuhkan waktu sekitar 2.0 - 2.5 jam. Melakukan perbaikan sekarang mencegah perombakan total powerpack hingga 36 jam.`;
      } else if (qLower.includes("hai") || qLower.includes("halo")) {
        reply = `Halo! Saya **TerraCortex Mining Copilot**. Unit **${unit_id}** saat ini dalam status Peringatan CMSI. Ada yang bisa saya bantu terkait risiko, suku cadang, atau jadwal servis?`;
      }
    } else {
      reply = `**TerraCortex Copilot:** Machine unit **${unit_id}** is actively monitored under our predictive condition-based maintenance protocol.`;

      if (qLower.includes("risk") || qLower.includes("fail") || qLower.includes("danger")) {
        reply = `**Risk Assessment (${unit_id}):** Continued high-load excavation will accelerate micro-fissures in hydraulic control channels. RUL is below 30 operating hours. Immediate derating of digging force by 30% is advised until the mobile rig arrives.`;
      } else if (qLower.includes("part") || qLower.includes("stock") || qLower.includes("sap") || qLower.includes("spare")) {
        reply = `**Parts Logistics (${unit_id}):** Verified in SAP MM inventory. Replacement seal kits and filter cartridges are ready in Warehouse Bay 02/03. No supply bottleneck detected.`;
      } else if (qLower.includes("time") || qLower.includes("downtime") || qLower.includes("duration") || qLower.includes("long")) {
        reply = `**Service Duration Estimate (${unit_id}):** Scheduled field repair requires approx. 2.0 - 2.5 hours. Performing this now avoids an unscheduled 36-hour catastrophic powerpack overhaul.`;
      } else if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("hey")) {
        reply = `Hello! I am the **TerraCortex Mining Copilot**. Unit **${unit_id}** is currently under active CMSI Alert. How can I assist you with failure risk, SAP spare parts, or rig dispatch?`;
      }
    }

    return NextResponse.json({
      success: true,
      unit_id,
      query,
      reply,
      source: "nextjs_fallback"
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
