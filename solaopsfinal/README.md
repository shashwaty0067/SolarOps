# ☀️ SolarOps — Digital Solar Management System

**SolarOps** is an enterprise-grade digital operating backbone built for Solar EPC (Engineering, Procurement, and Construction) companies and rooftop solar installers. Built with **React 18 + Vite** and powered by **Supabase PostgreSQL**, SolarOps replaces disconnected spreadsheets, WhatsApp groups, and paper sign-offs with an end-to-end digital workflow — from customer inquiry and rooftop feasibility survey to inventory dispatch, digital sign-off, warranty tracking, and real-time job profitability.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Portals & Capabilities](#-key-portals--capabilities)
- [Real-World Operational Workflows](#-real-world-operational-workflows)
- [Database Schema & Architecture](#-database-schema--architecture)
- [Demo Data & Seeder Utility](#-demo-data--seeder-utility)
- [Environment Setup & Installation](#-environment-setup--installation)
- [Deployment on Vercel](#-deployment-on-vercel)
- [Tech Stack](#-tech-stack)

---

## 🏛️ System Architecture

```
                                  PUBLIC WEBSITE
                       (Accessible to all visitors & leads)
        Solar Packages • Savings Calculator • Track by Phone • Quote Request
                                        │
                         Authentication & Role Routing
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
                 CUSTOMER PORTAL  TECHNICIAN PORTAL ADMIN DASHBOARD
                 (Customer Role)  (Field Staff Role) (Admin/Executive)
                 ───────────────  ───────────────── ───────────────
                 • My Inquiries   • Assigned Feas.  • Lead Pipeline
                 • My Quotations    Surveys         • Survey Approvals
                 • Order Tracking • Field Handover  • Dynamic BOM & Quote
                 • Dispatch Items • On-Screen Sign- • Live Warehouse &
                 • Warranties       off with Pad      Serial Dispatch
                 • Service / Help • Breakdown Serv. • Technician Roster
                   Tickets          Tickets         • Orders & Payments
                                                    • Warranty Master
                                                    • Job Profitability
                        └───────────────┬───────────────┘
                                        ▼
                                SUPABASE BACKEND
          (PostgreSQL Database • Row Level Security • REST API • Auth)
```

---

## 🌟 Key Portals & Capabilities

### 1. 🌐 Public Website & Lead Capture
- **Solar Solution Explorer**: Residential, Commercial, and Industrial grid-tie and off-grid packages with PM Surya Ghar subsidy estimations.
- **Rooftop Calculator**: Recommends system capacity (kW), estimated monthly savings, and roof area requirement based on the customer's power bill.
- **Track by Phone**: Customers can look up live progress of their application or order simply by entering their registered phone number.
- **Feasibility Request Modal**: Captures electricity connection category, sanctioned load, monthly bill, and roof type.

### 2. 👤 Customer Self-Service Portal
- **Quotation Review & BOM Inspection**: View detailed hardware Bill of Materials (BOM) with OEM warranties.
- **Digital Payment Proof Submission**: Homeowners can submit NEFT/UPI/Bank UTR reference numbers directly from the portal.
- **Live Milestone Tracker**: Real-time progress bar through Survey → Quote → Payment Confirmed → Warehouse Packing → Truck Dispatched → Installation Scheduled → Grid Net-Meter Commissioned.
- **Itemized Component Warranties**: View active warranties for each scanned serial number with direct warranty claim / service ticketing.
- **Breakdown & Troubleshooting Tickets**: Raise complaints specifying exact equipment serial numbers or report inverter fault codes.

### 3. 🛠️ Technician & Field Crew Portal
- **Feasibility Survey Form**: Record rooftop azimuth direction, tilt angle, shadow-free area (sq.ft), cable run length, and structural integrity directly on mobile/tablet.
- **Installation Acceptance Handover**: Record tested power generation (kW), earthing resistance (Ohms), and system inspection notes.
- **Interactive Digital Signature Pad**: Capture the customer's on-screen digital signature at final commissioning.
- **Payment Collection**: Field technicians can record collected payments on site with immediate company ledger sync.

### 4. 📊 Admin & Executive Dashboard
- **Feasibility Survey Gate**: Enforces safety policy — quotations remain locked until site survey feasibility is verified and approved.
- **Dynamic Quotation & BOM Generator**: Generates quotes from pre-configured packages (1 kW to 25 kW) and auto-populates exact components.
- **Warehouse Staging & Serial Scanner**: Pre-fixes dispatch items based on package BOM, validates warehouse stock availability, and scans unique serial numbers before truck departure.
- **Direct & UTR Payment Verification**: Admin verifies bank transactions, auto-advances the order status, and generates payment receipts.
- **Technical Staff & Crew Roster**: Manage 3 field crews (Alpha, Beta, Gamma), assign jobs, monitor safety certifications, and track technician ratings.
- **Real-Time Job Profitability & Month-End Reports**: Zero hardcoded data — calculates real-time revenue, stock purchase costs, wages, and permits per job to display true gross margin percentages.

---

## ⚡ Real-World Operational Workflows

1. **Rooftop Inquiry & Feasibility Check (Scene 1)**:
   - A homeowner submits a request. The engineering desk assigns a surveyor from the technical crew directory.
   - The surveyor inspects the roof, records structural integrity, tilt, and azimuth, and approves the feasibility report.

2. **Accurate Bill of Materials & Quotation (Scene 2)**:
   - Quotation generator unlocks only for approved site surveys.
   - Admin selects package template; system auto-computes subsidies (e.g. PM Surya Ghar Muft Bijli Yojana) and net payable amounts.
   - Advance payment (e.g. 35%) unlocks order booking.

3. **Inventory Staging, Stock Check & Serial Scan (Scene 3)**:
   - Required items are pre-loaded from BOM. If warehouse stock is low, the system raises an alert.
   - Every inverter and Tier-1 panel serial number is uniquely scanned and linked to that customer.
   - Truck dispatch triggers the item's warranty clock starting from the dispatch date.

4. **Rooftop Handover & Digital Acceptance (Scene 4)**:
   - Field crew mounts the array, grounds the earthing pit (<2.0 Ohms), tests peak kW generation, and syncs the inverter.
   - Homeowner accepts the installation by signing on the digital canvas right on the technician's tablet.

5. **Rainy Season Breakdowns & Warranty Validation (Scene 5)**:
   - When a customer calls or raises a ticket, entering their phone or inverter serial immediately pulls up their warranty status.
   - If under warranty: Repair or replacement is marked at **₹0 (Free)** under OEM guarantee.
   - If expired: Automated billing is generated for labour and replacement components.

6. **Executive Financials & Month-End Ledger (Scene 6)**:
   - Real-time financial reports show gross margin % for every individual project:
     $$\text{Gross Profit} = \text{Revenue Received} - (\text{Stock Cost} + \text{Crew Wages} + \text{Permits/Logistics})$$
   - Tracks DISCOM inspection status and subsidy disbursement pipelines.

---

## 🗄️ Database Schema & Architecture

SolarOps uses a relational PostgreSQL schema in Supabase with foreign keys, indexes, and Row Level Security:

| Table | Description |
| :--- | :--- |
| `profiles` | User accounts (Customer, Technician, Admin) with role-based access |
| `staff` | Technical crew members, license numbers, blood groups, and skills |
| `packages` | Pre-defined solar system configurations (1 kW – 25 kW) with BOM templates |
| `enquiries` | Solar leads capturing load, roof area, and DISCOM connection type |
| `site_surveys` | Rooftop feasibility reports, shadow analysis, tilt, and azimuth |
| `quotations` | Financial proposals, BOM items, subsidies, and payment milestones |
| `orders` | Confirmed installations, scheduled dates, and live tracking stages |
| `inventory_items`| Warehouse inventory items, categories, and stock quantities |
| `serial_numbers` | Hardware serial numbers uniquely tied to orders and customers |
| `installations` | Job handovers, generation output tests, and digital signatures |
| `warranties` | Component-level certificates with start/end dates and coverage terms |
| `service_tickets`| Troubleshooting tickets, fault codes, assigned technicians, and costs |
| `job_profitability`| Real-time financial ledger calculating margin % and expenses |

The complete SQL migration and table definitions are available in:
- `supabase/schema.sql` (Tables, Constraints, Indexes & RLS Policies)
- `supabase/seed_complete.sql` (Initial relational seeds)

---

## 🧪 Demo Data & Seeder Utility

SolarOps includes an automated node seeder that populates Supabase with over **420+ realistic, interconnected records**:

```bash
# Seed 420+ demo records across all tables into live Supabase
node scripts/feedDemoData.js

# Audit and verify row counts across all tables
node scripts/verifyCounts.js
```

---

## 🚀 Environment Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- A Supabase project (free tier works great)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/solarops.git
cd solarops
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

*(You can copy `.env.example` as a template)*

### 4. Run database migrations
Go to your **Supabase Dashboard → SQL Editor** and execute the contents of:
- `supabase/schema.sql`

### 5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deployment on Vercel

SolarOps is pre-configured for seamless zero-config deployment on Vercel:

1. Push your code to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables under **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_ID.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `YOUR_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 🧰 Tech Stack

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL 15, RLS, Realtime)
- **State Management**: Reactive in-memory state store with dual-sync (Supabase live DB + offline fallback)
- **Styling**: Modern responsive CSS with clean flexbox & grid design system
- **Signing**: HTML5 Canvas digital signature capture for on-site handovers

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
