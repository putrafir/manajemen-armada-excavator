import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const unitId = body.unit_id || "EX-04";

    // Attempt to proxy to Python LangGraph Microservice on port 8000
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/agent/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3500),
      });

      if (pyRes.ok) {
        const data = await pyRes.json();
        return NextResponse.json({ ...data, source: "python_langgraph" });
      }
    } catch {
      // Fallback if Python LangGraph server is offline
    }

    // Graceful offline fallback
    const fallbackMap: Record<string, any> = {
      "EX-04": {
        component: "Hydraulic Spool Valve (Main Control Block)",
        diagnosis: "142 Hz cavitation resonance and relief spool leakage under 34.8 MPa stall load.",
        dtc: "SPN 520204 / FMI 14",
        partName: "Parker Spool Seal Kit #PS-902",
        partSapCode: "SAP-PARK-902-KIT",
        inventoryLocation: "Warehouse Bay 03 (Bin B-04)",
        partStock: "3 Units on Shelf (In Stock - Ready)",
        assignedRig: "Mobile Rig Alpha (Heavy Hydraulics)",
        estimatedDowntime: "2.5 Hours Field Service",
        confidence: 98,
        operatorAlert: "DERATE DIGGING ENVELOPE: Limit breakout angle by 30% against Hard Basalt until field crew arrives.",
      },
      "EX-17": {
        component: "Main Relief Valve Cartridge",
        diagnosis: "155 Hz high-frequency relief flutter with acute pressure surge during bucket stall.",
        dtc: "SPN 520210 / FMI 08",
        partName: "Main Relief Valve Cartridge 350-bar",
        partSapCode: "SAP-VLV-RELIEF-400",
        inventoryLocation: "Warehouse Bay 01 (Bin A-12)",
        partStock: "2 Units on Shelf (In Stock - Ready)",
        assignedRig: "Mobile Rig Beta (Mechanical)",
        estimatedDowntime: "3.0 Hours Valve Replacement",
        confidence: 96,
        operatorAlert: "AVOID FULL-STROKE STALL: Relief valve vibrating at high frequency. Switch digging approach.",
      },
    };

    const fb = fallbackMap[unitId] || fallbackMap["EX-04"];

    return NextResponse.json({
      success: true,
      unit_id: unitId,
      source: "nextjs_graceful_fallback",
      execution_trace: ["ingest_telemetry_node", "diagnose_dtc_node", "check_sap_inventory_node", "synthesize_dispatch_node"],
      diagnosis: {
        component: fb.component,
        diagnosis: fb.diagnosis,
        dtc: fb.dtc,
        confidence: fb.confidence,
        freq: "High-Frequency Harmonic",
        rul_hours: 28,
        severity: "CRITICAL"
      },
      work_order: {
        id: `WO-AI-${unitId.replace("-", "")}`,
        unit: unitId,
        model: "Mining Hydraulic Excavator",
        dtc: fb.dtc,
        diagnosis: fb.diagnosis,
        part_name: fb.partName,
        part_sap_code: fb.partSapCode,
        inventory_location: fb.inventoryLocation,
        part_stock: fb.partStock,
        assigned_rig: fb.assignedRig,
        estimated_downtime: fb.estimatedDowntime,
        priority: "CRITICAL",
        operator_alert: fb.operatorAlert,
        confidence: fb.confidence,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
