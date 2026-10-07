-- =========================================================================
-- TERRACORTEX HEAVY EXCAVATOR OPERATIONS INTELLIGENCE
-- Supabase PostgreSQL Schema & Realtime Replication
-- Project Ref: wltoldskffnbxropaspz
-- =========================================================================

-- 1. Table: fleet_assets (Master Data Unit Excavator)
CREATE TABLE IF NOT EXISTS fleet_assets (
  id TEXT PRIMARY KEY,                       -- e.g. 'EX-04'
  model TEXT NOT NULL,                       -- e.g. 'XCMG XE4000 Mining Shovel'
  vin TEXT UNIQUE NOT NULL,                  -- e.g. 'XCMG-902-CN-64'
  node TEXT,                                 -- e.g. 'EDGE-XCMG-8829-PX'
  mac TEXT,                                  -- e.g. '00:1A:2B:3C:4D:5E'
  site TEXT NOT NULL,                        -- e.g. 'Sector 4 - North Pit'
  pit_id TEXT NOT NULL,                      -- e.g. 'pit-4', 'pit-2', 'pit-1', 'pit-3'
  status TEXT DEFAULT 'ACTIVE',              -- 'ACTIVE', 'STANDBY', 'MAINTENANCE'
  tier TEXT DEFAULT 'Tier 4F',
  cmsi_score NUMERIC DEFAULT 40.0,
  operating_hours INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: sap_inventory (Suku Cadang SAP ERP Materials Management)
CREATE TABLE IF NOT EXISTS sap_inventory (
  sap_code TEXT PRIMARY KEY,                 -- e.g. 'SAP-PARK-902-KIT'
  name TEXT NOT NULL,
  fitment TEXT NOT NULL,
  location TEXT NOT NULL,                    -- e.g. 'Warehouse Bay 03 (Bin B-04)'
  on_hand INT DEFAULT 0,
  min_required INT DEFAULT 2,
  unit_cost TEXT DEFAULT '$1,000',
  status TEXT DEFAULT 'In Stock - Ready',
  status_color TEXT DEFAULT 'bg-emerald-100 text-emerald-800 border-emerald-200',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: work_orders (CMMS Maintenance Queue)
CREATE TABLE IF NOT EXISTS work_orders (
  id TEXT PRIMARY KEY,                       -- e.g. 'WO-8841-HYD'
  unit_id TEXT REFERENCES fleet_assets(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  time_label TEXT DEFAULT 'Just now',
  dtc TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  part_name TEXT NOT NULL,
  part_number TEXT REFERENCES sap_inventory(sap_code) ON DELETE SET NULL,
  inventory_location TEXT,
  inventory_status TEXT DEFAULT 'ok',        -- 'ok' | 'shortage'
  priority TEXT NOT NULL,                    -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  approved BOOLEAN DEFAULT FALSE,
  assigned_rig TEXT NOT NULL,
  category TEXT NOT NULL,
  technician_notes TEXT,
  source TEXT DEFAULT 'MANUAL',              -- 'AI_COPILOT' | 'MANUAL_SUPERVISOR'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Supabase Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE fleet_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE sap_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE work_orders;

-- 5. Seed Initial Data for Fleet Assets
INSERT INTO fleet_assets (id, model, vin, node, mac, site, pit_id, status, tier, cmsi_score, operating_hours)
VALUES
  ('EX-04', 'XCMG XE4000 Mining Shovel', 'XCMG-902-CN-64', 'EDGE-XCMG-8829-PX', '00:1A:2B:3C:4D:5E', 'Pit 4 Bench 12B (Floor)', 'pit-4', 'ACTIVE', 'Tier 4F', 94.0, 4210),
  ('EX-08', 'XCMG XE1250 Mining Excavator', 'XCMG-XE1250-08', 'EDGE-TC-7711-HT', '00:1B:44:77:11:08', 'Pit 4 Upper Waste Dump', 'pit-4', 'ACTIVE', 'Tier 4F', 76.2, 8920),
  ('EX-12', 'XCMG XE7000 Mining Excavator', 'XCMG-XE700-12', 'EDGE-TC-9024-KM', '00:25:96:FF:FE:12', 'Pit 2 West Bench', 'pit-2', 'ACTIVE', 'Tier 4F', 83.1, 6840),
  ('EX-17', 'XCMG XE4000 Mining Shovel', 'XCMG-902-CN-17', 'EDGE-TC-4412-MK', '00:1A:2B:3C:4D:17', 'Pit 2 Deep Sump', 'pit-2', 'ACTIVE', 'Tier 4F', 92.4, 3890),
  ('EX-27', 'XCMG XE2000 Mining Excavator', 'XCMG-XE200-27', 'EDGE-TC-3312-LH', '00:1B:44:33:12:AA', 'Pit 1 North Cut', 'pit-1', 'ACTIVE', 'Tier 4F', 79.4, 5110),
  ('EX-31', 'XCMG XE700D Heavy Excavator', 'XCMG-XE700-31', 'EDGE-TC-4902-TX', '00:1B:44:49:02:TX', 'Pit 1 South Cut', 'pit-1', 'ACTIVE', 'Tier 4F', 38.6, 1140),
  ('EX-33', 'XCMG XE7000 Mining Excavator', 'XCMG-XE700-33', 'EDGE-TC-7733-PL', '00:1B:44:77:33:PL', 'Pit 3 East Highwall', 'pit-3', 'ACTIVE', 'Tier 4F', 91.0, 5120),
  ('EX-19', 'XCMG XE950G Heavy Excavator', 'XCMG-XE950-19', 'EDGE-TC-4402-HT', '00:1B:44:02:89:94', 'Pit 3 Overburden', 'pit-3', 'ACTIVE', 'Tier 4', 44.0, 2350),
  ('EX-15', 'XCMG XE2000 Mining Excavator', 'XCMG-XE200-15', 'EDGE-TC-1520-QR', '00:1B:44:15:20:QR', 'Pit 3 South Ramp', 'pit-3', 'ACTIVE', 'Tier 4F', 74.5, 4330),
  ('EX-41', 'XCMG XE1250 Mining Excavator', 'XCMG-XE1250-41', 'EDGE-TC-4109-TX', '00:1B:44:41:09:TX', 'Sector 5 Overburden', 'pit-4', 'STANDBY', 'Tier 4F', 71.8, 7400)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Initial Data for SAP Inventory
INSERT INTO sap_inventory (sap_code, name, fitment, location, on_hand, min_required, unit_cost, status, status_color)
VALUES
  ('SAP-PARK-902-KIT', 'Parker Spool Seal Kit #PS-902', 'XCMG XE4000 Mining Shovel', 'Warehouse Bay 03 (Bin B-04)', 4, 2, '$1,850', 'In Stock - Ready', 'bg-emerald-100 text-emerald-800 border-emerald-200'),
  ('SAP-LUBE-PURGE-08', 'Slew Bearing Grease Purge Pack #EP-2', 'XCMG XE7000 Mining Excavator', 'Warehouse Bay 02 (Bin A-09)', 12, 5, '$320', 'In Stock - Ready', 'bg-emerald-100 text-emerald-800 border-emerald-200'),
  ('SAP-PARK-W200-HP', 'Parker Boom Wiper Pack #W-200', 'XCMG XE2000 Mining Excavator', 'Warehouse Bay 01 (Bin C-14)', 0, 3, '$940', 'PO-9912 In Transit (ETA 6h)', 'bg-amber-100 text-amber-800 border-amber-200'),
  ('SAP-FLT-HYD-440', 'High-Pressure Return Filter Element #FLT-440', 'Universal Heavy Shovel Fleet', 'Warehouse Bay 02 (Bin B-18)', 18, 6, '$480', 'In Stock - Ready', 'bg-emerald-100 text-emerald-800 border-emerald-200'),
  ('SAP-RAD-CORE-1250', 'Hydraulic Oil Cooler Core #RAD-1250', 'XCMG XE1250 Mining Excavator', 'Warehouse Yard Staging (Pallet 04)', 2, 1, '$6,200', 'In Stock - Ready', 'bg-emerald-100 text-emerald-800 border-emerald-200'),
  ('SAP-RLF-350-CARTRIDGE', 'Main Relief Valve Cartridge 350-Bar', 'XCMG XE4000 / XE7000 Heavy Fleet', 'Warehouse Bay 03 (Bin A-02)', 3, 2, '$3,450', 'In Stock - Ready', 'bg-emerald-100 text-emerald-800 border-emerald-200')
ON CONFLICT (sap_code) DO NOTHING;

-- 7. Seed Initial Work Orders
INSERT INTO work_orders (id, unit_id, model, time_label, dtc, diagnosis, part_name, part_number, inventory_location, inventory_status, priority, approved, assigned_rig, category, source)
VALUES
  ('WO-8841-HYD', 'EX-04', 'XCMG XE4000 Mining Shovel', '12 mins ago', 'SPN 1079 FMI 03 (Relief Vent Cavitation)', '142 Hz hydraulic micro-implosion in spool valve. Delta pressure drop >35 bar across distributor pump #2.', 'Parker Spool Seal Kit #PS-902', 'SAP-PARK-902-KIT', 'Bay 03 (Bin B-04)', 'ok', 'CRITICAL', FALSE, 'Mobile Rig 3 (Lead: D. Miller)', 'Hydraulic System', 'AI_COPILOT'),
  ('WO-8839-SLW', 'EX-12', 'XCMG XE7000 Mining Excavator', '48 mins ago', 'SPN 2420 FMI 04 (Slew Bearing Harmonic Shock)', '88 Hz radial vibration on swing gear raceway. Accelerated raceway micro-pitting detected on -140m grade.', 'Slew Ring Bearing Grease Flush & Purge Pack', 'SAP-LUBE-PURGE-08', 'Bay 02 (Bin A-09)', 'ok', 'HIGH', FALSE, 'Mobile Rig 1 (Lead: K. Johansen)', 'Mechanical Transmission', 'AI_COPILOT'),
  ('WO-8835-CYL', 'EX-27', 'XCMG XE2000 Mining Excavator', '2 hours ago', 'SPN 1120 FMI 01 (Cylinder Internal Flow Bypass)', '12.4 L/min internal bypass flow detected on boom cylinder descent. Wiper lip abrasion suspected.', 'Parker Wiper Lip & Head Pack #W-200', 'SAP-PARK-W200-HP', 'Bay 01 (Bin C-14)', 'shortage', 'HIGH', FALSE, 'Workshop Bay 2 (Staging)', 'Hydraulic Actuators', 'AI_COPILOT')
ON CONFLICT (id) DO NOTHING;

-- 8. Disable RLS or Allow Anon Public Access
ALTER TABLE fleet_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE sap_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders DISABLE ROW LEVEL SECURITY;
