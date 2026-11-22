import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import {
  INITIAL_REGISTERED_USERS,
  INITIAL_PACKAGES,
  INITIAL_TECHNICIANS,
  INITIAL_ENQUIRIES,
  INITIAL_SURVEYS,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_SERIALS,
  INITIAL_INSTALLATIONS,
  INITIAL_WARRANTIES,
  INITIAL_SERVICE_TICKETS,
  INITIAL_PROFITABILITY
} from './initialData'

const STORAGE_KEY = 'SOLAR_FLOW_STATE_V3'

export function generateWhatsAppReceiptLink(phone, customerName, orderNumber, receiptNumber, amount, milestone, balanceDue) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '')
  const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone || '919876543210')
  const message = `☀️ *SolarOps / SunPower Payment Confirmation*\n\nDear ${customerName || 'Customer'},\nYour payment of *₹${Number(amount || 0).toLocaleString()}* has been successfully received & verified on-site/in accounts.\n\n📋 *Receipt Number:* ${receiptNumber || 'RCPT-SUN-OFFICIAL'}\n📦 *Order Number:* #${orderNumber || 'ORD-2026'}\n🎯 *Milestone:* ${milestone || 'Project Payment'}\n💰 *Updated Balance Due:* ₹${Number(balanceDue || 0).toLocaleString()}\n\nTrack your live rooftop project progress in your SolarOps Customer Portal.\nThank you for choosing SolarOps!`
  return `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(message)}`
}

export function generateWhatsAppTrackingLink(phone, customerName, orderNumber, stage, notes) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '')
  const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone || '919876543210')
  const message = `⚡ *SolarOps Live Project Update*\n\nDear ${customerName || 'Customer'},\nYour solar project *#${orderNumber || 'ORD-2026'}* has progressed to a new stage:\n\n📍 *Current Stage:* ${stage}\n📝 *Field Notes:* ${notes || 'Updated by technical operations crew.'}\n\nTrack live rooftop milestones and inspection sign-offs in your SolarOps Customer Portal.\nSunPower Solutions / SolarOps`
  return `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(message)}`
}

export function buildDefaultDispatchItems(source, inventory = []) {
  if (!source) return []

  // If items already defined in quote or bom
  const sourceItems = source.items || source.bom || []
  if (sourceItems.length > 0) {
    return sourceItems.map((it, idx) => {
      const itemName = it.item || it.name || ''
      const lower = itemName.toLowerCase()
      let sku = 'GEN-ACC'
      let category = 'accessory'
      let requiresSerial = false
      let warrantyYears = 2

      if (lower.includes('panel') || lower.includes('mono perc')) {
        sku = 'PNL-540W'
        category = 'panel'
        requiresSerial = true
        warrantyYears = 20
      } else if (lower.includes('off-grid') && lower.includes('5 kva')) {
        sku = 'INV-5KW-OG'
        category = 'inverter'
        requiresSerial = true
        warrantyYears = 2
      } else if (lower.includes('10 kw') || lower.includes('three-phase')) {
        sku = 'INV-10KW-3P'
        category = 'inverter'
        requiresSerial = true
        warrantyYears = 2
      } else if (lower.includes('inverter') || lower.includes('grid-tie')) {
        sku = 'INV-3KW-GT'
        category = 'inverter'
        requiresSerial = true
        warrantyYears = 2
      } else if (lower.includes('battery') || lower.includes('lifepo4') || lower.includes('storage')) {
        sku = lower.includes('200ah') ? 'BAT-48V-200' : 'BAT-48V-100'
        category = 'battery'
        requiresSerial = true
        warrantyYears = 2
      } else if (lower.includes('controller') || lower.includes('mppt') || lower.includes('bms')) {
        sku = 'CTR-MPPT-60'
        category = 'charge_controller'
        requiresSerial = true
        warrantyYears = 2
      } else if (lower.includes('stand') || lower.includes('structure') || lower.includes('mounting')) {
        sku = 'STR-HDG-3KW'
        category = 'structure'
        warrantyYears = 5
      } else if (lower.includes('cable') || lower.includes('wire')) {
        sku = 'CBL-DC-6MM'
        category = 'wires'
        warrantyYears = 10
      } else if (lower.includes('earth') || lower.includes('surge') || lower.includes('electrode')) {
        sku = 'EARTH-COP-KIT'
        category = 'safety'
        warrantyYears = 5
      }

      return {
        id: `disp-${Date.now()}-${idx}`,
        sku,
        name: itemName,
        category,
        qty: it.qty || 1,
        unit: it.unit || 'Nos',
        warrantyYears,
        requiresSerial
      }
    })
  }

  // Fallback if no source items, based on capacity and systemType:
  const cap = Number(source.capacityKw) || 3
  const isOffGrid = source.systemType === 'off_grid'
  const panelCount = Math.round((cap * 1000) / 540) || 6

  const items = [
    {
      id: `disp-${Date.now()}-1`,
      sku: 'PNL-540W',
      name: `Mono PERC Solar Panel 540W Tier-1 (${panelCount}x)`,
      category: 'panel',
      qty: panelCount,
      unit: 'Nos',
      warrantyYears: 20,
      requiresSerial: true
    },
    {
      id: `disp-${Date.now()}-2`,
      sku: isOffGrid ? 'INV-5KW-OG' : (cap > 5 ? 'INV-10KW-3P' : 'INV-3KW-GT'),
      name: isOffGrid ? '5 kVA Heavy-duty Off-Grid Inverter with MPPT' : (cap > 5 ? '10 kW Three-Phase Smart Grid-Tie Inverter' : '3.3 kW Dual-MPPT Solar Grid-Tie Inverter'),
      category: 'inverter',
      qty: 1,
      unit: 'Unit',
      warrantyYears: 2,
      requiresSerial: true
    }
  ]

  if (isOffGrid) {
    items.push({
      id: `disp-${Date.now()}-3`,
      sku: 'BAT-48V-200',
      name: '48V 200Ah High-Cycle Lithium Storage Battery',
      category: 'battery',
      qty: 1,
      unit: 'Unit',
      warrantyYears: 2,
      requiresSerial: true
    })
    items.push({
      id: `disp-${Date.now()}-4`,
      sku: 'CTR-MPPT-60',
      name: '60A Intelligent MPPT Solar Charge Controller',
      category: 'charge_controller',
      qty: 1,
      unit: 'Unit',
      warrantyYears: 2,
      requiresSerial: true
    })
  }

  items.push(
    {
      id: `disp-${Date.now()}-5`,
      sku: 'STR-HDG-3KW',
      name: 'Hot-Dip Galvanized Rooftop Stand Mounting Kit',
      category: 'structure',
      qty: Math.max(1, Math.round(cap / 3)),
      unit: 'Set',
      warrantyYears: 5,
      requiresSerial: false
    },
    {
      id: `disp-${Date.now()}-6`,
      sku: 'CBL-DC-6MM',
      name: '6 sq.mm UV Solar DC Cable Drum (100m)',
      category: 'wires',
      qty: 1,
      unit: 'Drum',
      warrantyYears: 10,
      requiresSerial: false
    },
    {
      id: `disp-${Date.now()}-7`,
      sku: 'EARTH-COP-KIT',
      name: 'Copper Earthing Rod & Compound Set',
      category: 'safety',
      qty: isOffGrid ? 4 : 3,
      unit: 'Sets',
      warrantyYears: 5,
      requiresSerial: false
    }
  )

  return items
}

export function computeLiveFinancials(orders = [], inventory = [], quotations = [], technicians = [], tickets = []) {
  const liveJobs = orders.map((order) => {
    const quote = quotations.find((q) => q.id === order.quoteId)
    const cap = Number(order.capacityKw) || 3
    const totalAmount = Number(order.totalAmount) || 0
    const advancePaid = Number(order.advancePaid) || 0
    const balanceDue = Number(order.balanceDue) || 0

    // Compute actual stock purchase cost from order's dispatchItems or BOM matched to warehouse inventory
    const dispatchItems = order.dispatchItems || []
    let stockCost = 0

    if (dispatchItems.length > 0) {
      stockCost = dispatchItems.reduce((acc, item) => {
        const inv = inventory.find(
          (i) => (item.sku && i.sku === item.sku) || i.name.toLowerCase() === (item.name || '').toLowerCase()
        )
        const unitCost = inv ? inv.unitCost : (item.category === 'panel' ? 11500 : (item.category === 'inverter' ? 28000 : 3500))
        return acc + unitCost * (Number(item.qty) || 1)
      }, 0)
    } else {
      stockCost = Math.round(totalAmount * 0.58)
    }

    // Technician wages: allocated based on system size (₹4,500/kW)
    const technicianWages = Math.round(cap * 4500)
    // Permits, PSPCL net-metering & logistics
    const permitsAndLogistics = order.systemType === 'on_grid' ? 6500 : 4000

    const totalJobCost = stockCost + technicianWages + permitsAndLogistics
    const revenueReceived = advancePaid
    const grossProfit = revenueReceived - totalJobCost
    const contractGrossProfit = totalAmount - totalJobCost
    const profitMarginPct = totalAmount > 0 ? Math.round((contractGrossProfit / totalAmount) * 100) : 0

    const subsidyAmount = quote ? (quote.subsidyDiscount || 0) : 0
    const subsidyStatus = order.installationStatus === 'completed'
      ? 'discom_inspection_passed'
      : (order.dispatchStatus === 'delivered' ? 'application_submitted' : 'documentation_pending')

    return {
      id: `live-prf-${order.id}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.customerName} (${cap} kW ${order.systemType.replace('_', ' ')})`,
      customerRawName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      capacityKw: cap,
      systemType: order.systemType,
      connectionCategory: order.connectionCategory || 'Residential',
      totalAmount,
      revenueReceived,
      balanceDue,
      subsidyAmount,
      stockPurchaseCost: stockCost,
      technicianWages,
      permitsAndLogistics,
      totalJobCost,
      grossProfit,
      contractGrossProfit,
      profitMarginPct,
      subsidyStatus,
      installationStatus: order.installationStatus,
      dispatchStatus: order.dispatchStatus,
      assignedCrew: order.assignedCrew,
      scheduledDate: order.scheduledDate,
      paymentHistory: order.paymentHistory || []
    }
  })

  const totalContractRevenue = liveJobs.reduce((acc, j) => acc + j.totalAmount, 0)
  const totalCollectedRevenue = liveJobs.reduce((acc, j) => acc + j.revenueReceived, 0)
  const totalOutstandingBalance = liveJobs.reduce((acc, j) => acc + j.balanceDue, 0)
  const totalHardwareCost = liveJobs.reduce((acc, j) => acc + j.stockPurchaseCost, 0)
  const totalTechWages = liveJobs.reduce((acc, j) => acc + j.technicianWages, 0)
  const totalPermitsCost = liveJobs.reduce((acc, j) => acc + j.permitsAndLogistics, 0)
  const totalExpenses = totalHardwareCost + totalTechWages + totalPermitsCost
  const netGrossProfit = totalCollectedRevenue - totalExpenses
  const contractNetProfit = totalContractRevenue - totalExpenses
  const overallMarginPct = totalContractRevenue > 0
    ? Math.round((contractNetProfit / totalContractRevenue) * 100)
    : 0
  const collectionRatePct = totalContractRevenue > 0
    ? Math.round((totalCollectedRevenue / totalContractRevenue) * 100)
    : 0

  // Flatten and sort all recorded payment transactions
  const allTransactions = orders.flatMap((o) =>
    (o.paymentHistory || []).map((p) => ({
      ...p,
      orderId: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.phone,
      customerEmail: o.customerEmail,
      orderTotal: o.totalAmount,
      currentBalance: o.balanceDue
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return {
    liveJobs,
    totalContractRevenue,
    totalCollectedRevenue,
    totalOutstandingBalance,
    totalHardwareCost,
    totalTechWages,
    totalPermitsCost,
    totalExpenses,
    netGrossProfit,
    contractNetProfit,
    overallMarginPct,
    collectionRatePct,
    allTransactions
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Ensure orders have dispatchItems, paymentHistory, and trackingHistory
      if (parsed.orders) {
        parsed.orders = parsed.orders.map((o) => {
          if (!o.dispatchItems || o.dispatchItems.length === 0) {
            o.dispatchItems = buildDefaultDispatchItems(o, parsed.inventory || INITIAL_INVENTORY)
          }
          if (!o.paymentHistory || o.paymentHistory.length === 0) {
            o.paymentHistory = o.advancePaid > 0 ? [
              {
                id: `pay-${o.id}-init`,
                receiptNumber: `RCPT-SUN-2026-${o.id.replace(/\D/g, '') || '101'}`,
                amount: o.advancePaid,
                paymentMode: 'Bank Transfer (NEFT/RTGS)',
                milestone: 'Booking Advance (35%)',
                referenceNo: `PSPCL-VERIFIED-${o.id}`,
                notes: 'Booking advance verified in company accounts.',
                updatedBy: 'Staff Accounts Desk',
                timestamp: o.createdAt || new Date().toISOString(),
                notificationSent: true,
                notificationChannel: 'WhatsApp + SMS + Email',
                notificationRecipient: o.customerEmail ? `${o.phone} / ${o.customerEmail}` : o.phone
              }
            ] : []
          }
          if (!o.trackingHistory || o.trackingHistory.length === 0) {
            o.trackingHistory = [
              {
                stage: o.trackingStage || 'Payment Confirmed & Order Booked',
                notes: `Advance payment verified. System booking confirmed for ${o.capacityKw} kW.`,
                updatedBy: 'Operations Desk',
                timestamp: o.createdAt || new Date().toISOString(),
                notificationSent: true,
                notificationChannel: 'WhatsApp + SMS + Email'
              }
            ]
          }
          return o
        })
      }
      // Hydrate technicians with rich IDP, Showcase, and Work Handling data
      if (parsed.technicians) {
        parsed.technicians = parsed.technicians.map((t) => {
          const match = INITIAL_TECHNICIANS.find(
            (it) => it.id === t.id || it.name.toLowerCase() === t.name?.toLowerCase()
          )
          if (match) {
            return {
              ...match,
              ...t,
              employeeId: t.employeeId || match.employeeId,
              avatar: t.avatar || match.avatar,
              licenseNo: t.licenseNo || match.licenseNo,
              bloodGroup: t.bloodGroup || match.bloodGroup,
              emergencyContact: t.emergencyContact || match.emergencyContact,
              joiningDate: t.joiningDate || match.joiningDate,
              safetyClearance: t.safetyClearance || match.safetyClearance,
              certifications: (t.certifications && t.certifications.length > 0) ? t.certifications : match.certifications,
              stats: { ...match.stats, ...(t.stats || {}) },
              showcaseGallery: (t.showcaseGallery && t.showcaseGallery.length > 0) ? t.showcaseGallery : match.showcaseGallery,
              workHandling: {
                ...match.workHandling,
                ...(t.workHandling || {}),
                checklist: { ...match.workHandling?.checklist, ...(t.workHandling?.checklist || {}) },
                dailyRoute: (t.workHandling?.dailyRoute && t.workHandling.dailyRoute.length > 0) ? t.workHandling.dailyRoute : match.workHandling?.dailyRoute
              }
            }
          }
          return t
        })
      }
      return parsed
    }
  } catch (err) {
    console.warn('Could not parse localStorage, resetting to initial state', err)
  }
  return null
}

const defaultState = {
  currentUser: null,
  registeredUsers: INITIAL_REGISTERED_USERS,
  packages: INITIAL_PACKAGES,
  technicians: INITIAL_TECHNICIANS,
  enquiries: INITIAL_ENQUIRIES,
  surveys: INITIAL_SURVEYS,
  quotations: INITIAL_QUOTATIONS,
  orders: INITIAL_ORDERS,
  inventory: INITIAL_INVENTORY,
  serials: INITIAL_SERIALS,
  installations: INITIAL_INSTALLATIONS,
  warranties: INITIAL_WARRANTIES,
  tickets: INITIAL_SERVICE_TICKETS,
  profitability: INITIAL_PROFITABILITY,
  isSupabaseConnected: !!supabase
}

// Global subscribers for reactive UI
let listeners = []
let globalState = loadSavedState() || defaultState
let isSupabaseLoaded = false

function emitChange() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState))
  } catch (e) {
    console.error('Storage write error', e)
  }
  listeners.forEach((listener) => listener(globalState))
}

