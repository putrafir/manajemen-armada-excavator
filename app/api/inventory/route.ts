import { NextResponse } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export interface InventoryItem {
  sapCode: string;
  name: string;
  fitment: string;
  location: string;
  onHand: number;
  minRequired: number;
  unitCost: string;
  status: string;
  statusColor: string;
}

let inMemoryInventoryDb: InventoryItem[] = [
  {
    sapCode: "SAP-PARK-902-KIT",
    name: "Parker Spool Seal Kit #PS-902",
    fitment: "XCMG XE4000 Mining Shovel",
    location: "Warehouse Bay 03 (Bin B-04)",
    onHand: 4,
    minRequired: 2,
    unitCost: "$1,850",
    status: "In Stock - Ready",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    sapCode: "SAP-LUBE-PURGE-08",
    name: "Slew Bearing Grease Purge Pack #EP-2",
    fitment: "XCMG XE7000 Mining Excavator",
    location: "Warehouse Bay 02 (Bin A-09)",
    onHand: 12,
    minRequired: 5,
    unitCost: "$320",
    status: "In Stock - Ready",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    sapCode: "SAP-PARK-W200-HP",
    name: "Parker Boom Wiper Pack #W-200",
    fitment: "XCMG XE2000 Mining Excavator",
    location: "Warehouse Bay 01 (Bin C-14)",
    onHand: 0,
    minRequired: 3,
    unitCost: "$940",
    status: "PO-9912 In Transit (ETA 6h)",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200"
  },
  {
    sapCode: "SAP-FLT-HYD-440",
    name: "High-Pressure Return Filter Element #FLT-440",
    fitment: "Universal Heavy Shovel Fleet",
    location: "Warehouse Bay 02 (Bin B-18)",
    onHand: 18,
    minRequired: 6,
    unitCost: "$480",
    status: "In Stock - Ready",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    sapCode: "SAP-RAD-CORE-1250",
    name: "Hydraulic Oil Cooler Core #RAD-1250",
    fitment: "XCMG XE1250 Mining Excavator",
    location: "Warehouse Yard Staging (Pallet 04)",
    onHand: 2,
    minRequired: 1,
    unitCost: "$6,200",
    status: "In Stock - Ready",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    sapCode: "SAP-RLF-350-CARTRIDGE",
    name: "Main Relief Valve Cartridge 350-Bar",
    fitment: "XCMG XE4000 / XE7000 Heavy Fleet",
    location: "Warehouse Bay 03 (Bin A-02)",
    onHand: 3,
    minRequired: 2,
    unitCost: "$3,450",
    status: "In Stock - Ready",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  }
];

export async function GET() {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("sap_inventory")
        .select("*")
        .order("name");

      if (!error && data && data.length > 0) {
        const mapped: InventoryItem[] = data.map((row: any) => ({
          sapCode: row.sap_code,
          name: row.name,
          fitment: row.fitment,
          location: row.location,
          onHand: row.on_hand,
          minRequired: row.min_required,
          unitCost: row.unit_cost,
          status: row.status,
          statusColor: row.status_color || "bg-emerald-100 text-emerald-800 border-emerald-200"
        }));

        return NextResponse.json({
          success: true,
          source: "Supabase PostgreSQL (Live Realtime)",
          totalParts: mapped.length,
          timestamp: new Date().toISOString(),
          items: mapped
        });
      }
    } catch (err) {
      console.warn("Supabase inventory fetch failed:", err);
    }
  }

  return NextResponse.json({
    success: true,
    source: "In-Memory Local Mode (Ready for Supabase)",
    totalParts: inMemoryInventoryDb.length,
    timestamp: new Date().toISOString(),
    items: inMemoryInventoryDb
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sapCode, qty } = body;

    const item = inMemoryInventoryDb.find(i => i.sapCode === sapCode);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    const changeQty = qty || 1;
    if (action === "deduct") {
      item.onHand = Math.max(0, item.onHand - changeQty);
      if (item.onHand === 0) {
        item.status = "Out of Stock (PO Triggered)";
        item.statusColor = "bg-red-100 text-red-800 border-red-200";
      } else if (item.onHand < item.minRequired) {
        item.status = "Low Stock Alert";
        item.statusColor = "bg-amber-100 text-amber-800 border-amber-200";
      }
    } else if (action === "restock") {
      item.onHand += changeQty;
      item.status = "In Stock - Ready";
      item.statusColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    }

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase
          .from("sap_inventory")
          .update({
            on_hand: item.onHand,
            status: item.status,
            status_color: item.statusColor,
            updated_at: new Date().toISOString()
          })
          .eq("sap_code", sapCode);
      } catch (err) {
        console.warn("Supabase inventory update error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Stock updated for ${item.name}`,
      item,
      items: inMemoryInventoryDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
