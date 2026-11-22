// Initial seed data reflecting SunPower Solutions operations
// Real registered users, Residential + Commercial packages, 15 technicians crew

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'cust-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    password: 'password123',
    phone: '+91 98140 12345',
    address: 'Plot 42, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    connectionCategory: 'Residential',
    connectionType: 'Residential 1-Phase 230V',
    discomAccount: 'PSPCL-JL-884920',
    role: 'customer',
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 'cust-2',
    name: 'Sunita Patel',
    email: 'sunita.patel@patelfarms.in',
    password: 'password123',
    phone: '+91 98250 98765',
    address: 'Green Valley Dairy, GT Road, Ludhiana, Punjab',
    city: 'Ludhiana',
    connectionCategory: 'Commercial',
    connectionType: 'Commercial 3-Phase 415V (Dairy & Chilling)',
    discomAccount: 'PSPCL-LD-110294',
    role: 'customer',
    createdAt: '2026-11-05T12:00:00Z'
  },
  {
    id: 'cust-3',
    name: 'Vikram Malhotra',
    email: 'vikram.m@malhotratextiles.com',
    password: 'password123',
    phone: '+91 98722 34567',
    address: 'Industrial Focal Point, Phase 4, Phagwara',
    city: 'Phagwara',
    connectionCategory: 'Industrial',
    connectionType: 'Industrial HT 11kV/33kV',
    discomAccount: 'PSPCL-PG-762910',
    role: 'customer',
    createdAt: '2026-11-08T09:00:00Z'
  },
  {
    id: 'admin-1',
    name: 'SunPower Operations Director',
    email: 'admin@sunpowersolutions.in',
    password: 'admin123',
    phone: '+91 1800 000 000',
    address: 'HQ Jalandhar Regional Centre, Punjab',
    city: 'Jalandhar',
    connectionCategory: 'Corporate',
    connectionType: 'Commercial 3-Phase 415V',
    discomAccount: 'PSPCL-HQ-001',
    role: 'admin',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'tech-1',
    name: 'Amit Singh',
    email: 'tech@sunpowersolutions.in',
    password: 'tech123',
    phone: '+91 98141 11223',
    address: 'Crew Alpha Base, Civil Lines, Jalandhar',
    city: 'Jalandhar',
    connectionCategory: 'Field Crew',
    connectionType: 'Lead Site Engineer',
    discomAccount: 'TECH-EMP-101',
    role: 'technician',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'tech-2',
    name: 'Rohan Sharma',
    email: 'rohan@sunpowersolutions.in',
    password: 'tech123',
    phone: '+91 98142 44556',
    address: 'Crew Beta Base, Focal Point, Ludhiana',
    city: 'Ludhiana',
    connectionCategory: 'Field Crew',
    connectionType: 'Site Feasibility Surveyor',
    discomAccount: 'TECH-EMP-102',
    role: 'technician',
    createdAt: '2026-10-18T08:00:00Z'
  }
]

