# ☀️ SolarOps — Digital Solar Management System

**SolarOps** is an enterprise-grade digital operating backbone built for Solar EPC (Engineering, Procurement, and Construction) companies and rooftop solar installers. Built with **React 18 + Vite** and powered by **Supabase PostgreSQL**, SolarOps replaces disconnected spreadsheets, WhatsApp groups, and paper sign-offs with an end-to-end digital workflow — from customer inquiry and rooftop feasibility survey to inventory dispatch, digital sign-off, warranty tracking, and real-time job profitability.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Demo Credentials](#-demo-credentials)
- [Key Portals & Capabilities](#-key-portals--capabilities)
- [Core Business Rules & Enforcements](#-core-business-rules--enforcements)
- [Real-World Operational Workflows (Scenes 1–6)](#-real-world-operational-workflows)
- [Project Directory Structure](#-project-directory-structure)
- [Database Schema & Architecture](#-database-schema--architecture)
- [Demo Data & Seeder Utility](#-demo-data--seeder-utility)
- [Environment Setup & Installation](#-environment-setup--installation)
- [Deployment on Vercel](#-deployment-on-vercel)
- [Tech Stack](#-tech-stack)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

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

## 🔑 Demo Credentials

The platform includes pre-configured database profiles for all three roles. You can sign in immediately using the credentials below:

| Portal | Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Dashboard** | `admin` | `admin@sunpowersolutions.in` | `admin123` | Full enterprise control: approvals, BOM generation, warehouse, financials, reports |
| **Site Technician** | `technician` | `tech@sunpowersolutions.in` | `tech123` | Assigned feasibility surveys, rooftop handovers, digital signature pad, payment logging |
| **Customer Portal** | `customer` | `rajesh.sharma@gmail.com` | `password123` | Residential homeowner: quote review, UTR payment proof, order tracking, warranties |
| **Commercial Client** | `customer` | `sunita.patel@patelfarms.in` | `password123` | Commercial client: 3-phase system, dairy connection, milestone tracking |

> **Note:** The sign-in modal also features single-click role selectors for instant testing.

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
- **Mobile Payment Collection**: Field technicians can record collected payments on site with immediate company ledger sync.

### 4. 📊 Admin & Executive Dashboard
- **Feasibility Survey Gate**: Enforces safety policy — quotations remain locked until site survey feasibility is verified and approved.
- **Dynamic Quotation & BOM Generator**: Generates quotes from pre-configured packages (1 kW to 25 kW) and auto-populates exact components.
- **Warehouse Staging & Serial Scanner**: Pre-fixes dispatch items based on package BOM, validates warehouse stock availability, and scans unique serial numbers before truck departure.
- **Direct & UTR Payment Verification**: Admin verifies bank transactions, auto-advances the order status, and generates payment receipts.
- **Technical Staff & Crew Roster**: Manage 3 field crews (Alpha, Beta, Gamma), assign jobs, monitor safety certifications, and track technician ratings.
- **Real-Time Job Profitability & Month-End Reports**: Zero hardcoded data — calculates real-time revenue, stock purchase costs, wages, and permits per job to display true gross margin percentages.

---

## 🛡️ Core Business Rules & Enforcements

SolarOps embeds strict operational constraints designed to eliminate common field failures:

1. **Mandatory Feasibility Survey Gate**:
   - Under technical safety policy, an engineering quote **cannot** be generated until an authorized surveyor has inspected the roof, confirmed shadow-free space, and officially marked the survey as `approved`.
2. **Pre-Fixed Dispatch Items & Inventory Stock Check**:
   - When an order is placed, required hardware items are pre-loaded automatically based on the package BOM.
   - Admin can manually adjust item quantities prior to dispatch.
   - The system checks warehouse inventory to ensure sufficient stock exists before truck dispatch is confirmed.
3. **Unique Serial Number Binding**:
   - Each scanned component (Tier-1 PV module, dual MPPT inverter) is uniquely linked to one customer and order ID. A serial number cannot be re-assigned or reused across multiple sites.
4. **Automated Dispatch-Triggered Warranty**:
   - The warranty clock for inverters (2–8 years) and panels (20–25 years) begins automatically from the recorded **dispatch date**, giving customers full visibility into their active warranty coverage.
5. **Dual-Access Payment Logging & Completed Order Segregation**:
   - Both Administrators and Field Technicians can log incremental milestone payments (advance, dispatch milestone, final handover).
   - In the Orders view, **Completed** installations are automatically organized into a separate section so pending dispatches and active rooftop tasks remain uncluttered.
6. **Real-Time Accounting Engine**:
   - Financial analytics and month-end reports calculate gross profit and margin percentages strictly from live database records:
     $$\text{Gross Profit} = \text{Revenue Received} - (\text{Stock Cost} + \text{Technician Wages} + \text{Permits \& Logistics})$$

---

## ⚡ Real-World Operational Workflows

1. **Scene 1: The Rooftop Inquiry & Feasibility Check**:
   - A homeowner submits a request. The engineering desk assigns a surveyor from the technical crew directory.
   - The surveyor inspects the roof, records structural integrity, tilt, and azimuth, and approves the feasibility report.

2. **Scene 2: Accurate Bill of Materials & Quotation**:
   - Quotation generator unlocks only for approved site surveys.
   - Admin selects package template; system auto-computes subsidies (e.g. PM Surya Ghar Muft Bijli Yojana) and net payable amounts.
   - Advance payment (e.g. 35%) unlocks order booking.

3. **Scene 3: Inventory Staging, Stock Check & Serial Scan**:
   - Required items are pre-loaded from BOM. If warehouse stock is low, the system raises an alert.
   - Every inverter and Tier-1 panel serial number is uniquely scanned and linked to that customer.
   - Truck dispatch triggers the item's warranty clock starting from the dispatch date.

4. **Scene 4: Rooftop Handover & Digital Acceptance**:
   - Field crew mounts the array, grounds the earthing pit (<2.0 Ohms), tests peak kW generation, and syncs the inverter.
   - Homeowner accepts the installation by signing on the digital canvas right on the technician's tablet.

5. **Scene 5: Rainy Season Breakdowns & Warranty Validation**:
   - When a customer calls or raises a ticket, entering their phone or inverter serial immediately pulls up their warranty status.
   - If under warranty: Repair or replacement is marked at **₹0 (Free)** under OEM guarantee.
   - If expired: Automated billing is generated for labour and replacement components.

6. **Scene 6: Executive Financials & Month-End Ledger**:
   - Real-time financial reports show gross margin % for every individual project.
   - Tracks DISCOM inspection status and subsidy disbursement pipelines.

---

## 📁 Project Directory Structure

```
solarops/
├── dist/                      # Production build output
├── public/                    # Static assets & favicon
├── scripts/                   # Automated seeding & verification utilities
│   ├── feedDemoData.js        # Relational seeder (seeds 420+ demo records)
│   └── verifyCounts.js        # Live Supabase table row count auditor
├── src/
│   ├── admin/
│   │   └── AdminDashboard.jsx # Executive operations: pipeline, quotes, warehouse, finances
│   ├── components/
│   │   ├── LoginModal.jsx     # Role-based authentication modal with 1-click test fill
│   │   ├── QuoteRequestModal.jsx # Public lead feasibility inquiry modal
│   │   ├── SignaturePad.jsx   # HTML5 Canvas for customer rooftop digital sign-offs
│   │   ├── StatusBadge.jsx    # Status badge component across workflow states
│   │   ├── SupabaseStatusBanner.jsx # Realtime Supabase connectivity indicator
│   │   └── TrackByPhoneModal.jsx # Public quick status lookup by mobile number
│   ├── customer/
│   │   └── CustomerPortal.jsx # Customer dashboard: orders, UTR submission, warranties
│   ├── lib/
│   │   ├── initialData.js     # Default baseline packages, staff, and configurations
│   │   ├── store.js           # Reactive unified store with dual-sync (Supabase + fallback)
│   │   └── supabase.js        # Supabase client initializer
│   ├── public/
│   │   └── PublicWebsite.jsx  # Customer-facing marketing site & savings calculator
│   ├── technician/
│   │   └── TechnicianPortal.jsx # Mobile-optimized field technician interface
│   ├── App.jsx                # Root router & role guard controller
│   ├── main.jsx               # React DOM entry point
│   └── styles.css             # Global design system & theme variables
├── supabase/
│   ├── schema.sql             # Full PostgreSQL DDL (tables, FK constraints, RLS)
│   └── seed_complete.sql      # SQL baseline seed file
├── .env.example               # Template for environment variables
├── package.json               # Node.js project metadata & dependencies
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

---

## 🗄️ Database Schema & Architecture

SolarOps uses a relational PostgreSQL schema in Supabase with foreign keys, indexes, and Row Level Security:

| Table | Description | Primary Key | Key Foreign Keys |
| :--- | :--- | :--- | :--- |
| `profiles` | User accounts (Customer, Technician, Admin) | `id` | — |
| `staff` | Technical crew members, license numbers, blood groups | `id` | — |
| `packages` | Pre-defined solar system configurations (1 kW – 25 kW) | `id` | — |
| `enquiries` | Solar leads capturing load, roof area, and connection type | `id` | `customer_id` → `profiles(id)` |
| `site_surveys` | Rooftop feasibility reports, shadow analysis, tilt, azimuth | `id` | `enquiry_id` → `enquiries(id)` |
| `quotations` | Proposals, BOM items, subsidies, and payment milestones | `id` | `enquiry_id`, `customer_id` |
| `orders` | Confirmed installations, scheduled dates, tracking stages | `id` | `quote_id`, `customer_id` |
| `inventory_items`| Warehouse inventory items, categories, stock quantities | `id` | — |
| `serial_numbers` | Hardware serial numbers uniquely tied to orders | `id` | `order_id` → `orders(id)` |
| `installations` | Job handovers, generation output tests, digital signatures | `id` | `order_id` → `orders(id)` |
| `warranties` | Component certificates with start/end dates and terms | `id` | `serial_number` |
| `service_tickets`| Troubleshooting tickets, fault codes, assigned technicians | `id` | `serial_number` |
| `job_profitability`| Real-time financial ledger calculating margin % and expenses | `id` | `order_id` → `orders(id)` |

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

### Table Breakdown from Live Database:
- `profiles`: 57 customer & staff accounts
- `enquiries`: 58 realistic rooftop leads
- `site_surveys`: 46 feasibility reports
- `quotations`: 39 engineering proposals
- `orders`: 33 live & archived project orders
- `serial_numbers`: 45 uniquely bound hardware serials
- `installations`: 26 rooftop handover records with digital sign-offs
- `warranties`: 28 active component certificates
- `service_tickets`: 20 breakdown & maintenance tickets
- `job_profitability`: 30 job margin ledgers
- `inventory_items`: 20 warehouse SKUs
- `staff`: 24 technical crew profiles

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

## ❓ Troubleshooting & FAQ

### Q: Why does the app work even if Supabase credentials are not configured?
**A:** SolarOps includes an automated offline fallback data store with localStorage persistence. If Supabase is unreachable or credentials are not yet supplied, the system seamlessly initializes local demo state so you can test all workflows without interruptions.

### Q: How do I seed fresh demo data to my own Supabase project?
**A:** Ensure your `.env` contains valid credentials, run the schema migration in `supabase/schema.sql`, and execute:
```bash
node scripts/feedDemoData.js
```

### Q: How are WhatsApp & SMS alerts triggered?
**A:** When an order milestone or payment receipt is generated, SolarOps creates pre-formatted WhatsApp and SMS deep-links with customer names, order IDs, payment amounts, and tracking URLs ready for one-click transmission.

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
