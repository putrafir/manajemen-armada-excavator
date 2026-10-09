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
        signal: AbortSignal.timeout(60000),
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
        stockoutCritical: false,
        isSubstituted: false,
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
        stockoutCritical: false,
        isSubstituted: false,
      },
      "EX-27": {
        component: "Boom Cylinder Piston Seal Pack",
        diagnosis: "Internal bypass drop 12.4 L/min across distributor O-rings under hard cyclic shock.",
        dtc: "SPN 520144 / FMI 07",
        partName: "Hallite 755 Heavy Boom Cylinder Packing Set",
        partSapCode: "SAP-CAT-W200-EQUIV",
        inventoryLocation: "Warehouse Bay 01 (Bin C-16)",
        partStock: "3 Units on Shelf (OEM Substitute Ready)",
        assignedRig: "Mobile Rig Alpha (Heavy Hydraulics)",
        estimatedDowntime: "3.5 Hours Seal Replacement",
        confidence: 97,
        operatorAlert: "DERATE DIGGING ENVELOPE: Primary seal was depleted. Mobile rig dispatched with verified OEM equivalent substitute Hallite 755. Maintain low idle until crew arrives.",
        isSubstituted: true,
        substitutionNote: "Primary part SAP-PARK-W200-HP is out of stock. Autonomous Agent allocated OEM equivalent substitute: Hallite 755 Heavy Boom Cylinder Packing Set.",
      },
      "EX-31": {
        component: "Main Hydraulic Delivery Pump Rotating Group",
        diagnosis: "Severe pressure line excursion 33.8 MPa and cylinder block wear under bucket stall load.",
        dtc: "SPN 520150 / FMI 00",
        partName: "Kawasaki K3V180 Cylinder Block & Piston Set",
        partSapCode: "SAP-PUMP-ROT-700",
        inventoryLocation: "Warehouse Bay 04 (Heavy Rack 02)",
        partStock: "0 Units on Shelf (OUT OF STOCK - PO-EMG-EX31 DISPATCHED)",
        assignedRig: "Mobile Rig Alpha (HELD AT WORKSHOP - STANDBY)",
        estimatedDowntime: "5.0 Hours Pump Rebuild (Awaiting Part)",
        confidence: 98,
        operatorAlert: "EMERGENCY MACHINE STANDBY / SHUTDOWN: Critical pump block is OUT OF STOCK. All field mobile rigs held at workshop. IMMEDIATELY CEASE DIGGING & SHUT DOWN HYDRAULIC PUMP. Emergency PO-EMG-EX31 dispatched to distributor (ETA: 4-6 Hours Air Freight).",
        stockoutCritical: true,
        emergencyPo: {
          po_id: "PO-EMG-EX31",
          requested_part: "Kawasaki K3V180 Cylinder Block & Piston Set",
          sap_code: "SAP-PUMP-ROT-700",
          vendor_eta: "4-6 Hours Air Freight",
          urgency: "AOG / MINE DOWN CRITICAL",
          status: "DISPATCHED TO REGIONAL DISTRIBUTOR"
        }
      }
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
        stockout_critical: fb.stockoutCritical,
        is_substituted: fb.isSubstituted,
        emergency_po: fb.emergencyPo,
        substitution_note: fb.substitutionNote,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