export const INITIAL_PACKAGES = [
  {
    id: 'pkg-1kw-ongrid',
    name: '1 kW Rooftop On-Grid System',
    capacityKw: 1.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential',
    basePrice: 65000,
    subsidyAmount: 30000,
    description: 'Ideal for 1-2 BHK homes. Generates ~4-5 units/day, saving up to ₹1,200/month.',
    bom: [
      { item: 'Mono PERC Solar Panels 540W (Tier-1)', qty: 2, unit: 'Nos', warranty: 20 },
      { item: '1 kW On-Grid String Inverter', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Hot-Dip Galvanized Metal Mounting Stands', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'ACDB & DCDB Protection Wiring Boxes with MCB/SPD', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Copper Earthing Rods & Chemical Compound', qty: 2, unit: 'Sets', warranty: 5 },
      { item: '4 sq.mm UV Protected Solar DC Cables', qty: 30, unit: 'Meters', warranty: 10 },
      { item: 'Installation, Testing & Grid Commissioning', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  {
    id: 'pkg-2kw-ongrid',
    name: '2 kW Rooftop On-Grid System',
    capacityKw: 2.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential',
    basePrice: 125000,
    subsidyAmount: 60000,
    description: 'Perfect for 2-3 BHK homes. Generates ~8-10 units/day, cutting bills by ₹2,500/month.',
    bom: [
      { item: 'Mono PERC Solar Panels 540W (Tier-1)', qty: 4, unit: 'Nos', warranty: 20 },
      { item: '2 kW Smart On-Grid Inverter with Wi-Fi Logger', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Pre-galvanized High Wind-load Metal Stands', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'Dual ACDB/DCDB Surge & Disconnect Boxes', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Dedicated Safety Earthing (Equipment + Lightning)', qty: 3, unit: 'Sets', warranty: 5 },
      { item: '4 sq.mm UV Solar DC + 4 sq.mm AC Armored Cable', qty: 50, unit: 'Meters', warranty: 10 },
      { item: 'Installation, Testing & DISCOM Net Metering Work', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  {
    id: 'pkg-3kw-ongrid',
    name: '3 kW Rooftop On-Grid System (Most Popular)',
    capacityKw: 3.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential',
    basePrice: 185000,
    subsidyAmount: 78000,
    description: 'Homeowner favorite under national subsidy. Generates 12-14 units/day with max subsidy.',
    bom: [
      { item: 'Mono PERC Solar Panels 540W (Tier-1 Bi-facial)', qty: 6, unit: 'Nos', warranty: 20 },
      { item: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Elevated High-Strength Metal Rooftop Stands', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'IP65 ACDB & DCDB Distribution Box with Type-2 SPD', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Pure Copper Bonded Earthing Electrodes', qty: 3, unit: 'Sets', warranty: 5 },
      { item: '6 sq.mm Heavy-duty Solar DC Wires & Conduits', qty: 70, unit: 'Meters', warranty: 10 },
      { item: 'Crew Turnkey Fitting, Testing & Grid Sync', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  {
    id: 'pkg-5kw-ongrid',
    name: '5 kW Commercial & Villa On-Grid System',
    capacityKw: 5.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential / Light Commercial',
    basePrice: 295000,
    subsidyAmount: 78000,
    description: 'For large residences and small factories. Powers ACs, refrigeration, and daytime machinery.',
    bom: [
      { item: 'Mono PERC Solar Panels 550W (Tier-1)', qty: 10, unit: 'Nos', warranty: 20 },
      { item: '5 kW Three-Phase / Single-Phase Inverter', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Heavy Industrial Metal Elevated Structure', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'AC & DC Protection Distribution Panels', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Chemical Earthing Pit & Lightning Arrestor (ESE)', qty: 4, unit: 'Sets', warranty: 5 },
      { item: 'Heavy Gauged Wires, MC4 Connectors & Metal Conduits', qty: 110, unit: 'Meters', warranty: 10 },
      { item: 'Full Crew Installation, Load Testing & Inspection', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  {
    id: 'pkg-3kw-offgrid',
    name: '3 kW Off-Grid System (With Battery Backup)',
    capacityKw: 3.0,
    systemType: 'off_grid',
    connectionCategory: 'Residential',
    basePrice: 265000,
    subsidyAmount: 0,
    description: 'Complete independence with battery storage. Powers lights, fans, fridge during blackouts.',
    bom: [
      { item: 'Mono PERC Solar Panels 540W (Tier-1)', qty: 6, unit: 'Nos', warranty: 20 },
      { item: '3.5 kVA Pure Sine Wave Off-Grid Hybrid Inverter', qty: 1, unit: 'Unit', warranty: 2 },
      { item: '48V 100Ah Lithium Ferro Phosphate (LiFePO4) Battery', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Integrated MPPT Battery Charge Controller', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Sturdy Non-penetrating Metal Stands', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'Battery Interconnect Heavy Cables & Fuse Protection', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Chemical Safety Earthing Kit', qty: 3, unit: 'Sets', warranty: 5 },
      { item: 'Full Service Site Assembly & Commissioning', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  {
    id: 'pkg-5kw-offgrid',
    name: '5 kW Off-Grid Powerhouse (Heavy Battery Bank)',
    capacityKw: 5.0,
    systemType: 'off_grid',
    connectionCategory: 'Commercial & Dairy',
    basePrice: 420000,
    subsidyAmount: 0,
    description: 'Built for rural factories, clinics, and farmhouses with severe or zero grid availability.',
    bom: [
      { item: 'Mono PERC Solar Panels 550W (Tier-1)', qty: 10, unit: 'Nos', warranty: 20 },
      { item: '5 kVA Heavy-duty Off-Grid Inverter with MPPT', qty: 1, unit: 'Unit', warranty: 2 },
      { item: '48V 200Ah High-Cycle Solar Storage Battery', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Automated Battery Charge Controller & BMS', qty: 1, unit: 'Unit', warranty: 2 },
      { item: 'Industrial Hot-Dip Galvanized Elevated Stands', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'Heavy DC Busbars, Breakers & Enclosure', qty: 1, unit: 'Set', warranty: 2 },
      { item: 'Earthing & Lightning Surge Protection', qty: 4, unit: 'Sets', warranty: 5 },
      { item: 'Certified Technician Deployment & Load Run-test', qty: 1, unit: 'Service', warranty: 1 }
    ]
  },
  // NEW COMMERCIAL & INDUSTRIAL CONNECTIONS
  {
    id: 'pkg-10kw-commercial',
    name: '10 kW Commercial Three-Phase Grid-Tied System',
    capacityKw: 10.0,
    systemType: 'on_grid',
    connectionCategory: 'Commercial',
    basePrice: 560000,
    subsidyAmount: 0,
    description: 'Designed for Commercial 3-Phase connections (offices, schools, cold storage, dairies). Eligible for 40% accelerated depreciation tax savings.',
    bom: [
      { item: 'Mono PERC Solar Panels 550W (Tier-1 Bi-facial)', qty: 18, unit: 'Nos', warranty: 20 },
      { item: '10 kW Three-Phase 415V Smart Grid-Tie Inverter', qty: 1, unit: 'Unit', warranty: 5 },
      { item: 'Heavy Aluminum Elevated Rooftop Superstructure', qty: 1, unit: 'Set', warranty: 10 },
      { item: 'IP66 Industrial LT Distribution Board with SPD & Breakers', qty: 1, unit: 'Set', warranty: 3 },
      { item: 'Four-Chamber Chemical Earthing System (Equipment + Neutral + Lightning)', qty: 4, unit: 'Sets', warranty: 5 },
      { item: '10 sq.mm UV-Resistant DC Solar & 16 sq.mm AC Armored Cables', qty: 180, unit: 'Meters', warranty: 10 },
      { item: 'Turnkey HT/LT Liaison, Net-Metering Approval & Testing', qty: 1, unit: 'Service', warranty: 2 }
    ]
  },
  {
    id: 'pkg-25kw-industrial',
    name: '25 kW Industrial High-Demand Solar Plant',
    capacityKw: 25.0,
    systemType: 'on_grid',
    connectionCategory: 'Industrial',
    basePrice: 1350000,
    subsidyAmount: 0,
    description: 'Engineered for factories, spinning mills, cold chains, and high-load industrial connections. Includes zero-export device & real-time telemetry.',
    bom: [
      { item: 'Mono PERC Solar Panels 550W (Tier-1)', qty: 45, unit: 'Nos', warranty: 20 },
      { item: '25 kW Heavy Industrial Grid Inverter with Triple MPPT', qty: 1, unit: 'Unit', warranty: 5 },
      { item: 'Hot-Dip Galvanized Metal Truss Mountings (160 km/h wind rated)', qty: 1, unit: 'Set', warranty: 10 },
      { item: 'Heavy C&I Protection Cubicle with Shunt Trips & Type-1+2 SPD', qty: 1, unit: 'Set', warranty: 3 },
      { item: 'Early Streamer Emission (ESE) Lightning Arrestor & 6 Earthing Pits', qty: 1, unit: 'Set', warranty: 5 },
      { item: 'Industrial Armored DC/AC Cabling Network & Cable Trays', qty: 320, unit: 'Meters', warranty: 10 },
      { item: 'Electrical Inspectorate (CEIG) Clearance & Power Flow Sync', qty: 1, unit: 'Service', warranty: 2 }
    ]
  }
]

export const INITIAL_TECHNICIANS = [
  // 16 Technicians across 3 specialized crews with complete IDP (Identity Pass), Showcase & Handling
  {
    id: 'tech-1',
    name: 'Amit Singh',
    role: 'Lead Solar PV Engineer',
    crew: 'Crew Alpha',
    phone: '+91 98141 11223',
    email: 'tech@sunpowersolutions.in',
    employeeId: 'TECH-SOL-101',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    licenseNo: 'MNRE-NABL-PV-2024-8841',
    bloodGroup: 'B+',
    emergencyContact: '+91 98140 99881 (Sunita Singh - Spouse)',
    joiningDate: '2023-03-15',
    safetyClearance: 'Class-A: HT / Working at Heights (IS 3521)',
    skills: ['Inverter Specialist', 'Grid Sync', 'Dual-MPPT Calibration', 'Earthing Pit Testing'],
    stats: {
      totalKwInstalled: 64.5,
      surveysCompleted: 38,
      customerRating: 4.95,
      safetyScore: '100% Zero-Incident',
      activeJobsCount: 2
    },
    certifications: [
      'National Institute of Solar Energy (NISE) Suryamitra Certified',
      'Central Electricity Authority (CEA) Grade-A Supervisor License',
      'Industrial Working at Heights & Fall-Arrest Compliance (IS 3521)',
      'Fronius & GoodWe Multi-String Inverter Commissioning Specialist'
    ],
    showcaseGallery: [
      {
        id: 'proj-1',
        title: '3 kW Residential Rooftop with Net-Metering',
        capacity: '3.0 kW',
        customer: 'Rajesh Sharma',
        location: 'Model Town, Jalandhar',
        date: '2026-11-14',
        rating: 5.0,
        review: 'Exceptional installation by Amit and Crew Alpha. Inverter sync and net-metering done without any hassle.',
        photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
        highlights: 'Bi-facial panels mounted at 22° south tilt. Inverter tested at 3.12 kW peak output.'
      },
      {
        id: 'proj-2',
        title: '5 kW Commercial Hybrid Dairy Plant',
        capacity: '5.0 kW',
        customer: 'Sunita Patel',
        location: 'Green Valley Dairy, Ludhiana',
        date: '2026-11-18',
        rating: 4.9,
        review: 'Heavy duty off-grid system with lithium battery storage. Powers milk chillers seamlessly.',
        photo: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80',
        highlights: '48V 200Ah Lithium Bank + 60A MPPT controller integrated with auto-generator backup.'
      },
      {
        id: 'proj-3',
        title: '10 kW 3-Phase Industrial Superstructure',
        capacity: '10.0 kW',
        customer: 'Phagwara Textile Unit',
        location: 'Industrial Focal Point, Phagwara',
        date: '2026-10-29',
        rating: 5.0,
        review: 'Superb execution on high-wind industrial shed. Zero leakage and neat cable tray conduits.',
        photo: 'https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80',
        highlights: 'Hot-dip galvanized elevated structure with 4-chamber earthing (<1.5 Ohms).'
      }
    ],
    workHandling: {
      currentStatus: 'On Roof - System Testing & Earthing Sync',
      currentCustomer: 'Rajesh Sharma (ORD-SUN-2026-088)',
      address: 'Plot 42, Model Town, Jalandhar',
      activeStage: 'Inverter Synchronization & Net Metering',
      dailyRoute: [
        { time: '08:30 AM', task: 'Crew Alpha Morning Safety Briefing & Tool Kit Inspection', status: 'completed' },
        { time: '10:00 AM', task: 'Site Feasibility Verification - Plot 42, Model Town', status: 'completed' },
        { time: '01:30 PM', task: 'Mounting Structure & Module Array Laying (3 kW)', status: 'completed' },
        { time: '03:45 PM', task: 'Inverter Synchronization & Net-Meter Testing', status: 'in_progress' },
        { time: '05:00 PM', task: 'Customer Handover, App Setup & Digital Signature', status: 'pending' }
      ],
      checklist: {
        ppeSafety: true,
        bomUnboxing: true,
        structureAnchoring: true,
        dcArrayStringing: true,
        earthingResistance: true,
        netMeterSync: false,
        customerSignoff: false
      }
    }
  },
  {
    id: 'tech-2',
    name: 'Rohan Sharma',
    role: 'Site Feasibility Surveyor',
    crew: 'Crew Beta',
    phone: '+91 98142 44556',
    email: 'rohan@sunpowersolutions.in',
    employeeId: 'TECH-SOL-102',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    licenseNo: 'MNRE-SURV-2024-5512',
    bloodGroup: 'O+',
    emergencyContact: '+91 98142 88776 (Parent)',
    joiningDate: '2023-06-01',
    safetyClearance: 'Class-A: Solar Irradiance & Structural Load',
    skills: ['Shadow Analysis', 'Roof Load Assessment', 'Drone LiDAR Survey', 'Single Line Diagrams'],
    stats: {
      totalKwInstalled: 48.0,
      surveysCompleted: 56,
      customerRating: 4.9,
      safetyScore: '100% Zero-Incident',
      activeJobsCount: 1
    },
    certifications: [
      'Solar Pathfinder Shadow Analysis Certified',
      'Civil Structure Roof Load Bearing Inspector (IS 875 Part 3)',
      'MNRE Site Feasibility Assessor'
    ],
    showcaseGallery: [
      {
        id: 'proj-201',
        title: '5 kW Commercial Dairy Feasibility & 3D Shadow Map',
        capacity: '5.0 kW',
        customer: 'Sunita Patel',
        location: 'Ludhiana, Punjab',
        date: '2026-11-06',
        rating: 5.0,
        review: 'Rohan did an extraordinarily thorough drone survey and accurate shadow profile.',
        photo: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80',
        highlights: 'Identified 850 sq.ft shadow-free roof with 24° optimum tilt.'
      }
    ],
    workHandling: {
      currentStatus: 'Field Survey En Route',
      currentCustomer: 'Jasleen Kaur (ENQ-105)',
      address: 'Industrial Estate, Ludhiana',
      activeStage: 'On-Site 3D Roof Scan',
      dailyRoute: [
        { time: '09:00 AM', task: 'Equipment Calibration (Inclinometer, Solar Meter)', status: 'completed' },
        { time: '11:00 AM', task: 'Commercial Feasibility Inspection - Jasleen Kaur', status: 'in_progress' },
        { time: '03:00 PM', task: 'Admin Feasibility Report Filing & BOM Sizing', status: 'pending' }
      ],
      checklist: {
        ppeSafety: true,
        bomUnboxing: true,
        structureAnchoring: false,
        dcArrayStringing: false,
        earthingResistance: false,
        netMeterSync: false,
        customerSignoff: false
      }
    }
  },
  {
    id: 'tech-3',
    name: 'Manoj Patel',
    role: 'Commercial Rooftop & Battery Lead',
    crew: 'Crew Beta',
    phone: '+91 98765 43215',
    email: 'manoj.patel@sunpowersolutions.in',
    employeeId: 'TECH-SOL-103',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    licenseNo: 'MNRE-BAT-2024-3310',
    bloodGroup: 'A+',
    emergencyContact: '+91 98765 11223 (Family)',
    joiningDate: '2022-11-10',
    safetyClearance: 'Class-A: Industrial 3-Phase & High Voltage LiFePO4',
    skills: ['Battery Energy Storage (BESS)', '3-Phase Grid-Tied', 'High Wind Anchoring'],
    stats: {
      totalKwInstalled: 112.0,
      surveysCompleted: 42,
      customerRating: 4.88,
      safetyScore: '100% Zero-Incident',
      activeJobsCount: 1
    },
    certifications: [
      'Tesla & BYD Certified Battery Storage Technician',
      'MNRE Senior Installer Certification'
    ],
    showcaseGallery: [
      {
        id: 'proj-301',
        title: '15 kW Cold Storage Hybrid Storage Array',
        capacity: '15.0 kW',
        customer: 'Verma Cold Storage',
        location: 'Kapurthala, Punjab',
        date: '2026-10-12',
        rating: 5.0,
        review: 'Flawless execution by Manoj Patel. Battery switchover in <15ms.',
        photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
        highlights: '48V 400Ah LiFePO4 battery rack synchronized with 15kVA inverter.'
      }
    ],
    workHandling: {
      currentStatus: 'Staging & Pre-Commissioning',
      currentCustomer: 'Sunita Patel (ORD-SUN-2026-089)',
      address: 'Green Valley Dairy, Ludhiana',
      activeStage: 'Battery Bank Integration',
      dailyRoute: [
        { time: '09:00 AM', task: 'Lithium Battery BMS Firmware Check', status: 'completed' },
        { time: '01:00 PM', task: 'Heavy Duty DC Busbar Connection', status: 'in_progress' },
        { time: '04:30 PM', task: 'Full Load Isolation Test', status: 'pending' }
      ],
      checklist: {
        ppeSafety: true,
        bomUnboxing: true,
        structureAnchoring: true,
        dcArrayStringing: true,
        earthingResistance: false,
        netMeterSync: false,
        customerSignoff: false
      }
    }
  },
  {
    id: 'tech-4',
    name: 'Pooja Rawat',
    role: 'Industrial HT Lead & Quality Assurance',
    crew: 'Crew Gamma',
    phone: '+91 98765 43220',
    email: 'pooja.rawat@sunpowersolutions.in',
    employeeId: 'TECH-SOL-104',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    licenseNo: 'MNRE-QA-2023-9901',
    bloodGroup: 'AB+',
    emergencyContact: '+91 98765 88990 (Family)',
    joiningDate: '2022-08-20',
    safetyClearance: 'Class-A: 11kV/33kV HT & Electrical Inspectorate CEIG',
    skills: ['Heavy Industrial HT', 'CEIG Clearances', 'Zero Export Control', 'SCADA Telemetry'],
    stats: {
      totalKwInstalled: 185.0,
      surveysCompleted: 62,
      customerRating: 4.97,
      safetyScore: '100% Zero-Incident',
      activeJobsCount: 1
    },
    certifications: [
      'CEIG Certified Electrical Inspector Liaison',
      'Industrial SCADA & Solar Telemetry Specialist',
      'TUV Rheinland PV Quality Auditor'
    ],
    showcaseGallery: [
      {
        id: 'proj-401',
        title: '25 kW Industrial Plant with CEIG Compliance',
        capacity: '25.0 kW',
        customer: 'Malhotra Spinning Mills',
        location: 'Phagwara Industrial Zone',
        date: '2026-11-02',
        rating: 5.0,
        review: 'Pooja led the installation with textbook perfection. Handled CEIG approval smoothly.',
        photo: 'https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80',
        highlights: 'Triple MPPT industrial inverter with ESE lightning rod and zero export limiter.'
      }
    ],
    workHandling: {
      currentStatus: 'Quality Inspection & Load Sync',
      currentCustomer: 'Vikram Malhotra (Industrial)',
      address: 'Industrial Focal Point, Phase 4, Phagwara',
      activeStage: 'Grid Harmonics & CEIG Audit',
      dailyRoute: [
        { time: '09:30 AM', task: 'Substation Transformer Relay Calibration', status: 'completed' },
        { time: '01:30 PM', task: 'Harmonics and THD Metering at 415V LT', status: 'in_progress' },
        { time: '04:00 PM', task: 'Final Handover Certificate Generation', status: 'pending' }
      ],
      checklist: {
        ppeSafety: true,
        bomUnboxing: true,
        structureAnchoring: true,
        dcArrayStringing: true,
        earthingResistance: true,
        netMeterSync: true,
        customerSignoff: false
      }
    }
  },
  {
    id: 'tech-5',
    name: 'Rakesh Kumar',
    role: 'Senior Rooftop Structure Lead',
    crew: 'Crew Alpha',
    phone: '+91 98765 43211',
    email: 'rakesh.kumar@sunpowersolutions.in',
    employeeId: 'TECH-SOL-105',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    licenseNo: 'MNRE-MEC-2024-4412',
    bloodGroup: 'B+',
    emergencyContact: '+91 98765 22334',
    joiningDate: '2023-01-10',
    safetyClearance: 'Class-A: High Wind Rooftop Superstructures',
    skills: ['Rooftop Mounting', 'Chemical Anchoring', '160km/h Wind Load Design'],
    stats: { totalKwInstalled: 52.0, surveysCompleted: 22, customerRating: 4.85, safetyScore: '100%', activeJobsCount: 1 },
    certifications: ['Hilti Chemical Anchoring Certified', 'Metal Fabrication Expert'],
    showcaseGallery: [],
    workHandling: {
      currentStatus: 'On Roof - Mounting Rails Alignment',
      currentCustomer: 'Rajesh Sharma',
      address: 'Model Town, Jalandhar',
      activeStage: 'Structural Fastening',
      dailyRoute: [{ time: '09:00 AM', task: 'Base Plate Anchoring', status: 'completed' }, { time: '02:00 PM', task: 'Rail Torque Verification', status: 'in_progress' }],
      checklist: { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: false, earthingResistance: false, netMeterSync: false, customerSignoff: false }
    }
  },
  {
    id: 'tech-6',
    name: 'Vijay Verma',
    role: 'Senior Protection & Earthing Specialist',
    crew: 'Crew Alpha',
    phone: '+91 98765 43212',
    email: 'vijay.verma@sunpowersolutions.in',
    employeeId: 'TECH-SOL-106',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    licenseNo: 'MNRE-ELC-2024-6621',
    bloodGroup: 'A+',
    emergencyContact: '+91 98765 77665',
    joiningDate: '2023-05-18',
    safetyClearance: 'Class-A: Chemical Earthing & Surge Protection',
    skills: ['ACDB/DCDB', 'Type-2 SPD', 'Chemical Earth Pits', 'Earth Resistance Tester'],
    stats: { totalKwInstalled: 44.0, surveysCompleted: 29, customerRating: 4.9, safetyScore: '100%', activeJobsCount: 1 },
    certifications: ['CEA Certified Earthing Specialist', 'Surge Protection Devices (SPD) Certified'],
    showcaseGallery: [],
    workHandling: {
      currentStatus: 'Earthing Pit Resistance Testing',
      currentCustomer: 'Rajesh Sharma',
      address: 'Model Town, Jalandhar',
      activeStage: 'Earth Resistance Test (<2 Ohms)',
      dailyRoute: [{ time: '10:00 AM', task: 'Earthing Chamber Chemical Fill', status: 'completed' }, { time: '03:00 PM', task: 'Digital Earth Megger Test', status: 'in_progress' }],
      checklist: { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: true, earthingResistance: true, netMeterSync: false, customerSignoff: false }
    }
  },
  {
    id: 'tech-7',
    name: 'Sunil Yadav',
    role: 'Senior Electrical Wiring Tech',
    crew: 'Crew Beta',
    phone: '+91 98765 43216',
    email: 'sunil.yadav@sunpowersolutions.in',
    employeeId: 'TECH-SOL-107',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    licenseNo: 'MNRE-ELC-2024-1189',
    bloodGroup: 'O-',
    emergencyContact: '+91 98765 33445',
    joiningDate: '2023-04-12',
    safetyClearance: 'Class-A: DC String Cabling & MC4 Connectors',
    skills: ['Off-Grid Systems', 'BMS Wiring', 'Solar DC UV Conduits'],
    stats: { totalKwInstalled: 40.0, surveysCompleted: 15, customerRating: 4.86, safetyScore: '100%', activeJobsCount: 1 },
    certifications: ['Staubli MC4 Connector Certification'],
    showcaseGallery: [],
    workHandling: {
      currentStatus: 'DC String Termination',
      currentCustomer: 'Sunita Patel',
      address: 'Ludhiana, Punjab',
      activeStage: 'DC Cable Dressing',
      dailyRoute: [{ time: '09:00 AM', task: 'DC Conduit Clamping', status: 'completed' }, { time: '01:30 PM', task: 'MC4 Crimping & Polarity Test', status: 'in_progress' }],
      checklist: { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: true, earthingResistance: false, netMeterSync: false, customerSignoff: false }
    }
  },
  {
    id: 'tech-8',
    name: 'Neeraj Joshi',
    role: 'Grid Commissioning Engineer',
    crew: 'Crew Gamma',
    phone: '+91 98765 43221',
    email: 'neeraj.joshi@sunpowersolutions.in',
    employeeId: 'TECH-SOL-108',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    licenseNo: 'MNRE-COMM-2024-9988',
    bloodGroup: 'B+',
    emergencyContact: '+91 98765 66778',
    joiningDate: '2023-02-14',
    safetyClearance: 'Class-A: DISCOM Net-Metering Synchronization',
    skills: ['Testing', 'Net Metering Protocol', 'Bidirectional Meters'],
    stats: { totalKwInstalled: 78.0, surveysCompleted: 45, customerRating: 4.92, safetyScore: '100%', activeJobsCount: 1 },
    certifications: ['DISCOM Net-meter Liaison Approved', 'Power Quality Analyser'],
    showcaseGallery: [],
    workHandling: {
      currentStatus: 'Bi-directional Meter Testing',
      currentCustomer: 'Vikram Malhotra',
      address: 'Phagwara',
      activeStage: 'Grid Synchronization Check',
      dailyRoute: [{ time: '11:00 AM', task: 'DISCOM Net-Meter Line Inspection', status: 'completed' }, { time: '02:30 PM', task: 'Anti-Islanding Protection Test', status: 'in_progress' }],
      checklist: { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: true, earthingResistance: true, netMeterSync: true, customerSignoff: false }
    }
  }
]

export const INITIAL_ENQUIRIES = [
  {
    id: 'enq-101',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    phone: '+91 98140 12345',
    email: 'rajesh.sharma@gmail.com',
    address: 'Plot 42, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    connectionCategory: 'Residential',
    connectionType: 'Residential 1-Phase 230V',
    sanctionedLoadKw: 5.0,
    roofType: 'Reinforced Concrete (RCC Flat Roof)',
    monthlyElectricityBill: 4500,
    roofAreaSqft: 450,
    systemPreference: '3 kW On-Grid',
    subsidyInterested: true,
    discomAccount: 'PSPCL-JL-884920',
    assignedTechName: 'Amit Singh (Crew Lead)',
    assignedCrew: 'Crew Alpha',
    surveyDate: '2026-11-08',
    timeSlot: 'Morning (09:00 AM - 01:00 PM)',
    status: 'survey_completed',
    notes: 'Homeowner wants maximum central subsidy under PM Surya Ghar. No tree shadows observed.',
    createdAt: '2026-11-05T09:30:00Z'
  },
  {
    id: 'enq-102',
    customerId: 'cust-2',
    customerName: 'Sunita Patel',
    phone: '+91 98250 98765',
    email: 'sunita.patel@patelfarms.in',
    address: 'Green Valley Dairy, GT Road, Ludhiana, Punjab',
    city: 'Ludhiana',
    connectionCategory: 'Commercial',
    connectionType: 'Commercial 3-Phase 415V (Dairy & Chilling)',
    sanctionedLoadKw: 15.0,
    roofType: 'Industrial Metal Tin Shed',
    monthlyElectricityBill: 8800,
    roofAreaSqft: 750,
    systemPreference: '5 kW Off-Grid',
    subsidyInterested: false,
    discomAccount: 'PSPCL-LD-110294',
    assignedTechName: 'Manoj Patel (Crew Lead)',
    assignedCrew: 'Crew Beta',
    surveyDate: '2026-11-10',
    timeSlot: 'Morning (09:00 AM - 01:00 PM)',
    status: 'converted',
    notes: 'Frequent power cuts at dairy shed. Needs battery storage for chilling units.',
    createdAt: '2026-11-08T11:15:00Z'
  },
  {
    id: 'enq-103',
    customerId: 'cust-3',
    customerName: 'Vikram Malhotra',
    phone: '+91 98722 34567',
    email: 'vikram.m@malhotratextiles.com',
    address: 'Industrial Focal Point, Phase 4, Phagwara',
    city: 'Phagwara',
    connectionCategory: 'Industrial',
    connectionType: 'Industrial HT 11kV/33kV',
    sanctionedLoadKw: 40.0,
    roofType: 'Industrial Metal Tin Shed',
    monthlyElectricityBill: 42000,
    roofAreaSqft: 2800,
    systemPreference: '25 kW Industrial',
    subsidyInterested: false,
    discomAccount: 'PSPCL-PG-762910',
    status: 'new',
    notes: 'Factory seeking commercial tariff reduction and accelerated tax depreciation.',
    createdAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'enq-104',
    customerId: 'cust-4',
    customerName: 'Harpreet Singh Sandhu',
    phone: '+91 98145 77889',
    email: 'harpreet.sandhu@gmail.com',
    address: 'Street 9, Urban Estate Phase II, Jalandhar',
    city: 'Jalandhar',
    connectionCategory: 'Residential',
    connectionType: 'Residential 1-Phase 230V',
    sanctionedLoadKw: 6.0,
    roofType: 'Reinforced Concrete (RCC Flat Roof)',
    monthlyElectricityBill: 5200,
    roofAreaSqft: 500,
    systemPreference: '3 kW On-Grid',
    subsidyInterested: true,
    discomAccount: 'PSPCL-JL-449102',
    assignedTechName: 'Amit Singh (Crew Lead)',
    assignedCrew: 'Crew Alpha',
    surveyDate: '2026-11-23',
    timeSlot: 'Morning (09:00 AM - 01:00 PM)',
    status: 'survey_scheduled',
    notes: 'New double-story house. Direct unobstructed South exposure.',
    createdAt: '2026-11-19T11:00:00Z'
  },
  {
    id: 'enq-105',
    customerId: 'cust-5',
    customerName: 'Jasleen Kaur Chawla',
    phone: '+91 98761 22334',
    email: 'jasleen.k@chawlaclinic.in',
    address: 'Civil Hospital Road, Ludhiana',
    city: 'Ludhiana',
    connectionCategory: 'Commercial',
    connectionType: 'Commercial 3-Phase 415V',
    sanctionedLoadKw: 12.0,
    roofType: 'Reinforced Concrete (RCC Flat Roof)',
    monthlyElectricityBill: 12500,
    roofAreaSqft: 900,
    systemPreference: '10 kW Commercial',
    subsidyInterested: false,
    discomAccount: 'PSPCL-LD-993821',
    assignedTechName: 'Rohan Sharma (Site Surveyor)',
    assignedCrew: 'Crew Beta',
    surveyDate: '2026-11-23',
    timeSlot: 'Afternoon (02:00 PM - 06:00 PM)',
    status: 'survey_scheduled',
    notes: 'Daytime dental clinic with constant air-conditioning and compressor loads.',
    createdAt: '2026-11-20T14:30:00Z'
  }
]

export const INITIAL_SURVEYS = [
  {
    id: 'srv-1',
    enquiryId: 'enq-101',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    technicianName: 'Amit Singh (Lead Tech)',
    surveyDate: '2026-11-08',
    shadowFreeRoofSqft: 420,
    monthlyBill: 4500,
    gridConnectionType: 'Residential 1-Phase 230V',
    roofDirection: 'South (True South 185°)',
    roofTiltDegrees: 22,
    cableRunDistanceMeters: 18,
    structuralIntegrity: 'Solid Reinforced Concrete (RCC) - Excellent',
    status: 'approved',
    surveyorNotes: 'Optimal solar irradiation. Direct conduit path to meter room. Approved for 3 kW On-Grid.',
    createdAt: '2026-11-08T16:00:00Z'
  },
  {
    id: 'srv-2',
    enquiryId: 'enq-102',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    technicianName: 'Manoj Patel (Lead Tech)',
    surveyDate: '2026-11-10',
    shadowFreeRoofSqft: 720,
    monthlyBill: 8800,
    gridConnectionType: 'Commercial 3-Phase 415V',
    roofDirection: 'South-West (210°)',
    roofTiltDegrees: 25,
    cableRunDistanceMeters: 32,
    structuralIntegrity: 'Heavy Steel Trusses on Dairy Shed - Good',
    status: 'approved',
    surveyorNotes: 'Shed roof ideal for elevated clamps. Battery bank to be housed in ventilated dry room.',
    createdAt: '2026-11-10T17:30:00Z'
  }
]

export const INITIAL_QUOTATIONS = [
  {
    id: 'quo-1001',
    quoteNumber: 'SP-QT-2026-101',
    enquiryId: 'enq-101',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    packageId: 'pkg-3kw-ongrid',
    capacityKw: 3.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential',
    subtotalAmount: 185000,
    subsidyDiscount: 78000,
    netPayableAmount: 107000,
    advanceRequired: 40000,
    advancePaid: 40000,
    status: 'advance_paid',
    validUntil: '2026-12-10',
    items: [
      { item: 'Mono PERC Solar Panels 540W (Tier-1 Bi-facial)', qty: 6, unit: 'Nos', warranty: '20 Years' },
      { item: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', qty: 1, unit: 'Unit', warranty: '2 Years' },
      { item: 'Elevated High-Strength Metal Rooftop Stands', qty: 1, unit: 'Set', warranty: '5 Years' },
      { item: 'IP65 ACDB & DCDB Distribution Box with SPD', qty: 1, unit: 'Set', warranty: '2 Years' },
      { item: 'Pure Copper Bonded Earthing Electrodes', qty: 3, unit: 'Sets', warranty: '5 Years' },
      { item: '6 sq.mm Heavy-duty Solar DC Wires & Conduits', qty: 70, unit: 'Meters', warranty: '10 Years' },
      { item: 'Crew Turnkey Fitting, Testing & Grid Sync', qty: 1, unit: 'Service', warranty: '1 Year' }
    ],
    createdAt: '2026-11-09T10:00:00Z'
  },
  {
    id: 'quo-1002',
    quoteNumber: 'SP-QT-2026-102',
    enquiryId: 'enq-102',
    customerId: 'cust-2',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    packageId: 'pkg-5kw-offgrid',
    capacityKw: 5.0,
    systemType: 'off_grid',
    connectionCategory: 'Commercial',
    subtotalAmount: 420000,
    subsidyDiscount: 0,
    netPayableAmount: 420000,
    advanceRequired: 150000,
    advancePaid: 150000,
    status: 'accepted',
    validUntil: '2026-12-15',
    items: [
      { item: 'Mono PERC Solar Panels 550W (Tier-1)', qty: 10, unit: 'Nos', warranty: '20 Years' },
      { item: '5 kVA Heavy-duty Off-Grid Inverter with MPPT', qty: 1, unit: 'Unit', warranty: '2 Years' },
      { item: '48V 200Ah High-Cycle Solar Storage Battery', qty: 1, unit: 'Unit', warranty: '2 Years' },
      { item: 'Automated Battery Charge Controller & BMS', qty: 1, unit: 'Unit', warranty: '2 Years' },
      { item: 'Industrial Hot-Dip Galvanized Elevated Stands', qty: 1, unit: 'Set', warranty: '5 Years' },
      { item: 'Heavy DC Busbars, Breakers & Enclosure', qty: 1, unit: 'Set', warranty: '2 Years' },
      { item: 'Earthing & Lightning Surge Protection', qty: 4, unit: 'Sets', warranty: '5 Years' }
    ],
    createdAt: '2026-11-11T12:00:00Z'
  }
]

export const INITIAL_ORDERS = [
  {
    id: 'ord-201',
    orderNumber: 'ORD-SUN-2026-088',
    quoteId: 'quo-1001',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    phone: '+91 98140 12345',
    address: 'Plot 42, Model Town, Jalandhar, Punjab',
    capacityKw: 3.0,
    systemType: 'on_grid',
    connectionCategory: 'Residential',
    totalAmount: 107000,
    advancePaid: 40000,
    balanceDue: 67000,
    dispatchStatus: 'delivered',
    dispatchDate: '2026-11-14',
    dispatchItems: [
      { id: 'di-201-1', sku: 'PNL-540W', name: 'Mono PERC Solar Panel 540W Tier-1', category: 'panel', qty: 6, unit: 'Nos', warrantyYears: 20, requiresSerial: true },
      { id: 'di-201-2', sku: 'INV-3KW-GT', name: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', category: 'inverter', qty: 1, unit: 'Unit', warrantyYears: 2, requiresSerial: true },
      { id: 'di-201-3', sku: 'STR-HDG-3KW', name: 'Hot-Dip Galvanized Rooftop Stand 3 kW Kit', category: 'structure', qty: 1, unit: 'Set', warrantyYears: 5, requiresSerial: false },
      { id: 'di-201-4', sku: 'CBL-DC-6MM', name: '6 sq.mm UV Solar DC Cable Drum (100m)', category: 'wires', qty: 1, unit: 'Drum', warrantyYears: 10, requiresSerial: false },
      { id: 'di-201-5', sku: 'EARTH-COP-KIT', name: 'Copper Earthing Rod & Compound Set', category: 'safety', qty: 3, unit: 'Sets', warrantyYears: 5, requiresSerial: false }
    ],
    installationStatus: 'completed',
    assignedCrew: 'Crew Alpha (Lead: Amit Singh)',
    scheduledDate: '2026-11-14',
    trackingStage: 'Installation Completed & Handed Over',
    paymentHistory: [
      {
        id: 'pay-201-1',
        amount: 40000,
        paymentMode: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: 'NEFT-PSPCL-881920',
        milestone: 'Booking Advance (35%)',
        notes: 'Initial 3 kW system booking advance verified in bank account.',
        updatedBy: 'Staff Accounts Desk',
        timestamp: '2026-11-10T14:30:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      }
    ],
    trackingHistory: [
      {
        stage: 'Installation Completed & Handed Over',
        notes: 'Rooftop installation tested. Generation output: 3.18 kW. Homeowner signed handover certificate.',
        updatedBy: 'Amit Singh (Lead Tech)',
        timestamp: '2026-11-14T17:00:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      },
      {
        stage: 'Dispatched on Truck',
        notes: 'Truck departed warehouse. All 5 equipment items dispatched with verified stock.',
        updatedBy: 'Warehouse Dispatch Manager',
        timestamp: '2026-11-14T08:30:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      },
      {
        stage: 'Payment Confirmed & Order Booked',
        notes: 'Booking payment received. Order released to warehouse for kit packing.',
        updatedBy: 'Staff Accounts Desk',
        timestamp: '2026-11-10T14:30:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      }
    ],
    createdAt: '2026-11-10T14:00:00Z'
  },
  {
    id: 'ord-202',
    orderNumber: 'ORD-SUN-2026-089',
    quoteId: 'quo-1002',
    customerId: 'cust-2',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    phone: '+91 98250 98765',
    address: 'Green Valley Dairy, GT Road, Ludhiana, Punjab',
    capacityKw: 5.0,
    systemType: 'off_grid',
    connectionCategory: 'Commercial',
    totalAmount: 420000,
    advancePaid: 150000,
    balanceDue: 270000,
    dispatchStatus: 'packed',
    dispatchDate: null,
    dispatchItems: [
      { id: 'di-202-1', sku: 'PNL-540W', name: 'Mono PERC Solar Panel 540W Tier-1', category: 'panel', qty: 10, unit: 'Nos', warrantyYears: 20, requiresSerial: true },
      { id: 'di-202-2', sku: 'INV-5KW-OG', name: '5 kVA Heavy-duty Off-Grid Inverter with MPPT', category: 'inverter', qty: 1, unit: 'Unit', warrantyYears: 2, requiresSerial: true },
      { id: 'di-202-3', sku: 'BAT-48V-200', name: '48V 200Ah High-Cycle Lithium Storage Battery', category: 'battery', qty: 1, unit: 'Unit', warrantyYears: 2, requiresSerial: true },
      { id: 'di-202-4', sku: 'CTR-MPPT-60', name: '60A Intelligent MPPT Solar Charge Controller', category: 'charge_controller', qty: 1, unit: 'Unit', warrantyYears: 2, requiresSerial: true },
      { id: 'di-202-5', sku: 'STR-HDG-3KW', name: 'Hot-Dip Galvanized Rooftop Stand 3 kW Kit', category: 'structure', qty: 2, unit: 'Sets', warrantyYears: 5, requiresSerial: false },
      { id: 'di-202-6', sku: 'EARTH-COP-KIT', name: 'Copper Earthing Rod & Compound Set', category: 'safety', qty: 4, unit: 'Sets', warrantyYears: 5, requiresSerial: false }
    ],
    installationStatus: 'scheduled',
    assignedCrew: 'Crew Beta (Lead: Manoj Patel)',
    scheduledDate: '2026-11-23',
    trackingStage: 'Kit BOM Packed at Warehouse',
    paymentHistory: [
      {
        id: 'pay-202-1',
        amount: 150000,
        paymentMode: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: 'RTGS-HDFC-990142',
        milestone: 'Booking Advance (35%)',
        notes: 'Commercial Dairy 5 kW Off-Grid System advance payment verified in company account.',
        updatedBy: 'Staff Accounts Desk',
        timestamp: '2026-11-12T16:45:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      }
    ],
    trackingHistory: [
      {
        stage: 'Kit BOM Packed at Warehouse',
        notes: '5 kW off-grid kit components staged in dispatch bay. Awaiting barcode scanning.',
        updatedBy: 'Warehouse Manager',
        timestamp: '2026-11-13T10:00:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      },
      {
        stage: 'Payment Confirmed & Order Booked',
        notes: 'Advance of ₹1,50,000 confirmed. Commercial schedule locked for Nov 23.',
        updatedBy: 'Staff Accounts Desk',
        timestamp: '2026-11-12T16:45:00Z',
        notificationSent: true,
        notificationChannel: 'WhatsApp + SMS + Email'
      }
    ],
    createdAt: '2026-11-12T16:00:00Z'
  }
]

export const INITIAL_INVENTORY = [
  { id: 'inv-1', sku: 'PNL-540W', name: 'Mono PERC Solar Panel 540W Tier-1', category: 'panel', stockQty: 140, unitCost: 11500, sellingPrice: 15500, requiresSerial: true },
  { id: 'inv-2', sku: 'INV-3KW-GT', name: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter', category: 'inverter', stockQty: 18, unitCost: 28000, sellingPrice: 38000, requiresSerial: true },
  { id: 'inv-3', sku: 'INV-5KW-OG', name: '5 kVA Heavy-duty Off-Grid Inverter with MPPT', category: 'inverter', stockQty: 9, unitCost: 46000, sellingPrice: 62000, requiresSerial: true },
  { id: 'inv-3b', sku: 'INV-10KW-3P', name: '10 kW Three-Phase 415V Smart Grid-Tie Inverter', category: 'inverter', stockQty: 6, unitCost: 65000, sellingPrice: 85000, requiresSerial: true },
  { id: 'inv-4', sku: 'BAT-48V-100', name: '48V 100Ah LiFePO4 Solar Battery', category: 'battery', stockQty: 12, unitCost: 55000, sellingPrice: 72000, requiresSerial: true },
  { id: 'inv-5', sku: 'BAT-48V-200', name: '48V 200Ah High-Cycle Lithium Storage Battery', category: 'battery', stockQty: 6, unitCost: 98000, sellingPrice: 130000, requiresSerial: true },
  { id: 'inv-6', sku: 'CTR-MPPT-60', name: '60A Intelligent MPPT Solar Charge Controller', category: 'charge_controller', stockQty: 15, unitCost: 8500, sellingPrice: 13000, requiresSerial: true },
  { id: 'inv-7', sku: 'STR-HDG-3KW', name: 'Hot-Dip Galvanized Rooftop Stand 3 kW Kit', category: 'structure', stockQty: 25, unitCost: 9000, sellingPrice: 14000, requiresSerial: false },
  { id: 'inv-8', sku: 'CBL-DC-6MM', name: '6 sq.mm UV Solar DC Cable Drum (100m)', category: 'wires', stockQty: 34, unitCost: 3800, sellingPrice: 5500, requiresSerial: false },
  { id: 'inv-9', sku: 'EARTH-COP-KIT', name: 'Copper Earthing Rod & Compound Set', category: 'safety', stockQty: 40, unitCost: 1800, sellingPrice: 3200, requiresSerial: false }
]

export const INITIAL_SERIALS = [
  {
    id: 'sn-1',
    serialNumber: 'INV-SUN-3K-88910',
    itemName: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter',
    category: 'inverter',
    orderId: 'ord-201',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    status: 'installed',
    warrantyYears: 2,
    warrantyStartDate: '2026-11-14',
    warrantyEndDate: '2028-11-14'
  },
  {
    id: 'sn-2',
    serialNumber: 'INV-SUN-5K-99014',
    itemName: '5 kVA Heavy-duty Off-Grid Inverter with MPPT',
    category: 'inverter',
    orderId: 'ord-202',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    status: 'scanned_for_dispatch',
    warrantyYears: 2,
    warrantyStartDate: '2026-11-21',
    warrantyEndDate: '2028-11-21'
  },
  {
    id: 'sn-3',
    serialNumber: 'BAT-LFP-48V-44120',
    itemName: '48V 200Ah High-Cycle Lithium Storage Battery',
    category: 'battery',
    orderId: 'ord-202',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    status: 'scanned_for_dispatch',
    warrantyYears: 2,
    warrantyStartDate: '2026-11-21',
    warrantyEndDate: '2028-11-21'
  },
  {
    id: 'sn-4',
    serialNumber: 'CTR-MPPT-60A-1109',
    itemName: '60A Intelligent MPPT Solar Charge Controller',
    category: 'charge_controller',
    orderId: 'ord-202',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    status: 'scanned_for_dispatch',
    warrantyYears: 2,
    warrantyStartDate: '2026-11-21',
    warrantyEndDate: '2028-11-21'
  },
  {
    id: 'sn-5',
    serialNumber: 'INV-SUN-2K-71022',
    itemName: '2 kW Grid-Tie Inverter (2024 Series)',
    category: 'inverter',
    orderId: null,
    customerName: 'Kapurthala Textile Mills',
    customerEmail: 'vikram.m@malhotratextiles.com',
    status: 'installed',
    warrantyYears: 2,
    warrantyStartDate: '2024-05-10',
    warrantyEndDate: '2026-05-10' // Expired
  }
]

export const INITIAL_INSTALLATIONS = [
  {
    id: 'inst-1',
    orderId: 'ord-201',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    customerPhone: '+91 98140 12345',
    address: 'Plot 42, Model Town, Jalandhar, Punjab',
    crewName: 'Crew Alpha (Lead: Amit Singh)',
    technicianCount: 4,
    scheduledDate: '2026-11-14',
    startTime: '08:30 AM',
    finishTime: '04:15 PM',
    systemSizeKw: 3.0,
    powerGenerationTestedKw: 3.12,
    customerSigned: true,
    customerSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M 10 40 Q 60 10, 110 35 T 190 25" fill="none" stroke="%230e5a8a" stroke-width="3"/></svg>',
    customerSignerName: 'Rajesh Sharma',
    handoverNotes: 'Earthing pit resistance tested < 2.0 Ohms. Inverter synced with PSPCL net-meter line. Customer trained on phone mobile app monitoring.',
    photos: [
      { url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80', label: 'Completed 3 kW Rooftop Array (6 Bi-facial Panels)' },
      { url: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80', label: 'Inverter & ACDB/DCDB Surge Enclosure Mounted' },
      { url: 'https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80', label: 'Safety Earthing Chamber & Lightning Spike' }
    ],
    status: 'signed_off',
    completedAt: '2026-11-14T16:30:00Z'
  },
  {
    id: 'inst-2',
    orderId: 'ord-202',
    customerName: 'Sunita Patel',
    customerEmail: 'sunita.patel@patelfarms.in',
    customerPhone: '+91 98250 98765',
    address: 'Green Valley Dairy, GT Road, Ludhiana, Punjab',
    crewName: 'Crew Beta (Lead: Manoj Patel)',
    technicianCount: 5,
    scheduledDate: '2026-11-23',
    startTime: '09:00 AM',
    finishTime: null,
    systemSizeKw: 5.0,
    powerGenerationTestedKw: null,
    customerSigned: false,
    customerSignature: null,
    customerSignerName: '',
    handoverNotes: 'Warehouse staging complete. Truck loaded with ₹1,50,000 worth inverters and batteries. Installation scheduled.',
    photos: [],
    status: 'scheduled',
    completedAt: null
  }
]

export const INITIAL_WARRANTIES = [
  {
    id: 'war-1',
    serialNumber: 'INV-SUN-3K-88910',
    equipmentName: '3.3 kW Dual-MPPT Solar Grid-Tie Inverter',
    equipmentType: 'Inverter',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    customerPhone: '+91 98140 12345',
    startDate: '2026-11-14',
    endDate: '2028-11-14',
    warrantyYears: 2,
    isActive: true,
    coverage: '100% Free replacement of PCB / Inverter unit & on-site labour.'
  },
  {
    id: 'war-2',
    serialNumber: 'PNL-540-LOT-8891',
    equipmentName: 'Mono PERC Solar Panels (6x 540W)',
    equipmentType: 'Solar Panels',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    customerPhone: '+91 98140 12345',
    startDate: '2026-11-14',
    endDate: '2046-11-14',
    warrantyYears: 20,
    isActive: true,
    coverage: '20-Year linear power generation output performance guarantee.'
  },
  {
    id: 'war-3',
    serialNumber: 'INV-SUN-2K-71022',
    equipmentName: '2 kW Grid-Tie Inverter (2024 Series)',
    equipmentType: 'Inverter',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram.m@malhotratextiles.com',
    customerPhone: '+91 98722 34567',
    startDate: '2024-05-10',
    endDate: '2026-05-10',
    warrantyYears: 2,
    isActive: false, // Expired
    coverage: 'Expired (Requires chargeable parts & standard labour billing).'
  }
]

export const INITIAL_SERVICE_TICKETS = [
  {
    id: 'tkt-301',
    ticketNumber: 'TCK-2026-042',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@gmail.com',
    phone: '+91 98140 12345',
    serialNumber: 'INV-SUN-3K-88910',
    equipmentType: 'Inverter',
    faultCode: 'E04 - Heavy Rain Grid Isolation Warning',
    description: 'Heavy rain in Jalandhar yesterday. Inverter LCD showing error E04 and zero power generation.',
    isUnderWarranty: true,
    estimatedCost: 0,
    technicianAssigned: 'Amit Singh (Lead Tech)',
    status: 'in_repair',
    resolutionNotes: 'Technician dispatched to inspect cable gland sealing and moisture resistance. 100% covered under warranty (₹0 charged).',
    createdAt: '2026-11-19T08:20:00Z'
  },
  {
    id: 'tkt-302',
    ticketNumber: 'TCK-2026-039',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram.m@malhotratextiles.com',
    phone: '+91 98722 34567',
    serialNumber: 'INV-SUN-2K-71022',
    equipmentType: 'Inverter',
    faultCode: 'F12 - Fan & IGBT Breakdown',
    description: 'Zero power generation after lightning storm. Inverter fan not spinning.',
    isUnderWarranty: false,
    estimatedCost: 7400,
    technicianAssigned: 'Vijay Verma',
    status: 'assigned',
    resolutionNotes: 'Inverter 2-year warranty expired in May 2026. Automated estimate generated: Cooling fan ₹1,800 + IGBT module ₹4,400 + Labour ₹1,200.',
    createdAt: '2026-11-18T14:10:00Z'
  }
]

export const INITIAL_PROFITABILITY = [
  {
    id: 'prf-1',
    orderNumber: 'ORD-SUN-2026-088',
    customerName: 'Rajesh Sharma (3 kW On-Grid)',
    capacityKw: 3.0,
    connectionCategory: 'Residential',
    revenueReceived: 107000,
    subsidyAmount: 78000,
    stockPurchaseCost: 62000,
    technicianWages: 14000,
    permitsAndLogistics: 5500,
    grossProfit: 25500,
    profitMarginPct: 23.83,
    subsidyStatus: 'discom_inspection_passed',
    monthYear: 'November 2026'
  },
  {
    id: 'prf-2',
    orderNumber: 'ORD-SUN-2026-081',
    customerName: 'Sharma Residence, Jalandhar (5 kW)',
    capacityKw: 5.0,
    connectionCategory: 'Residential',
    revenueReceived: 217000,
    subsidyAmount: 78000,
    stockPurchaseCost: 132000,
    technicianWages: 21000,
    permitsAndLogistics: 9000,
    grossProfit: 55000,
    profitMarginPct: 25.34,
    subsidyStatus: 'disbursed',
    monthYear: 'November 2026'
  },
  {
    id: 'prf-3',
    orderNumber: 'ORD-SUN-2026-079',
    customerName: 'Phagwara Textile Unit (10 kW Commercial)',
    capacityKw: 10.0,
    connectionCategory: 'Commercial',
    revenueReceived: 560000,
    subsidyAmount: 0,
    stockPurchaseCost: 380000,
    technicianWages: 48000,
    permitsAndLogistics: 22000,
    grossProfit: 110000,
    profitMarginPct: 19.64,
    subsidyStatus: 'not_applicable',
    monthYear: 'November 2026'
  },
  {
    id: 'prf-4',
    orderNumber: 'ORD-SUN-2026-074',
    customerName: 'Urban High-Rise Rooftop (2 kW Difficult Access)',
    capacityKw: 2.0,
    connectionCategory: 'Residential',
    revenueReceived: 85000,
    subsidyAmount: 60000,
    stockPurchaseCost: 59000,
    technicianWages: 22000,
    permitsAndLogistics: 11000,
    grossProfit: -7000,
    profitMarginPct: -8.23,
    subsidyStatus: 'approved',
    monthYear: 'November 2026'
  }
]
