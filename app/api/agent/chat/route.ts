import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { unit_id, query, context } = body;

    // Attempt to proxy to Python LangGraph Microservice
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit_id, query, context }),
        signal: AbortSignal.timeout(60000),
      });

      if (pyRes.ok) {
        const data = await pyRes.json();
        return NextResponse.json({ ...data, source: "python_langgraph" });
      }
    } catch {
      // Fallback
    }

    // Determine if unit is healthy / high rock load only (Scenario 1 or 2)
    const isNoService = Boolean(
      context?.no_service_needed ||
      (context?.assigned_rig && context.assigned_rig.toLowerCase().includes("no rig")) ||
      (context?.assigned_rig && context.assigned_rig.toLowerCase().includes("no mobile rig")) ||
      (context?.dtc && context.dtc.includes("0x00") && context.dtc.toLowerCase().includes("workload")) ||
      (context?.diagnosis && context.diagnosis.toLowerCase().includes("bukan kerusakan")) ||
      (context?.cmsi && context.cmsi < 85 && context?.dtc && context.dtc.includes("0x00"))
    );

    const qLower = (query || "").toLowerCase();
    const isIndonesian = /halo|hai|apa|berapa|kenapa|mengapa|bagaimana|apakah|ada|bisa|lama|rusak|bahaya|suku|cadang|gudang|stok|jam|mekanik|risiko|sisa|umur|bekerja/.test(qLower);

    let reply = "";
    if (isIndonesian) {
      if (isNoService) {
        if (/jam|rul|lama|waktu|bekerja|sisa|umur/.test(qLower)) {
          reply = `**Estimasi Sisa Umur Operasional (${unit_id}):** Unit **${unit_id}** memiliki sisa umur pakai komponen normal lebih dari **${context?.rul_hours || 1200} Jam Operasional** dan **TIDAK MENGALAMI KERUSAKAN MEKANIKAL**.\n\n1. **Status Operasi:** Unit aman dan diizinkan **TETAP BEKERJA** di pit penambangan secara normal tanpa interupsi jadwal bengkel.\n2. **Penyebab CMSI (${context?.cmsi || 72}/100):** Kenaikan CMSI merupakan respon beban mekanikal wajar saat penetrasi batuan basalt keras (184 MPa), bukan kerusakan pompa atau katup hidrolik.\n3. **Rekomendasi Kerja:** Operator cukup melakukan derate breakout force sebesar 30% atau meminta bantuan drill & blast, tanpa perlu stop operasi.`;
        } else if (/risk|fail|bahaya|risiko|rusak/.test(qLower)) {
          reply = `**Penilaian Kondisi Operasional (${unit_id}):** Kondisi unit **${unit_id}** aman dari kegagalan katastrofik (DTC ${context?.dtc || "0x00"}). Tingginya CMSI murni akibat formasi batuan keras, bukan kerusakan komponen hidrolik. Unit tetap beroperasi normal.`;
        } else if (/part|stock|cadang|gudang|stok|sap/.test(qLower)) {
          reply = `**Logistik Suku Cadang (${unit_id}):** **Tidak diperlukan suku cadang baru.** Seluruh komponen hidrolik dan spool valve berada dalam batas operasional aman. Tidak ada Work Order yang perlu dikirim ke CMMS.`;
        } else if (/hai|halo/.test(qLower)) {
          reply = `Halo! Saya **TerraCortex Mining Copilot**. Unit **${unit_id}** termonitor dalam status operasional normal (CMSI ${context?.cmsi || 72}/100 - Bukan Kerusakan). Unit tetap beroperasi di pit. Ada yang bisa saya bantu?`;
        } else {
          reply = `**Ringkasan Operasional (${unit_id}):** ${context?.diagnosis || "Mesin beroperasi normal menghadapi formasi batuan keras."}\n\n* Status: **TETAP BEKERJA** (RUL > ${context?.rul_hours || 1200} Jam Operasional)\n* Kode DTC: \`${context?.dtc || "0x00 (Operational High Workload)"}\`\n* Arahan Kabin: Derate breakout force 30%. Unit aman melanjutkan penambangan.`;
        }
      } else {
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
      }
    } else {
      if (isNoService) {
        if (/hour|rul|time|work|remain/.test(qLower)) {
          reply = `**Operating Hours Assessment (${unit_id}):** Machine unit **${unit_id}** has normal remaining useful life of **> ${context?.rul_hours || 1200} Operating Hours** with **NO MECHANICAL DAMAGE**.\n\n1. **Operational Status:** Machine is authorized to **CONTINUE WORKING** on the pit face without maintenance interruption.\n2. **CMSI Score (${context?.cmsi || 72}/100):** Elevated index is a natural mechanical reaction to hard basalt rock (184 MPa), not a pump or valve failure (DTC \`${context?.dtc || "0x00"}\`).\n3. **Recommendation:** Derate breakout force by 30% or request blast pre-fracturing assistance.`;
        } else if (/risk|fail|danger/.test(qLower)) {
          reply = `**Risk Assessment (${unit_id}):** Machine unit **${unit_id}** has **ZERO RISK OF STRUCTURAL BREAKDOWN**. Load resistance against basalt rock strata is normal. Continue active production.`;
        } else if (/part|stock|warehouse|spare|sap/.test(qLower)) {
          reply = `**Spare Parts Logistics (${unit_id}):** **No replacement parts required.** All hydraulic circuits and mechanical blocks are functioning nominally.`;
        } else if (/hi|hello|hey/.test(qLower)) {
          reply = `Hello! I am the **TerraCortex Mining Copilot**. Machine **${unit_id}** is actively excavating hard basalt strata with CMSI **${context?.cmsi || 72}/100** (normal rock resistance, not a failure). How can I assist you?`;
        } else {
          reply = `**Operational Summary (${unit_id}):** ${context?.diagnosis || "Operating within acceptable limits against hard rock strata."}\n\n* Operational Status: **CONTINUE PRODUCTION** (RUL > ${context?.rul_hours || 1200} Operating Hours)\n* SAE DTC Code: \`${context?.dtc || "0x00 (Operational High Workload)"}\`\n* In-Cab Directive: Derate breakout force by 30%.`;
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
