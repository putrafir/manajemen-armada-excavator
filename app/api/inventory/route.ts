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
  substituteSapCode?: string;
  vendorLeadTime?: string;
}

let inMemoryInventoryDb: InventoryItem[] = [
  {
    "sapCode": "SAP-PARK-902-KIT",
    "name": "Parker Spool Valve Seal Kit #PS-902",
    "fitment": "XCMG XE4000 Mining Shovel",
    "location": "Warehouse Bay 03 (Bin B-04)",
    "onHand": 4,
    "minRequired": 2,
    "unitCost": "$1,850",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-REX-902-EQUIV",
    "vendorLeadTime": "24h Domestic"
  },
  {
    "sapCode": "SAP-REX-902-EQUIV",
    "name": "Rexroth Spool Seal Equivalent #RS-902",
    "fitment": "XCMG XE4000 / XE7000 Control Block",
    "location": "Warehouse Bay 03 (Bin B-06)",
    "onHand": 2,
    "minRequired": 1,
    "unitCost": "$1,920",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-PARK-902-KIT",
    "vendorLeadTime": "24h Domestic"
  },
  {
    "sapCode": "SAP-VLV-RELIEF-400",
    "name": "Main Relief Valve Cartridge 350-Bar",
    "fitment": "XCMG XE4000 Powerpack Manifold",
    "location": "Warehouse Bay 01 (Bin A-12)",
    "onHand": 2,
    "minRequired": 1,
    "unitCost": "$4,120",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-VLV-RELIEF-HP",
    "vendorLeadTime": "48h Express"
  },
  {
    "sapCode": "SAP-VLV-RELIEF-HP",
    "name": "High-Pressure Relief Valve 380-Bar Cartridge",
    "fitment": "Universal XCMG Heavy Shovels",
    "location": "Warehouse Bay 01 (Bin A-14)",
    "onHand": 1,
    "minRequired": 1,
    "unitCost": "$4,450",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-VLV-RELIEF-400",
    "vendorLeadTime": "48h Express"
  },
  {
    "sapCode": "SAP-SOL-PROP-24V",
    "name": "Proportional Pilot Solenoid Valve 24VDC",
    "fitment": "XCMG XE4000 / XE7000 Pilot Manifold",
    "location": "Warehouse Bay 03 (Bin C-01)",
    "onHand": 6,
    "minRequired": 2,
    "unitCost": "$780",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "12h On-Site"
  },
  {
    "sapCode": "SAP-PUMP-ROT-700",
    "name": "Kawasaki K3V180 Cylinder Block & Piston Set",
    "fitment": "XCMG XE700D Heavy Excavator",
    "location": "Warehouse Bay 04 (Heavy Rack 02)",
    "onHand": 0,
    "minRequired": 1,
    "unitCost": "$12,800",
    "status": "Stock Shortage - Expedited PO Required",
    "statusColor": "bg-red-100 text-red-800 border-red-200",
    "substituteSapCode": "",
    "vendorLeadTime": "4-6 Hours Air Freight"
  },
  {
    "sapCode": "SAP-SWASH-BEARING-400",
    "name": "Main Pump Swashplate Cradle Bearing Set",
    "fitment": "XCMG XE4000 Main Pumps #1 & #2",
    "location": "Warehouse Bay 04 (Heavy Rack 05)",
    "onHand": 3,
    "minRequired": 1,
    "unitCost": "$5,600",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "48h Regional"
  },
  {
    "sapCode": "SAP-LUBE-PURGE-08",
    "name": "Slew Bearing Grease Purge Pack #EP-2",
    "fitment": "XCMG XE7000 / XE4000 Slew Race",
    "location": "Warehouse Bay 02 (Bin A-09)",
    "onHand": 12,
    "minRequired": 4,
    "unitCost": "$320",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-LUBE-MOBIL-EP2",
    "vendorLeadTime": "Immediate (Bulk Store)"
  },
  {
    "sapCode": "SAP-LUBE-MOBIL-EP2",
    "name": "Mobilith SHC 460 Mining Synthetic Grease",
    "fitment": "Universal Mining Shovel Swing Bearings",
    "location": "Warehouse Yard Staging (Lube Drum 01)",
    "onHand": 8,
    "minRequired": 4,
    "unitCost": "$390",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-LUBE-PURGE-08",
    "vendorLeadTime": "Immediate (Bulk Store)"
  },
  {
    "sapCode": "SAP-SLEW-PINION-700",
    "name": "Slew Pinion Drive Shaft 14-Tooth Heat-Treated",
    "fitment": "XCMG XE7000 Swing Reducer",
    "location": "Warehouse Bay 04 (Heavy Rack 08)",
    "onHand": 2,
    "minRequired": 1,
    "unitCost": "$8,950",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "72h Heavy Courier"
  },
  {
    "sapCode": "SAP-SLEW-BRAKE-DISC",
    "name": "Multi-Disc Wet Parking Brake Pack",
    "fitment": "XCMG XE7000 Slew Motor Box",
    "location": "Warehouse Bay 02 (Bin C-04)",
    "onHand": 4,
    "minRequired": 2,
    "unitCost": "$1,450",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "24h Domestic"
  },
  {
    "sapCode": "SAP-PARK-W200-HP",
    "name": "Parker Boom Wiper & Piston Pack #W-200",
    "fitment": "XCMG XE2000 Boom Cylinder",
    "location": "Warehouse Bay 01 (Bin C-14)",
    "onHand": 0,
    "minRequired": 2,
    "unitCost": "$1,120",
    "status": "Stock Shortage - Use Substitute",
    "statusColor": "bg-amber-100 text-amber-800 border-amber-200",
    "substituteSapCode": "SAP-CAT-W200-EQUIV",
    "vendorLeadTime": "PO In Transit (ETA 8h)"
  },
  {
    "sapCode": "SAP-CAT-W200-EQUIV",
    "name": "Hallite 755 Heavy Boom Cylinder Packing Set",
    "fitment": "XCMG XE2000 / Cat 6020B Equivalent",
    "location": "Warehouse Bay 01 (Bin C-16)",
    "onHand": 3,
    "minRequired": 1,
    "unitCost": "$1,280",
    "status": "In Stock - Substitute Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-PARK-W200-HP",
    "vendorLeadTime": "Immediate (On Shelf)"
  },
  {
    "sapCode": "SAP-CYL-ARM-REPACK",
    "name": "Arm Cylinder Heavy Rod Repack Kit #ARM-700",
    "fitment": "XCMG XE7000 Arm Cylinder",
    "location": "Warehouse Bay 01 (Bin D-02)",
    "onHand": 3,
    "minRequired": 2,
    "unitCost": "$2,640",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "24h Regional"
  },
  {
    "sapCode": "SAP-CYL-BCKT-SEAL",
    "name": "Bucket Cylinder Double-Acting Seal Kit #BKT-400",
    "fitment": "XCMG XE4000 Mining Shovel",
    "location": "Warehouse Bay 01 (Bin D-06)",
    "onHand": 5,
    "minRequired": 2,
    "unitCost": "$1,750",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "12h On-Site"
  },
  {
    "sapCode": "SAP-FLT-HYD-440",
    "name": "High-Pressure Return Filter Element #FLT-440",
    "fitment": "Universal Mining Fleet XCMG",
    "location": "Warehouse Bay 02 (Bin B-18)",
    "onHand": 18,
    "minRequired": 6,
    "unitCost": "$320",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-DON-HYD-440",
    "vendorLeadTime": "Immediate (Consumable)"
  },
  {
    "sapCode": "SAP-DON-HYD-440",
    "name": "Donaldson Duramax Hydraulic Filter #P165705",
    "fitment": "Universal Mining Fleet XCMG",
    "location": "Warehouse Bay 02 (Bin B-20)",
    "onHand": 10,
    "minRequired": 4,
    "unitCost": "$345",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "SAP-FLT-HYD-440",
    "vendorLeadTime": "Immediate (Consumable)"
  },
  {
    "sapCode": "SAP-FLT-PILOT-10M",
    "name": "Pilot Circuit Line Filter 10-Micron Absolute",
    "fitment": "XCMG XE4000 / XE7000 / XE1250",
    "location": "Warehouse Bay 02 (Bin B-24)",
    "onHand": 8,
    "minRequired": 3,
    "unitCost": "$180",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "Immediate (Consumable)"
  },
  {
    "sapCode": "SAP-FLT-SUCTION-STRN",
    "name": "Stainless Mesh Suction Strainer 100-Mesh",
    "fitment": "XCMG XE950G / XE700D Tank Port",
    "location": "Warehouse Bay 02 (Bin B-28)",
    "onHand": 4,
    "minRequired": 2,
    "unitCost": "$410",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "24h Domestic"
  },
  {
    "sapCode": "SAP-RAD-CORE-1250",
    "name": "Hydraulic Oil Cooler Core Radiator #RAD-1250",
    "fitment": "XCMG XE1250 Mining Excavator",
    "location": "Warehouse Yard Staging (Pallet 04)",
    "onHand": 2,
    "minRequired": 1,
    "unitCost": "$6,200",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "48h Regional"
  },
  {
    "sapCode": "SAP-FAN-CLUTCH-VISC",
    "name": "Viscous Thermal Fan Clutch Assembly #VFC-900",
    "fitment": "XCMG XE1250 / XE950G Radiator Cowling",
    "location": "Warehouse Bay 03 (Bin D-11)",
    "onHand": 3,
    "minRequired": 1,
    "unitCost": "$2,850",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "24h Domestic"
  },
  {
    "sapCode": "SAP-HOSE-4SP-25",
    "name": "Gates 4-Wire Spiral HP Hydraulic Hose 1-Inch #4SP",
    "fitment": "Universal High-Pressure Excavator Booms",
    "location": "Warehouse Bay 02 (Hose Rack 01)",
    "onHand": 25,
    "minRequired": 8,
    "unitCost": "$240",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "Immediate (Cut to Length)"
  },
  {
    "sapCode": "SAP-FLANGE-CODE62-KIT",
    "name": "SAE Code 62 Split Flange & D-Ring High-Pressure Kit",
    "fitment": "XCMG XE4000 / XE7000 Main Manifolds",
    "location": "Warehouse Bay 01 (Bin E-03)",
    "onHand": 40,
    "minRequired": 15,
    "unitCost": "$85",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "Immediate (Hardware Store)"
  },
  {
    "sapCode": "SAP-PRESS-TRANSDUCER-400",
    "name": "Sensata 400-Bar Piezoelectric Pressure Transducer",
    "fitment": "Universal XCMG J1939 Telemetry Bus",
    "location": "Warehouse Bay 03 (Clean Room Locker 02)",
    "onHand": 7,
    "minRequired": 2,
    "unitCost": "$620",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "12h On-Site"
  },
  {
    "sapCode": "SAP-VIBE-ACCEL-3AXIS",
    "name": "Industrial 3-Axis IEPE Vibration Accelerometer",
    "fitment": "Main Pump & Slew Bearing Housing",
    "location": "Warehouse Bay 03 (Clean Room Locker 04)",
    "onHand": 5,
    "minRequired": 2,
    "unitCost": "$950",
    "status": "In Stock - Ready",
    "statusColor": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "substituteSapCode": "",
    "vendorLeadTime": "24h Domestic"
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
          statusColor: row.status_color || "bg-emerald-100 text-emerald-800 border-emerald-200",
          substituteSapCode: row.substitute_sap_code,
          vendorLeadTime: row.vendor_lead_time
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
    source: "In-Memory Heavy Mining Catalog (25+ Parts)",
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
        item.status = "Out of Stock (Emergency PO Required)";
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