// ==========================================
// AUTOMATED SEEDING TO SUPABASE (NO BUTTON CLICK NEEDED)
// ==========================================
async function autoSeedSupabaseData() {
  if (!supabase) return
  try {
    // 0. Ensure staff table is seeded
    try {
      const { data: existingStaff } = await supabase.from('staff').select('id').limit(1)
      if (!existingStaff || existingStaff.length === 0) {
        await supabase.from('staff').upsert(
          INITIAL_TECHNICIANS.map((t) => ({
            id: t.id,
            name: t.name,
            email: t.email,
            phone: t.phone,
            role: t.role,
            crew: t.crew,
            employee_id: t.employeeId,
            license_no: t.licenseNo,
            blood_group: t.bloodGroup,
            emergency_contact: t.emergencyContact,
            joining_date: t.joiningDate,
            safety_clearance: t.safetyClearance,
            skills: t.skills || [],
            stats: t.stats || {},
            certifications: t.certifications || [],
            showcase_gallery: t.showcaseGallery || [],
            work_handling: t.workHandling || {}
          }))
        )
      }
    } catch (e) {
      console.warn('Auto-seed staff table check note:', e)
    }

    const { data: existingPkgs } = await supabase.from('packages').select('id').limit(1)
    if (!existingPkgs || existingPkgs.length === 0) {
      console.log('⚡ Auto-seeding initial database tables to Supabase...')
      // 1. Packages
      await supabase.from('packages').upsert(
        INITIAL_PACKAGES.map((p) => ({
          id: p.id,
          name: p.name,
          system_type: p.systemType,
          capacity_kw: p.capacityKw,
          connection_category: p.connectionCategory || 'Residential',
          base_price: p.basePrice,
          subsidy_amount: p.subsidyAmount || 0,
          description: p.description,
          bom: p.bom
        }))
      )

      // 1B. Staff / Technicians Directory
      await supabase.from('staff').upsert(
        INITIAL_TECHNICIANS.map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          phone: t.phone,
          role: t.role,
          crew: t.crew,
          employee_id: t.employeeId,
          license_no: t.licenseNo,
          blood_group: t.bloodGroup,
          emergency_contact: t.emergencyContact,
          joining_date: t.joiningDate,
          safety_clearance: t.safetyClearance,
          skills: t.skills || [],
          stats: t.stats || {},
          certifications: t.certifications || [],
          showcase_gallery: t.showcaseGallery || [],
          work_handling: t.workHandling || {}
        }))
      )

      // 2. Profiles (Admin + Initial Customers)
      await supabase.from('profiles').upsert(
        INITIAL_REGISTERED_USERS.map((u) => ({
          id: u.id,
          full_name: u.name,
          email: u.email,
          password: u.password,
          phone: u.phone,
          address: u.address,
          city: u.city || 'Punjab',
          connection_category: u.connectionCategory || 'Residential',
          connection_type: u.connectionType || 'Residential 1-Phase 230V',
          discom_account: u.discomAccount || '',
          role: u.role || 'customer'
        }))
      )

      // 3. Initial Enquiries
      await supabase.from('enquiries').upsert(
        INITIAL_ENQUIRIES.map((e) => ({
          id: e.id,
          customer_id: e.customerId,
          customer_name: e.customerName,
          phone: e.phone,
          email: e.email,
          address: e.address,
          city: e.city,
          connection_category: e.connectionCategory,
          connection_type: e.connectionType,
          sanctioned_load_kw: e.sanctionedLoadKw,
          roof_type: e.roofType,
          monthly_electricity_bill: e.monthlyElectricityBill,
          roof_area_sqft: e.roofAreaSqft,
          system_preference: e.systemPreference,
          subsidy_interested: e.subsidyInterested,
          discom_account: e.discomAccount,
          status: e.status,
          notes: e.notes
        }))
      )

      // 4. Initial Surveys
      await supabase.from('site_surveys').upsert(
        INITIAL_SURVEYS.map((s) => ({
          id: s.id,
          enquiry_id: s.enquiryId,
          customer_name: s.customerName,
          customer_email: s.customerEmail,
          customer_phone: s.customerPhone,
          technician_name: s.technicianName,
          survey_date: s.surveyDate,
          time_slot: s.timeSlot,
          shadow_free_roof_sqft: s.shadowFreeRoofSqft,
          monthly_bill: s.monthlyBill,
          grid_connection_type: s.gridConnectionType,
          roof_direction: s.roofDirection,
          roof_tilt_degrees: s.roofTiltDegrees,
          cable_run_distance_meters: s.cableRunDistanceMeters,
          structural_integrity: s.structuralIntegrity,
          status: s.status,
          disapproval_reason: s.disapprovalReason,
          surveyor_notes: s.surveyorNotes
        }))
      )

      // 5. Initial Quotations
      await supabase.from('quotations').upsert(
        INITIAL_QUOTATIONS.map((q) => ({
          id: q.id,
          quote_number: q.quoteNumber,
          enquiry_id: q.enquiryId,
          customer_id: q.customerId,
          customer_name: q.customerName,
          customer_email: q.customerEmail,
          customer_phone: q.customerPhone,
          package_id: q.packageId,
          capacity_kw: q.capacityKw,
          system_type: q.systemType,
          connection_category: q.connectionCategory,
          subtotal_amount: q.subtotalAmount,
          subsidy_discount: q.subsidyDiscount,
          net_payable_amount: q.netPayableAmount,
          advance_required: q.advanceRequired,
          advance_paid: q.advancePaid,
          status: q.status,
          payment_details: q.paymentDetails,
          payment_confirmed_by_admin: q.paymentConfirmedByAdmin,
          payment_verification: q.paymentVerification,
          valid_until: q.validUntil,
          items: q.items
        }))
      )

      // 6. Initial Orders
      await supabase.from('orders').upsert(
        INITIAL_ORDERS.map((o) => ({
          id: o.id,
          order_number: o.orderNumber,
          quote_id: o.quoteId,
          customer_id: o.customerId,
          customer_name: o.customerName,
          customer_email: o.customerEmail,
          phone: o.phone,
          address: o.address,
          capacity_kw: o.capacityKw,
          system_type: o.systemType,
          connection_category: o.connectionCategory,
          total_amount: o.totalAmount,
          advance_paid: o.advancePaid,
          balance_due: o.balanceDue,
          dispatch_status: o.dispatchStatus,
          installation_status: o.installationStatus,
          assigned_crew: o.assignedCrew,
          scheduled_date: o.scheduledDate,
          tracking_stage: o.trackingStage,
          tracking_history: o.trackingHistory
        }))
      )
      console.log('✓ Auto-seeding complete!')
    }
  } catch (err) {
    console.warn('Auto-seed note:', err)
  }
}

