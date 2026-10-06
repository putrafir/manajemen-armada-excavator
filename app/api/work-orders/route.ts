import { NextResponse } from "next/server";

export interface WorkOrder {
  id: string;
  unit: string;
  model: string;
  time: string;
  dtc: string;
  diagnosis: string;
  part: string;
  partNumber: string;
  inventory: string;
  inventoryStatus: "ok" | "shortage";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  approved: boolean;
  assignedRig: string;
  category: string;
  technicianNotes?: string;
  source: "AI_COPILOT" | "MANUAL_SUPERVISOR";
  createdAt: string;
}

let workOrdersDb: WorkOrder[] = [
  {
    id: "WO-8841-HYD",
    unit: "EX-04",
    model: "XCMG XE4000 Mining Shovel",
    time: "12 mins ago",
    dtc: "SPN 1079 FMI 03 (Relief Vent Cavitation)",
    diagnosis: "142 Hz hydraulic micro-implosion in spool valve. Delta pressure drop >35 bar across distributor pump #2.",
    part: "Parker Spool Seal Kit #PS-902",
    partNumber: "SAP-PARK-902-KIT",
    inventory: "4 kits in Bay 03 (Bin B-04)",
    inventoryStatus: "ok",
    priority: "CRITICAL",
    approved: false,
    assignedRig: "Mobile Rig 3 (Lead: D. Miller)",
    category: "Hydraulic System",
    source: "AI_COPILOT",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString()
  },
  {
    id: "WO-8839-SLW",
    unit: "EX-12",
    model: "XCMG XE7000 Mining Excavator",
    time: "48 mins ago",
    dtc: "SPN 2420 FMI 04 (Slew Bearing Harmonic Shock)",
    diagnosis: "88 Hz radial vibration on swing gear raceway. Accelerated raceway micro-pitting detected on -140m grade.",
    part: "Slew Ring Bearing Grease Flush & Purge Pack",
    partNumber: "SAP-LUBE-PURGE-08",
    inventory: "12 canisters in Bay 02 (Bin A-09)",
    inventoryStatus: "ok",
    priority: "HIGH",
    approved: false,
    assignedRig: "Mobile Rig 1 (Lead: K. Johansen)",
    category: "Mechanical Transmission",
    source: "AI_COPILOT",
    createdAt: new Date(Date.now() - 48 * 60000).toISOString()
  },
  {
    id: "WO-8835-CYL",
    unit: "EX-27",
    model: "XCMG XE2000 Mining Excavator",
    time: "2 hours ago",
    dtc: "SPN 1120 FMI 01 (Cylinder Internal Flow Bypass)",
    diagnosis: "12.4 L/min internal bypass flow detected on boom cylinder descent. Wiper lip abrasion suspected.",
    part: "Parker Wiper Lip & Head Pack #W-200",
    partNumber: "SAP-PARK-W200-HP",
    inventory: "Out of Stock (PO-9912 Dispatched)",
    inventoryStatus: "shortage",
    priority: "HIGH",
    approved: false,
    assignedRig: "Workshop Bay 2 (Staging)",
    category: "Hydraulic Actuators",
    source: "AI_COPILOT",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: workOrdersDb.length,
    workOrders: workOrdersDb
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = `WO-${Math.floor(1000 + Math.random() * 9000)}-${(body.unit || "EX").replace("EX-", "")}`;

    const newWO: WorkOrder = {
      id: newId,
      unit: body.unit || "EX-04",
      model: body.model || "Heavy Mining Excavator",
      time: "Just now",
      dtc: body.dtc || "MANUAL-OPERATOR-FLAG",
      diagnosis: body.diagnosis || body.title || "Manual Condition-Based Service Flag",
      part: body.part || "General Inspection Kit",
      partNumber: body.partNumber || "SAP-GEN-INSPECT",
      inventory: body.inventory || "In Stock (Workshop Staged)",
      inventoryStatus: body.inventoryStatus || "ok",
      priority: body.priority || "HIGH",
      approved: false,
      assignedRig: body.assignedRig || "Mobile Rig 2",
      category: body.category || "Preventive Maintenance",
      technicianNotes: body.technicianNotes || "",
      source: body.source || "MANUAL_SUPERVISOR",
      createdAt: new Date().toISOString()
    };

    workOrdersDb.unshift(newWO);

    return NextResponse.json({
      success: true,
      message: "Work Order created and queued into CMMS Inbox",
      workOrder: newWO,
      workOrders: workOrdersDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, approved } = body;

    const target = workOrdersDb.find(w => w.id === id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Work Order not found" }, { status: 404 });
    }

    if (approved !== undefined) {
      target.approved = approved;
    }

    return NextResponse.json({
      success: true,
      message: `Work Order ${id} updated`,
      workOrder: target,
      workOrders: workOrdersDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
