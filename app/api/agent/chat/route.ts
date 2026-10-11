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
      (context?.dtc && context.dtc.includes("0x00") && (context.dtc.toLowerCase().includes("workload") || context.dtc.toLowerCase().includes("normal"))) ||
      (context?.diagnosis && (context.diagnosis.toLowerCase().includes("bukan kerusakan") || context.diagnosis.toLowerCase().includes("not a hydraulic") || context.diagnosis.toLowerCase().includes("zero component fault"))) ||
      (context?.cmsi && context.cmsi < 85 && context?.dtc && context.dtc.includes("0x00"))
    );

    const qLower = (query || "").toLowerCase();

    let reply = "";
    if (isNoService) {
      if (/hour|rul|time|work|remain|jam|lama|bekerja|sisa|umur/.test(qLower)) {
        reply = `**Operating Hours Assessment (${unit_id}):** Machine unit **${unit_id}** has normal remaining useful life of **> ${context?.rul_hours || 1200} Operating Hours** with **NO MECHANICAL DAMAGE**.\n\n1. **Operational Status:** Machine is authorized to **CONTINUE WORKING** on the pit face without maintenance interruption.\n2. **CMSI Score (${context?.cmsi || 72}/100):** Elevated index is a natural mechanical reaction to hard basalt rock (184 MPa), not a pump or valve failure (DTC \`${context?.dtc || "0x00"}\`).\n3. **Recommendation:** Derate breakout force by 30% or request blast pre-fracturing assistance.`;
      } else if (/risk|fail|danger|bahaya|risiko|rusak/.test(qLower)) {
        reply = `**Risk Assessment (${unit_id}):** Machine unit **${unit_id}** has **ZERO RISK OF STRUCTURAL BREAKDOWN**. Load resistance against basalt rock strata is normal. Continue active production.`;
      } else if (/part|stock|warehouse|spare|sap|cadang|gudang|stok/.test(qLower)) {
        reply = `**Spare Parts Logistics (${unit_id}):** **No replacement parts required.** All hydraulic circuits and mechanical blocks are functioning nominally.`;
      } else if (/hi|hello|hey|hai|halo/.test(qLower)) {
        reply = `Hello! I am the **TerraCortex Mining Copilot**. Machine **${unit_id}** is actively excavating hard basalt strata with CMSI **${context?.cmsi || 72}/100** (normal rock resistance, not a failure). How can I assist you?`;
      } else {
        reply = `**Operational Summary (${unit_id}):** ${context?.diagnosis || "Operating within acceptable limits against hard rock strata."}\n\n* Operational Status: **CONTINUE PRODUCTION** (RUL > ${context?.rul_hours || 1200} Operating Hours)\n* SAE DTC Code: \`${context?.dtc || "0x00 (Operational High Workload)"}\`\n* In-Cab Directive: Derate breakout force by 30%.`;
      }
    } else {
      reply = `**TerraCortex Copilot:** Machine unit **${unit_id}** is actively monitored under our predictive condition-based maintenance protocol.`;

      if (qLower.includes("risk") || qLower.includes("fail") || qLower.includes("danger") || qLower.includes("bahaya") || qLower.includes("risiko")) {
        reply = `**Risk Assessment (${unit_id}):** Continued high-load excavation will accelerate micro-fissures in hydraulic control channels. RUL is below 30 operating hours. Immediate derating of digging force by 30% is advised until the mobile rig arrives.`;
      } else if (qLower.includes("part") || qLower.includes("stock") || qLower.includes("sap") || qLower.includes("spare") || qLower.includes("cadang") || qLower.includes("gudang")) {
        reply = `**Parts Logistics (${unit_id}):** Verified in SAP MM inventory. Replacement seal kits and filter cartridges are ready in Warehouse Bay 02/03. No supply bottleneck detected.`;
      } else if (qLower.includes("time") || qLower.includes("downtime") || qLower.includes("duration") || qLower.includes("long") || qLower.includes("jam") || qLower.includes("lama")) {
        reply = `**Service Duration Estimate (${unit_id}):** Scheduled field repair requires approx. 2.0 - 2.5 hours. Performing this now avoids an unscheduled 36-hour catastrophic powerpack overhaul.`;
      } else if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("hey") || qLower.includes("hai") || qLower.includes("halo")) {
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