// ==========================================
// ASYNC SUPABASE INITIAL FETCH & MERGE
// ==========================================
async function initSupabaseData() {
  if (!supabase || isSupabaseLoaded) return
  isSupabaseLoaded = true

  // Ensure initial data exists in Supabase
  await autoSeedSupabaseData()

  try {
    const [
      { data: profs, error: errProf },
      { data: stfs, error: errStf },
      { data: enqs, error: errEnq },
      { data: srvs, error: errSrv },
      { data: qts, error: errQt },
      { data: ords, error: errOrd },
      { data: pkgs, error: errPkg },
      { data: insts, error: errInst },
      { data: wars, error: errWar },
      { data: tkts, error: errTkt }
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('staff').select('*'),
      supabase.from('enquiries').select('*'),
      supabase.from('site_surveys').select('*'),
      supabase.from('quotations').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('packages').select('*'),
      supabase.from('installations').select('*'),
      supabase.from('warranties').select('*'),
      supabase.from('service_tickets').select('*')
    ])

    if (errProf || errEnq) {
      console.warn('Supabase fetch note:', errProf || errEnq)
      return
    }

    let updated = { ...globalState, isSupabaseConnected: true }

    if (stfs && stfs.length > 0) {
      const fetchedStaff = stfs.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        role: s.role,
        crew: s.crew,
        employeeId: s.employee_id,
        licenseNo: s.license_no,
        bloodGroup: s.blood_group,
        emergencyContact: s.emergency_contact,
        joiningDate: s.joining_date,
        safetyClearance: s.safety_clearance,
        skills: s.skills || [],
        stats: s.stats || {},
        certifications: s.certifications || [],
        showcaseGallery: s.showcase_gallery || [],
        workHandling: s.work_handling || {}
      }))

      // Merge INITIAL_TECHNICIANS so standard mock crews are preserved if not in DB
      const mergedStaff = [...fetchedStaff]
      for (const initT of INITIAL_TECHNICIANS) {
        if (!mergedStaff.some((t) => t.email.toLowerCase() === initT.email.toLowerCase())) {
          mergedStaff.push(initT)
          if (supabase) {
            supabase.from('staff').upsert([{
              id: initT.id,
              name: initT.name,
              email: initT.email,
              phone: initT.phone,
              role: initT.role,
              crew: initT.crew,
              employee_id: initT.employeeId,
              license_no: initT.licenseNo,
              blood_group: initT.bloodGroup,
              emergency_contact: initT.emergencyContact,
              joining_date: initT.joiningDate,
              safety_clearance: initT.safetyClearance,
              skills: initT.skills || [],
              stats: initT.stats || {},
              certifications: initT.certifications || [],
              showcase_gallery: initT.showcaseGallery || [],
              work_handling: initT.workHandling || {}
            }]).then(() => {})
          }
        }
      }
      updated.technicians = mergedStaff
    }

    if (profs && profs.length > 0) {
      const fetchedUsers = profs.map((p) => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        password: p.password,
        phone: p.phone,
        address: p.address,
        city: p.city,
        connectionCategory: p.connection_category,
        connectionType: p.connection_type,
        discomAccount: p.discom_account,
        role: p.role
      }))

      // Merge INITIAL_REGISTERED_USERS so technician and admin accounts are never lost
      const mergedUsers = [...fetchedUsers]
      for (const initU of INITIAL_REGISTERED_USERS) {
        if (!mergedUsers.some((u) => u.email.toLowerCase() === initU.email.toLowerCase())) {
          mergedUsers.push(initU)
          if (supabase) {
            supabase.from('profiles').upsert([{
              id: initU.id,
              full_name: initU.name,
              email: initU.email,
              password: initU.password,
              phone: initU.phone,
              address: initU.address,
              city: initU.city || 'Punjab',
              connection_category: initU.connectionCategory || 'Residential',
              connection_type: initU.connectionType || 'Residential 1-Phase 230V',
              discom_account: initU.discomAccount || '',
              role: initU.role || 'customer'
            }]).then(() => {})
          }
        }
      }
      updated.registeredUsers = mergedUsers
    }

    if (enqs && enqs.length > 0) {
      updated.enquiries = enqs.map((e) => ({
        id: e.id,
        customerId: e.customer_id,
        customerName: e.customer_name,
        phone: e.phone,
        email: e.email,
        address: e.address,
        city: e.city,
        connectionCategory: e.connection_category,
        connectionType: e.connection_type,
        sanctionedLoadKw: Number(e.sanctioned_load_kw),
        roofType: e.roof_type,
        monthlyElectricityBill: Number(e.monthly_electricity_bill),
        roofAreaSqft: Number(e.roof_area_sqft),
        systemPreference: e.system_preference,
        subsidyInterested: e.subsidy_interested,
        discomAccount: e.discom_account,
        status: e.status,
        notes: e.notes,
        createdAt: e.created_at
      }))
    }

    if (srvs && srvs.length > 0) {
      updated.surveys = srvs.map((s) => ({
        id: s.id,
        enquiryId: s.enquiry_id,
        customerName: s.customer_name,
        customerEmail: s.customer_email,
        customerPhone: s.customer_phone,
        technicianName: s.technician_name,
        surveyDate: s.survey_date,
        timeSlot: s.time_slot,
        shadowFreeRoofSqft: Number(s.shadow_free_roof_sqft),
        monthlyBill: Number(s.monthly_bill),
        gridConnectionType: s.grid_connection_type,
        roofDirection: s.roof_direction,
        roofTiltDegrees: Number(s.roof_tilt_degrees),
        cableRunDistanceMeters: Number(s.cable_run_distance_meters),
        structuralIntegrity: s.structural_integrity,
        status: s.status,
        disapprovalReason: s.disapproval_reason,
        surveyorNotes: s.surveyor_notes,
        approvedByRole: s.approved_by_role || 'technician',
        approvedByName: s.approved_by_name || s.technician_name || 'Field Technician',
        adminOverwritten: Boolean(s.admin_overwritten),
        adminOverwriteReason: s.admin_overwrite_reason || null,
        overwrittenBy: s.overwritten_by || null,
        createdAt: s.created_at
      }))
    }

    if (qts && qts.length > 0) {
      updated.quotations = qts.map((q) => ({
        id: q.id,
        quoteNumber: q.quote_number,
        enquiryId: q.enquiry_id,
        customerId: q.customer_id,
        customerName: q.customer_name,
        customerEmail: q.customer_email,
        customerPhone: q.customer_phone,
        packageId: q.package_id,
        capacityKw: Number(q.capacity_kw),
        systemType: q.system_type,
        connectionCategory: q.connection_category,
        subtotalAmount: Number(q.subtotal_amount),
        subsidyDiscount: Number(q.subsidy_discount),
        netPayableAmount: Number(q.net_payable_amount),
        advanceRequired: Number(q.advance_required),
        advancePaid: Number(q.advance_paid),
        status: q.status,
        paymentDetails: q.payment_details,
        paymentConfirmedByAdmin: q.payment_confirmed_by_admin,
        paymentVerification: q.payment_verification,
        validUntil: q.valid_until,
        items: q.items || [],
        createdAt: q.created_at
      }))
    }

    if (ords && ords.length > 0) {
      updated.orders = ords.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        quoteId: o.quote_id,
        customerId: o.customer_id,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        phone: o.phone,
        address: o.address,
        capacityKw: Number(o.capacity_kw),
        systemType: o.system_type,
        connectionCategory: o.connection_category,
        totalAmount: Number(o.total_amount),
        advancePaid: Number(o.advance_paid),
        balanceDue: Number(o.balance_due),
        dispatchStatus: o.dispatch_status,
        dispatchDate: o.dispatch_date || null,
        dispatchItems: (o.dispatch_items && o.dispatch_items.length > 0)
          ? o.dispatch_items
          : buildDefaultDispatchItems(o, globalState.inventory),
        installationStatus: o.installation_status,
        assignedCrew: o.assigned_crew,
        scheduledDate: o.scheduled_date,
        trackingStage: o.tracking_stage,
        trackingHistory: o.tracking_history || [],
        createdAt: o.created_at
      }))
    }

    if (pkgs && pkgs.length > 0) {
      updated.packages = pkgs.map((p) => ({
        id: p.id,
        name: p.name,
        systemType: p.system_type,
        capacityKw: Number(p.capacity_kw),
        connectionCategory: p.connection_category,
        basePrice: Number(p.base_price),
        subsidyAmount: Number(p.subsidy_amount),
        description: p.description,
        bom: p.bom || []
      }))
    }

    if (insts && insts.length > 0) {
      updated.installations = insts.map((i) => ({
        id: i.id,
        orderId: i.order_id,
        customerName: i.customer_name,
        customerEmail: i.customer_email,
        customerPhone: i.customer_phone,
        address: i.address,
        crewName: i.crew_name,
        technicianCount: i.technician_count,
        scheduledDate: i.scheduled_date,
        startTime: i.start_time,
        finishTime: i.finish_time,
        systemSizeKw: Number(i.system_size_kw),
        powerGenerationTestedKw: Number(i.power_generation_tested_kw),
        customerSigned: i.customer_signed,
        customerSignature: i.customer_signature,
        customerSignerName: i.customer_signer_name,
        handoverNotes: i.handover_notes,
        photos: i.photos || [],
        status: i.status,
        completedAt: i.completed_at,
        createdAt: i.created_at
      }))
    }

    if (wars && wars.length > 0) {
      updated.warranties = wars.map((w) => ({
        id: w.id,
        serialNumber: w.serial_number,
        equipmentName: w.equipment_name,
        equipmentType: w.equipment_type,
        customerName: w.customer_name,
        customerEmail: w.customer_email,
        customerPhone: w.customer_phone,
        startDate: w.start_date,
        endDate: w.end_date,
        warrantyYears: w.warranty_years,
        isActive: w.is_active,
        coverage: w.coverage,
        createdAt: w.created_at
      }))
    }

    if (tkts && tkts.length > 0) {
      updated.tickets = tkts.map((t) => ({
        id: t.id,
        ticketNumber: t.ticket_number,
        customerName: t.customer_name,
        customerEmail: t.customer_email,
        phone: t.phone,
        serialNumber: t.serial_number,
        equipmentType: t.equipment_type,
        faultCode: t.fault_code,
        description: t.description,
        isUnderWarranty: t.is_under_warranty,
        estimatedCost: Number(t.estimated_cost),
        technicianAssigned: t.technician_assigned,
        status: t.status,
        resolutionNotes: t.resolution_notes,
        resolvedAt: t.resolved_at,
        createdAt: t.created_at
      }))
    }

    globalState = updated
    emitChange()
  } catch (err) {
    console.warn('Initial Supabase fetch note:', err)
  }
}

// Trigger initial fetch
initSupabaseData()

