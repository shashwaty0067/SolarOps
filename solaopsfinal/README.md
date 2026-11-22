# SolarOps — Digital Solar Management System

A digital backbone built with **React + Vite** and **Supabase PostgreSQL** for rooftop solar companies (inspired by SunPower Solutions), solving operational headaches from the first quote request to the 20-year warranty.

---

## 🏛️ Project Architecture

The application strictly reflects the system architecture specification:

```
                                  PUBLIC WEBSITE
                       (Anyone can visit without logging in)
         Solar products • Services • Packages • Contact • Request a quote
                                        │
                                 Login / Sign up
                        ┌───────────────┴───────────────┐
                        ▼                               ▼
                 Customer Portal                 Admin Dashboard
                  (User login)                    (Admin login)
            Customers manage their           Company controls the
             own solar journey:                entire operation:
            • My enquiries                   • Customer management
            • My quotations                  • Site surveys
            • My orders                      • Quotations
            • Installation status            • Inventory
            • Warranty                       • Orders
            • Service requests               • Installations
            • Profile                        • Warranty
                                             • Finance
                                             • Reports
                        └───────────────┬───────────────┘
                                        ▼
                                 Supabase Backend
               (Authentication + PostgreSQL + Storage + Row Level Security)
```

---

## ⚡ Problem Statement Real-World Flows Implemented

1. **Scene 1: The Rooftop Inquiry**
   - Web enquiry captures name, phone, address, shadow-free roof area, and monthly power bill.
   - Engineering desk assigns 1 of 15 technicians.
   - Field survey records roof direction (azimuth), tilt angle, grid connection (1-phase/3-phase), and cable run distance to main meter.
   - Quotation creation is safely locked until survey is officially approved.

2. **Scene 2: Getting the Kit Right**
   - Standard package templates from **1 kW to 5 kW** (On-Grid with max PM Surya Ghar subsidy & Off-Grid with battery storage).
   - Automatically populates the exact Bill of Materials (BOM) parts: Tier-1 Mono PERC panels, inverters, elevated galvanized stands, ACDB/DCDB protection boxes, earthing electrodes, and cables so nothing is forgotten.
   - Advance payment (e.g. 35%) confirmation unlocks warehouse dispatch and crew scheduling.

3. **Scene 3: Dispatch Day and Serial Numbers**
   - Staging for ₹1,50,000 worth of inverters and batteries.
   - Every inverter, battery, and charge controller has its serial number scanned/registered before the truck leaves.
   - Truck dispatch automatically initiates the warranty clock (2 years for inverters & batteries, 20 years for solar panels).

4. **Scene 4: On the Roof**
   - 15 field technicians organized across 3 specialized crews (Alpha, Beta, Gamma).
   - Mobile/tablet friendly handover form: start/finish times, confirmation of system size, tested power generation output, roof photo proof.
   - **Interactive Digital Signature Pad**: Homeowners sign directly on screen to certify handover acceptance and net-metering commissioning.

5. **Scene 5: The Rainy Season Breakdown**
   - Instant search bar finds customer and exact inverter serial number in seconds.
   - Automated warranty validation:
     - **Under Warranty**: Repair or replacement costs the customer **₹0 (Free)**.
     - **Expired**: Automated billing generated for parts and technician labour.
   - Full ticket lifecycle tracking until customer confirms resolution.

6. **Scene 6: The Director's Month-End**
   - Answers: *Which installations made money? Which lost money?*
   - Per-job gross margin % and profit calculation (Revenue - Stock Purchase Cost - Technician Wages - Permits/Logistics).
   - Advance payments collected vs balances due.
   - Technician payroll ledger.
   - Government subsidy paperwork tracking (Applied → DISCOM inspection passed → Approved → Disbursed).
   - Executive print/export report view.

---

## 🗄️ Supabase Backend (PostgreSQL)

The full PostgreSQL DDL schema with Row Level Security (RLS) is located at:
📁 `supabase/schema.sql`

Tables defined:
- `profiles`
- `packages` & `bom_templates`
- `enquiries`
- `site_surveys`
- `quotations`
- `orders`
- `inventory_items` & `serial_numbers`
- `installations`
- `warranties`
- `service_tickets`
- `job_profitability`

### Connecting Supabase
Add your Supabase project credentials in `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
*Note: The app also includes an automated offline demo store with local storage persistence, meaning it works 100% out of the box right away even before configuring Supabase.*

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
