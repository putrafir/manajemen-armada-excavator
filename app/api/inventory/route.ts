import { NextResponse } from "next/server";

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

// In-memory inventory state mimicking SAP ERP Materials Management (MM)
let inventoryDb: InventoryItem[] = [
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
  return NextResponse.json({
    success: true,
    source: "SAP ERP Materials Management API v4.2",
    totalParts: inventoryDb.length,
    timestamp: new Date().toISOString(),
    items: inventoryDb
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sapCode, qty = 1 } = body;

    const item = inventoryDb.find(i => i.sapCode === sapCode);
    if (!item) {
      return NextResponse.json({ success: false, error: "Part code not found in SAP catalog" }, { status: 404 });
    }

    if (action === "deduct") {
      if (item.onHand < qty) {
        return NextResponse.json({ 
          success: false, 
          error: `Insufficient stock on hand (${item.onHand} available, requested ${qty})` 
        }, { status: 400 });
      }
      item.onHand -= qty;
      if (item.onHand === 0) {
        item.status = "Out of Stock (Expedited PO Required)";
        item.statusColor = "bg-rose-100 text-rose-800 border-rose-200";
      }
    } else if (action === "restock") {
      item.onHand += qty;
      item.status = "In Stock - Ready";
      item.statusColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    }

    return NextResponse.json({
      success: true,
      message: `SAP inventory updated for ${sapCode}`,
      item,
      items: inventoryDb
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
