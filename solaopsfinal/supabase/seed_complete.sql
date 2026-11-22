-- ====================================================================
-- SunPower Solutions / SolarFlow - Complete Seed Insertion Script
-- Run this in Supabase SQL Editor to populate all frontend demo & operations data
-- ====================================================================

-- 1. PROFILES (Registered Users: Customers, Admin, Technicians)
INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('cust-1', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', 'password123', '+91 98140 12345', 'Plot 42, Model Town, Jalandhar, Punjab', 'Jalandhar', 'Residential', 'Residential 1-Phase 230V', 'PSPCL-JL-884920', 'customer')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('cust-2', 'Sunita Patel', 'sunita.patel@patelfarms.in', 'password123', '+91 98250 98765', 'Green Valley Dairy, GT Road, Ludhiana, Punjab', 'Ludhiana', 'Commercial', 'Commercial 3-Phase 415V (Dairy & Chilling)', 'PSPCL-LD-110294', 'customer')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('cust-3', 'Vikram Malhotra', 'vikram.m@malhotratextiles.com', 'password123', '+91 98722 34567', 'Industrial Focal Point, Phase 4, Phagwara', 'Phagwara', 'Industrial', 'Industrial HT 11kV/33kV', 'PSPCL-PG-762910', 'customer')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('admin-1', 'SunPower Operations Director', 'admin@sunpowersolutions.in', 'admin123', '+91 1800 000 000', 'HQ Jalandhar Regional Centre, Punjab', 'Jalandhar', 'Corporate', 'Commercial 3-Phase 415V', 'PSPCL-HQ-001', 'admin')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('tech-1', 'Amit Singh', 'tech@sunpowersolutions.in', 'tech123', '+91 98141 11223', 'Crew Alpha Base, Civil Lines, Jalandhar', 'Jalandhar', 'Field Crew', 'Lead Site Engineer', 'TECH-EMP-101', 'technician')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

INSERT INTO profiles (id, full_name, email, password, phone, address, city, connection_category, connection_type, discom_account, role)
VALUES ('tech-2', 'Rohan Sharma', 'rohan@sunpowersolutions.in', 'tech123', '+91 98142 44556', 'Crew Beta Base, Focal Point, Ludhiana', 'Ludhiana', 'Field Crew', 'Site Feasibility Surveyor', 'TECH-EMP-102', 'technician')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;


-- 2. STAFF (Technical Staff, Crews, Credentials, Showcase & Daily Work Handling)
INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-1', 'Amit Singh', 'tech@sunpowersolutions.in', '+91 98141 11223', 'Lead Solar PV Engineer', 'Crew Alpha', 'TECH-SOL-101', 'MNRE-NABL-PV-2024-8841', 'B+', '+91 98140 99881 (Sunita Singh - Spouse)', '2023-03-15', 'Class-A: HT / Working at Heights (IS 3521)', '["Inverter Specialist","Grid Sync","Dual-MPPT Calibration","Earthing Pit Testing"]'::jsonb, '{"totalKwInstalled":64.5,"surveysCompleted":38,"customerRating":4.95,"safetyScore":"100% Zero-Incident","activeJobsCount":2}'::jsonb, '["National Institute of Solar Energy (NISE) Suryamitra Certified","Central Electricity Authority (CEA) Grade-A Supervisor License","Industrial Working at Heights & Fall-Arrest Compliance (IS 3521)","Fronius & GoodWe Multi-String Inverter Commissioning Specialist"]'::jsonb, '[{"id":"proj-1","title":"3 kW Residential Rooftop with Net-Metering","capacity":"3.0 kW","customer":"Rajesh Sharma","location":"Model Town, Jalandhar","date":"2026-11-14","rating":5,"review":"Exceptional installation by Amit and Crew Alpha. Inverter sync and net-metering done without any hassle.","photo":"https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80","highlights":"Bi-facial panels mounted at 22° south tilt. Inverter tested at 3.12 kW peak output."},{"id":"proj-2","title":"5 kW Commercial Hybrid Dairy Plant","capacity":"5.0 kW","customer":"Sunita Patel","location":"Green Valley Dairy, Ludhiana","date":"2026-11-18","rating":4.9,"review":"Heavy duty off-grid system with lithium battery storage. Powers milk chillers seamlessly.","photo":"https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80","highlights":"48V 200Ah Lithium Bank + 60A MPPT controller integrated with auto-generator backup."},{"id":"proj-3","title":"10 kW 3-Phase Industrial Superstructure","capacity":"10.0 kW","customer":"Phagwara Textile Unit","location":"Industrial Focal Point, Phagwara","date":"2026-10-29","rating":5,"review":"Superb execution on high-wind industrial shed. Zero leakage and neat cable tray conduits.","photo":"https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80","highlights":"Hot-dip galvanized elevated structure with 4-chamber earthing (<1.5 Ohms)."}]'::jsonb, '{"currentStatus":"On Roof - System Testing & Earthing Sync","currentCustomer":"Rajesh Sharma (ORD-SUN-2026-088)","address":"Plot 42, Model Town, Jalandhar","activeStage":"Inverter Synchronization & Net Metering","dailyRoute":[{"time":"08:30 AM","task":"Crew Alpha Morning Safety Briefing & Tool Kit Inspection","status":"completed"},{"time":"10:00 AM","task":"Site Feasibility Verification - Plot 42, Model Town","status":"completed"},{"time":"01:30 PM","task":"Mounting Structure & Module Array Laying (3 kW)","status":"completed"},{"time":"03:45 PM","task":"Inverter Synchronization & Net-Meter Testing","status":"in_progress"},{"time":"05:00 PM","task":"Customer Handover, App Setup & Digital Signature","status":"pending"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":true,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-2', 'Rohan Sharma', 'rohan@sunpowersolutions.in', '+91 98142 44556', 'Site Feasibility Surveyor', 'Crew Beta', 'TECH-SOL-102', 'MNRE-SURV-2024-5512', 'O+', '+91 98142 88776 (Parent)', '2023-06-01', 'Class-A: Solar Irradiance & Structural Load', '["Shadow Analysis","Roof Load Assessment","Drone LiDAR Survey","Single Line Diagrams"]'::jsonb, '{"totalKwInstalled":48,"surveysCompleted":56,"customerRating":4.9,"safetyScore":"100% Zero-Incident","activeJobsCount":1}'::jsonb, '["Solar Pathfinder Shadow Analysis Certified","Civil Structure Roof Load Bearing Inspector (IS 875 Part 3)","MNRE Site Feasibility Assessor"]'::jsonb, '[{"id":"proj-201","title":"5 kW Commercial Dairy Feasibility & 3D Shadow Map","capacity":"5.0 kW","customer":"Sunita Patel","location":"Ludhiana, Punjab","date":"2026-11-06","rating":5,"review":"Rohan did an extraordinarily thorough drone survey and accurate shadow profile.","photo":"https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80","highlights":"Identified 850 sq.ft shadow-free roof with 24° optimum tilt."}]'::jsonb, '{"currentStatus":"Field Survey En Route","currentCustomer":"Jasleen Kaur (ENQ-105)","address":"Industrial Estate, Ludhiana","activeStage":"On-Site 3D Roof Scan","dailyRoute":[{"time":"09:00 AM","task":"Equipment Calibration (Inclinometer, Solar Meter)","status":"completed"},{"time":"11:00 AM","task":"Commercial Feasibility Inspection - Jasleen Kaur","status":"in_progress"},{"time":"03:00 PM","task":"Admin Feasibility Report Filing & BOM Sizing","status":"pending"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":false,"dcArrayStringing":false,"earthingResistance":false,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-3', 'Manoj Patel', 'manoj.patel@sunpowersolutions.in', '+91 98765 43215', 'Commercial Rooftop & Battery Lead', 'Crew Beta', 'TECH-SOL-103', 'MNRE-BAT-2024-3310', 'A+', '+91 98765 11223 (Family)', '2022-11-10', 'Class-A: Industrial 3-Phase & High Voltage LiFePO4', '["Battery Energy Storage (BESS)","3-Phase Grid-Tied","High Wind Anchoring"]'::jsonb, '{"totalKwInstalled":112,"surveysCompleted":42,"customerRating":4.88,"safetyScore":"100% Zero-Incident","activeJobsCount":1}'::jsonb, '["Tesla & BYD Certified Battery Storage Technician","MNRE Senior Installer Certification"]'::jsonb, '[{"id":"proj-301","title":"15 kW Cold Storage Hybrid Storage Array","capacity":"15.0 kW","customer":"Verma Cold Storage","location":"Kapurthala, Punjab","date":"2026-10-12","rating":5,"review":"Flawless execution by Manoj Patel. Battery switchover in <15ms.","photo":"https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80","highlights":"48V 400Ah LiFePO4 battery rack synchronized with 15kVA inverter."}]'::jsonb, '{"currentStatus":"Staging & Pre-Commissioning","currentCustomer":"Sunita Patel (ORD-SUN-2026-089)","address":"Green Valley Dairy, Ludhiana","activeStage":"Battery Bank Integration","dailyRoute":[{"time":"09:00 AM","task":"Lithium Battery BMS Firmware Check","status":"completed"},{"time":"01:00 PM","task":"Heavy Duty DC Busbar Connection","status":"in_progress"},{"time":"04:30 PM","task":"Full Load Isolation Test","status":"pending"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":false,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-4', 'Pooja Rawat', 'pooja.rawat@sunpowersolutions.in', '+91 98765 43220', 'Industrial HT Lead & Quality Assurance', 'Crew Gamma', 'TECH-SOL-104', 'MNRE-QA-2023-9901', 'AB+', '+91 98765 88990 (Family)', '2022-08-20', 'Class-A: 11kV/33kV HT & Electrical Inspectorate CEIG', '["Heavy Industrial HT","CEIG Clearances","Zero Export Control","SCADA Telemetry"]'::jsonb, '{"totalKwInstalled":185,"surveysCompleted":62,"customerRating":4.97,"safetyScore":"100% Zero-Incident","activeJobsCount":1}'::jsonb, '["CEIG Certified Electrical Inspector Liaison","Industrial SCADA & Solar Telemetry Specialist","TUV Rheinland PV Quality Auditor"]'::jsonb, '[{"id":"proj-401","title":"25 kW Industrial Plant with CEIG Compliance","capacity":"25.0 kW","customer":"Malhotra Spinning Mills","location":"Phagwara Industrial Zone","date":"2026-11-02","rating":5,"review":"Pooja led the installation with textbook perfection. Handled CEIG approval smoothly.","photo":"https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80","highlights":"Triple MPPT industrial inverter with ESE lightning rod and zero export limiter."}]'::jsonb, '{"currentStatus":"Quality Inspection & Load Sync","currentCustomer":"Vikram Malhotra (Industrial)","address":"Industrial Focal Point, Phase 4, Phagwara","activeStage":"Grid Harmonics & CEIG Audit","dailyRoute":[{"time":"09:30 AM","task":"Substation Transformer Relay Calibration","status":"completed"},{"time":"01:30 PM","task":"Harmonics and THD Metering at 415V LT","status":"in_progress"},{"time":"04:00 PM","task":"Final Handover Certificate Generation","status":"pending"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":true,"netMeterSync":true,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-5', 'Rakesh Kumar', 'rakesh.kumar@sunpowersolutions.in', '+91 98765 43211', 'Senior Rooftop Structure Lead', 'Crew Alpha', 'TECH-SOL-105', 'MNRE-MEC-2024-4412', 'B+', '+91 98765 22334', '2023-01-10', 'Class-A: High Wind Rooftop Superstructures', '["Rooftop Mounting","Chemical Anchoring","160km/h Wind Load Design"]'::jsonb, '{"totalKwInstalled":52,"surveysCompleted":22,"customerRating":4.85,"safetyScore":"100%","activeJobsCount":1}'::jsonb, '["Hilti Chemical Anchoring Certified","Metal Fabrication Expert"]'::jsonb, '[]'::jsonb, '{"currentStatus":"On Roof - Mounting Rails Alignment","currentCustomer":"Rajesh Sharma","address":"Model Town, Jalandhar","activeStage":"Structural Fastening","dailyRoute":[{"time":"09:00 AM","task":"Base Plate Anchoring","status":"completed"},{"time":"02:00 PM","task":"Rail Torque Verification","status":"in_progress"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":false,"earthingResistance":false,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-6', 'Vijay Verma', 'vijay.verma@sunpowersolutions.in', '+91 98765 43212', 'Senior Protection & Earthing Specialist', 'Crew Alpha', 'TECH-SOL-106', 'MNRE-ELC-2024-6621', 'A+', '+91 98765 77665', '2023-05-18', 'Class-A: Chemical Earthing & Surge Protection', '["ACDB/DCDB","Type-2 SPD","Chemical Earth Pits","Earth Resistance Tester"]'::jsonb, '{"totalKwInstalled":44,"surveysCompleted":29,"customerRating":4.9,"safetyScore":"100%","activeJobsCount":1}'::jsonb, '["CEA Certified Earthing Specialist","Surge Protection Devices (SPD) Certified"]'::jsonb, '[]'::jsonb, '{"currentStatus":"Earthing Pit Resistance Testing","currentCustomer":"Rajesh Sharma","address":"Model Town, Jalandhar","activeStage":"Earth Resistance Test (<2 Ohms)","dailyRoute":[{"time":"10:00 AM","task":"Earthing Chamber Chemical Fill","status":"completed"},{"time":"03:00 PM","task":"Digital Earth Megger Test","status":"in_progress"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":true,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-7', 'Sunil Yadav', 'sunil.yadav@sunpowersolutions.in', '+91 98765 43216', 'Senior Electrical Wiring Tech', 'Crew Beta', 'TECH-SOL-107', 'MNRE-ELC-2024-1189', 'O-', '+91 98765 33445', '2023-04-12', 'Class-A: DC String Cabling & MC4 Connectors', '["Off-Grid Systems","BMS Wiring","Solar DC UV Conduits"]'::jsonb, '{"totalKwInstalled":40,"surveysCompleted":15,"customerRating":4.86,"safetyScore":"100%","activeJobsCount":1}'::jsonb, '["Staubli MC4 Connector Certification"]'::jsonb, '[]'::jsonb, '{"currentStatus":"DC String Termination","currentCustomer":"Sunita Patel","address":"Ludhiana, Punjab","activeStage":"DC Cable Dressing","dailyRoute":[{"time":"09:00 AM","task":"DC Conduit Clamping","status":"completed"},{"time":"01:30 PM","task":"MC4 Crimping & Polarity Test","status":"in_progress"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":false,"netMeterSync":false,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;

INSERT INTO staff (id, name, email, phone, role, crew, employee_id, license_no, blood_group, emergency_contact, joining_date, safety_clearance, skills, stats, certifications, showcase_gallery, work_handling)
VALUES ('tech-8', 'Neeraj Joshi', 'neeraj.joshi@sunpowersolutions.in', '+91 98765 43221', 'Grid Commissioning Engineer', 'Crew Gamma', 'TECH-SOL-108', 'MNRE-COMM-2024-9988', 'B+', '+91 98765 66778', '2023-02-14', 'Class-A: DISCOM Net-Metering Synchronization', '["Testing","Net Metering Protocol","Bidirectional Meters"]'::jsonb, '{"totalKwInstalled":78,"surveysCompleted":45,"customerRating":4.92,"safetyScore":"100%","activeJobsCount":1}'::jsonb, '["DISCOM Net-meter Liaison Approved","Power Quality Analyser"]'::jsonb, '[]'::jsonb, '{"currentStatus":"Bi-directional Meter Testing","currentCustomer":"Vikram Malhotra","address":"Phagwara","activeStage":"Grid Synchronization Check","dailyRoute":[{"time":"11:00 AM","task":"DISCOM Net-Meter Line Inspection","status":"completed"},{"time":"02:30 PM","task":"Anti-Islanding Protection Test","status":"in_progress"}],"checklist":{"ppeSafety":true,"bomUnboxing":true,"structureAnchoring":true,"dcArrayStringing":true,"earthingResistance":true,"netMeterSync":true,"customerSignoff":false}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  crew = EXCLUDED.crew,
  employee_id = EXCLUDED.employee_id,
  license_no = EXCLUDED.license_no,
  blood_group = EXCLUDED.blood_group,
  emergency_contact = EXCLUDED.emergency_contact,
  skills = EXCLUDED.skills,
  stats = EXCLUDED.stats,
  certifications = EXCLUDED.certifications,
  showcase_gallery = EXCLUDED.showcase_gallery,
  work_handling = EXCLUDED.work_handling;


-- 3. PACKAGES (Residential & Commercial Rooftop Systems)
INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-1kw-ongrid', '1 kW Rooftop On-Grid System', 'on_grid', 1, 'Residential', 65000, 30000, 'Ideal for 1-2 BHK homes. Generates ~4-5 units/day, saving up to ₹1,200/month.', '[{"item":"Mono PERC Solar Panels 540W (Tier-1)","qty":2,"unit":"Nos","warranty":20},{"item":"1 kW On-Grid String Inverter","qty":1,"unit":"Unit","warranty":2},{"item":"Hot-Dip Galvanized Metal Mounting Stands","qty":1,"unit":"Set","warranty":5},{"item":"ACDB & DCDB Protection Wiring Boxes with MCB/SPD","qty":1,"unit":"Set","warranty":2},{"item":"Copper Earthing Rods & Chemical Compound","qty":2,"unit":"Sets","warranty":5},{"item":"4 sq.mm UV Protected Solar DC Cables","qty":30,"unit":"Meters","warranty":10},{"item":"Installation, Testing & Grid Commissioning","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-2kw-ongrid', '2 kW Rooftop On-Grid System', 'on_grid', 2, 'Residential', 125000, 60000, 'Perfect for 2-3 BHK homes. Generates ~8-10 units/day, cutting bills by ₹2,500/month.', '[{"item":"Mono PERC Solar Panels 540W (Tier-1)","qty":4,"unit":"Nos","warranty":20},{"item":"2 kW Smart On-Grid Inverter with Wi-Fi Logger","qty":1,"unit":"Unit","warranty":2},{"item":"Pre-galvanized High Wind-load Metal Stands","qty":1,"unit":"Set","warranty":5},{"item":"Dual ACDB/DCDB Surge & Disconnect Boxes","qty":1,"unit":"Set","warranty":2},{"item":"Dedicated Safety Earthing (Equipment + Lightning)","qty":3,"unit":"Sets","warranty":5},{"item":"4 sq.mm UV Solar DC + 4 sq.mm AC Armored Cable","qty":50,"unit":"Meters","warranty":10},{"item":"Installation, Testing & DISCOM Net Metering Work","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-3kw-ongrid', '3 kW Rooftop On-Grid System (Most Popular)', 'on_grid', 3, 'Residential', 185000, 78000, 'Homeowner favorite under national subsidy. Generates 12-14 units/day with max subsidy.', '[{"item":"Mono PERC Solar Panels 540W (Tier-1 Bi-facial)","qty":6,"unit":"Nos","warranty":20},{"item":"3.3 kW Dual-MPPT Solar Grid-Tie Inverter","qty":1,"unit":"Unit","warranty":2},{"item":"Elevated High-Strength Metal Rooftop Stands","qty":1,"unit":"Set","warranty":5},{"item":"IP65 ACDB & DCDB Distribution Box with Type-2 SPD","qty":1,"unit":"Set","warranty":2},{"item":"Pure Copper Bonded Earthing Electrodes","qty":3,"unit":"Sets","warranty":5},{"item":"6 sq.mm Heavy-duty Solar DC Wires & Conduits","qty":70,"unit":"Meters","warranty":10},{"item":"Crew Turnkey Fitting, Testing & Grid Sync","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-5kw-ongrid', '5 kW Commercial & Villa On-Grid System', 'on_grid', 5, 'Residential / Light Commercial', 295000, 78000, 'For large residences and small factories. Powers ACs, refrigeration, and daytime machinery.', '[{"item":"Mono PERC Solar Panels 550W (Tier-1)","qty":10,"unit":"Nos","warranty":20},{"item":"5 kW Three-Phase / Single-Phase Inverter","qty":1,"unit":"Unit","warranty":2},{"item":"Heavy Industrial Metal Elevated Structure","qty":1,"unit":"Set","warranty":5},{"item":"AC & DC Protection Distribution Panels","qty":1,"unit":"Set","warranty":2},{"item":"Chemical Earthing Pit & Lightning Arrestor (ESE)","qty":4,"unit":"Sets","warranty":5},{"item":"Heavy Gauged Wires, MC4 Connectors & Metal Conduits","qty":110,"unit":"Meters","warranty":10},{"item":"Full Crew Installation, Load Testing & Inspection","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-3kw-offgrid', '3 kW Off-Grid System (With Battery Backup)', 'off_grid', 3, 'Residential', 265000, 0, 'Complete independence with battery storage. Powers lights, fans, fridge during blackouts.', '[{"item":"Mono PERC Solar Panels 540W (Tier-1)","qty":6,"unit":"Nos","warranty":20},{"item":"3.5 kVA Pure Sine Wave Off-Grid Hybrid Inverter","qty":1,"unit":"Unit","warranty":2},{"item":"48V 100Ah Lithium Ferro Phosphate (LiFePO4) Battery","qty":1,"unit":"Unit","warranty":2},{"item":"Integrated MPPT Battery Charge Controller","qty":1,"unit":"Unit","warranty":2},{"item":"Sturdy Non-penetrating Metal Stands","qty":1,"unit":"Set","warranty":5},{"item":"Battery Interconnect Heavy Cables & Fuse Protection","qty":1,"unit":"Set","warranty":2},{"item":"Chemical Safety Earthing Kit","qty":3,"unit":"Sets","warranty":5},{"item":"Full Service Site Assembly & Commissioning","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-5kw-offgrid', '5 kW Off-Grid Powerhouse (Heavy Battery Bank)', 'off_grid', 5, 'Commercial & Dairy', 420000, 0, 'Built for rural factories, clinics, and farmhouses with severe or zero grid availability.', '[{"item":"Mono PERC Solar Panels 550W (Tier-1)","qty":10,"unit":"Nos","warranty":20},{"item":"5 kVA Heavy-duty Off-Grid Inverter with MPPT","qty":1,"unit":"Unit","warranty":2},{"item":"48V 200Ah High-Cycle Solar Storage Battery","qty":1,"unit":"Unit","warranty":2},{"item":"Automated Battery Charge Controller & BMS","qty":1,"unit":"Unit","warranty":2},{"item":"Industrial Hot-Dip Galvanized Elevated Stands","qty":1,"unit":"Set","warranty":5},{"item":"Heavy DC Busbars, Breakers & Enclosure","qty":1,"unit":"Set","warranty":2},{"item":"Earthing & Lightning Surge Protection","qty":4,"unit":"Sets","warranty":5},{"item":"Certified Technician Deployment & Load Run-test","qty":1,"unit":"Service","warranty":1}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-10kw-commercial', '10 kW Commercial Three-Phase Grid-Tied System', 'on_grid', 10, 'Commercial', 560000, 0, 'Designed for Commercial 3-Phase connections (offices, schools, cold storage, dairies). Eligible for 40% accelerated depreciation tax savings.', '[{"item":"Mono PERC Solar Panels 550W (Tier-1 Bi-facial)","qty":18,"unit":"Nos","warranty":20},{"item":"10 kW Three-Phase 415V Smart Grid-Tie Inverter","qty":1,"unit":"Unit","warranty":5},{"item":"Heavy Aluminum Elevated Rooftop Superstructure","qty":1,"unit":"Set","warranty":10},{"item":"IP66 Industrial LT Distribution Board with SPD & Breakers","qty":1,"unit":"Set","warranty":3},{"item":"Four-Chamber Chemical Earthing System (Equipment + Neutral + Lightning)","qty":4,"unit":"Sets","warranty":5},{"item":"10 sq.mm UV-Resistant DC Solar & 16 sq.mm AC Armored Cables","qty":180,"unit":"Meters","warranty":10},{"item":"Turnkey HT/LT Liaison, Net-Metering Approval & Testing","qty":1,"unit":"Service","warranty":2}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;

INSERT INTO packages (id, name, system_type, capacity_kw, connection_category, base_price, subsidy_amount, description, bom)
VALUES ('pkg-25kw-industrial', '25 kW Industrial High-Demand Solar Plant', 'on_grid', 25, 'Industrial', 1350000, 0, 'Engineered for factories, spinning mills, cold chains, and high-load industrial connections. Includes zero-export device & real-time telemetry.', '[{"item":"Mono PERC Solar Panels 550W (Tier-1)","qty":45,"unit":"Nos","warranty":20},{"item":"25 kW Heavy Industrial Grid Inverter with Triple MPPT","qty":1,"unit":"Unit","warranty":5},{"item":"Hot-Dip Galvanized Metal Truss Mountings (160 km/h wind rated)","qty":1,"unit":"Set","warranty":10},{"item":"Heavy C&I Protection Cubicle with Shunt Trips & Type-1+2 SPD","qty":1,"unit":"Set","warranty":3},{"item":"Early Streamer Emission (ESE) Lightning Arrestor & 6 Earthing Pits","qty":1,"unit":"Set","warranty":5},{"item":"Industrial Armored DC/AC Cabling Network & Cable Trays","qty":320,"unit":"Meters","warranty":10},{"item":"Electrical Inspectorate (CEIG) Clearance & Power Flow Sync","qty":1,"unit":"Service","warranty":2}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  subsidy_amount = EXCLUDED.subsidy_amount,
  bom = EXCLUDED.bom;


-- 4. ENQUIRIES (Rooftop Inquiries & Scheduled Surveys)
INSERT INTO enquiries (id, customer_id, customer_name, phone, email, address, city, connection_category, connection_type, sanctioned_load_kw, roof_type, monthly_electricity_bill, roof_area_sqft, system_preference, subsidy_interested, discom_account, status, notes)
VALUES ('enq-101', 'cust-1', 'Rajesh Sharma', '+91 98140 12345', 'rajesh.sharma@gmail.com', 'Plot 42, Model Town, Jalandhar, Punjab', 'Jalandhar', 'Residential', 'Residential 1-Phase 230V', 5, 'Reinforced Concrete (RCC Flat Roof)', 4500, 450, '3 kW On-Grid', TRUE, 'PSPCL-JL-884920', 'survey_completed', 'Homeowner wants maximum central subsidy under PM Surya Ghar. No tree shadows observed.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO enquiries (id, customer_id, customer_name, phone, email, address, city, connection_category, connection_type, sanctioned_load_kw, roof_type, monthly_electricity_bill, roof_area_sqft, system_preference, subsidy_interested, discom_account, status, notes)
VALUES ('enq-102', 'cust-2', 'Sunita Patel', '+91 98250 98765', 'sunita.patel@patelfarms.in', 'Green Valley Dairy, GT Road, Ludhiana, Punjab', 'Ludhiana', 'Commercial', 'Commercial 3-Phase 415V (Dairy & Chilling)', 15, 'Industrial Metal Tin Shed', 8800, 750, '5 kW Off-Grid', FALSE, 'PSPCL-LD-110294', 'converted', 'Frequent power cuts at dairy shed. Needs battery storage for chilling units.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO enquiries (id, customer_id, customer_name, phone, email, address, city, connection_category, connection_type, sanctioned_load_kw, roof_type, monthly_electricity_bill, roof_area_sqft, system_preference, subsidy_interested, discom_account, status, notes)
VALUES ('enq-103', 'cust-3', 'Vikram Malhotra', '+91 98722 34567', 'vikram.m@malhotratextiles.com', 'Industrial Focal Point, Phase 4, Phagwara', 'Phagwara', 'Industrial', 'Industrial HT 11kV/33kV', 40, 'Industrial Metal Tin Shed', 42000, 2800, '25 kW Industrial', FALSE, 'PSPCL-PG-762910', 'new', 'Factory seeking commercial tariff reduction and accelerated tax depreciation.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO enquiries (id, customer_id, customer_name, phone, email, address, city, connection_category, connection_type, sanctioned_load_kw, roof_type, monthly_electricity_bill, roof_area_sqft, system_preference, subsidy_interested, discom_account, status, notes)
VALUES ('enq-104', 'cust-4', 'Harpreet Singh Sandhu', '+91 98145 77889', 'harpreet.sandhu@gmail.com', 'Street 9, Urban Estate Phase II, Jalandhar', 'Jalandhar', 'Residential', 'Residential 1-Phase 230V', 6, 'Reinforced Concrete (RCC Flat Roof)', 5200, 500, '3 kW On-Grid', TRUE, 'PSPCL-JL-449102', 'survey_scheduled', 'New double-story house. Direct unobstructed South exposure.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO enquiries (id, customer_id, customer_name, phone, email, address, city, connection_category, connection_type, sanctioned_load_kw, roof_type, monthly_electricity_bill, roof_area_sqft, system_preference, subsidy_interested, discom_account, status, notes)
VALUES ('enq-105', 'cust-5', 'Jasleen Kaur Chawla', '+91 98761 22334', 'jasleen.k@chawlaclinic.in', 'Civil Hospital Road, Ludhiana', 'Ludhiana', 'Commercial', 'Commercial 3-Phase 415V', 12, 'Reinforced Concrete (RCC Flat Roof)', 12500, 900, '10 kW Commercial', FALSE, 'PSPCL-LD-993821', 'survey_scheduled', 'Daytime dental clinic with constant air-conditioning and compressor loads.')
ON CONFLICT (id) DO NOTHING;


-- 5. SITE SURVEYS (Technical Feasibility Evaluations)
INSERT INTO site_surveys (id, enquiry_id, customer_name, customer_email, customer_phone, technician_name, survey_date, time_slot, shadow_free_roof_sqft, monthly_bill, grid_connection_type, roof_direction, roof_tilt_degrees, cable_run_distance_meters, structural_integrity, status, disapproval_reason, surveyor_notes, approved_by_role, approved_by_name, admin_overwritten)
VALUES ('srv-1', 'enq-101', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', NULL, 'Amit Singh (Lead Tech)', '2026-11-08', 'Morning (09:00 AM - 01:00 PM)', 420, 4500, 'Residential 1-Phase 230V', 'South (True South 185°)', 22, 18, 'Solid Reinforced Concrete (RCC) - Excellent', 'approved', NULL, 'Optimal solar irradiation. Direct conduit path to meter room. Approved for 3 kW On-Grid.', 'technician', 'Amit Singh (Lead Tech)', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_surveys (id, enquiry_id, customer_name, customer_email, customer_phone, technician_name, survey_date, time_slot, shadow_free_roof_sqft, monthly_bill, grid_connection_type, roof_direction, roof_tilt_degrees, cable_run_distance_meters, structural_integrity, status, disapproval_reason, surveyor_notes, approved_by_role, approved_by_name, admin_overwritten)
VALUES ('srv-2', 'enq-102', 'Sunita Patel', 'sunita.patel@patelfarms.in', NULL, 'Manoj Patel (Lead Tech)', '2026-11-10', 'Morning (09:00 AM - 01:00 PM)', 720, 8800, 'Commercial 3-Phase 415V', 'South-West (210°)', 25, 32, 'Heavy Steel Trusses on Dairy Shed - Good', 'approved', NULL, 'Shed roof ideal for elevated clamps. Battery bank to be housed in ventilated dry room.', 'technician', 'Manoj Patel (Lead Tech)', FALSE)
ON CONFLICT (id) DO NOTHING;


-- 6. QUOTATIONS (Formal Estimates & Net Payable Calculations)
INSERT INTO quotations (id, quote_number, enquiry_id, customer_id, customer_name, customer_email, customer_phone, package_id, capacity_kw, system_type, connection_category, subtotal_amount, subsidy_discount, net_payable_amount, advance_required, advance_paid, status, payment_details, payment_confirmed_by_admin, payment_verification, valid_until, items)
VALUES ('quo-1001', 'SP-QT-2026-101', 'enq-101', 'cust-1', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', NULL, 'pkg-3kw-ongrid', 3, 'on_grid', 'Residential', 185000, 78000, 107000, 40000, 40000, 'advance_paid', NULL, FALSE, NULL, '2026-12-10', '[{"item":"Mono PERC Solar Panels 540W (Tier-1 Bi-facial)","qty":6,"unit":"Nos","warranty":"20 Years"},{"item":"3.3 kW Dual-MPPT Solar Grid-Tie Inverter","qty":1,"unit":"Unit","warranty":"2 Years"},{"item":"Elevated High-Strength Metal Rooftop Stands","qty":1,"unit":"Set","warranty":"5 Years"},{"item":"IP65 ACDB & DCDB Distribution Box with SPD","qty":1,"unit":"Set","warranty":"2 Years"},{"item":"Pure Copper Bonded Earthing Electrodes","qty":3,"unit":"Sets","warranty":"5 Years"},{"item":"6 sq.mm Heavy-duty Solar DC Wires & Conduits","qty":70,"unit":"Meters","warranty":"10 Years"},{"item":"Crew Turnkey Fitting, Testing & Grid Sync","qty":1,"unit":"Service","warranty":"1 Year"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quotations (id, quote_number, enquiry_id, customer_id, customer_name, customer_email, customer_phone, package_id, capacity_kw, system_type, connection_category, subtotal_amount, subsidy_discount, net_payable_amount, advance_required, advance_paid, status, payment_details, payment_confirmed_by_admin, payment_verification, valid_until, items)
VALUES ('quo-1002', 'SP-QT-2026-102', 'enq-102', 'cust-2', 'Sunita Patel', 'sunita.patel@patelfarms.in', NULL, 'pkg-5kw-offgrid', 5, 'off_grid', 'Commercial', 420000, 0, 420000, 150000, 150000, 'accepted', NULL, FALSE, NULL, '2026-12-15', '[{"item":"Mono PERC Solar Panels 550W (Tier-1)","qty":10,"unit":"Nos","warranty":"20 Years"},{"item":"5 kVA Heavy-duty Off-Grid Inverter with MPPT","qty":1,"unit":"Unit","warranty":"2 Years"},{"item":"48V 200Ah High-Cycle Solar Storage Battery","qty":1,"unit":"Unit","warranty":"2 Years"},{"item":"Automated Battery Charge Controller & BMS","qty":1,"unit":"Unit","warranty":"2 Years"},{"item":"Industrial Hot-Dip Galvanized Elevated Stands","qty":1,"unit":"Set","warranty":"5 Years"},{"item":"Heavy DC Busbars, Breakers & Enclosure","qty":1,"unit":"Set","warranty":"2 Years"},{"item":"Earthing & Lightning Surge Protection","qty":4,"unit":"Sets","warranty":"5 Years"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;


-- 7. ORDERS (Confirmed Projects & Tracking Milestones)
INSERT INTO orders (id, order_number, quote_id, customer_id, customer_name, customer_email, phone, address, capacity_kw, system_type, connection_category, total_amount, advance_paid, balance_due, dispatch_status, installation_status, assigned_crew, scheduled_date, tracking_stage, tracking_history)
VALUES ('ord-201', 'ORD-SUN-2026-088', 'quo-1001', 'cust-1', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', '+91 98140 12345', 'Plot 42, Model Town, Jalandhar, Punjab', 3, 'on_grid', 'Residential', 107000, 40000, 67000, 'delivered', 'completed', 'Crew Alpha (Lead: Amit Singh)', '2026-11-14', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, order_number, quote_id, customer_id, customer_name, customer_email, phone, address, capacity_kw, system_type, connection_category, total_amount, advance_paid, balance_due, dispatch_status, installation_status, assigned_crew, scheduled_date, tracking_stage, tracking_history)
VALUES ('ord-202', 'ORD-SUN-2026-089', 'quo-1002', 'cust-2', 'Sunita Patel', 'sunita.patel@patelfarms.in', '+91 98250 98765', 'Green Valley Dairy, GT Road, Ludhiana, Punjab', 5, 'off_grid', 'Commercial', 420000, 150000, 270000, 'packed', 'scheduled', 'Crew Beta (Lead: Manoj Patel)', '2026-11-23', NULL, NULL)
ON CONFLICT (id) DO NOTHING;


-- 8. INVENTORY ITEMS (Warehouse Equipment Stock)
INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-1', 'PNL-540W', 'Mono PERC Solar Panel 540W Tier-1', 'panel', NULL, 11500, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-2', 'INV-3KW-GT', '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', 'inverter', NULL, 28000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-3', 'INV-5KW-OG', '5 kVA Heavy-duty Off-Grid Inverter with MPPT', 'inverter', NULL, 46000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-3b', 'INV-10KW-3P', '10 kW Three-Phase 415V Smart Grid-Tie Inverter', 'inverter', NULL, 65000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-4', 'BAT-48V-100', '48V 100Ah LiFePO4 Solar Battery', 'battery', NULL, 55000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-5', 'BAT-48V-200', '48V 200Ah High-Cycle Lithium Storage Battery', 'battery', NULL, 98000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-6', 'CTR-MPPT-60', '60A Intelligent MPPT Solar Charge Controller', 'charge_controller', NULL, 8500, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-7', 'STR-HDG-3KW', 'Hot-Dip Galvanized Rooftop Stand 3 kW Kit', 'structure', NULL, 9000, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-8', 'CBL-DC-6MM', '6 sq.mm UV Solar DC Cable Drum (100m)', 'wires', NULL, 3800, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;

INSERT INTO inventory_items (id, sku, name, category, quantity_in_stock, unit_cost, reorder_threshold, warehouse_location)
VALUES ('inv-9', 'EARTH-COP-KIT', 'Copper Earthing Rod & Compound Set', 'safety', NULL, 1800, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost;


-- 9. SERIAL NUMBERS (Dispatched & Tracked Serial Items)
INSERT INTO serial_numbers (id, serial_number, item_name, category, order_id, customer_name, status, warranty_years, warranty_start_date, warranty_end_date)
VALUES ('sn-1', 'INV-SUN-3K-88910', '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', 'inverter', 'ord-201', 'Rajesh Sharma', 'installed', 2, '2026-11-14', '2028-11-14')
ON CONFLICT (id) DO NOTHING;

INSERT INTO serial_numbers (id, serial_number, item_name, category, order_id, customer_name, status, warranty_years, warranty_start_date, warranty_end_date)
VALUES ('sn-2', 'INV-SUN-5K-99014', '5 kVA Heavy-duty Off-Grid Inverter with MPPT', 'inverter', 'ord-202', 'Sunita Patel', 'scanned_for_dispatch', 2, '2026-11-21', '2028-11-21')
ON CONFLICT (id) DO NOTHING;

INSERT INTO serial_numbers (id, serial_number, item_name, category, order_id, customer_name, status, warranty_years, warranty_start_date, warranty_end_date)
VALUES ('sn-3', 'BAT-LFP-48V-44120', '48V 200Ah High-Cycle Lithium Storage Battery', 'battery', 'ord-202', 'Sunita Patel', 'scanned_for_dispatch', 2, '2026-11-21', '2028-11-21')
ON CONFLICT (id) DO NOTHING;

INSERT INTO serial_numbers (id, serial_number, item_name, category, order_id, customer_name, status, warranty_years, warranty_start_date, warranty_end_date)
VALUES ('sn-4', 'CTR-MPPT-60A-1109', '60A Intelligent MPPT Solar Charge Controller', 'charge_controller', 'ord-202', 'Sunita Patel', 'scanned_for_dispatch', 2, '2026-11-21', '2028-11-21')
ON CONFLICT (id) DO NOTHING;

INSERT INTO serial_numbers (id, serial_number, item_name, category, order_id, customer_name, status, warranty_years, warranty_start_date, warranty_end_date)
VALUES ('sn-5', 'INV-SUN-2K-71022', '2 kW Grid-Tie Inverter (2024 Series)', 'inverter', NULL, 'Kapurthala Textile Mills', 'installed', 2, '2024-05-10', '2026-05-10')
ON CONFLICT (id) DO NOTHING;


-- 10. INSTALLATIONS (On-roof Commissioning, Testing & Handover)
INSERT INTO installations (id, order_id, customer_name, customer_email, customer_phone, address, crew_name, technician_count, scheduled_date, start_time, finish_time, system_size_kw, power_generation_tested_kw, customer_signed, customer_signature, customer_signer_name, handover_notes, photos, status, completed_at)
VALUES ('inst-1', 'ord-201', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', '+91 98140 12345', 'Plot 42, Model Town, Jalandhar, Punjab', 'Crew Alpha (Lead: Amit Singh)', 4, '2026-11-14', '08:30 AM', '04:15 PM', 3, 3.12, TRUE, 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M 10 40 Q 60 10, 110 35 T 190 25" fill="none" stroke="%230e5a8a" stroke-width="3"/></svg>', 'Rajesh Sharma', 'Earthing pit resistance tested < 2.0 Ohms. Inverter synced with PSPCL net-meter line. Customer trained on phone mobile app monitoring.', '[{"url":"https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80","label":"Completed 3 kW Rooftop Array (6 Bi-facial Panels)"},{"url":"https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80","label":"Inverter & ACDB/DCDB Surge Enclosure Mounted"},{"url":"https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80","label":"Safety Earthing Chamber & Lightning Spike"}]'::jsonb, 'signed_off', '2026-11-14T16:30:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO installations (id, order_id, customer_name, customer_email, customer_phone, address, crew_name, technician_count, scheduled_date, start_time, finish_time, system_size_kw, power_generation_tested_kw, customer_signed, customer_signature, customer_signer_name, handover_notes, photos, status, completed_at)
VALUES ('inst-2', 'ord-202', 'Sunita Patel', 'sunita.patel@patelfarms.in', '+91 98250 98765', 'Green Valley Dairy, GT Road, Ludhiana, Punjab', 'Crew Beta (Lead: Manoj Patel)', 5, '2026-11-23', '09:00 AM', NULL, 5, NULL, FALSE, NULL, '', 'Warehouse staging complete. Truck loaded with ₹1,50,000 worth inverters and batteries. Installation scheduled.', '[]'::jsonb, 'scheduled', NULL)
ON CONFLICT (id) DO NOTHING;


-- 11. WARRANTIES (Active Inverter & Solar Panel Warranties)
INSERT INTO warranties (id, serial_number, equipment_name, equipment_type, customer_name, customer_email, customer_phone, start_date, end_date, warranty_years, is_active, coverage)
VALUES ('war-1', 'INV-SUN-3K-88910', '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', 'Inverter', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', '+91 98140 12345', '2026-11-14', '2028-11-14', 2, TRUE, '100% Free replacement of PCB / Inverter unit & on-site labour.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO warranties (id, serial_number, equipment_name, equipment_type, customer_name, customer_email, customer_phone, start_date, end_date, warranty_years, is_active, coverage)
VALUES ('war-2', 'PNL-540-LOT-8891', 'Mono PERC Solar Panels (6x 540W)', 'Solar Panels', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', '+91 98140 12345', '2026-11-14', '2046-11-14', 20, TRUE, '20-Year linear power generation output performance guarantee.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO warranties (id, serial_number, equipment_name, equipment_type, customer_name, customer_email, customer_phone, start_date, end_date, warranty_years, is_active, coverage)
VALUES ('war-3', 'INV-SUN-2K-71022', '2 kW Grid-Tie Inverter (2024 Series)', 'Inverter', 'Vikram Malhotra', 'vikram.m@malhotratextiles.com', '+91 98722 34567', '2024-05-10', '2026-05-10', 2, FALSE, 'Expired (Requires chargeable parts & standard labour billing).')
ON CONFLICT (id) DO NOTHING;


-- 12. SERVICE TICKETS (Field Service & Breakdown Repairs)
INSERT INTO service_tickets (id, ticket_number, customer_name, customer_email, phone, serial_number, equipment_type, fault_code, description, is_under_warranty, estimated_cost, technician_assigned, status, resolution_notes, resolved_at)
VALUES ('tkt-301', 'TCK-2026-042', 'Rajesh Sharma', 'rajesh.sharma@gmail.com', '+91 98140 12345', 'INV-SUN-3K-88910', 'Inverter', 'E04 - Heavy Rain Grid Isolation Warning', 'Heavy rain in Jalandhar yesterday. Inverter LCD showing error E04 and zero power generation.', TRUE, 0, 'Amit Singh (Lead Tech)', 'in_repair', 'Technician dispatched to inspect cable gland sealing and moisture resistance. 100% covered under warranty (₹0 charged).', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_tickets (id, ticket_number, customer_name, customer_email, phone, serial_number, equipment_type, fault_code, description, is_under_warranty, estimated_cost, technician_assigned, status, resolution_notes, resolved_at)
VALUES ('tkt-302', 'TCK-2026-039', 'Vikram Malhotra', 'vikram.m@malhotratextiles.com', '+91 98722 34567', 'INV-SUN-2K-71022', 'Inverter', 'F12 - Fan & IGBT Breakdown', 'Zero power generation after lightning storm. Inverter fan not spinning.', FALSE, 7400, 'Vijay Verma', 'assigned', 'Inverter 2-year warranty expired in May 2026. Automated estimate generated: Cooling fan ₹1,800 + IGBT module ₹4,400 + Labour ₹1,200.', NULL)
ON CONFLICT (id) DO NOTHING;


-- 13. JOB PROFITABILITY (Cost Breakdown & Margin Analysis)
INSERT INTO job_profitability (id, customer_name, capacity_kw, connection_category, revenue_received, stock_purchase_cost, technician_wages, permits_and_logistics, gross_profit, profit_margin_pct, subsidy_status, subsidy_amount, month_year)
VALUES ('prf-1', 'Rajesh Sharma (3 kW On-Grid)', 3, 'Residential', 107000, 62000, 14000, 5500, 25500, 23.83, 'discom_inspection_passed', 78000, 'November 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_profitability (id, customer_name, capacity_kw, connection_category, revenue_received, stock_purchase_cost, technician_wages, permits_and_logistics, gross_profit, profit_margin_pct, subsidy_status, subsidy_amount, month_year)
VALUES ('prf-2', 'Sharma Residence, Jalandhar (5 kW)', 5, 'Residential', 217000, 132000, 21000, 9000, 55000, 25.34, 'disbursed', 78000, 'November 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_profitability (id, customer_name, capacity_kw, connection_category, revenue_received, stock_purchase_cost, technician_wages, permits_and_logistics, gross_profit, profit_margin_pct, subsidy_status, subsidy_amount, month_year)
VALUES ('prf-3', 'Phagwara Textile Unit (10 kW Commercial)', 10, 'Commercial', 560000, 380000, 48000, 22000, 110000, 19.64, 'not_applicable', 0, 'November 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_profitability (id, customer_name, capacity_kw, connection_category, revenue_received, stock_purchase_cost, technician_wages, permits_and_logistics, gross_profit, profit_margin_pct, subsidy_status, subsidy_amount, month_year)
VALUES ('prf-4', 'Urban High-Rise Rooftop (2 kW Difficult Access)', 2, 'Residential', 85000, 59000, 22000, 11000, -7000, -8.23, 'approved', 60000, 'November 2026')
ON CONFLICT (id) DO NOTHING;

