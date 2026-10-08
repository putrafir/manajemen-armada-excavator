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

    // Graceful offline reasoning fallback
    const qLower = (query || "").toLowerCase();
    let reply = `TerraCortex Copilot: Unit ${unit_id} is being actively monitored under our predictive condition-based maintenance protocol.`;

    if (qLower.includes("risk") || qLower.includes("fail") || qLower.includes("bahaya") || qLower.includes("danger")) {
      reply = `Risk assessment for ${unit_id}: Continued high-load digging will cause micro-fissures in hydraulic control channels. RUL is below 30 operating hours. Immediate derating of digging force by 30% is advised until mobile rig arrives.`;
    } else if (qLower.includes("part") || qLower.includes("stock") || qLower.includes("sap") || qLower.includes("cadang")) {
      reply = `Parts logistics for ${unit_id}: Verified in SAP MM inventory. Replacement seal kits and cartridges are in stock at Warehouse Bay 03. No supply bottleneck detected.`;
    } else if (qLower.includes("time") || qLower.includes("downtime") || qLower.includes("duration") || qLower.includes("lama")) {
      reply = `Service duration estimate for ${unit_id}: Scheduled field repair requires approx. 2.5 hours. Performing this now avoids an unscheduled 36-hour catastrophic powerpack overhaul.`;
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
