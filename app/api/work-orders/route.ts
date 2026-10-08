import { NextResponse } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

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
  inventoryStatus: "ok" | "shortage" | "in_transit";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  approved: boolean;
  assignedRig: string;
  category: string;
  technicianNotes?: string;
  source: "AI_COPILOT" | "MANUAL_SUPERVISOR" | "LANGGRAPH_COPILOT";
  createdAt: string;
}

// In-memory store (starts empty; cleared when reset is clicked)
let inMemoryWorkOrdersDb: WorkOrder[] = [];

export async function GET() {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("work_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped: WorkOrder[] = data.map((row: any) => ({
          id: row.id,
          unit: row.unit_id,
          model: row.model,
          time: row.time_label || "Just now",
          dtc: row.dtc,
          diagnosis: row.diagnosis,
          part: row.part_name,
          partNumber: row.part_number,
          inventory: row.inventory_location || "In Warehouse Staging",
          inventoryStatus: row.inventory_status || "ok",
          priority: row.priority,
          approved: row.approved,
          assignedRig: row.assigned_rig,
          category: row.category,
          technicianNotes: row.technician_notes,
          source: row.source,
          createdAt: row.created_at
        }));

        return NextResponse.json({
          success: true,
          source: "Supabase PostgreSQL (Live Realtime)",
          count: mapped.length,
          workOrders: mapped
        });
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to in-memory:", err);
    }
  }

  return NextResponse.json({
    success: true,
    source: "In-Memory Local Mode",
    count: inMemoryWorkOrdersDb.length,
    workOrders: inMemoryWorkOrdersDb
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

    inMemoryWorkOrdersDb.unshift(newWO);

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("work_orders").insert({
          id: newWO.id,
          unit_id: newWO.unit,
          model: newWO.model,
          time_label: newWO.time,
          dtc: newWO.dtc,
          diagnosis: newWO.diagnosis,
          part_name: newWO.part,
          part_number: newWO.partNumber,
          inventory_location: newWO.inventory,
          inventory_status: newWO.inventoryStatus,
          priority: newWO.priority,
          approved: newWO.approved,
          assigned_rig: newWO.assignedRig,
          category: newWO.category,
          technician_notes: newWO.technicianNotes,
          source: newWO.source,
          created_at: newWO.createdAt
        });
      } catch (err) {
        console.warn("Supabase insert error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Work Order created and queued into CMMS Inbox",
      workOrder: newWO,
      workOrders: inMemoryWorkOrdersDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    inMemoryWorkOrdersDb = [];
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("work_orders").delete().neq("id", "DUMMY_ROW");
      } catch (err) {
        console.warn("Supabase delete all error:", err);
      }
    }
    return NextResponse.json({
      success: true,
      message: "All work orders cleared. Fleet queue reset to un-dispatched state.",
      count: 0,
      workOrders: []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (body.resetAll || body.clearAll) {
      inMemoryWorkOrdersDb = [];
      const supabase = getSupabaseClient();
      if (supabase && isSupabaseConfigured()) {
        try {
          await supabase.from("work_orders").delete().neq("id", "DUMMY_ROW");
        } catch (err) {
          console.warn("Supabase resetAll error:", err);
        }
      }
      return NextResponse.json({
        success: true,
        message: "All work orders cleared and reset to un-dispatched state.",
        count: 0,
        workOrders: []
      });
    }

    const { id, approved, technicianNotes } = body;

    const target = inMemoryWorkOrdersDb.find(w => w.id === id);
    if (target) {
      if (approved !== undefined) target.approved = approved;
      if (technicianNotes !== undefined) target.technicianNotes = technicianNotes;
    }

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const updatePayload: any = {};
        if (approved !== undefined) updatePayload.approved = approved;
        if (technicianNotes !== undefined) updatePayload.technician_notes = technicianNotes;

        await supabase
          .from("work_orders")
          .update(updatePayload)
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Work Order ${id} updated`,
      workOrder: target,
      workOrders: inMemoryWorkOrdersDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
