-- ====================================================================
-- SunPower Solutions / SolarFlow - Supabase PostgreSQL Schema
-- Solar Installation Management System
-- Digital backbone from first quote request to 20-year warranty
-- ====================================================================

-- 0. Clean reset of existing conflicting tables
DROP TABLE IF EXISTS job_profitability CASCADE;
DROP TABLE IF EXISTS service_tickets CASCADE;
DROP TABLE IF EXISTS warranties CASCADE;
DROP TABLE IF EXISTS installations CASCADE;
DROP TABLE IF EXISTS serial_numbers CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS site_surveys CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS bom_templates CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / REGISTERED USERS (Customers, Admin, Technician Auth)
CREATE TABLE profiles (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auth_user_id VARCHAR(80),
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(80) DEFAULT 'Punjab',
  connection_category VARCHAR(50) DEFAULT 'Residential',
  connection_type VARCHAR(80) DEFAULT 'Residential 1-Phase 230V',
  discom_account VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1B. TECHNICAL STAFF & CREW DIRECTORY (IDP, Credentials, Work Showcase & Handling)
CREATE TABLE staff (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(80) NOT NULL DEFAULT 'Field Technician',
  crew VARCHAR(80) DEFAULT 'Crew Alpha',
  employee_id VARCHAR(50) UNIQUE,
  license_no VARCHAR(80),
  blood_group VARCHAR(10) DEFAULT 'B+',
  emergency_contact VARCHAR(120),
  joining_date DATE DEFAULT CURRENT_DATE,
  safety_clearance VARCHAR(120),
  skills JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{"totalKwInstalled": 0, "surveysCompleted": 0, "customerRating": 5.0, "safetyScore": "100%", "activeJobsCount": 0}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  showcase_gallery JSONB DEFAULT '[]'::jsonb,
  work_handling JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PACKAGES & BILL OF MATERIALS TEMPLATES (Residential + Commercial)
CREATE TABLE packages (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  system_type VARCHAR(20) NOT NULL,
  capacity_kw NUMERIC(6,2) NOT NULL,
  connection_category VARCHAR(50) DEFAULT 'Residential',
  base_price NUMERIC(12,2) NOT NULL,
  subsidy_amount NUMERIC(12,2) DEFAULT 0,
  description TEXT,
  bom JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bom_templates (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  package_id VARCHAR(80) REFERENCES packages(id) ON DELETE CASCADE,
  item_name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  warranty_years INT DEFAULT 2
);

-- 3. CUSTOMER ENQUIRIES (The Rooftop Inquiry - Residential & Commercial)
CREATE TABLE enquiries (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id VARCHAR(80) REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(80) NOT NULL,
  connection_category VARCHAR(50) DEFAULT 'Residential',
  connection_type VARCHAR(80) DEFAULT 'Residential 1-Phase 230V',
  sanctioned_load_kw NUMERIC(6,2) DEFAULT 3.0,
  roof_type VARCHAR(80) DEFAULT 'Reinforced Concrete (RCC Flat Roof)',
  monthly_electricity_bill NUMERIC(12,2) NOT NULL,
  roof_area_sqft NUMERIC(10,2) NOT NULL,
  system_preference VARCHAR(80) DEFAULT '3 kW On-Grid',
  subsidy_interested BOOLEAN DEFAULT TRUE,
  discom_account VARCHAR(50),
  status VARCHAR(30) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SITE SURVEYS & TECHNICAL FEASIBILITY
CREATE TABLE site_surveys (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  enquiry_id VARCHAR(80) REFERENCES enquiries(id) ON DELETE CASCADE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  customer_phone VARCHAR(50),
  technician_name VARCHAR(120),
  survey_date DATE,
  time_slot VARCHAR(80) DEFAULT 'Morning (09:00 AM - 01:00 PM)',
  shadow_free_roof_sqft NUMERIC(10,2) NOT NULL,
  monthly_bill NUMERIC(12,2) NOT NULL,
  grid_connection_type VARCHAR(80) NOT NULL,
  roof_direction VARCHAR(50) NOT NULL,
  roof_tilt_degrees NUMERIC(5,2) NOT NULL,
  cable_run_distance_meters NUMERIC(6,2) NOT NULL,
  structural_integrity VARCHAR(80) DEFAULT 'Suitable for Standard Mounting',
  status VARCHAR(30) DEFAULT 'pending',
  disapproval_reason TEXT,
  surveyor_notes TEXT,
  approved_by_role VARCHAR(30) DEFAULT 'technician',
  approved_by_name VARCHAR(120),
  admin_overwritten BOOLEAN DEFAULT FALSE,
  admin_overwrite_reason TEXT,
  overwritten_by VARCHAR(120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. QUOTATIONS (Getting the Kit Right)
CREATE TABLE quotations (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  enquiry_id VARCHAR(80) REFERENCES enquiries(id) ON DELETE SET NULL,
  customer_id VARCHAR(80) REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  customer_phone VARCHAR(50),
  package_id VARCHAR(80) REFERENCES packages(id),
  capacity_kw NUMERIC(6,2) NOT NULL,
  system_type VARCHAR(20) NOT NULL,
  connection_category VARCHAR(50) DEFAULT 'Residential',
  subtotal_amount NUMERIC(12,2) NOT NULL,
  subsidy_discount NUMERIC(12,2) DEFAULT 0,
  net_payable_amount NUMERIC(12,2) NOT NULL,
  advance_required NUMERIC(12,2) NOT NULL,
  advance_paid NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(30) DEFAULT 'sent',
  payment_details JSONB,
  payment_confirmed_by_admin BOOLEAN DEFAULT FALSE,
  payment_verification JSONB,
  valid_until DATE,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDERS & INVENTORY (Dispatch Day & Serial Numbers)
CREATE TABLE orders (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  quote_id VARCHAR(80) REFERENCES quotations(id) ON DELETE SET NULL,
  customer_id VARCHAR(80) REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  capacity_kw NUMERIC(6,2) NOT NULL,
  system_type VARCHAR(20) NOT NULL,
  connection_category VARCHAR(50) DEFAULT 'Residential',
  total_amount NUMERIC(12,2) NOT NULL,
  advance_paid NUMERIC(12,2) NOT NULL,
  balance_due NUMERIC(12,2) NOT NULL,
  dispatch_status VARCHAR(30) DEFAULT 'pending_packing',
  dispatch_date DATE,
  dispatch_items JSONB,
  installation_status VARCHAR(30) DEFAULT 'scheduled',
  assigned_crew VARCHAR(120),
  scheduled_date DATE,
  tracking_stage VARCHAR(100) DEFAULT 'Payment Confirmed & Order Booked',
  tracking_history JSONB,
  payment_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_items (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity_in_stock INT NOT NULL DEFAULT 0,
  unit_cost NUMERIC(10,2) NOT NULL,
  reorder_threshold INT DEFAULT 5,
  warehouse_location VARCHAR(50) DEFAULT 'Phagwara Hub Warehouse',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE serial_numbers (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  serial_number VARCHAR(80) UNIQUE NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  order_id VARCHAR(80) REFERENCES orders(id) ON DELETE SET NULL,
  customer_name VARCHAR(120),
  status VARCHAR(30) DEFAULT 'scanned_for_dispatch',
  warranty_years INT DEFAULT 2,
  warranty_start_date DATE,
  warranty_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INSTALLATIONS (On the Roof - Handover Form & Signatures)
CREATE TABLE installations (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id VARCHAR(80) REFERENCES orders(id) ON DELETE CASCADE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  customer_phone VARCHAR(50),
  address TEXT NOT NULL,
  crew_name VARCHAR(120) NOT NULL,
  technician_count INT DEFAULT 5,
  scheduled_date DATE,
  start_time VARCHAR(20) DEFAULT '08:30 AM',
  finish_time VARCHAR(20),
  system_size_kw NUMERIC(6,2) NOT NULL,
  power_generation_tested_kw NUMERIC(6,2),
  customer_signed BOOLEAN DEFAULT FALSE,
  customer_signature TEXT,
  customer_signer_name VARCHAR(120),
  handover_notes TEXT,
  photos JSONB,
  status VARCHAR(30) DEFAULT 'scheduled',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. WARRANTIES
CREATE TABLE warranties (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  serial_number VARCHAR(80) NOT NULL,
  equipment_name VARCHAR(120) NOT NULL,
  equipment_type VARCHAR(50) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  customer_phone VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  warranty_years INT NOT NULL DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE,
  coverage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SERVICE REQUESTS & BREAKDOWNS (Rainy Season Breakdown)
CREATE TABLE service_tickets (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120),
  phone VARCHAR(20) NOT NULL,
  serial_number VARCHAR(80),
  equipment_type VARCHAR(50) NOT NULL,
  fault_code VARCHAR(50),
  description TEXT NOT NULL,
  is_under_warranty BOOLEAN DEFAULT TRUE,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  technician_assigned VARCHAR(120),
  status VARCHAR(30) DEFAULT 'open',
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. FINANCE & JOB PROFITABILITY (The Director's Month-End)
CREATE TABLE job_profitability (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id VARCHAR(80) REFERENCES orders(id) ON DELETE CASCADE,
  customer_name VARCHAR(120) NOT NULL,
  capacity_kw NUMERIC(6,2) NOT NULL,
  connection_category VARCHAR(50) DEFAULT 'Residential',
  revenue_received NUMERIC(12,2) NOT NULL,
  stock_purchase_cost NUMERIC(12,2) NOT NULL,
  technician_wages NUMERIC(12,2) NOT NULL,
  permits_and_logistics NUMERIC(12,2) NOT NULL,
  gross_profit NUMERIC(12,2) NOT NULL,
  profit_margin_pct NUMERIC(5,2) NOT NULL,
  subsidy_status VARCHAR(40) DEFAULT 'filed',
  subsidy_amount NUMERIC(12,2) DEFAULT 0,
  month_year VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- PERMISSIONS & ROLES (Ensures web client using anon key can read/write)
-- ====================================================================

-- 1. Grant schema usage and table access to anon, authenticated, service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 2. Disable Row Level Security (RLS) on all tables for seamless application read/write
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE bom_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE serial_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE installations DISABLE ROW LEVEL SECURITY;
ALTER TABLE warranties DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_profitability DISABLE ROW LEVEL SECURITY;

-- 3. Non-destructive safety migrations for RBAC, Staff & Feasibility overrides
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(80) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(80) NOT NULL DEFAULT 'Field Technician',
  crew VARCHAR(80) DEFAULT 'Crew Alpha',
  employee_id VARCHAR(50) UNIQUE,
  license_no VARCHAR(80),
  blood_group VARCHAR(10) DEFAULT 'B+',
  emergency_contact VARCHAR(120),
  joining_date DATE DEFAULT CURRENT_DATE,
  safety_clearance VARCHAR(120),
  skills JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{"totalKwInstalled": 0, "surveysCompleted": 0, "customerRating": 5.0, "safetyScore": "100%", "activeJobsCount": 0}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  showcase_gallery JSONB DEFAULT '[]'::jsonb,
  work_handling JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_surveys ADD COLUMN IF NOT EXISTS approved_by_role VARCHAR(30) DEFAULT 'technician';
ALTER TABLE site_surveys ADD COLUMN IF NOT EXISTS approved_by_name VARCHAR(120);
ALTER TABLE site_surveys ADD COLUMN IF NOT EXISTS admin_overwritten BOOLEAN DEFAULT FALSE;
ALTER TABLE site_surveys ADD COLUMN IF NOT EXISTS admin_overwrite_reason TEXT;
ALTER TABLE site_surveys ADD COLUMN IF NOT EXISTS overwritten_by VARCHAR(120);