export function useSolarStore() {
  const [state, setState] = useState(globalState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])

  // Helper to normalize phone numbers for search
  const cleanPhone = (p) => (p || '').replace(/\D/g, '').slice(-10)

  return {
    ...state,

    // ==========================================
    // 1. PUBLIC INQUIRY & QUOTE LOOKUP BY PHONE (NO LOGIN REQUIRED)
    // ==========================================
    getRecordsByPhone: (inputPhone) => {
      const targetPhone = cleanPhone(inputPhone)
      if (!targetPhone || targetPhone.length < 8) return null

      const matchedEnquiries = globalState.enquiries.filter(
        (e) => cleanPhone(e.phone).includes(targetPhone)
      )
      const matchedQuotes = globalState.quotations.filter((q) => {
        const enq = globalState.enquiries.find((e) => e.id === q.enquiryId)
        return (
          (enq && cleanPhone(enq.phone).includes(targetPhone)) ||
          (q.customerPhone && cleanPhone(q.customerPhone).includes(targetPhone))
        )
      })
      const matchedOrders = globalState.orders.filter((o) =>
        cleanPhone(o.phone).includes(targetPhone)
      )
      const matchedSurveys = globalState.surveys.filter((s) => {
        const enq = globalState.enquiries.find((e) => e.id === s.enquiryId)
        return enq && cleanPhone(enq.phone).includes(targetPhone)
      })

      return {
        enquiries: matchedEnquiries,
        surveys: matchedSurveys,
        quotations: matchedQuotes,
        orders: matchedOrders
      }
    },

    // ==========================================
    // 2. TECHNICIAN AVAILABILITY & AUTO/MANUAL ASSIGN ENGINE
    // ==========================================
    getTechnicianAvailability: (targetDate, targetSlot = 'Morning (09:00 AM - 01:00 PM)') => {
      return globalState.technicians.map((tech) => {
        const busyInSurvey = globalState.surveys.some(
          (s) =>
            s.technicianName?.includes(tech.name) &&
            s.surveyDate === targetDate &&
            s.timeSlot === targetSlot
        )
        const busyInScheduledEnquiry = globalState.enquiries.some(
          (e) =>
            e.assignedTechName?.includes(tech.name) &&
            e.surveyDate === targetDate &&
            e.timeSlot === targetSlot &&
            e.status === 'survey_scheduled'
        )
        const busyInInstall = globalState.installations.some(
          (i) =>
            (i.crewName?.includes(tech.crew) || i.crewName?.includes(tech.name)) &&
            i.scheduledDate === targetDate &&
            i.status !== 'signed_off'
        )
        const isBusy = busyInSurvey || busyInScheduledEnquiry || busyInInstall
        return {
          ...tech,
          isBusy,
          currentAssignment: isBusy
            ? busyInInstall
              ? `Active Rooftop Installation (${tech.crew})`
              : busyInSurvey
              ? 'Confirmed Site Feasibility Survey'
              : 'Scheduled Customer Inspection'
            : null
        }
      })
    },

    autoAssignFreeTechnician: (targetDate, targetSlot = 'Morning (09:00 AM - 01:00 PM)') => {
      const techs = globalState.technicians.map((tech) => {
        const busyInSurvey = globalState.surveys.some(
          (s) =>
            s.technicianName?.includes(tech.name) &&
            s.surveyDate === targetDate &&
            s.timeSlot === targetSlot
        )
        const busyInScheduledEnquiry = globalState.enquiries.some(
          (e) =>
            e.assignedTechName?.includes(tech.name) &&
            e.surveyDate === targetDate &&
            e.timeSlot === targetSlot &&
            e.status === 'survey_scheduled'
        )
        const busyInInstall = globalState.installations.some(
          (i) =>
            (i.crewName?.includes(tech.crew) || i.crewName?.includes(tech.name)) &&
            i.scheduledDate === targetDate &&
            i.status !== 'signed_off'
        )
        return {
          ...tech,
          isBusy: busyInSurvey || busyInScheduledEnquiry || busyInInstall
        }
      })

      const freeTech = techs.find((t) => !t.isBusy)
      return freeTech || null
    },

    // ==========================================
    // 2B. ADMIN CREATES TECHNICAL STAFF CREDENTIALS & ROLES
    // ==========================================
    createTechnicalStaff: async ({ name, email, password, role, crew, phone, employeeId, skills }) => {
      const cleanEmail = (email || '').trim().toLowerCase()
      if (!name || !cleanEmail || !password) {
        return { success: false, error: 'Full name, email login ID, and password are required.' }
      }

      if (globalState.registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: `An account with email "${cleanEmail}" already exists in the database.` }
      }

      const newId = `tech-${Date.now().toString().slice(-4)}`
      const newProfile = {
        id: newId,
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        phone: (phone || '+91 98140 00000').trim(),
        address: `${crew || 'Crew Alpha'} Base Station, Regional Centre`,
        city: 'Punjab',
        connectionCategory: 'Field Crew',
        connectionType: role || 'Lead Site Engineer',
        discomAccount: employeeId || `TECH-${Date.now().toString().slice(-3)}`,
        role: 'technician',
        createdAt: new Date().toISOString()
      }

      const newTech = {
        id: newId,
        name: newProfile.name,
        role: role || 'Field Technician',
        crew: crew || 'Crew Alpha',
        phone: newProfile.phone,
        email: cleanEmail,
        employeeId: employeeId || `TECH-SOL-${Math.floor(100 + Math.random() * 900)}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        licenseNo: `MNRE-TECH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        bloodGroup: 'B+',
        emergencyContact: '+91 98140 00000 (Family Emergency)',
        joiningDate: new Date().toISOString().slice(0, 10),
        safetyClearance: 'Class-A: Solar Rooftop & Working at Heights Certified',
        skills: Array.isArray(skills)
          ? skills
          : (skills || 'Rooftop Survey, Grid Tie Inverter Sync, Safety Protection').split(',').map((s) => s.trim()),
        stats: {
          totalKwInstalled: 0,
          surveysCompleted: 0,
          customerRating: 5.0,
          safetyScore: '100% Zero-Incident',
          activeJobsCount: 0
        },
        certifications: [
          'MNRE Certified Solar PV Installer',
          'OSHA / IS 3521 Safety at Heights Clearance',
          'SolarOps Field Operations Certified'
        ],
        showcaseGallery: [],
        workHandling: {
          currentStatus: 'Ready for Assignment',
          currentCustomer: 'None (Available for Dispatch)',
          address: `${crew || 'Crew Alpha'} Base Station`,
          activeStage: 'Awaiting Next Dispatch',
          dailyRoute: [
            { time: '08:30 AM', task: 'Morning Crew Roll Call & PPE Inspection', status: 'completed' },
            { time: '10:00 AM', task: 'Available for Field Survey & Installation Dispatch', status: 'in_progress' }
          ],
          checklist: {
            ppeSafety: true,
            bomUnboxing: false,
            structureAnchoring: false,
            dcArrayStringing: false,
            earthingResistance: false,
            netMeterSync: false,
            customerSignoff: false
          }
        }
      }

      if (supabase) {
        try {
          await supabase.from('profiles').insert([{
            id: newProfile.id,
            full_name: newProfile.name,
            email: newProfile.email,
            password: newProfile.password,
            phone: newProfile.phone,
            address: newProfile.address,
            city: newProfile.city,
            connection_category: newProfile.connectionCategory,
            connection_type: newProfile.connectionType,
            discom_account: newProfile.discomAccount,
            role: 'technician'
          }])

          await supabase.from('staff').insert([{
            id: newTech.id,
            name: newTech.name,
            email: newTech.email,
            phone: newTech.phone,
            role: newTech.role,
            crew: newTech.crew,
            employee_id: newTech.employeeId,
            license_no: newTech.licenseNo,
            blood_group: newTech.bloodGroup,
            emergency_contact: newTech.emergencyContact,
            joining_date: newTech.joiningDate,
            safety_clearance: newTech.safetyClearance,
            skills: newTech.skills,
            stats: newTech.stats,
            certifications: newTech.certifications,
            showcase_gallery: newTech.showcaseGallery,
            work_handling: newTech.workHandling
          }])
        } catch (e) {
          console.warn('Supabase createTechnicalStaff insert note:', e)
        }
      }

      globalState = {
        ...globalState,
        registeredUsers: [...globalState.registeredUsers, newProfile],
        technicians: [newTech, ...globalState.technicians]
      }
      emitChange()
      return { success: true, technician: newTech, user: newProfile }
    },

    // ==========================================
    // 2C. ADMIN DISPATCHES TECHNICIAN TO ENQUIRY (WITH CONFLICT PREVENTION)
    // ==========================================
    assignTechnicianToEnquiry: async ({ enquiryId, technicianName, surveyDate, timeSlot }) => {
      // Check live slot conflicts
      const availability = globalState.technicians.map((tech) => {
        const busyInSurvey = globalState.surveys.some(
          (s) =>
            s.technicianName?.includes(tech.name) &&
            s.surveyDate === surveyDate &&
            s.timeSlot === timeSlot
        )
        const busyInScheduledEnquiry = globalState.enquiries.some(
          (e) =>
            e.id !== enquiryId &&
            e.assignedTechName?.includes(tech.name) &&
            e.surveyDate === surveyDate &&
            e.timeSlot === timeSlot &&
            e.status === 'survey_scheduled'
        )
        const busyInInstall = globalState.installations.some(
          (i) =>
            (i.crewName?.includes(tech.crew) || i.crewName?.includes(tech.name)) &&
            i.scheduledDate === surveyDate &&
            i.status !== 'signed_off'
        )
        return {
          ...tech,
          isBusy: busyInSurvey || busyInScheduledEnquiry || busyInInstall
        }
      })

      const targetTech = availability.find((t) => technicianName?.includes(t.name))
      if (targetTech && targetTech.isBusy) {
        return {
          success: false,
          error: `Conflict Blocked: ${targetTech.name} is already busy in this slot (${timeSlot} on ${surveyDate}). You must select an available technician or pick another slot.`
        }
      }

      const assignedCrew = targetTech?.crew || 'Crew Alpha'
      const targetEnquiry = globalState.enquiries.find((e) => e.id === enquiryId)

      if (supabase) {
        try {
          await supabase.from('enquiries').update({
            status: 'survey_scheduled',
            notes: `Dispatched to ${technicianName} (${assignedCrew}) for on-site inspection on ${surveyDate} [${timeSlot}]. Site approval pending.`
          }).eq('id', enquiryId)
        } catch (e) {
          console.warn('Supabase assignTechnicianToEnquiry note:', e)
        }
      }

      // Ensure survey entry is created/updated as 'pending' (site approval pending field surveyor visit)
      const existingSurvey = globalState.surveys.find((s) => s.enquiryId === enquiryId)
      let updatedSurveys = [...globalState.surveys]
      if (existingSurvey) {
        updatedSurveys = updatedSurveys.map((s) =>
          s.enquiryId === enquiryId
            ? {
                ...s,
                technicianName,
                crew: assignedCrew,
                surveyDate,
                timeSlot,
                status: 'pending', // PENDING SITE SURVEYOR APPROVAL
                approvalStatus: 'pending',
                surveyorNotes: `Dispatched to ${technicianName} (${assignedCrew}) on ${surveyDate} [${timeSlot}]. Site approval pending.`
              }
            : s
        )
      } else if (targetEnquiry) {
        const newPendingSurvey = {
          id: `srv-${Date.now().toString().slice(-4)}`,
          enquiryId: targetEnquiry.id,
          customerName: targetEnquiry.customerName,
          customerEmail: targetEnquiry.email || '',
          technicianName,
          crew: assignedCrew,
          surveyDate,
          timeSlot,
          shadowFreeRoofSqft: targetEnquiry.roofAreaSqft || 350,
          monthlyBill: targetEnquiry.monthlyElectricityBill || 3500,
          gridConnectionType: targetEnquiry.connectionType || 'Residential 1-Phase 230V',
          roofDirection: 'Pending on-site verification',
          roofTiltDegrees: 22,
          cableRunDistanceMeters: 18,
          structuralIntegrity: 'Pending surveyor inspection',
          status: 'pending', // PENDING SITE SURVEYOR APPROVAL
          approvalStatus: 'pending',
          surveyorNotes: `Dispatched to ${technicianName} (${assignedCrew}) on ${surveyDate} [${timeSlot}]. Site approval pending.`
        }
        updatedSurveys.push(newPendingSurvey)
      }

      globalState = {
        ...globalState,
        enquiries: globalState.enquiries.map((e) =>
          e.id === enquiryId
            ? {
                ...e,
                status: 'survey_scheduled',
                assignedTechName: technicianName,
                assignedCrew,
                surveyDate,
                timeSlot,
                notes: `Dispatched to ${technicianName} (${assignedCrew}) on ${surveyDate} [${timeSlot}]. Site approval pending.`
              }
            : e
        ),
        surveys: updatedSurveys
      }
      emitChange()
      return { success: true }
    },

    // ==========================================
    // 2D. TECHNICIAN IDP, WORK SHOWCASE & HANDLING
    // ==========================================
    addTechnicianShowcaseItem: async ({ technicianId, project }) => {
      if (!technicianId || !project) return { success: false, error: 'Technician ID and project data required.' }

      const newProj = {
        id: `proj-${Date.now().toString().slice(-4)}`,
        title: project.title || 'Completed Rooftop Installation',
        capacity: project.capacity || '3.0 kW',
        customer: project.customer || 'Customer',
        location: project.location || 'Punjab',
        date: project.date || new Date().toISOString().slice(0, 10),
        rating: Number(project.rating) || 5.0,
        review: project.review || 'System installed and commissioned smoothly.',
        photo: project.photo || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
        highlights: project.highlights || 'Tier-1 modules installed with dual earthing and net-metering.'
      }

      const updatedTechs = globalState.technicians.map((t) => {
        if (t.id === technicianId || t.name.toLowerCase() === technicianId.toLowerCase()) {
          const currentShowcase = t.showcaseGallery || []
          const currentTotal = Number(t.stats?.totalKwInstalled || 0)
          const addCap = parseFloat(project.capacity) || 0
          const updatedT = {
            ...t,
            stats: {
              ...(t.stats || {}),
              totalKwInstalled: +(currentTotal + addCap).toFixed(1)
            },
            showcaseGallery: [newProj, ...currentShowcase]
          }
          if (supabase) {
            supabase.from('staff').update({
              stats: updatedT.stats,
              showcase_gallery: updatedT.showcaseGallery
            }).eq('id', updatedT.id).then(() => {})
          }
          return updatedT
        }
        return t
      })

      globalState = {
        ...globalState,
        technicians: updatedTechs
      }
      emitChange()
      return { success: true, project: newProj }
    },

    updateTechnicianChecklist: async ({ technicianId, checkKey, isChecked }) => {
      const updatedTechs = globalState.technicians.map((t) => {
        if (t.id === technicianId || t.name.toLowerCase() === technicianId.toLowerCase()) {
          const currentHandling = t.workHandling || {}
          const currentChecklist = currentHandling.checklist || {}
          const updatedT = {
            ...t,
            workHandling: {
              ...currentHandling,
              checklist: {
                ...currentChecklist,
                [checkKey]: isChecked
              }
            }
          }
          if (supabase) {
            supabase.from('staff').update({
              work_handling: updatedT.workHandling
            }).eq('id', updatedT.id).then(() => {})
          }
          return updatedT
        }
        return t
      })

      globalState = {
        ...globalState,
        technicians: updatedTechs
      }
      emitChange()
      return { success: true }
    },

    updateTechnicianHandling: async ({ technicianId, updates }) => {
      const updatedTechs = globalState.technicians.map((t) => {
        if (t.id === technicianId || t.name.toLowerCase() === technicianId.toLowerCase()) {
          const currentHandling = t.workHandling || {}
          const updatedT = {
            ...t,
            workHandling: {
              ...currentHandling,
              ...updates
            }
          }
          if (supabase) {
            supabase.from('staff').update({
              work_handling: updatedT.workHandling
            }).eq('id', updatedT.id).then(() => {})
          }
          return updatedT
        }
        return t
      })

      globalState = {
        ...globalState,
        technicians: updatedTechs
      }
      emitChange()
      return { success: true }
    },

    updateDailyRouteTask: async ({ technicianId, taskIndex, status }) => {
      const updatedTechs = globalState.technicians.map((t) => {
        if (t.id === technicianId || t.name.toLowerCase() === technicianId.toLowerCase()) {
          const currentHandling = t.workHandling || {}
          const currentRoute = [...(currentHandling.dailyRoute || [])]
          if (currentRoute[taskIndex]) {
            currentRoute[taskIndex] = {
              ...currentRoute[taskIndex],
              status
            }
          }
          const updatedT = {
            ...t,
            workHandling: {
              ...currentHandling,
              dailyRoute: currentRoute
            }
          }
          if (supabase) {
            supabase.from('staff').update({
              work_handling: updatedT.workHandling
            }).eq('id', updatedT.id).then(() => {})
          }
          return updatedT
        }
        return t
      })

      globalState = {
        ...globalState,
        technicians: updatedTechs
      }
      emitChange()
      return { success: true }
    },

    // ==========================================
    // 3. AUTHENTICATION & SIGNUP MODULE
    // ==========================================
    registerUser: async (userData) => {
      const email = userData.email.trim().toLowerCase()

      const existing = globalState.registeredUsers.find(
        (u) => u.email.toLowerCase() === email
      )
      if (existing) {
        return {
          success: false,
          error: 'An account with this email address is already registered. Please sign in.'
        }
      }

      if (!userData.password || userData.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' }
      }

      const newUser = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: userData.name.trim(),
        email: email,
        password: userData.password,
        phone: userData.phone.trim(),
        address: userData.address.trim(),
        city: userData.city?.trim() || 'Punjab',
        connectionCategory: userData.connectionCategory || 'Residential',
        connectionType: userData.connectionType || 'Residential 1-Phase 230V',
        discomAccount: userData.discomAccount?.trim() || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      }

      if (supabase) {
        try {
          const { error: sbErr } = await supabase.from('profiles').insert([
            {
              id: newUser.id,
              full_name: newUser.name,
              email: newUser.email,
              password: newUser.password,
              phone: newUser.phone,
              address: newUser.address,
              city: newUser.city,
              connection_category: newUser.connectionCategory,
              connection_type: newUser.connectionType,
              discom_account: newUser.discomAccount,
              role: 'customer'
            }
          ])
          if (sbErr) console.error('Supabase profile insertion error:', sbErr)
        } catch (sbErr) {
          console.error('Supabase profile insertion exception:', sbErr)
        }
      }

      globalState = {
        ...globalState,
        registeredUsers: [...globalState.registeredUsers, newUser],
        currentUser: newUser
      }
      emitChange()
      return { success: true, user: newUser }
    },

    loginUser: async ({ email, password, portalType }) => {
      const cleanEmail = (email || '').trim().toLowerCase()
      const cleanPass = password || ''

      let matchedUser = globalState.registeredUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail
      )

      if (supabase && !matchedUser) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', cleanEmail)
            .single()
          if (!error && data) {
            matchedUser = {
              id: data.id,
              name: data.full_name,
              email: data.email,
              password: data.password,
              phone: data.phone,
              address: data.address,
              city: data.city || 'Punjab',
              connectionCategory: data.connection_category || 'Residential',
              connectionType: data.connection_type || 'Residential 1-Phase 230V',
              discomAccount: data.discom_account,
              role: data.role || 'customer'
            }
          }
        } catch (e) {
          console.warn('Supabase login check note:', e)
        }
      }

      if (!matchedUser) {
        const foundInitial = INITIAL_REGISTERED_USERS.find(
          (u) => u.email.toLowerCase() === cleanEmail
        )
        if (foundInitial) {
          matchedUser = foundInitial
          if (!globalState.registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
            globalState.registeredUsers.push(foundInitial)
          }
          if (supabase) {
            supabase.from('profiles').upsert([{
              id: foundInitial.id,
              full_name: foundInitial.name,
              email: foundInitial.email,
              password: foundInitial.password,
              phone: foundInitial.phone,
              address: foundInitial.address,
              city: foundInitial.city || 'Punjab',
              connection_category: foundInitial.connectionCategory || 'Residential',
              connection_type: foundInitial.connectionType || 'Residential 1-Phase 230V',
              discom_account: foundInitial.discomAccount || '',
              role: foundInitial.role || 'customer'
            }]).then(() => {})
          }
        }
      }

      if (!matchedUser) {
        return {
          success: false,
          error:
            'No registered account found with this email. Please check your spelling or sign up for a new account.'
        }
      }

      if (matchedUser.password !== cleanPass) {
        return {
          success: false,
          error: 'Incorrect password. Please verify your credentials and try again.'
        }
      }

      // Security role checks:
      if (portalType === 'admin' && matchedUser.role !== 'admin') {
        return {
          success: false,
          error: `Access Denied: The account "${matchedUser.email}" is registered as ${matchedUser.role}. Administrator permissions are required to access the Admin Dashboard.`
        }
      }

      if (portalType === 'technician' && matchedUser.role === 'customer') {
        return {
          success: false,
          error: `Access Denied: The account "${matchedUser.email}" is registered as a Customer. Please use the Customer Portal.`
        }
      }

      globalState = {
        ...globalState,
        currentUser: matchedUser
      }
      emitChange()
      return { success: true, user: matchedUser }
    },

    logout: () => {
      globalState = {
        ...globalState,
        currentUser: null
      }
      emitChange()
    },

    // ==========================================
    // 4. ROOFTOP ENQUIRY SYSTEM
    // ==========================================
    addEnquiry: async (enquiryData) => {
      const newEnquiry = {
        id: `enq-${Date.now().toString().slice(-4)}`,
        customerId: globalState.currentUser?.id || null,
        customerName: enquiryData.name.trim(),
        phone: enquiryData.phone.trim(),
        email: (enquiryData.email || globalState.currentUser?.email || '').trim().toLowerCase(),
        address: enquiryData.address.trim(),
        city: enquiryData.city?.trim() || 'Punjab',
        connectionCategory: enquiryData.connectionCategory || 'Residential',
        connectionType: enquiryData.connectionType || 'Residential 1-Phase 230V',
        sanctionedLoadKw: Number(enquiryData.sanctionedLoadKw) || 3.0,
        roofType: enquiryData.roofType || 'Reinforced Concrete (RCC Flat Roof)',
        monthlyElectricityBill: Number(enquiryData.monthlyElectricityBill) || 3000,
        roofAreaSqft: Number(enquiryData.roofAreaSqft) || 300,
        systemPreference: enquiryData.systemPreference || '3 kW On-Grid',
        subsidyInterested:
          enquiryData.connectionCategory === 'Residential' &&
          !enquiryData.systemPreference?.includes('Off-Grid')
            ? enquiryData.subsidyInterested !== false
            : false,
        discomAccount: enquiryData.discomAccount?.trim() || '',
        status: 'new',
        notes: enquiryData.notes?.trim() || 'Inquiry logged from portal.',
        createdAt: new Date().toISOString()
      }

      if (supabase) {
        try {
          const { error: sbErr } = await supabase.from('enquiries').insert([
            {
              id: newEnquiry.id,
              customer_id: newEnquiry.customerId,
              customer_name: newEnquiry.customerName,
              phone: newEnquiry.phone,
              email: newEnquiry.email,
              address: newEnquiry.address,
              city: newEnquiry.city,
              connection_category: newEnquiry.connectionCategory,
              connection_type: newEnquiry.connectionType,
              sanctioned_load_kw: newEnquiry.sanctionedLoadKw,
              roof_type: newEnquiry.roofType,
              monthly_electricity_bill: newEnquiry.monthlyElectricityBill,
              roof_area_sqft: newEnquiry.roofAreaSqft,
              system_preference: newEnquiry.systemPreference,
              subsidy_interested: newEnquiry.subsidyInterested,
              discom_account: newEnquiry.discomAccount,
              status: 'new',
              notes: newEnquiry.notes
            }
          ])
          if (sbErr) console.error('Supabase enquiry insertion error:', sbErr)
        } catch (sbErr) {
          console.error('Supabase enquiry insertion exception:', sbErr)
        }
      }

      globalState = {
        ...globalState,
        enquiries: [newEnquiry, ...globalState.enquiries]
      }
      emitChange()
      return newEnquiry
    },

    updateEnquiryStatus: async (enquiryId, status) => {
      if (supabase) {
        try {
          await supabase.from('enquiries').update({ status }).eq('id', enquiryId)
        } catch (e) {
          console.error('Supabase updateEnquiryStatus error:', e)
        }
      }

      globalState = {
        ...globalState,
        enquiries: globalState.enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e))
      }
      emitChange()
    },

    // ==========================================
    // 5. SITE SURVEY & TECHNICAL FEASIBILITY
    // ==========================================
    createOrUpdateSurvey: async (surveyData) => {
      const existing = globalState.surveys.find((s) => s.enquiryId === surveyData.enquiryId)
      const targetEnquiry = globalState.enquiries.find((e) => e.id === surveyData.enquiryId)

      const isDisapproved = surveyData.status === 'rejected'

      const record = {
        id: existing ? existing.id : `srv-${Date.now().toString().slice(-4)}`,
        enquiryId: surveyData.enquiryId,
        customerName: surveyData.customerName,
        customerEmail: targetEnquiry?.email || '',
        customerPhone: targetEnquiry?.phone || '',
        technicianName: surveyData.technicianName || 'Amit Singh (Lead Tech)',
        surveyDate: surveyData.surveyDate || new Date().toISOString().slice(0, 10),
        timeSlot: surveyData.timeSlot || 'Morning (09:00 AM - 01:00 PM)',
        shadowFreeRoofSqft: Number(surveyData.shadowFreeRoofSqft) || 400,
        monthlyBill: Number(surveyData.monthlyBill) || 4000,
        gridConnectionType:
          surveyData.gridConnectionType ||
          targetEnquiry?.connectionType ||
          'Residential 1-Phase 230V',
        roofDirection: surveyData.roofDirection || 'South (Optimal)',
        roofTiltDegrees: Number(surveyData.roofTiltDegrees) || 22,
        cableRunDistanceMeters: Number(surveyData.cableRunDistanceMeters) || 20,
        structuralIntegrity: surveyData.structuralIntegrity || 'Suitable for Standard Mounting',
        status: isDisapproved ? 'rejected' : 'approved',
        disapprovalReason: isDisapproved
          ? surveyData.disapprovalReason ||
            'Site conditions do not satisfy solar structural/shading safety standards.'
          : null,
        surveyorNotes:
          surveyData.surveyorNotes ||
          (isDisapproved ? 'Survey rejected.' : 'Roof inspected and approved for installation.'),
        approvedByRole: globalState.currentUser?.role || 'technician',
        approvedByName: surveyData.technicianName || globalState.currentUser?.name || 'Field Technician',
        adminOverwritten: existing?.adminOverwritten || false,
        adminOverwriteReason: existing?.adminOverwriteReason || null,
        overwrittenBy: existing?.overwrittenBy || null,
        createdAt: existing ? existing.createdAt : new Date().toISOString()
      }

      if (supabase) {
        try {
          const { error: srvErr } = await supabase.from('site_surveys').upsert([
            {
              id: record.id,
              enquiry_id: record.enquiryId,
              customer_name: record.customerName,
              customer_email: record.customerEmail,
              customer_phone: record.customerPhone,
              technician_name: record.technicianName,
              survey_date: record.surveyDate,
              time_slot: record.timeSlot,
              shadow_free_roof_sqft: record.shadowFreeRoofSqft,
              monthly_bill: record.monthlyBill,
              grid_connection_type: record.gridConnectionType,
              roof_direction: record.roofDirection,
              roof_tilt_degrees: record.roofTiltDegrees,
              cable_run_distance_meters: record.cableRunDistanceMeters,
              structural_integrity: record.structuralIntegrity,
              status: record.status,
              disapproval_reason: record.disapprovalReason,
              surveyor_notes: record.surveyorNotes
            }
          ])
          if (srvErr) console.error('Supabase site_surveys upsert error:', srvErr)

          await supabase
            .from('enquiries')
            .update({ status: isDisapproved ? 'closed' : 'survey_completed' })
            .eq('id', surveyData.enquiryId)
        } catch (e) {
          console.error('Supabase survey save exception:', e)
        }
      }

      const surveys = existing
        ? globalState.surveys.map((s) => (s.id === existing.id ? record : s))
        : [record, ...globalState.surveys]

      const enquiries = globalState.enquiries.map((e) =>
        e.id === surveyData.enquiryId
          ? { ...e, status: isDisapproved ? 'closed' : 'survey_completed' }
          : e
      )

      globalState = { ...globalState, surveys, enquiries }
      emitChange()
      return record
    },

    // ==========================================
    // 5B. ADMIN OVERWRITE FEASIBILITY DECISION
    // ==========================================
    adminOverrideSurveyFeasibility: async ({ surveyId, status, overrideReason, adminName }) => {
      const existing = globalState.surveys.find((s) => s.id === surveyId)
      if (!existing) return { success: false, error: 'Survey record not found' }

      const isApproved = status === 'approved'
      const updated = {
        ...existing,
        status: isApproved ? 'approved' : 'rejected',
        disapprovalReason: isApproved ? null : overrideReason,
        adminOverwritten: true,
        adminOverwriteReason: overrideReason,
        overwrittenBy: adminName || globalState.currentUser?.name || 'SunPower Operations Director',
        overwrittenAt: new Date().toISOString()
      }

      if (supabase) {
        try {
          await supabase
            .from('site_surveys')
            .update({
              status: updated.status,
              disapproval_reason: updated.disapprovalReason
            })
            .eq('id', surveyId)

          await supabase
            .from('enquiries')
            .update({ status: isApproved ? 'survey_completed' : 'closed' })
            .eq('id', existing.enquiryId)
        } catch (e) {
          console.warn('Supabase adminOverrideSurveyFeasibility note:', e)
        }
      }

      const surveys = globalState.surveys.map((s) => (s.id === surveyId ? updated : s))
      const enquiries = globalState.enquiries.map((e) =>
        e.id === existing.enquiryId
          ? { ...e, status: isApproved ? 'survey_completed' : 'closed' }
          : e
      )

      globalState = { ...globalState, surveys, enquiries }
      emitChange()
      return { success: true, survey: updated }
    },

    // ==========================================
    // 6. QUOTATIONS (STRICTLY REQUIRE APPROVED SURVEY)
    // ==========================================
    generateQuotation: async (payload) => {
      const survey = globalState.surveys.find((s) => s.enquiryId === payload.enquiryId)
      if (!survey || survey.status !== 'approved') {
        alert(
          'Cannot generate quotation: This site survey has not been approved for technical feasibility!'
        )
        return null
      }

      const pkg =
        globalState.packages.find((p) => p.id === payload.packageId) || globalState.packages[2]
      const targetEnquiry = globalState.enquiries.find((e) => e.id === payload.enquiryId)

      const subtotal = pkg.basePrice
      const subsidy =
        pkg.systemType === 'on_grid' && pkg.connectionCategory === 'Residential'
          ? pkg.subsidyAmount
          : 0
      const netPayable = subtotal - subsidy
      const advanceRequired = Math.round(netPayable * 0.35)

      const newQuote = {
        id: `quo-${Date.now().toString().slice(-4)}`,
        quoteNumber: `SP-QT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        enquiryId: payload.enquiryId || null,
        customerId: targetEnquiry?.customerId || 'cust-1',
        customerName: payload.customerName,
        customerEmail: targetEnquiry?.email || '',
        customerPhone: targetEnquiry?.phone || '',
        packageId: pkg.id,
        capacityKw: pkg.capacityKw,
        systemType: pkg.systemType,
        connectionCategory: pkg.connectionCategory,
        subtotalAmount: subtotal,
        subsidyDiscount: subsidy,
        netPayableAmount: netPayable,
        advanceRequired,
        advancePaid: 0,
        status: 'sent',
        paymentDetails: null,
        paymentConfirmedByAdmin: false,
        validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        items: pkg.bom.map((b) => ({
          item: b.item,
          qty: b.qty,
          unit: b.unit,
          warranty: `${b.warranty} Years`
        })),
        createdAt: new Date().toISOString()
      }

      if (supabase) {
        try {
          const { error: qtErr } = await supabase.from('quotations').insert([
            {
              id: newQuote.id,
              quote_number: newQuote.quoteNumber,
              enquiry_id: newQuote.enquiryId,
              customer_id: newQuote.customerId,
              customer_name: newQuote.customerName,
              customer_email: newQuote.customerEmail,
              customer_phone: newQuote.customerPhone,
              package_id: newQuote.packageId,
              capacity_kw: newQuote.capacityKw,
              system_type: newQuote.systemType,
              connection_category: newQuote.connectionCategory,
              subtotal_amount: newQuote.subtotalAmount,
              subsidy_discount: newQuote.subsidyDiscount,
              net_payable_amount: newQuote.netPayableAmount,
              advance_required: newQuote.advanceRequired,
              advance_paid: 0,
              status: 'sent',
              valid_until: newQuote.validUntil,
              items: newQuote.items
            }
          ])
          if (qtErr) console.error('Supabase quotation insertion error:', qtErr)
        } catch (e) {
          console.error('Supabase quotation exception:', e)
        }
      }

      globalState = {
        ...globalState,
        quotations: [newQuote, ...globalState.quotations]
      }
      emitChange()
      return newQuote
    },

    submitPaymentProofByCustomer: async (quoteId, paymentInfo) => {
      const quote = globalState.quotations.find((q) => q.id === quoteId)
      if (!quote) return

      const paymentDetails = {
        submittedAmount: Number(paymentInfo.amount) || quote.advanceRequired,
        transactionRef: paymentInfo.transactionRef || 'UTR-PENDING',
        paymentMode: paymentInfo.paymentMode || 'Bank Transfer / UPI',
        bankName: paymentInfo.bankName || 'Customer Bank',
        notes:
          paymentInfo.notes ||
          'Payment reference submitted by customer. Awaiting staff verification.',
        submittedAt: new Date().toISOString()
      }

      const updatedQuote = {
        ...quote,
        status: 'pending_verification',
        paymentDetails
      }

      if (supabase) {
        try {
          const { error } = await supabase
            .from('quotations')
            .update({
              status: 'pending_verification',
              payment_details: paymentDetails
            })
            .eq('id', quoteId)
          if (error) console.error('Supabase submitPaymentProof error:', error)
        } catch (e) {
          console.error('Supabase submitPaymentProof exception:', e)
        }
      }

      globalState = {
        ...globalState,
        quotations: globalState.quotations.map((q) => (q.id === quoteId ? updatedQuote : q))
      }
      emitChange()
      return updatedQuote
    },

    confirmPaymentByAdmin: async ({
      quoteId,
      amountPaid,
      paymentMode = 'Bank Transfer (NEFT/RTGS)',
      transactionRef,
      staffNotes
    }) => {
      const quote = globalState.quotations.find((q) => q.id === quoteId)
      if (!quote) return null

      const confirmedPaid = Number(amountPaid) || quote.advanceRequired
      const isFull = confirmedPaid >= quote.netPayableAmount
      const updatedStatus = isFull ? 'full_paid' : 'advance_paid'

      const paymentVerification = {
        confirmedAmount: confirmedPaid,
        confirmedBy: globalState.currentUser?.name || 'Admin / Staff Desk',
        paymentMode,
        transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
        staffNotes: staffNotes || 'Payment verified in company account. Order confirmation released.',
        verifiedAt: new Date().toISOString()
      }

      const updatedQuote = {
        ...quote,
        advancePaid: confirmedPaid,
        status: updatedStatus,
        paymentConfirmedByAdmin: true,
        paymentVerification
      }

      const defaultDispatchItems = buildDefaultDispatchItems(quote, globalState.inventory)

      const newOrder = {
        id: `ord-${Date.now().toString().slice(-4)}`,
        orderNumber: `ORD-SUN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        quoteId: quote.id,
        customerId: quote.customerId,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        phone: quote.customerPhone || '+91 98140 12345',
        address: 'Customer Site Address, Punjab',
        capacityKw: quote.capacityKw,
        systemType: quote.systemType,
        connectionCategory: quote.connectionCategory,
        totalAmount: quote.netPayableAmount,
        advancePaid: confirmedPaid,
        balanceDue: Math.max(0, quote.netPayableAmount - confirmedPaid),
        dispatchStatus: 'pending_packing',
        dispatchDate: null,
        dispatchItems: defaultDispatchItems,
        installationStatus: 'scheduled',
        assignedCrew: 'Crew Alpha (Lead: Amit Singh)',
        scheduledDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        trackingStage: 'Payment Confirmed & Order Booked',
        trackingHistory: [
          {
            stage: 'Payment Confirmed & Order Booked',
            notes: `Verified by staff: ₹${confirmedPaid.toLocaleString()} received via ${paymentMode}. Order released to warehouse.`,
            updatedBy: globalState.currentUser?.name || 'Staff Accounts Desk',
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }

      const newInstallation = {
        id: `inst-${Date.now().toString().slice(-4)}`,
        orderId: newOrder.id,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.phone,
        address: newOrder.address,
        crewName: newOrder.assignedCrew,
        technicianCount: 5,
        scheduledDate: newOrder.scheduledDate,
        startTime: '08:30 AM',
        finishTime: null,
        systemSizeKw: newOrder.capacityKw,
        powerGenerationTestedKw: null,
        customerSigned: false,
        customerSignature: null,
        customerSignerName: '',
        handoverNotes: 'Kit packing initiated at warehouse. Awaiting dispatch.',
        photos: [],
        status: 'scheduled',
        completedAt: null
      }

      if (supabase) {
        try {
          await supabase
            .from('quotations')
            .update({
              advance_paid: confirmedPaid,
              status: updatedStatus,
              payment_confirmed_by_admin: true,
              payment_verification: paymentVerification
            })
            .eq('id', quoteId)

          const { error: ordErr } = await supabase.from('orders').insert([
            {
              id: newOrder.id,
              order_number: newOrder.orderNumber,
              quote_id: newOrder.quoteId,
              customer_id: newOrder.customerId,
              customer_name: newOrder.customerName,
              customer_email: newOrder.customerEmail,
              phone: newOrder.phone,
              address: newOrder.address,
              capacity_kw: newOrder.capacityKw,
              system_type: newOrder.systemType,
              connection_category: newOrder.connectionCategory,
              total_amount: newOrder.totalAmount,
              advance_paid: newOrder.advancePaid,
              balance_due: newOrder.balanceDue,
              dispatch_status: newOrder.dispatchStatus,
              installation_status: newOrder.installationStatus,
              assigned_crew: newOrder.assignedCrew,
              scheduled_date: newOrder.scheduledDate,
              tracking_stage: newOrder.trackingStage,
              tracking_history: newOrder.trackingHistory
            }
          ])
          if (ordErr) console.error('Supabase order insert error:', ordErr)

          await supabase.from('installations').insert([
            {
              id: newInstallation.id,
              order_id: newInstallation.orderId,
              customer_name: newInstallation.customerName,
              customer_email: newInstallation.customerEmail,
              customer_phone: newInstallation.customerPhone,
              address: newInstallation.address,
              crew_name: newInstallation.crewName,
              technician_count: newInstallation.technicianCount,
              scheduled_date: newInstallation.scheduledDate,
              system_size_kw: newInstallation.systemSizeKw,
              status: newInstallation.status
            }
          ])
        } catch (e) {
          console.error('Supabase order confirmation exception:', e)
        }
      }

      globalState = {
        ...globalState,
        quotations: globalState.quotations.map((q) => (q.id === quoteId ? updatedQuote : q)),
        orders: [newOrder, ...globalState.orders],
        installations: [newInstallation, ...globalState.installations]
      }
      emitChange()
      return newOrder
    },

    updateOrderTrackingStatus: async ({
      orderId,
      stage,
      notes,
      updatedBy,
      sendCustomerAlert = true,
      customBroadcastMessage
    }) => {
      const order = globalState.orders.find((o) => o.id === orderId)
      if (!order) return { success: false, error: 'Order not found' }

      const timestamp = new Date().toISOString()
      const notificationRecipient = order.customerEmail ? `${order.phone} / ${order.customerEmail}` : order.phone
      const broadcastText =
        customBroadcastMessage ||
        `SunPower Operations Alert: Your project for Order #${order.orderNumber} status progressed to "${stage}". Notes: ${notes || 'Site milestone updated.'}`

      const newUpdate = {
        stage,
        notes: notes || `Order stage progressed to ${stage}.`,
        updatedBy: updatedBy || globalState.currentUser?.name || 'Field Technician Lead',
        timestamp,
        notificationSent: sendCustomerAlert !== false,
        notificationChannel: 'WhatsApp + SMS + Email',
        notificationRecipient,
        broadcastMessage: broadcastText
      }

      let dispatchStatus = order.dispatchStatus
      let installationStatus = order.installationStatus

      if (stage.includes('Packing')) dispatchStatus = 'packed'
      if (stage.includes('Dispatched')) dispatchStatus = 'dispatched'
      if (stage.includes('Delivered')) dispatchStatus = 'delivered'
      if (stage.includes('Mounting') || stage.includes('Wiring')) installationStatus = 'in_progress'
      if (stage.includes('Complete') || stage.includes('Commissioned')) installationStatus = 'completed'

      const updatedHistory = [newUpdate, ...(order.trackingHistory || [])]
      const updatedOrder = {
        ...order,
        trackingStage: stage,
        dispatchStatus,
        installationStatus,
        trackingHistory: updatedHistory
      }

      if (supabase) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({
              tracking_stage: stage,
              dispatch_status: dispatchStatus,
              installation_status: installationStatus,
              tracking_history: updatedHistory
            })
            .eq('id', orderId)
          if (error) console.error('Supabase tracking update error:', error)
        } catch (e) {
          console.error('Supabase tracking update exception:', e)
        }
      }

      globalState = {
        ...globalState,
        orders: globalState.orders.map((o) => (o.id === orderId ? updatedOrder : o))
      }
      emitChange()
      return { success: true, order: updatedOrder, update: newUpdate }
    },

    // ==========================================
    // 7B. RECORD / UPDATE RECEIVED ORDER PAYMENT (TECH & ADMIN)
    // ==========================================
    recordOrderPayment: async ({
      orderId,
      amountReceived,
      paymentMode = 'Cash Collected On-Site',
      milestone = 'Milestone Payment',
      referenceNo,
      notes,
      updatedBy,
      sendCustomerReceipt = true
    }) => {
      const order = globalState.orders.find((o) => o.id === orderId)
      if (!order) return { success: false, error: 'Order not found' }

      const added = Number(amountReceived) || 0
      if (added <= 0) return { success: false, error: 'Please enter a valid positive payment amount.' }

      const currentAdvance = Number(order.advancePaid || 0)
      const totalAmount = Number(order.totalAmount || 0)
      const newAdvancePaid = currentAdvance + added
      const newBalanceDue = Math.max(0, totalAmount - newAdvancePaid)
      const isFull = newBalanceDue === 0
      const paymentStatus = isFull ? 'fully_paid' : 'partially_paid'

      const receiptNumber = `RCPT-SUN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      const timestamp = new Date().toISOString()
      const notificationRecipient = order.customerEmail ? `${order.phone} / ${order.customerEmail}` : order.phone

      const paymentEntry = {
        id: `pay-${Date.now().toString().slice(-4)}`,
        receiptNumber,
        amount: added,
        paymentMode,
        milestone,
        referenceNo: referenceNo || `TXN-${Date.now().toString().slice(-6)}`,
        notes: notes || 'Payment collected and logged.',
        updatedBy: updatedBy || globalState.currentUser?.name || 'Staff / Technician',
        timestamp,
        notificationSent: sendCustomerReceipt !== false,
        notificationChannel: 'WhatsApp + SMS + Email',
        notificationRecipient,
        totalPaidAfter: newAdvancePaid,
        balanceRemainingAfter: newBalanceDue
      }

      const trackingEntry = {
        stage: order.trackingStage || 'Payment Received',
        notes: `Payment of ₹${added.toLocaleString()} verified via ${paymentMode} (${milestone}, Receipt #${receiptNumber}, Ref: ${paymentEntry.referenceNo}). Total received: ₹${newAdvancePaid.toLocaleString()}, Outstanding balance: ₹${newBalanceDue.toLocaleString()}.`,
        updatedBy: paymentEntry.updatedBy,
        timestamp,
        notificationSent: sendCustomerReceipt !== false,
        notificationChannel: 'WhatsApp + SMS + Email',
        isPaymentMilestone: true,
        paymentRef: receiptNumber
      }

      const updatedPayments = [paymentEntry, ...(order.paymentHistory || [])]
      const updatedTracking = [trackingEntry, ...(order.trackingHistory || [])]

      const updatedOrder = {
        ...order,
        advancePaid: newAdvancePaid,
        balanceDue: newBalanceDue,
        paymentStatus,
        paymentHistory: updatedPayments,
        trackingHistory: updatedTracking
      }

      if (supabase) {
        try {
          await supabase
            .from('orders')
            .update({
              advance_paid: newAdvancePaid,
              balance_due: newBalanceDue,
              tracking_history: updatedTracking
            })
            .eq('id', orderId)
        } catch (e) {
          console.warn('Supabase recordOrderPayment update note:', e)
        }
      }

      globalState = {
        ...globalState,
        orders: globalState.orders.map((o) => (o.id === orderId ? updatedOrder : o))
      }
      emitChange()
      return { success: true, order: updatedOrder, payment: paymentEntry }
    },

    // ==========================================
    // 7C. MARK ORDER COMPLETED (SEPARATING PENDING VS COMPLETED)
    // ==========================================
    markOrderCompleted: async ({ orderId, completionNotes, updatedBy }) => {
      const order = globalState.orders.find((o) => o.id === orderId)
      if (!order) return { success: false, error: 'Order not found' }

      const trackingEntry = {
        stage: 'Installation Completed & Handed Over',
        notes: completionNotes || 'All rooftop installation, grid connection and commissioning tasks completed.',
        updatedBy: updatedBy || globalState.currentUser?.name || 'Operations Lead',
        timestamp: new Date().toISOString()
      }

      const updatedTracking = [trackingEntry, ...(order.trackingHistory || [])]
      const updatedOrder = {
        ...order,
        installationStatus: 'completed',
        dispatchStatus: 'delivered',
        trackingStage: 'Installation Completed & Handed Over',
        trackingHistory: updatedTracking
      }

      if (supabase) {
        try {
          await supabase
            .from('orders')
            .update({
              installation_status: 'completed',
              dispatch_status: 'delivered',
              tracking_stage: 'Installation Completed & Handed Over',
              tracking_history: updatedTracking
            })
            .eq('id', orderId)
        } catch (e) {
          console.warn('Supabase markOrderCompleted update note:', e)
        }
      }

      globalState = {
        ...globalState,
        orders: globalState.orders.map((o) => (o.id === orderId ? updatedOrder : o))
      }
      emitChange()
      return { success: true, order: updatedOrder }
    },

    updateOrderDispatchItems: async ({ orderId, dispatchItems }) => {
      const order = globalState.orders.find((o) => o.id === orderId)
      if (!order) return { success: false, error: 'Order not found' }

      const updatedOrder = {
        ...order,
        dispatchItems
      }

      if (supabase) {
        try {
          await supabase
            .from('orders')
            .update({
              dispatch_items: dispatchItems
            })
            .eq('id', orderId)
        } catch (e) {
          console.warn('Supabase updateOrderDispatchItems note:', e)
        }
      }

      globalState = {
        ...globalState,
        orders: globalState.orders.map((o) => (o.id === orderId ? updatedOrder : o))
      }
      emitChange()
      return { success: true, order: updatedOrder }
    },

    registerScannedSerial: async (serialData) => {
      const rawSerial = (serialData.serialNumber || '').trim().toUpperCase()
      if (!rawSerial) {
        return { success: false, error: 'Serial number cannot be blank.' }
      }

      // Check serial uniqueness across ALL customers and orders
      const targetCustomer = (serialData.customerName || '').trim().toLowerCase()

      const existingSerial = (globalState.serials || []).find(
        (s) => s.serialNumber && s.serialNumber.trim().toUpperCase() === rawSerial
      )
      const existingWarranty = (globalState.warranties || []).find(
        (w) => w.serialNumber && w.serialNumber.trim().toUpperCase() === rawSerial
      )

      if (existingSerial) {
        const assignedCustomer = (existingSerial.customerName || '').trim()
        if (assignedCustomer.toLowerCase() !== targetCustomer) {
          return {
            success: false,
            error: `Registration Blocked: Serial number "${rawSerial}" is already assigned to customer "${assignedCustomer}" (Order #${existingSerial.orderId || 'N/A'}). Each product serial number must be uniquely linked to one customer only.`
          }
        } else if (existingSerial.orderId && existingSerial.orderId !== serialData.orderId) {
          return {
            success: false,
            error: `Registration Blocked: Serial number "${rawSerial}" is already assigned to customer under Order #${existingSerial.orderId}. A product cannot be scanned for multiple orders.`
          }
        } else {
          return {
            success: false,
            error: `Serial number "${rawSerial}" has already been scanned for this order dispatch.`
          }
        }
      }

      if (existingWarranty) {
        const assignedCustomer = (existingWarranty.customerName || '').trim()
        if (assignedCustomer.toLowerCase() !== targetCustomer) {
          return {
            success: false,
            error: `Registration Blocked: Serial number "${rawSerial}" is already registered in active warranties for customer "${assignedCustomer}". Each product serial number must be uniquely linked to one customer only.`
          }
        }
      }

      const warrantyYears = serialData.category === 'panel' ? 20 : (serialData.warrantyYears || 2)
      const todayStr = new Date().toISOString().slice(0, 10)

      const newSerial = {
        id: `sn-${Date.now().toString().slice(-4)}`,
        serialNumber: rawSerial,
        itemName: serialData.itemName,
        category: serialData.category,
        orderId: serialData.orderId,
        customerName: serialData.customerName,
        customerEmail: serialData.customerEmail || '',
        status: 'scanned_for_dispatch',
        warrantyYears,
        warrantyStartDate: todayStr,
        warrantyEndDate: new Date(Date.now() + warrantyYears * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10)
      }

      if (supabase) {
        try {
          await supabase.from('serial_numbers').insert([
            {
              id: newSerial.id,
              serial_number: newSerial.serialNumber,
              item_name: newSerial.itemName,
              category: newSerial.category,
              order_id: newSerial.orderId,
              customer_name: newSerial.customerName,
              status: newSerial.status,
              warranty_years: newSerial.warrantyYears,
              warranty_start_date: newSerial.warrantyStartDate,
              warranty_end_date: newSerial.warrantyEndDate
            }
          ])
        } catch (e) {
          console.error('Supabase serial insert exception:', e)
        }
      }

      globalState = {
        ...globalState,
        serials: [newSerial, ...globalState.serials]
      }
      emitChange()
      return { success: true, serial: newSerial }
    },

    dispatchOrderTruck: async (orderId) => {
      const order = globalState.orders.find((o) => o.id === orderId)
      if (!order) return { success: false, error: 'Order not found' }

      const dispatchItems = (order.dispatchItems && order.dispatchItems.length > 0)
        ? order.dispatchItems
        : buildDefaultDispatchItems(order, globalState.inventory)

      // 1. Strict Warehouse Inventory Stock Verification
      const stockErrors = []
      const currentInventory = [...(globalState.inventory || [])]

      for (const item of dispatchItems) {
        const requiredQty = Number(item.qty) || 1
        const invItem = currentInventory.find(
          (inv) => (item.sku && inv.sku === item.sku) || inv.name.toLowerCase() === (item.name || '').toLowerCase()
        )
        if (!invItem) {
          stockErrors.push(`"${item.name}" (SKU: ${item.sku || 'N/A'}) does not exist in warehouse inventory catalog.`)
        } else if ((invItem.stockQty || 0) < requiredQty) {
          stockErrors.push(`Insufficient stock for "${item.name}": Only ${invItem.stockQty || 0} unit(s) in warehouse, but ${requiredQty} required to dispatch.`)
        }
      }

      if (stockErrors.length > 0) {
        return {
          success: false,
          error: `Dispatch Blocked by Warehouse Stock Verification:\n• ${stockErrors.join('\n• ')}`
        }
      }

      // 2. Deduct inventory quantities upon confirmed dispatch
      const updatedInventory = currentInventory.map((inv) => {
        const matchedItem = dispatchItems.find(
          (item) => (item.sku && inv.sku === item.sku) || inv.name.toLowerCase() === (item.name || '').toLowerCase()
        )
        if (matchedItem) {
          const qtyToDeduct = Number(matchedItem.qty) || 1
          return {
            ...inv,
            stockQty: Math.max(0, (inv.stockQty || 0) - qtyToDeduct)
          }
        }
        return inv
      })

      // 3. Mark dispatch date as TODAY (warranty clock starts from dispatch date)
      const todayStr = new Date().toISOString().slice(0, 10)

      const updatedSerials = globalState.serials.map((s) => {
        if (s.orderId === orderId) {
          return {
            ...s,
            status: 'delivered',
            dispatchDate: todayStr,
            warrantyStartDate: todayStr,
            warrantyEndDate: new Date(
              Date.now() + (s.warrantyYears || 2) * 365.25 * 24 * 3600 * 1000
            )
              .toISOString()
              .slice(0, 10)
          }
        }
        return s
      })

      const orderScannedSerials = globalState.serials.filter((s) => s.orderId === orderId)
      const newWarranties = []

      // Add scanned serial items
      orderScannedSerials.forEach((s) => {
        newWarranties.push({
          id: `war-${Date.now()}-${s.id}`,
          serialNumber: s.serialNumber,
          equipmentName: s.itemName,
          equipmentType: (s.category || 'Inverter').charAt(0).toUpperCase() + (s.category || 'Inverter').slice(1),
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.phone,
          dispatchDate: todayStr,
          startDate: todayStr,
          endDate: new Date(Date.now() + (s.warrantyYears || 2) * 365.25 * 24 * 3600 * 1000)
            .toISOString()
            .slice(0, 10),
          warrantyYears: s.warrantyYears || 2,
          isActive: true,
          coverage: `${s.warrantyYears || 2}-Year 100% Free replacement of parts & on-site service labour.`
        })
      })

      // Add remaining dispatch items (solar panels, mounting structure, cabling, earthing)
      dispatchItems.forEach((item, idx) => {
        const alreadyCovered = orderScannedSerials.some((s) => s.itemName.toLowerCase() === item.name.toLowerCase())
        if (!alreadyCovered) {
          const years = item.warrantyYears || (item.category === 'panel' ? 20 : 5)
          const fallbackSerial = `${item.sku || 'LOT'}-${order.orderNumber.replace(/[^A-Za-z0-9]/g, '')}-${idx + 1}`
          newWarranties.push({
            id: `war-${Date.now()}-di-${idx}`,
            serialNumber: fallbackSerial,
            equipmentName: `${item.name} (${item.qty} ${item.unit || 'Nos'})`,
            equipmentType: (item.category || 'Component').charAt(0).toUpperCase() + (item.category || 'Component').slice(1),
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.phone,
            dispatchDate: todayStr,
            startDate: todayStr,
            endDate: new Date(Date.now() + years * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            warrantyYears: years,
            isActive: true,
            coverage: `${years}-Year OEM warranty against manufacturing faults and performance loss.`
          })
        }
      })

      const trackingUpdate = {
        stage: 'Dispatched on Truck (Serials Scanned & Stock Allocated)',
        notes: `Warehouse dispatch confirmed on ${todayStr}. All items verified in inventory and stock deducted. Warranty clocks active from dispatch date.`,
        updatedBy: globalState.currentUser?.name || 'Warehouse Dispatch Manager',
        timestamp: new Date().toISOString()
      }

      const updatedHistory = [trackingUpdate, ...(order.trackingHistory || [])]

      if (supabase) {
        try {
          await supabase
            .from('orders')
            .update({
              dispatch_status: 'delivered',
              dispatch_date: todayStr,
              dispatch_items: dispatchItems,
              installation_status: 'in_progress',
              tracking_stage: 'Dispatched on Truck (Serials Scanned & Stock Allocated)',
              tracking_history: updatedHistory
            })
            .eq('id', orderId)

          if (newWarranties.length > 0) {
            await supabase.from('warranties').insert(
              newWarranties.map((w) => ({
                id: w.id,
                serial_number: w.serialNumber,
                equipment_name: w.equipmentName,
                equipment_type: w.equipmentType,
                customer_name: w.customerName,
                customer_email: w.customerEmail,
                customer_phone: w.customerPhone,
                start_date: w.startDate,
                end_date: w.endDate,
                warranty_years: w.warrantyYears,
                is_active: w.isActive,
                coverage: w.coverage
              }))
            )
          }
        } catch (e) {
          console.error('Supabase dispatchOrderTruck exception:', e)
        }
      }

      globalState = {
        ...globalState,
        inventory: updatedInventory,
        orders: globalState.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                dispatchStatus: 'delivered',
                dispatchDate: todayStr,
                dispatchItems,
                installationStatus: 'in_progress',
                trackingStage: 'Dispatched on Truck (Serials Scanned & Stock Allocated)',
                trackingHistory: updatedHistory
              }
            : o
        ),
        serials: updatedSerials,
        warranties: [...newWarranties, ...globalState.warranties]
      }
      emitChange()
      return { success: true, warrantiesCount: newWarranties.length }
    },

    submitRoofHandover: async (instId, handoverPayload) => {
      const inst = globalState.installations.find((i) => i.id === instId)
      if (!inst) return

      const updated = {
        ...inst,
        startTime: handoverPayload.startTime || inst.startTime,
        finishTime: handoverPayload.finishTime || '05:00 PM',
        systemSizeKw: Number(handoverPayload.systemSizeKw) || inst.systemSizeKw,
        powerGenerationTestedKw: Number(handoverPayload.powerGenerationTestedKw) || 3.15,
        customerSigned: true,
        customerSignature: handoverPayload.signatureSvg,
        customerSignerName: handoverPayload.signerName || inst.customerName,
        handoverNotes: handoverPayload.notes || 'Installation completed and accepted by customer.',
        photos:
          handoverPayload.photos && handoverPayload.photos.length > 0
            ? handoverPayload.photos
            : [
                {
                  url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
                  label: 'Completed Rooftop Installation'
                },
                {
                  url: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80',
                  label: 'Inverter & Safety Distribution Boxes'
                }
              ],
        status: 'signed_off',
        completedAt: new Date().toISOString()
      }

      const trackingUpdate = {
        stage: 'Commissioned & Handover Complete',
        notes: `System fully commissioned. Output tested: ${updated.powerGenerationTestedKw} kW. Customer digital certificate signed.`,
        updatedBy: inst.crewName,
        timestamp: new Date().toISOString()
      }

      if (supabase) {
        try {
          await supabase
            .from('installations')
            .update({
              customer_signed: true,
              customer_signature: handoverPayload.signatureSvg,
              customer_signer_name: updated.customerSignerName,
              finish_time: updated.finishTime,
              power_generation_tested_kw: updated.powerGenerationTestedKw,
              handover_notes: updated.handoverNotes,
              photos: updated.photos,
              status: 'signed_off',
              completed_at: updated.completedAt
            })
            .eq('id', instId)

          const matchedOrder = globalState.orders.find((o) => o.id === inst.orderId)
          if (matchedOrder) {
            await supabase
              .from('orders')
              .update({
                installation_status: 'completed',
                tracking_stage: 'Commissioned & Handover Complete',
                tracking_history: [trackingUpdate, ...(matchedOrder.trackingHistory || [])]
              })
              .eq('id', inst.orderId)
          }
        } catch (e) {
          console.error('Supabase submitRoofHandover exception:', e)
        }
      }

      const orders = globalState.orders.map((o) =>
        o.id === inst.orderId
          ? {
              ...o,
              installationStatus: 'completed',
              trackingStage: 'Commissioned & Handover Complete',
              trackingHistory: [trackingUpdate, ...(o.trackingHistory || [])]
            }
          : o
      )

      globalState = {
        ...globalState,
        installations: globalState.installations.map((i) => (i.id === instId ? updated : i)),
        orders
      }
      emitChange()
    },

    fileServiceTicket: async (ticketPayload) => {
      const serialNum = (ticketPayload.serialNumber || '').trim().toUpperCase()
      const matchedSerial = globalState.serials.find(
        (s) => s.serialNumber && s.serialNumber.toUpperCase() === serialNum
      )

      let isUnderWarranty = true
      let estimatedCost = 0

      if (matchedSerial) {
        const today = new Date().toISOString().slice(0, 10)
        isUnderWarranty = matchedSerial.warrantyEndDate >= today
      } else {
        const matchedWar = globalState.warranties.find(
          (w) => w.serialNumber && w.serialNumber.toUpperCase() === serialNum
        )
        if (matchedWar) {
          isUnderWarranty = matchedWar.isActive
        }
      }

      if (!isUnderWarranty) {
        estimatedCost = 1200 + (ticketPayload.partsEstimate ? Number(ticketPayload.partsEstimate) : 4500)
      } else {
        estimatedCost = 0
      }

      const newTicket = {
        id: `tkt-${Date.now().toString().slice(-4)}`,
        ticketNumber: `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        customerName: ticketPayload.customerName,
        customerEmail: ticketPayload.customerEmail || globalState.currentUser?.email || '',
        phone: ticketPayload.phone,
        serialNumber: serialNum,
        equipmentType: ticketPayload.equipmentType || 'Inverter',
        reportedItem: ticketPayload.reportedItem || ticketPayload.equipmentType || 'Solar System Component',
        faultCode: ticketPayload.faultCode || 'E04 Rainy Season Breakdown',
        description: ticketPayload.description,
        troubleshootingDifficulty: ticketPayload.troubleshootingDifficulty || false,
        difficultyNotes: ticketPayload.difficultyNotes || '',
        needsFollowUp: ticketPayload.needsFollowUp || false,
        isUnderWarranty,
        estimatedCost,
        technicianAssigned: ticketPayload.technicianAssigned || 'Amit Singh (Lead Tech)',
        raisedBy: ticketPayload.raisedBy || (globalState.currentUser?.role === 'customer' ? 'Customer' : 'SunPower Operations Desk'),
        status: 'open',
        resolutionNotes: isUnderWarranty
          ? 'Unit is UNDER WARRANTY (Free replacement parts & on-site service dispatched: ₹0).'
          : `Warranty expired. Automated bill raised: Parts + ₹1,200 technician labour (Total: ₹${estimatedCost.toLocaleString()}).`,
        createdAt: new Date().toISOString()
      }

      if (supabase) {
        try {
          await supabase.from('service_tickets').insert([
            {
              id: newTicket.id,
              ticket_number: newTicket.ticketNumber,
              customer_name: newTicket.customerName,
              customer_email: newTicket.customerEmail,
              phone: newTicket.phone,
              serial_number: newTicket.serialNumber,
              equipment_type: newTicket.equipmentType,
              fault_code: newTicket.faultCode,
              description: newTicket.description,
              is_under_warranty: newTicket.isUnderWarranty,
              estimated_cost: newTicket.estimatedCost,
              technician_assigned: newTicket.technicianAssigned,
              status: newTicket.status,
              resolution_notes: newTicket.resolutionNotes
            }
          ])
        } catch (e) {
          console.error('Supabase ticket insertion exception:', e)
        }
      }

      globalState = {
        ...globalState,
        tickets: [newTicket, ...globalState.tickets]
      }
      emitChange()
      return newTicket
    },

    raiseTicketOnBehalfOfCustomer: async (payload) => {
      const ticket = await solarOpsStore.fileServiceTicket({
        ...payload,
        raisedBy: `${globalState.currentUser?.name || 'Admin Operations Desk'} (Raised on Behalf of Customer)`
      })
      return ticket
    },

    resolveServiceTicket: async (ticketId, resolutionNotes) => {
      if (supabase) {
        try {
          await supabase
            .from('service_tickets')
            .update({
              status: 'resolved',
              resolution_notes:
                resolutionNotes || 'Customer tested and confirmed system functioning.',
              resolved_at: new Date().toISOString()
            })
            .eq('id', ticketId)
        } catch (e) {
          console.error('Supabase resolve ticket exception:', e)
        }
      }

      globalState = {
        ...globalState,
        tickets: globalState.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: 'resolved',
                resolutionNotes:
                  resolutionNotes || 'Customer tested and confirmed system functioning.'
              }
            : t
        )
      }
      emitChange()
    },

    // Seed / Sync all initial data directly to Supabase PostgreSQL
    syncAllToSupabase: async () => {
      if (!supabase) return { success: false, error: 'Supabase client is not connected.' }

      try {
        // 1. Profiles
        if (globalState.registeredUsers.length > 0) {
          const { error: pErr } = await supabase.from('profiles').upsert(
            globalState.registeredUsers.map((u) => ({
              id: u.id,
              full_name: u.name,
              email: u.email,
              password: u.password,
              phone: u.phone,
              address: u.address,
              city: u.city || 'Punjab',
              connection_category: u.connectionCategory || 'Residential',
              connection_type: u.connectionType || 'Residential 1-Phase 230V',
              discom_account: u.discomAccount || '',
              role: u.role || 'customer'
            }))
          )
          if (pErr) throw pErr
        }

        // 2. Packages
        if (globalState.packages.length > 0) {
          const { error: pkgErr } = await supabase.from('packages').upsert(
            globalState.packages.map((p) => ({
              id: p.id,
              name: p.name,
              system_type: p.systemType,
              capacity_kw: p.capacityKw,
              connection_category: p.connectionCategory || 'Residential',
              base_price: p.basePrice,
              subsidy_amount: p.subsidyAmount || 0,
              description: p.description,
              bom: p.bom
            }))
          )
          if (pkgErr) throw pkgErr
        }

        // 3. Enquiries
        if (globalState.enquiries.length > 0) {
          const { error: eErr } = await supabase.from('enquiries').upsert(
            globalState.enquiries.map((e) => ({
              id: e.id,
              customer_id: e.customerId,
              customer_name: e.customerName,
              phone: e.phone,
              email: e.email,
              address: e.address,
              city: e.city,
              connection_category: e.connectionCategory,
              connection_type: e.connectionType,
              sanctioned_load_kw: e.sanctionedLoadKw,
              roof_type: e.roofType,
              monthly_electricity_bill: e.monthlyElectricityBill,
              roof_area_sqft: e.roofAreaSqft,
              system_preference: e.systemPreference,
              subsidy_interested: e.subsidyInterested,
              discom_account: e.discomAccount,
              status: e.status,
              notes: e.notes
            }))
          )
          if (eErr) throw eErr
        }

        // 4. Surveys
        if (globalState.surveys.length > 0) {
          const { error: sErr } = await supabase.from('site_surveys').upsert(
            globalState.surveys.map((s) => ({
              id: s.id,
              enquiry_id: s.enquiryId,
              customer_name: s.customerName,
              customer_email: s.customerEmail,
              customer_phone: s.customerPhone,
              technician_name: s.technicianName,
              survey_date: s.surveyDate,
              time_slot: s.timeSlot,
              shadow_free_roof_sqft: s.shadowFreeRoofSqft,
              monthly_bill: s.monthlyBill,
              grid_connection_type: s.gridConnectionType,
              roof_direction: s.roofDirection,
              roof_tilt_degrees: s.roofTiltDegrees,
              cable_run_distance_meters: s.cableRunDistanceMeters,
              structural_integrity: s.structuralIntegrity,
              status: s.status,
              disapproval_reason: s.disapprovalReason,
              surveyor_notes: s.surveyorNotes
            }))
          )
          if (sErr) throw sErr
        }

        // 5. Quotations
        if (globalState.quotations.length > 0) {
          const { error: qErr } = await supabase.from('quotations').upsert(
            globalState.quotations.map((q) => ({
              id: q.id,
              quote_number: q.quoteNumber,
              enquiry_id: q.enquiryId,
              customer_id: q.customerId,
              customer_name: q.customerName,
              customer_email: q.customerEmail,
              customer_phone: q.customerPhone,
              package_id: q.packageId,
              capacity_kw: q.capacityKw,
              system_type: q.systemType,
              connection_category: q.connectionCategory,
              subtotal_amount: q.subtotalAmount,
              subsidy_discount: q.subsidyDiscount,
              net_payable_amount: q.netPayableAmount,
              advance_required: q.advanceRequired,
              advance_paid: q.advancePaid,
              status: q.status,
              payment_details: q.paymentDetails,
              payment_confirmed_by_admin: q.paymentConfirmedByAdmin,
              payment_verification: q.paymentVerification,
              valid_until: q.validUntil,
              items: q.items
            }))
          )
          if (qErr) throw qErr
        }

        // 6. Orders
        if (globalState.orders.length > 0) {
          const { error: oErr } = await supabase.from('orders').upsert(
            globalState.orders.map((o) => ({
              id: o.id,
              order_number: o.orderNumber,
              quote_id: o.quoteId,
              customer_id: o.customerId,
              customer_name: o.customerName,
              customer_email: o.customerEmail,
              phone: o.phone,
              address: o.address,
              capacity_kw: o.capacityKw,
              system_type: o.systemType,
              connection_category: o.connectionCategory,
              total_amount: o.totalAmount,
              advance_paid: o.advancePaid,
              balance_due: o.balanceDue,
              dispatch_status: o.dispatchStatus,
              installation_status: o.installationStatus,
              assigned_crew: o.assignedCrew,
              scheduled_date: o.scheduledDate,
              tracking_stage: o.trackingStage,
              tracking_history: o.trackingHistory
            }))
          )
          if (oErr) throw oErr
        }

        return { success: true }
      } catch (err) {
        console.error('syncAllToSupabase error:', err)
        return { success: false, error: err.message }
      }
    },

    resetDemoData: () => {
      globalState = {
        ...defaultState,
        currentUser: null
      }
      localStorage.removeItem(STORAGE_KEY)
      emitChange()
    }
  }
}
