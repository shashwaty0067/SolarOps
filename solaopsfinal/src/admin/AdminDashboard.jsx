import React, { useState } from 'react'
import { useSolarStore, buildDefaultDispatchItems, computeLiveFinancials, generateWhatsAppReceiptLink, generateWhatsAppTrackingLink } from '../lib/store'
import { StatusBadge } from '../components/StatusBadge'
import { SignaturePad } from '../components/SignaturePad'

export function AdminDashboard({ onGoHome }) {
  const {
    registeredUsers,
    enquiries,
    surveys,
    quotations,
    orders,
    inventory,
    serials,
    installations,
    warranties,
    tickets,
    profitability,
    technicians,
    packages,
    createOrUpdateSurvey,
    adminOverrideSurveyFeasibility,
    createTechnicalStaff,
    assignTechnicianToEnquiry,
    generateQuotation,
    registerScannedSerial,
    dispatchOrderTruck,
    updateOrderDispatchItems,
    raiseTicketOnBehalfOfCustomer,
    fileServiceTicket,
    submitRoofHandover,
    resolveServiceTicket,
    getTechnicianAvailability,
    autoAssignFreeTechnician,
    confirmPaymentByAdmin,
    updateOrderTrackingStatus,
    recordOrderPayment,
    markOrderCompleted,
    currentUser,
    logout
  } = useSolarStore()

  // Real-time dynamic financials strictly calculated at current time
  const liveFinancials = computeLiveFinancials(orders, inventory, quotations, technicians, tickets)
  const [viewingPaymentOrder, setViewingPaymentOrder] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const [activeTab, setActiveTab] = useState('surveys') // default to surveys or customers
  const [selectedSurveyEnquiry, setSelectedSurveyEnquiry] = useState(null)
  const [surveyDecision, setSurveyDecision] = useState('approved') // 'approved' | 'rejected'
  const [techAssignMode, setTechAssignMode] = useState('auto') // 'auto' | 'manual'
  const [autoAssignSuccessMsg, setAutoAssignSuccessMsg] = useState('')

  // New Technical Staff Creation State (Requirement 1)
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Lead Site Engineer',
    crew: 'Crew Alpha',
    phone: '',
    employeeId: '',
    skills: 'Site Feasibility, RCC Mountings, MPPT Inverter Sync'
  })
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('')
  const [staffErrorMsg, setStaffErrorMsg] = useState('')

  // Technical Staff IDP & Showcase Modal State
  const [selectedStaffForIdp, setSelectedStaffForIdp] = useState(null)
  const [staffIdpViewSide, setStaffIdpViewSide] = useState('front')

  // Admin Overwrite Feasibility State
  const [selectedSurveyForOverride, setSelectedSurveyForOverride] = useState(null)
  const [overrideStatus, setOverrideStatus] = useState('approved')
  const [overrideReason, setOverrideReason] = useState('')
  const [surveyFormData, setSurveyFormData] = useState({
    technicianName: 'Amit Singh (Lead Tech)',
    surveyDate: new Date().toISOString().slice(0, 10),
    timeSlot: 'Morning (09:00 AM - 01:00 PM)',
    shadowFreeRoofSqft: 400,
    monthlyBill: 4200,
    gridConnectionType: 'Residential 1-Phase 230V',
    roofDirection: 'South (Optimal 180°)',
    roofTiltDegrees: 22,
    cableRunDistanceMeters: 20,
    structuralIntegrity: 'Reinforced Concrete (RCC) - Excellent',
    disapprovalReason: '',
    surveyorNotes: 'Shadow-free rooftop confirmed. Clear cable route to main distribution box.'
  })

  // Quotation form (Filtered strictly to approved surveys - Point 3)
  const [selectedEnquiryForQuote, setSelectedEnquiryForQuote] = useState(null)
  const [quotePackageId, setQuotePackageId] = useState('pkg-3kw-ongrid')

  // Admin Payment Confirmation Modal (Point 4)
  const [selectedQuoteForAdminPay, setSelectedQuoteForAdminPay] = useState(null)
  const [adminPaymentForm, setAdminPaymentForm] = useState({
    amountPaid: '',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionRef: '',
    staffNotes: 'Payment verified in company account. Order released to warehouse.'
  })

  // Live Order Tracking Updater Modal (Point 5)
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null)
  const [trackingForm, setTrackingForm] = useState({
    stage: 'Kit BOM Packed at Warehouse',
    notes: '',
    updatedBy: 'Amit Singh (Lead Tech)',
    sendCustomerAlert: true,
    customBroadcastMessage: ''
  })

  // Inventory Serial Scanning Modal / Form
  const [selectedOrderForScan, setSelectedOrderForScan] = useState(null)
  const [scanSerialInput, setScanSerialInput] = useState('')
  const [scanCategory, setScanCategory] = useState('inverter')
  const [scanItemName, setScanItemName] = useState('3.3 kW Dual-MPPT Solar Grid-Tie Inverter')

  // Installation Mobile/Tablet Sign-off Modal
  const [selectedInstForSign, setSelectedInstForSign] = useState(null)
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [handoverFormData, setHandoverFormData] = useState({
    startTime: '08:30 AM',
    finishTime: '04:45 PM',
    systemSizeKw: 3.0,
    powerGenerationTestedKw: 3.18,
    signerName: '',
    notes: 'Earthing pit resistance < 1.8 Ohms. Dual MPPT sync checked. Mobile monitoring app configured on homeowner phone.'
  })

  // Warranty & Serial quick search
  const [serialSearchQuery, setSerialSearchQuery] = useState('')
  const [customerWarrantyFilter, setCustomerWarrantyFilter] = useState('all')

  // Dispatch Items customization & unique serial scanning
  const [editingDispatchItemsOrder, setEditingDispatchItemsOrder] = useState(null)
  const [dispatchItemDrafts, setDispatchItemDrafts] = useState([])
  const [addInventorySkuSelect, setAddInventorySkuSelect] = useState('')
  const [addInventoryQty, setAddInventoryQty] = useState(1)
  const [scanErrorMessage, setScanErrorMessage] = useState('')
  const [scanSuccessMessage, setScanSuccessMessage] = useState('')

  // Raise issue on behalf of customer modal
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState(false)
  const [raiseTicketSuccessMsg, setRaiseTicketSuccessMsg] = useState('')
  const [raiseTicketForm, setRaiseTicketForm] = useState({
    customerEmail: '',
    customerName: '',
    phone: '',
    selectedEquipment: '',
    serialNumber: '',
    equipmentType: 'Inverter',
    faultCode: 'E04 - Heavy Rain Grid Isolation Error',
    description: '',
    troubleshootingDifficulty: true,
    difficultyNotes: '',
    technicianAssigned: 'Amit Singh (Lead Tech)'
  })

  // Point 6: Auto-Assign available technician with no conflicting installations
  const handleAutoAssignTech = () => {
    const freeTech = autoAssignFreeTechnician(surveyFormData.surveyDate, surveyFormData.timeSlot)
    if (freeTech) {
      setSurveyFormData((prev) => ({
        ...prev,
        technicianName: `${freeTech.name} (${freeTech.crew})`
      }))
      setAutoAssignSuccessMsg(`✓ Auto-assigned ${freeTech.name} (${freeTech.crew}) — Available in this slot!`)
      setTimeout(() => setAutoAssignSuccessMsg(''), 4500)
    } else {
      alert(`All technicians are currently busy or deployed on active installations for ${surveyFormData.timeSlot} on ${surveyFormData.surveyDate}. Please select another time slot or date.`)
    }
  }

  // Handle Dispatching Site Surveyor (Site approval will be PENDING, site surveyor will approve it)
  const handleDispatchSurveyor = async (e) => {
    e.preventDefault()
    if (!selectedSurveyEnquiry) return

    // Check if chosen technician is busy in this slot
    const avail = getTechnicianAvailability(surveyFormData.surveyDate, surveyFormData.timeSlot)
    const techCheck = avail.find((t) => surveyFormData.technicianName?.includes(t.name))
    if (techCheck && techCheck.isBusy) {
      alert(`Assignment Blocked: ${techCheck.name} is currently busy ("${techCheck.currentAssignment}") during ${surveyFormData.timeSlot} on ${surveyFormData.surveyDate}. You must choose an available technician or pick another time slot.`)
      return
    }

    const res = await assignTechnicianToEnquiry({
      enquiryId: selectedSurveyEnquiry.id,
      technicianName: surveyFormData.technicianName,
      surveyDate: surveyFormData.surveyDate,
      timeSlot: surveyFormData.timeSlot
    })

    if (res.success) {
      alert(`✓ Site Surveyor ${surveyFormData.technicianName} successfully dispatched for ${surveyFormData.surveyDate} [${surveyFormData.timeSlot}]. Site feasibility approval is now PENDING on-site surveyor inspection.`)
      setSelectedSurveyEnquiry(null)
    } else {
      alert(res.error || 'Failed to dispatch technician.')
    }
  }

  // Handle Technical Staff Creation (Requirement 1)
  const handleCreateStaff = async (e) => {
    e.preventDefault()
    setStaffSuccessMsg('')
    setStaffErrorMsg('')

    const res = await createTechnicalStaff(newStaffForm)
    if (res.success) {
      setStaffSuccessMsg(`✓ Successfully created technical staff account for ${res.technician.name}! Login ID: ${res.technician.email} | Role: ${res.technician.role}`)
      setNewStaffForm({
        name: '',
        email: '',
        password: '',
        role: 'Lead Site Engineer',
        crew: 'Crew Alpha',
        phone: '',
        employeeId: '',
        skills: 'Site Feasibility, RCC Mountings, MPPT Inverter Sync'
      })
      setTimeout(() => setStaffSuccessMsg(''), 7000)
    } else {
      setStaffErrorMsg(res.error)
    }
  }

  // Handle Quote Generation (Point 3: Locked behind survey approval)
  const handleGenerateQuote = (e) => {
    e.preventDefault()
    if (!selectedEnquiryForQuote) return
    generateQuotation({
      enquiryId: selectedEnquiryForQuote.id,
      customerName: selectedEnquiryForQuote.customerName,
      packageId: quotePackageId
    })
    setSelectedEnquiryForQuote(null)
  }

  // Point 4: Admin Payment Confirmation Handler
  const handleAdminConfirmPayment = (e) => {
    e.preventDefault()
    if (!selectedQuoteForAdminPay) return
    confirmPaymentByAdmin({
      quoteId: selectedQuoteForAdminPay.id,
      amountPaid: adminPaymentForm.amountPaid || selectedQuoteForAdminPay.advanceRequired,
      paymentMode: adminPaymentForm.paymentMode,
      transactionRef: adminPaymentForm.transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      staffNotes: adminPaymentForm.staffNotes
    })
    setSelectedQuoteForAdminPay(null)
    alert('✓ Payment confirmed! Order confirmed, warehouse staging initiated, and customer notified.')
    setActiveTab('orders')
  }

  // Point 5: Live Order Tracking Update Handler
  const handleSaveTrackingUpdate = (e) => {
    e.preventDefault()
    if (!selectedOrderForTracking) return
    updateOrderTrackingStatus({
      orderId: selectedOrderForTracking.id,
      stage: trackingForm.stage,
      notes: trackingForm.notes,
      updatedBy: trackingForm.updatedBy,
      sendCustomerAlert: trackingForm.sendCustomerAlert,
      customBroadcastMessage: trackingForm.customBroadcastMessage
    })
    setSelectedOrderForTracking(null)
    alert(`✓ Order tracking status updated to: "${trackingForm.stage}"` + (trackingForm.sendCustomerAlert ? ' & alert dispatched via WhatsApp/SMS!' : ''))
  }

  // Handle Serial scanning before truck leaves
  const handleAddScannedSerial = async (e) => {
    e.preventDefault()
    setScanErrorMessage('')
    setScanSuccessMessage('')
    if (!scanSerialInput.trim()) return

    const res = await registerScannedSerial({
      orderId: selectedOrderForScan?.id || null,
      customerName: selectedOrderForScan?.customerName || 'Warehouse Staging',
      customerEmail: selectedOrderForScan?.customerEmail || '',
      serialNumber: scanSerialInput,
      itemName: scanItemName,
      category: scanCategory
    })

    if (res && res.success === false) {
      setScanErrorMessage(res.error)
      return
    }

    setScanSuccessMessage(`✓ Serial ${scanSerialInput.trim().toUpperCase()} uniquely registered for ${selectedOrderForScan?.customerName || 'Customer'}!`)
    setScanSerialInput('')
    setTimeout(() => setScanSuccessMessage(''), 4500)
  }

  // Handle Truck Dispatch with strict warehouse stock check
  const handleDispatchTruck = async (orderId) => {
    const res = await dispatchOrderTruck(orderId)
    if (res && res.success === false) {
      alert(res.error)
      return
    }
    alert('🚚 Truck Dispatched Successfully!\n• All items verified and stock deducted from warehouse inventory.\n• Scanned serial numbers uniquely bound to customer.\n• Automated warranty clock started from today\'s dispatch date!')
    setSelectedOrderForScan(null)
  }

  // Open modal to customize items to dispatch before confirming
  const handleOpenEditDispatchItems = (order) => {
    const currentItems = (order.dispatchItems && order.dispatchItems.length > 0)
      ? order.dispatchItems
      : buildDefaultDispatchItems(order, inventory)
    setEditingDispatchItemsOrder(order)
    setDispatchItemDrafts(JSON.parse(JSON.stringify(currentItems)))
    setAddInventorySkuSelect('')
    setAddInventoryQty(1)
  }

  const handleSaveDispatchItems = async () => {
    if (!editingDispatchItemsOrder) return
    const res = await updateOrderDispatchItems({
      orderId: editingDispatchItemsOrder.id,
      dispatchItems: dispatchItemDrafts
    })
    if (res.success) {
      if (selectedOrderForScan && selectedOrderForScan.id === editingDispatchItemsOrder.id) {
        setSelectedOrderForScan({
          ...selectedOrderForScan,
          dispatchItems: dispatchItemDrafts
        })
      }
      setEditingDispatchItemsOrder(null)
      alert('✓ Dispatch items list updated successfully!')
    } else {
      alert(`Error updating dispatch items: ${res.error}`)
    }
  }

  const handleAddCustomInventoryItem = () => {
    if (!addInventorySkuSelect) return
    const inv = inventory.find((i) => i.sku === addInventorySkuSelect)
    if (!inv) return

    const newItem = {
      id: `disp-add-${Date.now()}`,
      sku: inv.sku,
      name: inv.name,
      category: inv.category,
      qty: Math.max(1, Number(addInventoryQty) || 1),
      unit: inv.category === 'wires' ? 'Drum' : (inv.category === 'structure' || inv.category === 'safety' ? 'Set' : 'Unit'),
      warrantyYears: inv.category === 'panel' ? 20 : 2,
      requiresSerial: inv.requiresSerial
    }

    setDispatchItemDrafts([...dispatchItemDrafts, newItem])
    setAddInventorySkuSelect('')
    setAddInventoryQty(1)
  }

  // Open Raise Ticket on Behalf of Customer Modal
  const handleOpenRaiseTicketModal = (prefillCustomer = null) => {
    if (prefillCustomer) {
      setRaiseTicketForm({
        customerEmail: prefillCustomer.email || '',
        customerName: prefillCustomer.name || '',
        phone: prefillCustomer.phone || '',
        selectedEquipment: '',
        serialNumber: '',
        equipmentType: 'Inverter',
        faultCode: 'E04 - Heavy Rain Grid Isolation Error',
        description: '',
        troubleshootingDifficulty: true,
        difficultyNotes: '',
        technicianAssigned: 'Amit Singh (Lead Tech)'
      })
    } else {
      setRaiseTicketForm({
        customerEmail: '',
        customerName: '',
        phone: '',
        selectedEquipment: '',
        serialNumber: '',
        equipmentType: 'Inverter',
        faultCode: 'E04 - Heavy Rain Grid Isolation Error',
        description: '',
        troubleshootingDifficulty: true,
        difficultyNotes: '',
        technicianAssigned: 'Amit Singh (Lead Tech)'
      })
    }
    setShowRaiseTicketModal(true)
  }

  const handleSubmitRaiseTicketOnBehalf = async (e) => {
    e.preventDefault()
    if (!raiseTicketForm.customerName) {
      alert('Please select or specify customer name.')
      return
    }

    await raiseTicketOnBehalfOfCustomer({
      customerName: raiseTicketForm.customerName,
      customerEmail: raiseTicketForm.customerEmail,
      phone: raiseTicketForm.phone || '+91 98140 12345',
      serialNumber: raiseTicketForm.serialNumber,
      equipmentType: raiseTicketForm.equipmentType,
      reportedItem: raiseTicketForm.selectedEquipment || raiseTicketForm.equipmentType,
      faultCode: raiseTicketForm.faultCode,
      description: raiseTicketForm.description,
      troubleshootingDifficulty: raiseTicketForm.troubleshootingDifficulty,
      difficultyNotes: raiseTicketForm.difficultyNotes,
      needsFollowUp: true,
      technicianAssigned: raiseTicketForm.technicianAssigned
    })

    setRaiseTicketSuccessMsg(`✓ Support issue filed on behalf of ${raiseTicketForm.customerName}. Technician ${raiseTicketForm.technicianAssigned} dispatched!`)
    setTimeout(() => {
      setRaiseTicketSuccessMsg('')
      setShowRaiseTicketModal(false)
    }, 2500)
  }

  // Handle Roof Handover Signature
  const handleSaveSignature = (signatureDataUrl) => {
    if (!selectedInstForSign) return
    submitRoofHandover(selectedInstForSign.id, {
      ...handoverFormData,
      signatureSvg: signatureDataUrl,
      signerName: handoverFormData.signerName || selectedInstForSign.customerName
    })
    setShowSignaturePad(false)
    setSelectedInstForSign(null)
    alert('Roof handover signed by customer! Digital certificate & warranty active.')
  }

  // Handle Admin Override of Survey Feasibility
  const handleSaveAdminOverride = async (e) => {
    e.preventDefault()
    if (!selectedSurveyForOverride) return
    if (!overrideReason.trim()) {
      alert('Mandatory Requirement: Please provide an administrative reason / engineering justification for overwriting this feasibility decision.')
      return
    }

    await adminOverrideSurveyFeasibility({
      surveyId: selectedSurveyForOverride.id,
      status: overrideStatus,
      overrideReason: overrideReason.trim(),
      adminName: currentUser?.name || 'SunPower Operations Director'
    })

    setSelectedSurveyForOverride(null)
    setOverrideReason('')
    alert(`Survey feasibility successfully overwritten to: ${overrideStatus.toUpperCase()}!`)
  }

  // Orders Tab Segment Filter & Payment Updating State
  const [orderFilterTab, setOrderFilterTab] = useState('pending') // 'pending' | 'completed' | 'all'
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null)
  const [orderPaymentForm, setOrderPaymentForm] = useState({
    amountReceived: '',
    paymentMode: 'UPI / Online QR',
    milestone: 'Booking Advance (35%)',
    referenceNo: '',
    notes: '',
    sendCustomerReceipt: true
  })
  const [orderPaymentMsg, setOrderPaymentMsg] = useState('')

  const isOrderCompleted = (o) => {
    return (
      o.installationStatus === 'completed' ||
      (o.trackingStage && (
        o.trackingStage.toLowerCase().includes('completed') ||
        o.trackingStage.toLowerCase().includes('commissioned') ||
        o.trackingStage.toLowerCase().includes('handed over')
      ))
    )
  }

  const pendingOrders = orders.filter((o) => !isOrderCompleted(o))
  const completedOrders = orders.filter((o) => isOrderCompleted(o))
  const displayedOrders =
    orderFilterTab === 'pending'
      ? pendingOrders
      : orderFilterTab === 'completed'
      ? completedOrders
      : orders

  const handleRecordOrderPayment = async (e) => {
    e.preventDefault()
    if (!selectedOrderForPayment) return
    const amt = Number(orderPaymentForm.amountReceived)
    if (!amt || amt <= 0) {
      alert('Please enter a valid positive payment amount received.')
      return
    }

    const res = await recordOrderPayment({
      orderId: selectedOrderForPayment.id,
      amountReceived: amt,
      paymentMode: orderPaymentForm.paymentMode,
      milestone: orderPaymentForm.milestone,
      referenceNo: orderPaymentForm.referenceNo,
      notes: orderPaymentForm.notes,
      updatedBy: currentUser?.name || 'Admin Operations Desk',
      sendCustomerReceipt: orderPaymentForm.sendCustomerReceipt
    })

    if (res.success) {
      setOrderPaymentMsg(`✓ Successfully recorded ₹${amt.toLocaleString()} payment! Receipt: ${res.receiptNumber || 'Generated'}. Outstanding balance: ₹${res.order.balanceDue.toLocaleString()}`)
      setTimeout(() => {
        setOrderPaymentMsg('')
        setSelectedOrderForPayment(null)
        setOrderPaymentForm({
          amountReceived: '',
          paymentMode: 'UPI / Online QR',
          milestone: 'Booking Advance (35%)',
          referenceNo: '',
          notes: '',
          sendCustomerReceipt: true
        })
      }, 1600)
    } else {
      alert(res.error || 'Failed to record payment.')
    }
  }

  const handleMarkOrderCompleted = async (orderId) => {
    if (!window.confirm('Mark this project as fully completed & commissioned? It will be moved to the Completed Orders archive.')) return
    const res = await markOrderCompleted({
      orderId,
      completionNotes: 'Commissioned and handed over to customer. Warranty initiated.',
      updatedBy: currentUser?.name || 'Admin Operations'
    })
    if (res.success) {
      alert('Order successfully marked as Completed! Moved to Completed Orders section.')
    }
  }

  const filteredSerials = serials.filter(
    (s) =>
      s.serialNumber.toLowerCase().includes(serialSearchQuery.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(serialSearchQuery.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>
      {/* Top Admin Header */}
      <header
        style={{
          background: '#07192e',
          color: '#fff',
          padding: '0.8rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #ffb81c'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onGoHome}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffb81c',
              fontSize: '1.25rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🛡️ SolarOps <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'normal' }}>| Admin & Operations Control</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.78rem', background: '#1e3a8a', padding: '3px 8px', borderRadius: '4px', color: '#93c5fd' }}>
            Director / HQ View
          </span>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Horizontal Navigation (Matches the 9 items in Architecture Diagram) */}
      <div style={{ background: '#0b2540', padding: '0 4vw', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {[
            { id: 'customers', label: 'Customer management', icon: '👥' },
            { id: 'surveys', label: 'Site surveys', icon: '📐', badge: enquiries.filter((e) => e.status === 'new').length },
            { id: 'staff', label: 'Technical Staff & Roles', icon: '👷', badge: technicians.length },
            { id: 'quotations', label: 'Quotations', icon: '📑' },
            { id: 'inventory', label: 'Inventory', icon: '📦' },
            { id: 'orders', label: 'Orders', icon: '🚚', badge: pendingOrders.length },
            { id: 'installations', label: 'Installations', icon: '⚡' },
            { id: 'warranty', label: 'Warranty', icon: '🛡️', badge: tickets.filter((t) => t.status === 'open').length },
            { id: 'finance', label: 'Finance', icon: '💰' },
            { id: 'reports', label: 'Reports', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ffb81c' : '3px solid transparent',
                color: activeTab === tab.id ? '#ffb81c' : '#94a3b8',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.86rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge ? (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '1px 5px', borderRadius: '999px', fontWeight: 'bold' }}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1360px', margin: '1.5rem auto', padding: '0 4vw' }}>
        {/* 1. CUSTOMER MANAGEMENT */}
        {activeTab === 'customers' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Customer Relationship Management (CRM)</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Central directory of solar clients across residential, commercial, and agricultural sectors
                </p>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Registered Clients: <b>{registeredUsers.filter((u) => u.role === 'customer').length}</b></span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px' }}>Customer Name</th>
                    <th style={{ padding: '10px 14px' }}>Phone / Email</th>
                    <th style={{ padding: '10px 14px' }}>Site Location</th>
                    <th style={{ padding: '10px 14px' }}>DISCOM Consumer #</th>
                    <th style={{ padding: '10px 14px' }}>Tariff Category</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.filter((u) => u.role === 'customer').map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 'bold', color: '#0b2540' }}>{c.name}</td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        <div>{c.phone}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{c.email}</div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>{c.address}, {c.city}</td>
                      <td style={{ padding: '10px 14px', color: '#0e5a8a', fontFamily: 'monospace', fontWeight: '600' }}>{c.discomAccount || 'Pending Net Meter'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.78rem' }}>
                          {c.connectionCategory || 'Residential'}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{c.connectionType}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          onClick={() => {
                            setActiveTab('surveys')
                          }}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
                        >
                          View Activity
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. SITE SURVEYS (Scene 1: Rooftop Inquiry & Survey Approval) */}
        {activeTab === 'surveys' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Site Surveys & Technical Feasibility</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Scene 1: Record shadow-free roof space, electricity bill, roof direction, tilt and cable distance. Only after approval should quote be unlocked.
                </p>
              </div>
            </div>

            {/* If an inquiry is selected for recording a survey */}
            {selectedSurveyEnquiry && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '2px solid #0e5a8a', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(14,90,138,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚀</span> Dispatch Site Surveyor: {selectedSurveyEnquiry.customerName}
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      Location: {selectedSurveyEnquiry.address}, {selectedSurveyEnquiry.city} • System: {selectedSurveyEnquiry.systemPreference} ({selectedSurveyEnquiry.connectionCategory})
                    </p>
                  </div>
                  <button onClick={() => setSelectedSurveyEnquiry(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                </div>

                <form onSubmit={handleDispatchSurveyor}>
                  {/* Customer Snapshot */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '0.78rem' }}>
                    <div>Customer Phone: <b>{selectedSurveyEnquiry.phone}</b></div>
                    <div>Reported Roof: <b>{selectedSurveyEnquiry.roofAreaSqft} sq.ft</b> ({selectedSurveyEnquiry.roofType})</div>
                    <div>Monthly Bill: <b>₹{selectedSurveyEnquiry.monthlyElectricityBill}</b></div>
                    <div>DISCOM Account: <b>{selectedSurveyEnquiry.discomAccount || 'Pending'}</b></div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {/* Technician Scheduling & Slot Availability Engine */}
                    <div style={{ gridColumn: '1 / -1', background: '#f1f5f9', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0b2540' }}>
                          📅 Technician Scheduling & Slot Availability Engine (Point 6):
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setTechAssignMode('auto')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              border: techAssignMode === 'auto' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                              background: techAssignMode === 'auto' ? '#eff6ff' : '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            🤖 Auto-Assign Available Tech
                          </button>
                          <button
                            type="button"
                            onClick={() => setTechAssignMode('manual')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              border: techAssignMode === 'manual' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                              background: techAssignMode === 'manual' ? '#eff6ff' : '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            👤 Manual Tech Picker
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Survey Date *</label>
                          <input
                            type="date"
                            required
                            value={surveyFormData.surveyDate}
                            onChange={(e) => setSurveyFormData({ ...surveyFormData, surveyDate: e.target.value })}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Time Slot (Slot Picker) *</label>
                          <select
                            value={surveyFormData.timeSlot}
                            onChange={(e) => setSurveyFormData({ ...surveyFormData, timeSlot: e.target.value })}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                          >
                            <option value="Morning (09:00 AM - 01:00 PM)">Morning (09:00 AM - 01:00 PM)</option>
                            <option value="Afternoon (02:00 PM - 06:00 PM)">Afternoon (02:00 PM - 06:00 PM)</option>
                          </select>
                        </div>

                        {techAssignMode === 'auto' ? (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                              Auto-Assign Non-Conflicting Technician
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoAssignTech}
                              style={{
                                width: '100%',
                                background: '#0e5a8a',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              ⚡ Run Free-Tech Finder
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                              Select Free Technician (Live Conflict Check) *
                            </label>
                            <select
                              value={surveyFormData.technicianName}
                              onChange={(e) => setSurveyFormData({ ...surveyFormData, technicianName: e.target.value })}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                            >
                              {getTechnicianAvailability(surveyFormData.surveyDate, surveyFormData.timeSlot).map((t) => (
                                <option
                                  key={t.id}
                                  value={`${t.name} (${t.crew})`}
                                  disabled={t.isBusy}
                                  style={{
                                    color: t.isBusy ? '#991b1b' : '#0f172a',
                                    background: t.isBusy ? '#fee2e2' : '#fff'
                                  }}
                                >
                                  {t.name} - {t.crew} {t.isBusy ? `🚫 [BUSY: ${t.currentAssignment}] — BLOCKED` : '● [AVAILABLE]'}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Live Conflict Warning Banner */}
                      {(() => {
                        const avail = getTechnicianAvailability(surveyFormData.surveyDate, surveyFormData.timeSlot)
                        const chosen = avail.find((t) => surveyFormData.technicianName?.includes(t.name))
                        if (chosen && chosen.isBusy) {
                          return (
                            <div style={{ marginTop: '8px', background: '#fee2e2', border: '1.5px solid #f87171', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                              🚫 TIME-SLOT CONFLICT: {chosen.name} is currently busy ("{chosen.currentAssignment}") during {surveyFormData.timeSlot} on {surveyFormData.surveyDate}. Assignment is BLOCKED. Please select an available technician or pick another slot.
                            </div>
                          )
                        }
                        return null
                      })()}

                      {autoAssignSuccessMsg && (
                        <div style={{ marginTop: '8px', background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {autoAssignSuccessMsg}
                        </div>
                      )}
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                        Selected Assignee: <b>{surveyFormData.technicianName}</b> for <b>{surveyFormData.timeSlot}</b> on {surveyFormData.surveyDate}
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                        Special Dispatch Notes & Surveyor Instructions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inspect parapet wall shading, measure cable distance from roof to DISCOM meter box"
                        value={surveyFormData.surveyorNotes}
                        onChange={(e) => setSurveyFormData({ ...surveyFormData, surveyorNotes: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>

                    {/* Operational Rule Notice */}
                    <div style={{ gridColumn: '1 / -1', background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 16px', borderRadius: '8px', fontSize: '0.8rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>⏳</span>
                      <div>
                        <b>Site Feasibility Approval Policy:</b> While dispatching, the site approval status remains <b>PENDING</b>. The assigned surveyor will conduct the on-site rooftop inspection, record shadow-free measurements, and officially approve or disapprove feasibility from the Technician Portal. Quotation generator will unlock once feasibility is approved by the surveyor.
                      </div>
                    </div>

                    {(() => {
                      const avail = getTechnicianAvailability(surveyFormData.surveyDate, surveyFormData.timeSlot)
                      const chosen = avail.find((t) => surveyFormData.technicianName?.includes(t.name))
                      const isBusy = Boolean(chosen && chosen.isBusy)
                      return (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedSurveyEnquiry(null)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isBusy}
                            style={{
                              background: isBusy ? '#94a3b8' : 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 'bold',
                              padding: '10px 24px',
                              borderRadius: '6px',
                              cursor: isBusy ? 'not-allowed' : 'pointer',
                              fontSize: '0.85rem',
                              boxShadow: '0 2px 6px rgba(11,37,64,0.2)'
                            }}
                          >
                            {isBusy ? '🚫 Assignment Blocked (Tech Busy)' : '🚀 Confirm Dispatch (Site Approval Pending Field Inspection)'}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                </form>
              </div>
            )}

            {/* Enquiries awaiting survey */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>Incoming Rooftop Inquiries Pipeline</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Customer</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Phone</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Address / City</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Reported Space</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Survey Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => {
                      const surv = surveys.find((s) => s.enquiryId === enq.id)
                      return (
                        <tr key={enq.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#0b2540' }}>{enq.customerName}</td>
                          <td style={{ padding: '8px 12px' }}>{enq.phone}</td>
                          <td style={{ padding: '8px 12px' }}>{enq.address}, {enq.city}</td>
                          <td style={{ padding: '8px 12px' }}>{enq.roofAreaSqft} sq.ft (Bill: ₹{enq.monthlyElectricityBill})</td>
                          <td style={{ padding: '8px 12px' }}>
                            <StatusBadge status={enq.status} />
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            {surv && surv.status === 'pending' ? (
                              <div>
                                <span style={{ color: '#b45309', fontWeight: 'bold', fontSize: '0.78rem', background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                  ⏳ Site Approval Pending
                                </span>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                  Surveyor: {surv.technicianName || enq.assignedTechName} ({surv.surveyDate || enq.surveyDate})
                                </div>
                              </div>
                            ) : surv && surv.status === 'rejected' ? (
                              <div>
                                <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                  ✕ Disapproved by Surveyor
                                </span>
                                <div style={{ fontSize: '0.72rem', color: '#991b1b', fontStyle: 'italic' }}>
                                  "{surv.disapprovalReason}"
                                </div>
                              </div>
                            ) : surv && surv.status === 'approved' ? (
                              <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                ✓ Feasibility Approved ({surv.technicianName})
                              </span>
                            ) : enq.assignedTechName ? (
                              <div>
                                <span style={{ color: '#b45309', fontWeight: 'bold', fontSize: '0.78rem', background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                  ⏳ Site Approval Pending
                                </span>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                  Dispatched: {enq.assignedTechName} ({enq.surveyDate})
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedSurveyEnquiry(enq)}
                                style={{
                                  background: '#0e5a8a',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                🚀 Dispatch Site Surveyor
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Completed Surveys list (Approved & Disapproved) */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>Technical Site Feasibility Assessments & Dispatch Tracking</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                {surveys.map((s) => (
                  <div key={s.id} style={{
                    background: s.status === 'pending' ? '#fffbeb' : s.status === 'rejected' ? '#fff5f5' : '#f8fafc',
                    padding: '14px',
                    borderRadius: '8px',
                    border: s.status === 'pending' ? '1px solid #fef3c7' : s.status === 'rejected' ? '1px solid #fecaca' : '1px solid #cbd5e1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <b style={{ color: '#0b2540' }}>{s.customerName}</b>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          background: s.status === 'pending' ? '#fef3c7' : s.status === 'rejected' ? '#fee2e2' : '#dcfce7',
                          color: s.status === 'pending' ? '#b45309' : s.status === 'rejected' ? '#991b1b' : '#166534'
                        }}>
                          {s.status === 'pending' ? '⏳ Site Approval Pending' : s.status === 'rejected' ? '✕ Feasibility Disapproved' : '✓ Feasibility Approved'}
                        </span>
                        {s.adminOverwritten && (
                          <span style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '0.68rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd6fe' }}>
                            👑 Overwritten
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Overwrite Banner */}
                    {s.adminOverwritten && (
                      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6', padding: '6px 8px', borderRadius: '6px', fontSize: '0.74rem', marginBottom: '8px' }}>
                        <b>👑 Admin Overwrite:</b> Decision modified by {s.overwrittenBy || 'Admin'}. Reason: <em>"{s.adminOverwriteReason}"</em>
                      </div>
                    )}

                    {s.status === 'pending' ? (
                      <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#92400e', background: '#fef3c7', padding: '10px', borderRadius: '6px' }}>
                        <div><b>Site Feasibility:</b> Approval is pending on-site surveyor inspection.</div>
                        <div style={{ fontSize: '0.74rem', color: '#b45309', marginTop: '4px' }}>
                          Surveyor Assigned: <b>{s.technicianName}</b> • Date: {s.surveyDate} [{s.timeSlot}]
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78350f', marginTop: '4px', fontStyle: 'italic' }}>
                          "{s.surveyorNotes || 'Dispatched for on-site inspection. Site approval pending surveyor review.'}"
                        </div>
                      </div>
                    ) : s.status === 'rejected' ? (
                      <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#991b1b', background: '#fee2e2', padding: '8px 10px', borderRadius: '6px' }}>
                        <b>Disapproval Reason:</b> {s.disapprovalReason}
                        <div style={{ fontSize: '0.74rem', color: '#7f1d1d', marginTop: '4px' }}>
                          Surveyor: {s.technicianName} ({s.approvedByRole || 'Site Tech'}) • Date: {s.surveyDate}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
                          <div>Shadow-free Roof: <b>{s.shadowFreeRoofSqft} sq.ft</b></div>
                          <div>Direction & Tilt: <b>{s.roofDirection} @ {s.roofTiltDegrees}°</b></div>
                          <div>Cable Run: <b>{s.cableRunDistanceMeters}m</b> ({s.gridConnectionType})</div>
                          <div>Surveyor: <b>{s.technicianName}</b> ({s.approvedByRole || 'Site Tech'}) • Date: {s.surveyDate}</div>
                        </div>
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                          "{s.surveyorNotes}"
                        </div>
                      </>
                    )}

                    {/* Admin Override Button */}
                    {s.status !== 'pending' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSurveyForOverride(s)
                          setOverrideStatus(s.status === 'approved' ? 'rejected' : 'approved')
                          setOverrideReason('')
                        }}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          background: '#6d28d9',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        👑 Admin Overwrite Feasibility ({s.status === 'approved' ? 'Disapprove' : 'Approve'})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TECHNICAL STAFF & ROLES MANAGEMENT SECTION */}
        {/* ======================================================== */}
        {activeTab === 'staff' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👷</span> Technical Staff, Roles & Access Provisioning
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Register and provision official login accounts (Email & Password) for Site Technicians, Surveyors, and Installation Crews.
                  Assigned technicians only see their own assigned customers.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#0b2540' }}>
                  Total Staff: {technicians.length}
                </span>
                <span style={{ background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                  Active Crews: {new Set(technicians.map((t) => t.crew)).size}
                </span>
              </div>
            </div>

            {/* Success and Error Alerts */}
            {staffSuccessMsg && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✅</span>
                <span>{staffSuccessMsg}</span>
              </div>
            )}
            {staffErrorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span>
                <span>{staffErrorMsg}</span>
              </div>
            )}

            {/* Provisioning Form Card */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>➕</span> Create New Technical Staff Account (ID & Password)
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  The technician will use this Email and Password to log in directly via the Site Technician Portal.
                </p>
              </div>

              <form onSubmit={handleCreateStaff}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Kumar"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Official Login Email (User ID) *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. suresh@sunpowersolutions.in"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Password (Login Auth) *
                    </label>
                    <input
                      type="text"
                      placeholder="Min 6 characters (e.g. TechPass@2026)"
                      value={newStaffForm.password}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Role & Designation *
                    </label>
                    <select
                      value={newStaffForm.role}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                    >
                      <option value="site_technician">Site Technician & Surveyor</option>
                      <option value="technician">Rooftop Installation Lead</option>
                      <option value="electrical_specialist">Electrical & Inverter Specialist</option>
                      <option value="maintenance_engineer">Service & AMC Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Assigned Crew Team *
                    </label>
                    <select
                      value={newStaffForm.crew}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, crew: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                    >
                      <option value="Crew Alpha">Crew Alpha (Residential Rooftop)</option>
                      <option value="Crew Beta">Crew Beta (Commercial & Industrial 3-Phase)</option>
                      <option value="Crew Gamma">Crew Gamma (High-Tension & Heavy Industrial)</option>
                      <option value="Crew Delta">Crew Delta (Rapid Service & Inverter Replacement)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Employee Badge ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TECH-305"
                      value={newStaffForm.employeeId}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, employeeId: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                      Skills & Certifications
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MNRE Certified, 3-Phase HT, Rooftop Safety"
                      value={newStaffForm.skills}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, skills: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 6px rgba(11,37,64,0.2)'
                    }}
                  >
                    <span>🛡️</span> Register Technical Staff & Provision Credentials
                  </button>
                </div>
              </form>
            </div>

            {/* Technical Staff Directory */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>
                  📋 Active Technical Staff Roster & Assigned Workload
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  🔒 Each technician is isolated and can only view their own assigned customer orders and surveys
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Staff Name / Badge</th>
                      <th style={{ padding: '10px 12px' }}>Login ID (Email)</th>
                      <th style={{ padding: '10px 12px' }}>Assigned Crew</th>
                      <th style={{ padding: '10px 12px' }}>Current Status</th>
                      <th style={{ padding: '10px 12px' }}>Surveys (Done / Pend)</th>
                      <th style={{ padding: '10px 12px' }}>Active Installs</th>
                      <th style={{ padding: '10px 12px' }}>Completed Installs</th>
                      <th style={{ padding: '10px 12px' }}>Actual Total Works</th>
                      <th style={{ padding: '10px 12px' }}>Official IDP & Showcase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicians.map((tech) => {
                      const techSurveys = surveys.filter(
                        (s) =>
                          s.technicianName?.toLowerCase().includes(tech.name.toLowerCase()) ||
                          s.crew?.toLowerCase().includes(tech.crew.toLowerCase()) ||
                          s.approvedByName?.toLowerCase().includes(tech.name.toLowerCase())
                      )
                      const completedSurveys = techSurveys.filter((s) => s.status === 'approved' || s.status === 'rejected').length
                      const pendingSurveys = techSurveys.filter((s) => s.status === 'pending').length ||
                        enquiries.filter((e) => (e.assignedTechName?.includes(tech.name) || e.assignedCrew?.includes(tech.crew)) && e.status === 'survey_scheduled').length

                      const techInstalls = installations.filter(
                        (i) =>
                          i.crewName?.toLowerCase().includes(tech.crew.toLowerCase()) ||
                          i.crewName?.toLowerCase().includes(tech.name.toLowerCase()) ||
                          i.technicianName?.toLowerCase().includes(tech.name.toLowerCase())
                      )
                      const completedInstalls = techInstalls.filter((i) => i.status === 'signed_off').length
                      const activeInstalls = techInstalls.filter((i) => i.status !== 'signed_off').length

                      const techTickets = tickets.filter(
                        (t) =>
                          t.technicianAssigned?.toLowerCase().includes(tech.name.toLowerCase()) ||
                          t.technicianAssigned?.toLowerCase().includes(tech.crew.toLowerCase())
                      )
                      const resolvedTickets = techTickets.filter((t) => t.status === 'resolved').length

                      // Actual total number of real works
                      const actualTotalWorks = completedSurveys + completedInstalls + resolvedTickets + activeInstalls + pendingSurveys
                      const isCurrentlyBusy = tech.status === 'busy' || activeInstalls > 0

                      return (
                        <tr key={tech.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{tech.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{tech.employeeId || 'ID: ' + tech.id}</div>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            <code>{tech.email || tech.name.toLowerCase().replace(/\s+/g, '') + '@sunpowersolutions.in'}</code>
                            <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>Role: {tech.role || 'Site Tech'}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: tech.crew.includes('Alpha') ? '#eff6ff' : tech.crew.includes('Beta') ? '#fef3c7' : '#f3e8ff',
                              color: tech.crew.includes('Alpha') ? '#1d4ed8' : tech.crew.includes('Beta') ? '#b45309' : '#7e22ce'
                            }}>
                              {tech.crew}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              background: isCurrentlyBusy ? '#fee2e2' : '#dcfce7',
                              color: isCurrentlyBusy ? '#991b1b' : '#166534'
                            }}>
                              {isCurrentlyBusy ? '🚫 Busy on Roof' : '● Available'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#0b2540' }}>
                            <div>
                              <b>{completedSurveys}</b> Done
                              {pendingSurveys > 0 && (
                                <span style={{ marginLeft: '4px', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                  +{pendingSurveys} pend
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600, color: '#0b2540' }}>{activeInstalls}</td>
                          <td style={{ padding: '12px', fontWeight: 600, color: '#059669' }}>{completedInstalls}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                              ⚡ {actualTotalWorks} Works
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStaffForIdp(tech)
                                setStaffIdpViewSide('front')
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(11,37,64,0.15)'
                              }}
                            >
                              <span>🪪</span> View IDP & Showcase
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. QUOTATIONS (Scene 2: Getting the Kit Right - Point 3: Strictly Locked to Approved Surveys) */}
        {activeTab === 'quotations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Quotation & Ready Bill of Materials (BOM) Generator</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Scene 2: Quotes generated from ready templates (1 kW to 5 kW). Exact parts list auto-populates so nobody misses any part.
                </p>
              </div>
            </div>

            {/* Point 3 Compliance Note: Quotations can ONLY be created for approved surveys */}
            {enquiries.filter((enq) => surveys.some((s) => s.enquiryId === enq.id && s.status === 'approved')).length === 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                ⚠️ <b>Feasibility Survey Gate:</b> No inquiries currently have an approved site survey. Under technical safety policy, site survey feasibility must be approved before quotation creation is unlocked.
              </div>
            )}

            {/* Quick Generator Modal / Box */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>⚡ Generate New Quote from Approved Survey (Point 3)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Select Customer with Approved Survey *
                  </label>
                  <select
                    value={selectedEnquiryForQuote ? selectedEnquiryForQuote.id : ''}
                    onChange={(e) => {
                      const match = enquiries.find((enq) => enq.id === e.target.value)
                      setSelectedEnquiryForQuote(match || null)
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">-- Choose Customer with Approved Survey --</option>
                    {enquiries
                      .filter((enq) => surveys.some((s) => s.enquiryId === enq.id && s.status === 'approved'))
                      .map((enq) => (
                        <option key={enq.id} value={enq.id}>
                          ✓ {enq.customerName} ({enq.systemPreference}) — Feasibility Approved
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Standard Package Template (1 kW - 5 kW)
                  </label>
                  <select
                    value={quotePackageId}
                    onChange={(e) => setQuotePackageId(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.basePrice.toLocaleString()} {pkg.subsidyAmount > 0 ? `(Subsidy: ₹${pkg.subsidyAmount.toLocaleString()})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    onClick={handleGenerateQuote}
                    disabled={!selectedEnquiryForQuote}
                    style={{
                      width: '100%',
                      background: selectedEnquiryForQuote ? '#ffb81c' : '#cbd5e1',
                      color: '#0b2540',
                      border: 'none',
                      fontWeight: 'bold',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: selectedEnquiryForQuote ? 'pointer' : 'not-allowed'
                    }}
                  >
                    + Auto-Populate BOM & Send Quote
                  </button>
                </div>
              </div>
            </div>

            {/* List of Quotes with Admin Payment Confirmation (Point 4) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {quotations.map((q) => (
                <div key={q.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0b2540' }}>Quote #{q.quoteNumber} — {q.customerName}</h4>
                        <StatusBadge status={q.status} />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {q.capacityKw} kW {q.systemType === 'on_grid' ? 'On-Grid' : 'Off-Grid'} System • Valid until {q.validUntil}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Gross: ₹{q.subtotalAmount.toLocaleString()}</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0b2540' }}>
                        Net Payable: ₹{q.netPayableAmount.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#16a34a' }}>
                        Advance Paid: ₹{q.advancePaid.toLocaleString()} / ₹{q.advanceRequired.toLocaleString()} req.
                      </span>
                    </div>
                  </div>

                  {/* Customer Payment Submission Notification Box (Point 4) */}
                  {q.paymentDetails && (
                    <div style={{ marginTop: '10px', background: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <b style={{ color: '#1e40af' }}>💳 Customer Payment Submission Received:</b>
                          <div style={{ color: '#1e3a8a', marginTop: '2px' }}>
                            Amount: <b>₹{q.paymentDetails.submittedAmount.toLocaleString()}</b> via {q.paymentDetails.paymentMode} ({q.paymentDetails.bankName || 'Bank'})
                          </div>
                          <div style={{ fontFamily: 'monospace', color: '#0e5a8a', marginTop: '2px' }}>
                            UTR / Transaction Ref: <b>{q.paymentDetails.transactionRef}</b>
                          </div>
                        </div>
                        {(!q.paymentConfirmedByAdmin || q.status === 'pending_verification') && (
                          <button
                            onClick={() => {
                              setSelectedQuoteForAdminPay(q)
                              setAdminPaymentForm({
                                amountPaid: q.paymentDetails.submittedAmount,
                                paymentMode: q.paymentDetails.paymentMode,
                                transactionRef: q.paymentDetails.transactionRef,
                                staffNotes: 'Verified in company bank account. Released to warehouse.'
                              })
                            }}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 'bold',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.82rem'
                            }}
                          >
                            ✓ Staff Verify & Confirm Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* If no customer proof yet, but Admin wants to confirm direct advance */}
                  {!q.paymentDetails && q.advancePaid === 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedQuoteForAdminPay(q)
                          setAdminPaymentForm({
                            amountPaid: q.advanceRequired,
                            paymentMode: 'Bank Transfer (NEFT/RTGS)',
                            transactionRef: `NEFT-${Date.now().toString().slice(-6)}`,
                            staffNotes: 'Direct advance payment received in office. Order released.'
                          })
                        }}
                        style={{
                          background: '#0e5a8a',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 'bold',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.78rem'
                        }}
                      >
                        + Record & Confirm Payment (Admin Desk)
                      </button>
                    </div>
                  )}

                  {q.advancePaid > 0 && (
                    <div style={{ marginTop: '10px', background: '#dcfce7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: '#166534', fontWeight: 'bold' }}>
                      ✓ Payment Confirmed by Admin: ₹{q.advancePaid.toLocaleString()} ({q.paymentVerification?.confirmedBy || 'Staff Desk'}) • Released to Orders Master Tracker
                    </div>
                  )}

                  <div style={{ marginTop: '10px', fontSize: '0.8rem', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px' }}>
                    <b>Auto-Generated BOM Components:</b>
                    <ul style={{ margin: '4px 0 0', paddingLeft: '1.2rem', color: '#475569', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4px' }}>
                      {q.items.map((it, idx) => (
                        <li key={idx}>
                          {it.item} ({it.qty} {it.unit}) — <span style={{ color: '#0e5a8a' }}>{it.warranty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INVENTORY & SERIAL TRACKING (Scene 3: Dispatch day & serial numbers) */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Warehouse Inventory & Serial Number Dispatch Staging</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Scene 3: ₹1,50,000 worth of inverters and batteries. Every unit must be scanned before leaving so we know which unit went to which customer. Delivery auto-starts the warranty clock.
                </p>
              </div>
            </div>

            {/* Truck Staging Barcode Scanner Modal */}
            {selectedOrderForScan && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '2px solid #2563eb', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0b2540' }}>
                      🚚 Warehouse Dispatch Staging: Order #{selectedOrderForScan.orderNumber}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                      Customer: <b>{selectedOrderForScan.customerName}</b> ({selectedOrderForScan.capacityKw} kW {selectedOrderForScan.systemType}) • Scheduled: {selectedOrderForScan.scheduledDate}
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrderForScan(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Section 1: Pre-Fixed Dispatch Items with Stock Availability & Customization */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0b2540' }}>
                        📋 Fixed Dispatch Items (Auto-populated from Package BOM)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Each item must exist with sufficient warehouse stock before dispatch can be confirmed. Admin can customize items/quantities prior to truck departure.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditDispatchItems(selectedOrderForScan)}
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ✏️ Customize / Edit Dispatch Items
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '6px 10px' }}>SKU</th>
                          <th style={{ padding: '6px 10px' }}>Item Description</th>
                          <th style={{ padding: '6px 10px' }}>Category</th>
                          <th style={{ padding: '6px 10px', textAlign: 'center' }}>Required Qty</th>
                          <th style={{ padding: '6px 10px', textAlign: 'center' }}>Warehouse Stock</th>
                          <th style={{ padding: '6px 10px', textAlign: 'center' }}>Stock Status</th>
                          <th style={{ padding: '6px 10px', textAlign: 'center' }}>Serial Scan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {((selectedOrderForScan.dispatchItems && selectedOrderForScan.dispatchItems.length > 0)
                          ? selectedOrderForScan.dispatchItems
                          : buildDefaultDispatchItems(selectedOrderForScan, inventory)
                        ).map((item, idx) => {
                          const invItem = inventory.find(
                            (inv) => (item.sku && inv.sku === item.sku) || inv.name.toLowerCase() === (item.name || '').toLowerCase()
                          )
                          const stockAvailable = invItem ? invItem.stockQty : 0
                          const hasStock = stockAvailable >= (Number(item.qty) || 1)
                          return (
                            <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.sku || 'GEN-ACC'}</td>
                              <td style={{ padding: '6px 10px', color: '#0b2540', fontWeight: '500' }}>{item.name}</td>
                              <td style={{ padding: '6px 10px', textTransform: 'capitalize', color: '#64748b' }}>{item.category}</td>
                              <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                                {item.qty} {item.unit || 'Nos'}
                              </td>
                              <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 'bold', color: hasStock ? '#15803d' : '#b91c1c' }}>
                                {stockAvailable} in warehouse
                              </td>
                              <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                {hasStock ? (
                                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                    ✓ Available
                                  </span>
                                ) : (
                                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                    ⚠️ Stock Short ({item.qty - stockAvailable} short)
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                {item.requiresSerial ? (
                                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    Barcode Scan Required
                                  </span>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Bulk Pack</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 2: Barcode Scanner & Scanned Units */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Scanner input */}
                  <div>
                    <form onSubmit={handleAddScannedSerial} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px' }}>
                        Scan / Register Serial Number (Unique per Customer)
                      </div>

                      {scanErrorMessage && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #f87171', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '10px', fontWeight: 'bold' }}>
                          ❌ {scanErrorMessage}
                        </div>
                      )}
                      {scanSuccessMessage && (
                        <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '10px', fontWeight: 'bold' }}>
                          {scanSuccessMessage}
                        </div>
                      )}

                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Component Category</label>
                        <select
                          value={scanCategory}
                          onChange={(e) => {
                            setScanCategory(e.target.value)
                            if (e.target.value === 'inverter') setScanItemName('3.3 kW Dual-MPPT Solar Grid-Tie Inverter')
                            if (e.target.value === 'battery') setScanItemName('48V 200Ah High-Cycle Lithium Storage Battery')
                            if (e.target.value === 'charge_controller') setScanItemName('60A Intelligent MPPT Solar Charge Controller')
                            if (e.target.value === 'panel') setScanItemName('Mono PERC Solar Panel 540W Tier-1')
                          }}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        >
                          <option value="inverter">Inverter (2-Year Clock)</option>
                          <option value="battery">Lithium Battery (2-Year Clock)</option>
                          <option value="charge_controller">Charge Controller (2-Year Clock)</option>
                          <option value="panel">Solar Panels (20-Year Clock)</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Serial Number Barcode * (Unique to Customer)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. INV-SUN-2026-9042"
                          value={scanSerialInput}
                          onChange={(e) => {
                            setScanSerialInput(e.target.value)
                            if (scanErrorMessage) setScanErrorMessage('')
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 'bold' }}
                        />
                      </div>

                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          background: '#0e5a8a',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 'bold',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        + Register Scanned Serial to Truck
                      </button>
                    </form>
                  </div>

                  {/* Scanned units for this order */}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px' }}>
                      Scanned Units Ready on Truck ({serials.filter((s) => s.orderId === selectedOrderForScan.id).length}):
                    </div>
                    <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                      {serials.filter((s) => s.orderId === selectedOrderForScan.id).length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                          No serials scanned yet for this dispatch.
                        </div>
                      ) : (
                        serials
                          .filter((s) => s.orderId === selectedOrderForScan.id)
                          .map((s) => (
                            <div key={s.id} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <b style={{ fontFamily: 'monospace', color: '#0e5a8a' }}>{s.serialNumber}</b>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.itemName}</div>
                              </div>
                              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                ✓ Linked
                              </span>
                            </div>
                          ))
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDispatchTruck(selectedOrderForScan.id)}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        background: '#15803d',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '800',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      🚀 Dispatch Truck & Start Warranty Clocks
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Warehouse Stock Table */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>Warehouse Component Inventory</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>SKU</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Component Description</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Category</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Stock Qty</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Cost</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Selling Price</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Serial Tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.sku}</td>
                        <td style={{ padding: '8px 12px', color: '#0b2540', fontWeight: '500' }}>{item.name}</td>
                        <td style={{ padding: '8px 12px', textTransform: 'capitalize', color: '#64748b' }}>{item.category}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: item.stockQty < 10 ? '#ef4444' : '#0b2540' }}>
                          {item.stockQty} Units
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{item.unitCost.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>₹{item.sellingPrice.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {item.requiresSerial ? (
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              Required
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Bulk</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders ready for packing / dispatch */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>Orders Staging for Dispatch</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map((o) => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <b>Order #{o.orderNumber}</b> — {o.customerName}
                        <StatusBadge status={o.dispatchStatus} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {o.capacityKw} kW {o.systemType} • Scheduled Date: {o.scheduledDate}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrderForScan(o)}
                      style={{
                        background: '#0e5a8a',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      📦 Scan Serials & Stage Truck
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. ORDERS (Active Tasks vs Completed Separated & Real-time Payment Tracking) */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span> Orders & Live Milestone Tracker
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Organize pending installation tasks, monitor full/partial payments, and log received amounts in real-time.
                </p>
              </div>

              {/* Segmented Filter: Pending Tasks vs Completed Orders */}
              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setOrderFilterTab('pending')}
                  style={{
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: orderFilterTab === 'pending' ? '#0b2540' : 'transparent',
                    color: orderFilterTab === 'pending' ? '#fff' : '#475569',
                    boxShadow: orderFilterTab === 'pending' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ⚡ Active & Pending Tasks ({pendingOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilterTab('completed')}
                  style={{
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: orderFilterTab === 'completed' ? '#059669' : 'transparent',
                    color: orderFilterTab === 'completed' ? '#fff' : '#475569',
                    boxShadow: orderFilterTab === 'completed' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ✅ Completed Archive ({completedOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilterTab('all')}
                  style={{
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: orderFilterTab === 'all' ? '#0b2540' : 'transparent',
                    color: orderFilterTab === 'all' ? '#fff' : '#475569',
                    boxShadow: orderFilterTab === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  📋 All ({orders.length})
                </button>
              </div>
            </div>

            {/* Quick KPI Bar for Outstanding Collections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.2rem' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Pending Tasks</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0b2540' }}>{pendingOrders.length} Orders</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Awaiting warehouse packing or roof completion</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Completed & Commissioned</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>{completedOrders.length} Finished</div>
                <div style={{ fontSize: '0.7rem', color: '#059669' }}>100% Handover & Digital Certificate active</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Collections Received</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>
                  ₹{orders.reduce((acc, o) => acc + Number(o.advancePaid || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>Total collected to date</div>
              </div>

              <div style={{ background: '#fef2f2', padding: '12px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Balance to Collect</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b91c1c' }}>
                  ₹{orders.reduce((acc, o) => acc + Number(o.balanceDue || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>Outstanding across customer orders</div>
              </div>
            </div>

            {displayedOrders.length === 0 ? (
              <div style={{ background: '#f8fafc', padding: '2.5rem', textAlign: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>
                  {orderFilterTab === 'completed' ? '🎉' : '📦'}
                </span>
                <b>No {orderFilterTab === 'completed' ? 'completed' : 'pending'} orders found.</b>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                  {orderFilterTab === 'completed'
                    ? 'Orders will appear here once marked completed or when installation handover is signed.'
                    : 'All active installation orders have been resolved and completed!'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>Order Number</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>Customer & Site</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>System</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Order Value</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', minWidth: '220px' }}>Payment Status & Collection</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Dispatch</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Install</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>Crew Assigned</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', minWidth: '200px' }}>Tracking & Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map((o) => {
                      const completed = isOrderCompleted(o)
                      const isPaid = Number(o.balanceDue || 0) <= 0 || Number(o.advancePaid || 0) >= Number(o.totalAmount || 0)
                      return (
                        <tr
                          key={o.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            background: completed ? '#fcfdfd' : '#ffffff'
                          }}
                        >
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            <div style={{ color: '#0b2540' }}>{o.orderNumber}</div>
                            {completed && (
                              <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                ✓ COMPLETED
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 'bold', color: '#0b2540' }}>{o.customerName}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{o.phone}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{o.address?.slice(0, 32)}...</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontWeight: '600', color: '#0e5a8a' }}>{o.capacityKw} kW</span>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{o.systemType}</div>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold' }}>
                            ₹{Number(o.totalAmount || 0).toLocaleString()}
                          </td>

                          {/* PAYMENT STATUS & AMOUNT RECEIVED (POINT 1) */}
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '2px' }}>
                                <span style={{ color: '#64748b' }}>Received:</span>
                                <b style={{ color: '#16a34a' }}>₹{Number(o.advancePaid || 0).toLocaleString()}</b>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                                <span style={{ color: '#64748b' }}>Balance Due:</span>
                                <b style={{ color: isPaid ? '#15803d' : '#b91c1c' }}>
                                  ₹{Number(o.balanceDue || 0).toLocaleString()}
                                </b>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    background: isPaid ? '#dcfce7' : '#fef3c7',
                                    color: isPaid ? '#15803d' : '#92400e'
                                  }}
                                >
                                  {isPaid ? '✓ Fully Paid' : '⏳ Partial Payment'}
                                </span>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedOrderForPayment(o)
                                      setOrderPaymentForm({
                                        amountReceived: o.balanceDue > 0 ? o.balanceDue : '',
                                        paymentMode: 'UPI / Online QR',
                                        milestone: 'Booking Advance (35%)',
                                        referenceNo: '',
                                        notes: '',
                                        sendCustomerReceipt: true
                                      })
                                    }}
                                    style={{
                                      background: '#0e5a8a',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    💵 + Payment
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setViewingPaymentOrder(o)}
                                    style={{
                                      background: '#f1f5f9',
                                      color: '#0e5a8a',
                                      border: '1px solid #cbd5e1',
                                      padding: '3px 7px',
                                      borderRadius: '4px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                    title="View milestone breakdown & payment history ledger"
                                  >
                                    💳 Milestones ({o.paymentHistory?.length || 0})
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <StatusBadge status={o.dispatchStatus} />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <StatusBadge status={o.installationStatus} />
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: '#0e5a8a', fontWeight: '500' }}>
                            {o.assignedCrew}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0e5a8a' }}>
                              ⚡ {o.trackingStage || 'Order Booked'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                              {o.trackingHistory && o.trackingHistory[0]?.notes
                                ? o.trackingHistory[0].notes.slice(0, 48) + '...'
                                : 'In progress'}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => {
                                  setSelectedOrderForTracking(o)
                                  setTrackingForm({
                                    stage: o.trackingStage || 'Kit BOM Packed at Warehouse',
                                    notes: '',
                                    updatedBy: o.assignedCrew || 'Operations Desk'
                                  })
                                }}
                                style={{
                                  background: '#ffb81c',
                                  color: '#0b2540',
                                  border: 'none',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontWeight: 'bold',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer'
                                }}
                              >
                                ⚡ Update Stage
                              </button>
                              {!completed && (
                                <button
                                  onClick={() => handleMarkOrderCompleted(o.id)}
                                  style={{
                                    background: '#10b981',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✓ Mark Completed
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 6. INSTALLATIONS (Scene 4: On the roof - Crew scheduling & Digital Signature) */}
        {activeTab === 'installations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Rooftop Installations & 15-Technician Field Crews</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Scene 4: Mobile/Tablet rooftop completion form: log start/finish times, verify generation, upload finished roof photos, and capture customer digital signature on screen!
                </p>
              </div>
            </div>

            {/* Technicians roster summary */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.4rem', border: '1px solid #e2e8f0', marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px' }}>
                Active Field Technicians (15 Personnel in 3 Specialized Crews):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {['Crew Alpha', 'Crew Beta', 'Crew Gamma'].map((crewName) => {
                  const members = technicians.filter((t) => t.crew === crewName)
                  return (
                    <div key={crewName} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <b style={{ color: '#0e5a8a' }}>{crewName}</b> ({members.length} Techs)
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                        Lead: <b>{members[0]?.name}</b> • {members.map((m) => m.name.split(' ')[0]).join(', ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Handover Dialog / Modal */}
            {selectedInstForSign && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '2px solid #16a34a', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(22,163,74,0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#0b2540' }}>
                    📱 Mobile Field Handover Form: {selectedInstForSign.customerName}
                  </h3>
                  <button onClick={() => setSelectedInstForSign(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569' }}>Start Time</label>
                    <input
                      type="text"
                      value={handoverFormData.startTime}
                      onChange={(e) => setHandoverFormData({ ...handoverFormData, startTime: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569' }}>Finish Time</label>
                    <input
                      type="text"
                      value={handoverFormData.finishTime}
                      onChange={(e) => setHandoverFormData({ ...handoverFormData, finishTime: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569' }}>Confirmed System Size (kW)</label>
                    <input
                      type="number"
                      value={handoverFormData.systemSizeKw}
                      onChange={(e) => setHandoverFormData({ ...handoverFormData, systemSizeKw: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569' }}>Tested Generation (kW)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={handoverFormData.powerGenerationTestedKw}
                      onChange={(e) => setHandoverFormData({ ...handoverFormData, powerGenerationTestedKw: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569' }}>Handover Acceptance Notes</label>
                  <input
                    type="text"
                    value={handoverFormData.notes}
                    onChange={(e) => setHandoverFormData({ ...handoverFormData, notes: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedInstForSign(null)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(true)}
                    style={{ background: '#ffb81c', color: '#0b2540', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ✍️ Open Customer Screen Signature Pad
                  </button>
                </div>
              </div>
            )}

            {/* Installations list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {installations.map((inst) => (
                <div key={inst.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#0b2540' }}>{inst.customerName}</h4>
                        <StatusBadge status={inst.status} />
                      </div>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                        Crew: <b>{inst.crewName}</b> • Address: {inst.address}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Capacity: {inst.systemSizeKw} kW</span>
                      {inst.customerSigned ? (
                        <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>✓ Digital Signature Logged</div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedInstForSign(inst)
                            setHandoverFormData({
                              ...handoverFormData,
                              systemSizeKw: inst.systemSizeKw,
                              signerName: inst.customerName
                            })
                          }}
                          style={{
                            marginTop: '4px',
                            background: '#ffb81c',
                            color: '#0b2540',
                            border: 'none',
                            fontWeight: 'bold',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          📱 Open Handover Form & Sign-off
                        </button>
                      )}
                    </div>
                  </div>

                  {inst.customerSigned && (
                    <div style={{ marginTop: '12px', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#166534' }}>
                          Commissioned: {inst.startTime} - {inst.finishTime} (Tested: {inst.powerGenerationTestedKw} kW)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                          Signed by {inst.customerSignerName || inst.customerName}
                        </div>
                      </div>
                      {inst.customerSignature && (
                        <img src={inst.customerSignature} alt="Signature Proof" style={{ height: '32px' }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. WARRANTY & RAINY SEASON BREAKDOWNS (Scene 5) */}
        {activeTab === 'warranty' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Customer Warranty Registry & Support Desk</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Scene 5: View complete customer warranty records starting from their dispatch date. Raise breakdown complaints on customer's behalf when follow-up is requested.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenRaiseTicketModal()}
                style={{
                  background: '#0e5a8a',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(14,90,138,0.25)'
                }}
              >
                ➕ Raise Issue on Behalf of Customer
              </button>
            </div>

            {/* Customer Warranty Master Directory */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0b2540' }}>
                    📂 Customer-wise Dispatched Equipment & Warranty Directory
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Each product serial number is uniquely bound to exactly one customer. Warranty clock starts on dispatch date.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Filter Customer:</span>
                  <select
                    value={customerWarrantyFilter}
                    onChange={(e) => setCustomerWarrantyFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#f8fafc' }}
                  >
                    <option value="all">All Registered Customers</option>
                    {registeredUsers
                      .filter((u) => u.role === 'customer')
                      .map((u) => (
                        <option key={u.id} value={u.email}>
                          {u.name} ({u.city || 'Punjab'})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Grouped Customer Warranty Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {registeredUsers
                  .filter((u) => u.role === 'customer')
                  .filter((u) => customerWarrantyFilter === 'all' || u.email.toLowerCase() === customerWarrantyFilter.toLowerCase())
                  .map((cust) => {
                    const custWarranties = warranties.filter(
                      (w) => (w.customerEmail && w.customerEmail.toLowerCase() === cust.email.toLowerCase()) ||
                             (w.customerName && w.customerName.toLowerCase() === cust.name.toLowerCase())
                    )
                    const custOrders = orders.filter(
                      (o) => (o.customerEmail && o.customerEmail.toLowerCase() === cust.email.toLowerCase()) ||
                             (o.customerName && o.customerName.toLowerCase() === cust.name.toLowerCase())
                    )

                    return (
                      <div
                        key={cust.id}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <b style={{ fontSize: '1rem', color: '#0b2540' }}>{cust.name}</b>
                              <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                {cust.connectionCategory || 'Residential'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              📧 {cust.email} • 📞 {cust.phone} • 📍 {cust.address}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                              Orders: {custOrders.length} • Units Registered: {custWarranties.length}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenRaiseTicketModal(cust)}
                              style={{
                                background: '#f1f5f9',
                                color: '#0e5a8a',
                                border: '1px solid #cbd5e1',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              ⚡ Raise Ticket for Customer
                            </button>
                          </div>
                        </div>

                        {custWarranties.length === 0 ? (
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                            No dispatched units under active warranty yet for this customer. Warranties start automatically upon warehouse truck dispatch.
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
                              <thead>
                                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                                  <th style={{ padding: '6px 10px' }}>Unique Serial Number</th>
                                  <th style={{ padding: '6px 10px' }}>Equipment Item</th>
                                  <th style={{ padding: '6px 10px' }}>Type</th>
                                  <th style={{ padding: '6px 10px' }}>Dispatch Date (Clock Start)</th>
                                  <th style={{ padding: '6px 10px' }}>Valid Until</th>
                                  <th style={{ padding: '6px 10px', textAlign: 'center' }}>Duration</th>
                                  <th style={{ padding: '6px 10px', textAlign: 'center' }}>Status</th>
                                  <th style={{ padding: '6px 10px', textAlign: 'right' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {custWarranties.map((w) => {
                                  const today = new Date().toISOString().slice(0, 10)
                                  const isExpired = w.endDate && w.endDate < today
                                  return (
                                    <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#0e5a8a' }}>
                                        {w.serialNumber}
                                      </td>
                                      <td style={{ padding: '6px 10px', color: '#0b2540', fontWeight: '500' }}>
                                        {w.equipmentName}
                                      </td>
                                      <td style={{ padding: '6px 10px', textTransform: 'capitalize', color: '#64748b' }}>
                                        {w.equipmentType}
                                      </td>
                                      <td style={{ padding: '6px 10px', fontWeight: '600', color: '#1e293b' }}>
                                        {w.startDate || w.dispatchDate || '2026-11-14'}
                                      </td>
                                      <td style={{ padding: '6px 10px', color: isExpired ? '#b91c1c' : '#15803d', fontWeight: '600' }}>
                                        {w.endDate}
                                      </td>
                                      <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                                        {w.warrantyYears} Years
                                      </td>
                                      <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                        {isExpired ? (
                                          <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                            Expired
                                          </span>
                                        ) : (
                                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                            Active
                                          </span>
                                        )}
                                      </td>
                                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setRaiseTicketForm({
                                              customerEmail: cust.email,
                                              customerName: cust.name,
                                              phone: cust.phone || '',
                                              selectedEquipment: w.equipmentName,
                                              serialNumber: w.serialNumber,
                                              equipmentType: w.equipmentType || 'Inverter',
                                              faultCode: 'E04 - Heavy Rain Grid Isolation Error',
                                              description: `Reported issue with unit: ${w.equipmentName} (${w.serialNumber})`,
                                              troubleshootingDifficulty: true,
                                              difficultyNotes: 'Homeowner called team for assistance.',
                                              technicianAssigned: 'Amit Singh (Lead Tech)'
                                            })
                                            setShowRaiseTicketModal(true)
                                          }}
                                          style={{
                                            background: '#e0f2fe',
                                            color: '#0369a1',
                                            border: 'none',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.72rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          + File Issue
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Quick 2-Second Serial Search Bar */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '6px' }}>
                🔍 Instant Serial Number / Customer Lookup:
              </div>
              <input
                type="text"
                placeholder="Type serial number (e.g. INV-SUN-3K-88910) or customer name (e.g. Rajesh, Kapurthala)..."
                value={serialSearchQuery}
                onChange={(e) => setSerialSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '2px solid #0e5a8a', fontSize: '0.95rem' }}
              />
            </div>

            {/* Search results & registry */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>
                Active & Registered Serial Clocks ({filteredSerials.length} units found)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Serial Number</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Equipment</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Customer</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Warranty Period</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Coverage Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSerials.map((s) => {
                      const today = new Date().toISOString().slice(0, 10)
                      const isExpired = s.warrantyEndDate && s.warrantyEndDate < today
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 'bold', color: '#0e5a8a' }}>{s.serialNumber}</td>
                          <td style={{ padding: '8px 12px' }}>{s.itemName}</td>
                          <td style={{ padding: '8px 12px', fontWeight: '500' }}>{s.customerName || 'Staged in Warehouse'}</td>
                          <td style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#64748b' }}>
                            {s.warrantyStartDate} to {s.warrantyEndDate} ({s.warrantyYears} Years)
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            {isExpired ? (
                              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                Expired
                              </span>
                            ) : (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                Active
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold' }}>
                            {isExpired ? (
                              <span style={{ color: '#b91c1c' }}>Billable (Parts + Labour)</span>
                            ) : (
                              <span style={{ color: '#15803d' }}>100% Free Replacement (₹0)</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Service Complaints & Tickets */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#0b2540' }}>Customer Breakdown Tickets & Follow-Up Desk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map((t) => (
                  <div key={t.id} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <b>Ticket #{t.ticketNumber}</b> — {t.customerName} ({t.phone})
                          <StatusBadge status={t.status} />
                          {t.troubleshootingDifficulty && (
                            <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                              ⚠️ Customer Unable to Troubleshoot • Urgent Follow-up
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#0e5a8a', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '2px' }}>
                          Unit: {t.reportedItem || t.equipmentType} • Serial #: {t.serialNumber || 'N/A'} • Fault: {t.faultCode}
                        </div>
                        {t.raisedBy && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Origin: <b>{t.raisedBy}</b>
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            background: t.isUnderWarranty ? '#dcfce7' : '#fee2e2',
                            color: t.isUnderWarranty ? '#15803d' : '#b91c1c',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {t.isUnderWarranty ? 'Under Warranty (₹0 Bill)' : `Out of Warranty (₹${t.estimatedCost.toLocaleString()} Billed)`}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '6px 0', fontSize: '0.82rem', color: '#475569' }}>
                      "{t.description}"
                    </p>

                    {t.difficultyNotes && (
                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '6px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#78350f', margin: '4px 0 8px' }}>
                        <b>Troubleshooting Difficulty Note:</b> {t.difficultyNotes}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                      <span>Technician: <b>{t.technicianAssigned}</b> • Notes: {t.resolutionNotes}</span>
                      {t.status !== 'resolved' && (
                        <button
                          onClick={() => resolveServiceTicket(t.id, 'Repair verified and tested on site.')}
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. FINANCE (Strictly Live Data at Current Time - No Mock Figures) */}
        {activeTab === 'finance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Executive Financial Reconciliation & Real-Time Job Profitability</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Strictly calculated live at current time: <b>{new Date().toLocaleTimeString()}</b> ({new Date().toLocaleDateString()}) • Zero mock or static metrics. Hardware evaluated against live warehouse inventory costs.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                🖨️ Print Financial Statement
              </button>
            </div>

            {/* Financial Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Contract Value</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0b2540', marginTop: '4px' }}>
                  ₹{liveFinancials.totalContractRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Across {orders.length} booked project{orders.length === 1 ? '' : 's'}
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Collected Revenue</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>
                  ₹{liveFinancials.totalCollectedRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '4px', fontWeight: 600 }}>
                  {liveFinancials.collectionRatePct}% Collection Rate
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Outstanding Balance</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
                  ₹{liveFinancials.totalOutstandingBalance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: '4px' }}>
                  {liveFinancials.liveJobs.filter((j) => j.balanceDue > 0).length} customer balances due
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Hardware & Stock Cost</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#e11d48', marginTop: '4px' }}>
                  ₹{liveFinancials.totalHardwareCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Warehouse inventory valuation
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Tech Wages & Permits</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>
                  ₹{(liveFinancials.totalTechWages + liveFinancials.totalPermitsCost).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  ₹4,500/kW + PSPCL net-metering
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Net Gross Profit</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: liveFinancials.netGrossProfit >= 0 ? '#16a34a' : '#b91c1c', marginTop: '4px' }}>
                  ₹{liveFinancials.netGrossProfit.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: liveFinancials.netGrossProfit >= 0 ? '#15803d' : '#b91c1c', marginTop: '4px', fontWeight: 600 }}>
                  Margin: {liveFinancials.overallMarginPct}%
                </div>
              </div>
            </div>

            {/* Live Job-by-Job Profitability Table */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>Live Installation Profit / Loss Breakdown</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Calculated dynamically from live order records, BOM dispatched items, and technician wage allocations.
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  ● Live Data Synchronized
                </span>
              </div>

              {liveFinancials.liveJobs.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No orders found at current time.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Order / Customer</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Contract Value</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Collected</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Balance Due</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Stock Cost</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Tech Wages</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Permits</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Gross Profit</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Margin %</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Subsidy Status</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveFinancials.liveJobs.map((p) => {
                        const isProfit = p.grossProfit >= 0
                        const matchedOrder = orders.find((o) => o.id === p.orderId)
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px 10px' }}>
                              <div style={{ fontWeight: 'bold', color: '#0b2540' }}>{p.customerName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>#{p.orderNumber} • {p.assignedCrew || 'Unassigned'}</div>
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{p.totalAmount.toLocaleString()}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>₹{p.revenueReceived.toLocaleString()}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: p.balanceDue > 0 ? '#b91c1c' : '#64748b', fontWeight: 600 }}>
                              {p.balanceDue > 0 ? `₹${p.balanceDue.toLocaleString()}` : '✓ Cleared'}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#e11d48' }}>₹{p.stockPurchaseCost.toLocaleString()}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{p.technicianWages.toLocaleString()}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{p.permitsAndLogistics.toLocaleString()}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', color: isProfit ? '#16a34a' : '#b91c1c' }}>
                              {isProfit ? `+₹${p.grossProfit.toLocaleString()}` : `-₹${Math.abs(p.grossProfit).toLocaleString()}`}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', color: isProfit ? '#16a34a' : '#b91c1c' }}>
                              {p.profitMarginPct}%
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                                {p.subsidyStatus.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              {matchedOrder && (
                                <button
                                  onClick={() => setViewingPaymentOrder(matchedOrder)}
                                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0e5a8a', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  💳 Ledger ({p.paymentHistory?.length || 0})
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Live Payment Transactions Ledger */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>Live Payment Transactions Ledger ({liveFinancials.allTransactions.length} Entries)</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Complete audit trail of all advance & milestone receipts recorded by Admin and On-Site Technicians.
                  </p>
                </div>
              </div>

              {liveFinancials.allTransactions.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No payment receipts recorded yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Receipt #</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Date & Time</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Customer & Order</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Milestone Purpose</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Mode & Reference</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount Paid</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Verified By</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Notification Alert</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Receipt Slip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveFinancials.allTransactions.map((tx, idx) => (
                        <tr key={tx.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 'bold', color: '#0e5a8a' }}>
                            {tx.receiptNumber || `RCPT-${idx + 1}`}
                          </td>
                          <td style={{ padding: '8px 10px', color: '#64748b' }}>
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#0b2540' }}>{tx.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Order #{tx.orderNumber}</div>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#0b2540', fontWeight: 500 }}>
                            {tx.milestone || 'Milestone Payment'}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 500 }}>{tx.paymentMode}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ref: {tx.referenceNo || 'Direct Handover'}</div>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
                            ₹{Number(tx.amountReceived || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: '#334155' }}>
                            {tx.updatedBy}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            {tx.notificationSent ? (
                              <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                📱 Dispatched ({tx.notificationChannel || 'WhatsApp+SMS'})
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              onClick={() => setSelectedReceipt(tx)}
                              style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              📜 View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. REPORTS (Strictly Live Operational Data - No Hardcoded Values) */}
        {activeTab === 'reports' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#0b2540', margin: 0 }}>Executive Director Operations & Live Audit Reports</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Real-time operational health for SunPower Solutions • Audit timestamp: <b>{new Date().toLocaleTimeString()}</b> ({new Date().toLocaleDateString()})
                </p>
              </div>
              <button
                onClick={() => window.print()}
                style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              >
                🖨️ Print / Export Executive Summary
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '1.5rem' }}>
              {/* Project Execution Status */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', background: '#fafafa' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Live Project Execution</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0e5a8a', marginTop: '6px' }}>
                  {completedOrders.length} / {orders.length}{' '}
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    ({orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}% Handed Over)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '10px' }}>
                  <div
                    style={{
                      width: `${orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}%`,
                      height: '100%',
                      background: '#10b981',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Active In-Field: <b>{pendingOrders.length}</b></span>
                  <span>Fully Commissioned: <b>{completedOrders.length}</b></span>
                </div>
              </div>

              {/* Field Crew Deployment */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', background: '#fafafa' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Field Crew Deployment</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#16a34a', marginTop: '6px' }}>
                  {orders.filter((o) => !isOrderCompleted(o) && o.assignedCrew).length} / {technicians.length}{' '}
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Assigned Deployments</span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#475569' }}>
                  {technicians.length} registered technical staff active across{' '}
                  <b>{Array.from(new Set(technicians.map((t) => t.crew || 'Crew Alpha'))).length} Field Crews</b>.
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                  Active Crews: {Array.from(new Set(technicians.map((t) => t.crew || 'Crew Alpha'))).join(', ')}
                </div>
              </div>

              {/* Active Warranty Support Tickets */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', background: '#fafafa' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Warranty Service & SLAs</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: tickets.filter((t) => t.status !== 'resolved').length > 0 ? '#d97706' : '#16a34a', marginTop: '6px' }}>
                  {tickets.filter((t) => t.status !== 'resolved').length} Open{' '}
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {tickets.length} Total</span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#475569' }}>
                  Resolution Rate:{' '}
                  <b>{tickets.length > 0 ? Math.round((tickets.filter((t) => t.status === 'resolved').length / tickets.length) * 100) : 100}%</b>
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                  Resolved: {tickets.filter((t) => t.status === 'resolved').length} • Active In Follow-up: {tickets.filter((t) => t.status !== 'resolved').length}
                </div>
              </div>

              {/* Sales to Commissioning Funnel */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', background: '#fafafa' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pipeline Funnel Velocity</span>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0b2540', marginTop: '6px' }}>
                  {enquiries.length} Enquiries → {orders.length} Orders
                </div>
                <div style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#475569' }}>
                  Conversion Rate: <b>{enquiries.length > 0 ? Math.round((orders.length / enquiries.length) * 100) : 0}%</b>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                  Surveys: {surveys.length} ({surveys.filter((s) => s.status === 'approved').length} approved) • Quotes: {quotations.length}
                </div>
              </div>

              {/* Warehouse Inventory Valuation */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', background: '#fafafa' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Warehouse Asset Valuation</span>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0e5a8a', marginTop: '6px' }}>
                  ₹{inventory.reduce((acc, i) => acc + (i.quantityInStock || 0) * (i.unitCost || 0), 0).toLocaleString()}
                </div>
                <div style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#475569' }}>
                  {inventory.reduce((acc, i) => acc + (i.quantityInStock || 0), 0)} Total Units across {inventory.length} SKUs
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: inventory.filter((i) => i.quantityInStock <= (i.reorderThreshold || 5)).length > 0 ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
                  {inventory.filter((i) => i.quantityInStock <= (i.reorderThreshold || 5)).length} SKU{inventory.filter((i) => i.quantityInStock <= (i.reorderThreshold || 5)).length === 1 ? '' : 's'} at/below reorder threshold
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signature Pad Modal Component */}
      {showSignaturePad && (
        <SignaturePad
          customerName={handoverFormData.signerName || selectedInstForSign?.customerName}
          onSave={handleSaveSignature}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}

      {/* Point 4: Admin / Staff Payment Confirmation Modal */}
      {selectedQuoteForAdminPay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 60,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '520px',
              borderRadius: '16px',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.25rem' }}>
                  🛡️ Staff Payment Verification & Order Confirmation
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Quote #{selectedQuoteForAdminPay.quoteNumber} • Customer: {selectedQuoteForAdminPay.customerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuoteForAdminPay(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '0.82rem' }}>
              <div>Total System Value: <b>₹{selectedQuoteForAdminPay.netPayableAmount.toLocaleString()}</b></div>
              <div>Required Advance (35%): <b>₹{selectedQuoteForAdminPay.advanceRequired.toLocaleString()}</b></div>
              {selectedQuoteForAdminPay.paymentDetails && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', color: '#0e5a8a' }}>
                  <b>Customer Reported:</b> ₹{selectedQuoteForAdminPay.paymentDetails.submittedAmount.toLocaleString()} via {selectedQuoteForAdminPay.paymentDetails.paymentMode} (Ref: {selectedQuoteForAdminPay.paymentDetails.transactionRef})
                </div>
              )}
            </div>

            <form onSubmit={handleAdminConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Confirmed Amount Received in Company Account (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={adminPaymentForm.amountPaid}
                  onChange={(e) => setAdminPaymentForm({ ...adminPaymentForm, amountPaid: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Payment Mode Verified *
                  </label>
                  <select
                    value={adminPaymentForm.paymentMode}
                    onChange={(e) => setAdminPaymentForm({ ...adminPaymentForm, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI Transfer">UPI Transfer</option>
                    <option value="Cheque Cleared">Cheque Cleared</option>
                    <option value="Cash Receipt at Office">Cash Receipt at Office</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Bank Transaction / Slip Ref *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminPaymentForm.transactionRef}
                    onChange={(e) => setAdminPaymentForm({ ...adminPaymentForm, transactionRef: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Staff Verification Notes
                </label>
                <input
                  type="text"
                  value={adminPaymentForm.staffNotes}
                  onChange={(e) => setAdminPaymentForm({ ...adminPaymentForm, staffNotes: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForAdminPay(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  ✓ Confirm Payment & Release Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Point 5: Live Order Tracking Update Modal (Admin / Assigned Technician) */}
      {selectedOrderForTracking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 60,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '540px',
              borderRadius: '16px',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.25rem' }}>
                  ⚡ Update Live Order Tracking Progress
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Order #{selectedOrderForTracking.orderNumber} • Customer: {selectedOrderForTracking.customerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrackingUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Progress Stage *
                </label>
                <select
                  value={trackingForm.stage}
                  onChange={(e) => setTrackingForm({ ...trackingForm, stage: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="Payment Confirmed & Order Booked">Payment Confirmed & Order Booked</option>
                  <option value="Kit BOM Packed at Warehouse">Kit BOM Packed at Warehouse</option>
                  <option value="Dispatched on Delivery Truck (Serials Scanned)">Dispatched on Delivery Truck (Serials Scanned)</option>
                  <option value="Materials Delivered at Customer Rooftop">Materials Delivered at Customer Rooftop</option>
                  <option value="Civil Structure & Mounting Fixed">Civil Structure & Mounting Fixed</option>
                  <option value="Solar Panels Mounted & Clamped">Solar Panels Mounted & Clamped</option>
                  <option value="Inverter & Battery Wiring Completed">Inverter & Battery Wiring Completed</option>
                  <option value="Earthing & Net-Meter Synchronization Checked">Earthing & Net-Meter Synchronization Checked</option>
                  <option value="Commissioned & Handover Complete">Commissioned & Handover Complete</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Update Logged By (Admin or Assigned Technician) *
                </label>
                <select
                  value={trackingForm.updatedBy}
                  onChange={(e) => setTrackingForm({ ...trackingForm, updatedBy: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Admin HQ Operations Desk">Admin HQ Operations Desk</option>
                  <option value={selectedOrderForTracking.assignedCrew || 'Crew Alpha'}>
                    {selectedOrderForTracking.assignedCrew || 'Assigned Crew'}
                  </option>
                  <option value="Amit Singh (Lead Technician)">Amit Singh (Lead Technician)</option>
                  <option value="Rohan Sharma (Site Tech)">Rohan Sharma (Site Tech)</option>
                  <option value="Warehouse Dispatch Manager">Warehouse Dispatch Manager</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Field Technician Notes / Observations
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Structure mounted on RCC roof slab. South tilt calibrated to 22 degrees. Inverter synchronization check passed."
                  value={trackingForm.notes}
                  onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Real-Time Customer Alert Dispatch System */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#0b2540' }}>
                  <input
                    type="checkbox"
                    checked={trackingForm.sendCustomerAlert}
                    onChange={(e) => setTrackingForm({ ...trackingForm, sendCustomerAlert: e.target.checked })}
                    style={{ accentColor: '#0e5a8a', width: '16px', height: '16px' }}
                  />
                  <span>📱 Broadcast Live Alert to Customer via WhatsApp, SMS & Email</span>
                </label>
                {trackingForm.sendCustomerAlert && (
                  <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#475569', background: '#ecfdf5', padding: '8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '2px' }}>
                      ⚡ Instant Customer Preview (Sending to {selectedOrderForTracking.phone || selectedOrderForTracking.customerEmail}):
                    </div>
                    <i>"Dear {selectedOrderForTracking.customerName}, your SunPower project #{selectedOrderForTracking.orderNumber} status is now: {trackingForm.stage}. Notes: {trackingForm.notes || 'Status updated by field team.'}"</i>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForTracking(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#ffb81c', color: '#0b2540', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Save & Publish Live Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👑 ADMIN OVERWRITE FEASIBILITY MODAL */}
      {selectedSurveyForOverride && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#4c1d95', fontSize: '1.2rem' }}>
                  👑 Admin Feasibility Decision Overwrite
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Customer: <b>{selectedSurveyForOverride.customerName}</b> • Surveyor: {selectedSurveyForOverride.technicianName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSurveyForOverride(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.82rem', color: '#5b21b6' }}>
              <div>Current Decision: <b>{selectedSurveyForOverride.status === 'approved' ? '✓ Feasibility Approved' : '✕ Feasibility Disapproved'}</b></div>
              {selectedSurveyForOverride.disapprovalReason && (
                <div style={{ marginTop: '4px', color: '#7c3aed' }}>
                  Current Reason: <em>"{selectedSurveyForOverride.disapprovalReason}"</em>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveAdminOverride} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                  Select Overwrite Verdict:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setOverrideStatus('approved')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: overrideStatus === 'approved' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: overrideStatus === 'approved' ? '#dcfce7' : '#fff',
                      color: overrideStatus === 'approved' ? '#166534' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Overwrite to APPROVED
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideStatus('rejected')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: overrideStatus === 'rejected' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                      background: overrideStatus === 'rejected' ? '#fee2e2' : '#fff',
                      color: overrideStatus === 'rejected' ? '#991b1b' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Overwrite to DISAPPROVED
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Administrative Justification / Engineering Reason (Mandatory) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    overrideStatus === 'approved'
                      ? 'e.g. Overwritten after structural engineer reviewed structural drawings: mounting elevated super-structure resolves parapet shading.'
                      : 'e.g. Overwritten to Disapproved: DISCOM feeder is saturated and does not permit 5 kW solar injection at this transformer zone.'
                  }
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSurveyForOverride(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#6d28d9',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Confirm Admin Overwrite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADMIN MODAL: TECHNICAL STAFF OFFICIAL IDP & SHOWCASE */}
      {/* ======================================================== */}
      {selectedStaffForIdp && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🪪</span> Technical Staff Official ID Pass & Work Portfolio
                </h3>
                <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.78rem' }}>
                  Verified Identity Pass, Active Work Handling Status & Completed Installations Showcase
                </p>
              </div>
              <button
                onClick={() => setSelectedStaffForIdp(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            {/* Smart ID Pass Display Card */}
            <div
              style={{
                background: staffIdpViewSide === 'front'
                  ? 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 60%, #0369a1 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(11,37,64,0.2)',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid rgba(245,158,11,0.5)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>☀️</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5px' }}>SOLAROPS OPERATIONS</div>
                    <div style={{ fontSize: '0.6rem', color: '#fef08a', textTransform: 'uppercase' }}>
                      MNRE & CEA Certified Solar Field Technician
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setStaffIdpViewSide(staffIdpViewSide === 'front' ? 'back' : 'front')}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    🔄 Flip ({staffIdpViewSide === 'front' ? 'Back Side' : 'Front Side'})
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{ background: '#f59e0b', color: '#0b2540', border: 'none', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>

              {staffIdpViewSide === 'front' ? (
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Official Security Badge Emblem (No photo in ID card) */}
                  <div
                    style={{
                      width: '84px',
                      height: '96px',
                      borderRadius: '10px',
                      border: '2px solid #f59e0b',
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(15,23,42,0.9) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '1.9rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>🛡️</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fef08a', marginTop: '2px', letterSpacing: '0.5px' }}>
                      {selectedStaffForIdp.employeeId || 'MNRE'}
                    </div>
                    <div style={{ fontSize: '0.52rem', color: '#93c5fd', fontWeight: 700 }}>
                      GOVT REG
                    </div>
                    <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      ● ACTIVE
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedStaffForIdp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#fef08a' }}>{selectedStaffForIdp.role || 'Site Engineer'}</div>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px' }}>
                      {selectedStaffForIdp.crew}
                    </div>
                    <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                      <div>Badge: <b style={{ color: '#fff' }}>{selectedStaffForIdp.employeeId || 'TECH-SOL-101'}</b></div>
                      <div>License: <b style={{ color: '#fff' }}>{selectedStaffForIdp.licenseNo || 'MNRE-PB-8841'}</b></div>
                      <div>Valid: <b style={{ color: '#86efac' }}>DEC 2028</b></div>
                      <div>Blood: <b style={{ color: '#fca5a5' }}>{selectedStaffForIdp.bloodGroup || 'B+'}</b></div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: '#fff', padding: '6px', borderRadius: '8px' }}>
                    <svg width="74" height="74" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                      <rect x="8" y="8" width="26" height="26" fill="#0b2540" />
                      <rect x="12" y="12" width="18" height="18" fill="#ffffff" />
                      <rect x="16" y="16" width="10" height="10" fill="#0b2540" />
                      <rect x="66" y="8" width="26" height="26" fill="#0b2540" />
                      <rect x="70" y="12" width="18" height="18" fill="#ffffff" />
                      <rect x="74" y="16" width="10" height="10" fill="#0b2540" />
                      <rect x="8" y="66" width="26" height="26" fill="#0b2540" />
                      <rect x="12" y="70" width="18" height="18" fill="#ffffff" />
                      <rect x="16" y="74" width="10" height="10" fill="#0b2540" />
                      <rect x="44" y="24" width="12" height="12" fill="#0b2540" />
                      <rect x="44" y="44" width="12" height="12" fill="#f59e0b" />
                      <rect x="64" y="64" width="12" height="12" fill="#0b2540" />
                    </svg>
                    <div style={{ fontSize: '0.52rem', color: '#0b2540', fontWeight: 800 }}>VERIFIED</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.76rem', lineHeight: '1.6' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>Official Email: <b>{selectedStaffForIdp.email}</b></div>
                    <div>Phone: <b>{selectedStaffForIdp.phone}</b></div>
                    <div>Emergency SOS: <b style={{ color: '#fca5a5' }}>{selectedStaffForIdp.emergencyContact || '+91 98140 99881'}</b></div>
                    <div>Joining Date: <b>{selectedStaffForIdp.joiningDate || '15 Mar 2023'}</b></div>
                  </div>
                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '6px', fontSize: '0.7rem' }}>
                    Authorized for solar rooftop installations, feasibility surveys, HT/LT electrical synchronization, and DISCOM net-meter testing under SunPower Solutions Pvt Ltd.
                  </div>
                </div>
              )}
            </div>

            {/* Work Handling & Performance Showcase Section (Showing Actual Real Work Counts) */}
            {(() => {
              const staffSurveys = surveys.filter(
                (s) =>
                  s.technicianName?.toLowerCase().includes(selectedStaffForIdp.name.toLowerCase()) ||
                  s.crew?.toLowerCase().includes(selectedStaffForIdp.crew.toLowerCase()) ||
                  s.approvedByName?.toLowerCase().includes(selectedStaffForIdp.name.toLowerCase())
              )
              const staffCompletedSurveys = staffSurveys.filter((s) => s.status === 'approved' || s.status === 'rejected').length
              const staffPendingSurveys = staffSurveys.filter((s) => s.status === 'pending').length

              const staffInstalls = installations.filter(
                (i) =>
                  i.crewName?.toLowerCase().includes(selectedStaffForIdp.crew.toLowerCase()) ||
                  i.crewName?.toLowerCase().includes(selectedStaffForIdp.name.toLowerCase()) ||
                  i.technicianName?.toLowerCase().includes(selectedStaffForIdp.name.toLowerCase())
              )
              const staffCompletedInstalls = staffInstalls.filter((i) => i.status === 'signed_off').length
              const staffActiveInstalls = staffInstalls.filter((i) => i.status !== 'signed_off').length
              const staffTotalKwInstalled = staffInstalls
                .filter((i) => i.status === 'signed_off')
                .reduce((acc, i) => acc + (Number(i.systemSizeKw) || 0), 0)

              const staffTickets = tickets.filter(
                (t) =>
                  t.technicianAssigned?.toLowerCase().includes(selectedStaffForIdp.name.toLowerCase()) ||
                  t.technicianAssigned?.toLowerCase().includes(selectedStaffForIdp.crew.toLowerCase())
              )
              const staffResolvedTickets = staffTickets.filter((t) => t.status === 'resolved').length
              const staffActualTotalWorks = staffCompletedSurveys + staffCompletedInstalls + staffResolvedTickets + staffActiveInstalls + staffPendingSurveys

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '1.5rem' }}>
                  {/* Work Handling Status */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0b2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡</span> Active Work Handling & Real-Time Status
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.6' }}>
                      <div>Current Status: <b style={{ color: staffActiveInstalls > 0 ? '#991b1b' : '#059669' }}>{staffActiveInstalls > 0 ? 'On Roof - Active Installation' : selectedStaffForIdp.workHandling?.currentStatus || 'Available for Dispatch'}</b></div>
                      <div>Active Tasks: <b>{staffActiveInstalls} active installs • {staffPendingSurveys} pending surveys</b></div>
                      <div>Location: <b>{selectedStaffForIdp.workHandling?.address || selectedStaffForIdp.crew + ' Base Station'}</b></div>
                      <div>Current Stage: <b>{selectedStaffForIdp.workHandling?.activeStage || 'Awaiting Dispatch'}</b></div>
                    </div>

                    <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>MANDATORY CHECKLIST:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.72rem' }}>
                        {Object.entries(selectedStaffForIdp.workHandling?.checklist || { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: true, earthingResistance: true, netMeterSync: false, customerSignoff: false }).map(([k, v]) => (
                          <div key={k} style={{ color: v ? '#059669' : '#64748b' }}>
                            {v ? '✓' : '○'} {k.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Work Showcase Summary (Actual Real Work Counts) */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0b2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🌟</span> Actual Work Metrics & Installation History
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>ACTUAL KW INSTALLED</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b2540' }}>{staffTotalKwInstalled} kW</div>
                      </div>
                      <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>COMPLETED SURVEYS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{staffCompletedSurveys}</div>
                      </div>
                    </div>

                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>Total Real Works Completed / Handled:</span>
                        <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                          ⚡ {staffActualTotalWorks} Real Works
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                        Includes {staffCompletedSurveys} surveys, {staffCompletedInstalls} installations, and {staffResolvedTickets} service tickets.
                      </div>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                      <b>Completed Projects Showcase Gallery:</b> {(selectedStaffForIdp.showcaseGallery || []).length} items
                    </div>
                  </div>
                </div>
              )
            })()}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedStaffForIdp(null)}
                style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Close IDP & Showcase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD / UPDATE ORDER PAYMENT MODAL (ADMIN) */}
      {selectedOrderForPayment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 64, 0.6)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '1.8rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #cbd5e1'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💵</span> Update Received Payment Amount
                </h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                  Order: <b>{selectedOrderForPayment.orderNumber}</b> • Client: <b>{selectedOrderForPayment.customerName}</b>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForPayment(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Financial Status Summary */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>TOTAL VALUE</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0b2540' }}>
                    ₹{Number(selectedOrderForPayment.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>RECEIVED SO FAR</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{Number(selectedOrderForPayment.advancePaid || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>REMAINING DUE</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b91c1c' }}>
                    ₹{Number(selectedOrderForPayment.balanceDue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {orderPaymentMsg && (
              <div style={{ background: '#ecfdf5', color: '#047857', padding: '10px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '12px', fontWeight: 600 }}>
                {orderPaymentMsg}
              </div>
            )}

            <form onSubmit={handleRecordOrderPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Amount Received Now (₹) *
                  </label>
                  {Number(selectedOrderForPayment.balanceDue || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setOrderPaymentForm({ ...orderPaymentForm, amountReceived: selectedOrderForPayment.balanceDue })}
                      style={{ background: 'none', border: 'none', color: '#0e5a8a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Fill Full Balance (₹{Number(selectedOrderForPayment.balanceDue).toLocaleString()})
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedOrderForPayment.balanceDue || selectedOrderForPayment.totalAmount}
                  value={orderPaymentForm.amountReceived}
                  onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, amountReceived: e.target.value })}
                  placeholder="e.g. 50000"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Payment Milestone *
                  </label>
                  <select
                    value={orderPaymentForm.milestone}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, milestone: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="Booking Advance (35%)">Milestone 1: Booking Advance (35%)</option>
                    <option value="Material Staging & Dispatch (40%)">Milestone 2: Material Staging & Dispatch (40%)</option>
                    <option value="Commissioning & Handover (25%)">Milestone 3: Commissioning & Handover (25%)</option>
                    <option value="Full Balance Settlement">Full Balance Settlement</option>
                    <option value="On-Site Custom Payment">On-Site Custom Payment</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Payment Mode *
                  </label>
                  <select
                    value={orderPaymentForm.paymentMode}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="UPI / Online QR">UPI / QR (PhonePe, GPay, Paytm)</option>
                    <option value="Cash Collected On-Site">Cash Collected On-Site</option>
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Ref / Receipt / UTR #
                  </label>
                  <input
                    type="text"
                    value={orderPaymentForm.referenceNo}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, referenceNo: e.target.value })}
                    placeholder="e.g. UTR-988410 / CHQ-102"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Payment Notes / Context
                  </label>
                  <input
                    type="text"
                    value={orderPaymentForm.notes}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, notes: e.target.value })}
                    placeholder="e.g. Milestone 2 verified via NEFT"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Digital Receipt Dispatch Confirmation */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#0b2540' }}>
                  <input
                    type="checkbox"
                    checked={orderPaymentForm.sendCustomerReceipt}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, sendCustomerReceipt: e.target.checked })}
                    style={{ accentColor: '#0e5a8a', width: '16px', height: '16px' }}
                  />
                  <span>📜 Generate Receipt Slip & Dispatch Notification to Customer (WhatsApp/SMS)</span>
                </label>
                {orderPaymentForm.sendCustomerReceipt && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#047857', background: '#ecfdf5', padding: '6px 8px', borderRadius: '4px' }}>
                    ✓ Auto-generates unique receipt (e.g. RCPT-SUN-2026-...) and records verified by {currentUser?.name || 'Admin Operations Desk'}.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '9px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(14,90,138,0.25)' }}
                >
                  ✓ Record Payment & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PROJECT MILESTONES & PAYMENT HISTORY LEDGER */}
      {viewingPaymentOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 64, 0.65)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1150,
            padding: '1rem',
            backdropFilter: 'blur(3px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.8rem',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid #cbd5e1',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💳</span> Milestones & Payment History
                </h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Order <b>#{viewingPaymentOrder.orderNumber}</b> • Client: <b>{viewingPaymentOrder.customerName}</b> ({viewingPaymentOrder.phone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingPaymentOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Financial Status Summary */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TOTAL CONTRACT</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b2540' }}>
                    ₹{Number(viewingPaymentOrder.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>COLLECTED SO FAR</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{Number(viewingPaymentOrder.advancePaid || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>OUTSTANDING DUE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: Number(viewingPaymentOrder.balanceDue || 0) > 0 ? '#b91c1c' : '#15803d' }}>
                    ₹{Number(viewingPaymentOrder.balanceDue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Stage Milestone Schedule */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#0b2540' }}>Project Payment Milestones</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  {
                    name: 'Milestone 1: Booking Advance (35%)',
                    desc: 'Payable upon contract agreement to initiate engineering & DISCOM net-metering file.',
                    pct: 0.35,
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.35)
                  },
                  {
                    name: 'Milestone 2: Material Staging & Dispatch (40%)',
                    desc: 'Payable prior to inventory truck loading & on-site delivery.',
                    pct: 0.40,
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.40)
                  },
                  {
                    name: 'Milestone 3: Commissioning & Handover (25%)',
                    desc: 'Payable upon rooftop generation testing & digital handover acceptance.',
                    pct: 0.25,
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.25)
                  }
                ].map((m, idx) => {
                  const cumulativeThreshold = Math.round(Number(viewingPaymentOrder.totalAmount || 0) * (idx === 0 ? 0.35 : idx === 1 ? 0.75 : 1.0))
                  const isSatisfied = Number(viewingPaymentOrder.advancePaid || 0) >= cumulativeThreshold
                  return (
                    <div key={idx} style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${isSatisfied ? '#bbf7d0' : '#e2e8f0'}`, background: isSatisfied ? '#f0fdf4' : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isSatisfied ? '#15803d' : '#0b2540' }}>
                          {isSatisfied ? '✓ ' : '⏳ '} {m.name}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isSatisfied ? '#15803d' : '#475569' }}>
                          ₹{m.target.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {m.desc}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Transactions Ledger */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0b2540' }}>Payment Receipts Ledger ({viewingPaymentOrder.paymentHistory?.length || 0})</h4>
                {Number(viewingPaymentOrder.balanceDue || 0) > 0 && (
                  <button
                    onClick={() => {
                      const target = viewingPaymentOrder
                      setViewingPaymentOrder(null)
                      setSelectedOrderForPayment(target)
                      setOrderPaymentForm({
                        amountReceived: target.balanceDue > 0 ? target.balanceDue : '',
                        paymentMode: 'UPI / Online QR',
                        milestone: 'Material Staging & Dispatch (40%)',
                        referenceNo: '',
                        notes: '',
                        sendCustomerReceipt: true
                      })
                    }}
                    style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Record New Payment
                  </button>
                )}
              </div>

              {(!viewingPaymentOrder.paymentHistory || viewingPaymentOrder.paymentHistory.length === 0) ? (
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>No payment receipts recorded yet for this project.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {viewingPaymentOrder.paymentHistory.map((ph, idx) => (
                    <div key={ph.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 800, color: '#0e5a8a', fontSize: '0.82rem' }}>
                            {ph.receiptNumber || `RCPT-${idx + 1}`}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '0.74rem', marginLeft: '8px' }}>
                            {new Date(ph.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>
                          ₹{Number(ph.amountReceived || 0).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.75rem', color: '#475569' }}>
                        <div>
                          <b>{ph.milestone || 'Milestone Payment'}</b> • {ph.paymentMode} ({ph.referenceNo || 'Direct Handover'})
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReceipt({
                              ...ph,
                              orderNumber: viewingPaymentOrder.orderNumber,
                              customerName: viewingPaymentOrder.customerName,
                              customerPhone: viewingPaymentOrder.phone,
                              orderTotal: viewingPaymentOrder.totalAmount,
                              currentBalance: viewingPaymentOrder.balanceDue
                            })
                          }}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0e5a8a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          📜 View Digital Slip
                        </button>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                        Verified By: <b>{ph.updatedBy || 'Staff'}</b> • Notes: {ph.notes || 'No notes'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setViewingPaymentOrder(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 18px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT DIGITAL PAYMENT RECEIPT */}
      {selectedReceipt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 64, 0.7)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1200,
            padding: '1rem',
            backdropFilter: 'blur(3px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              border: '2px solid #0e5a8a'
            }}
          >
            {/* Printable Receipt Header */}
            <div style={{ borderBottom: '2px solid #0b2540', paddingBottom: '12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0, color: '#0b2540', fontSize: '1.3rem', fontWeight: 800 }}>☀️ SunPower Solutions</h2>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Official Solar Project Installation & Commissioning Receipt
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  GSTIN: 03AAACS1234F1Z9 • Punjab State Power Corporation (PSPCL) Certified
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  ✓ VERIFIED RECEIPT
                </span>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e5a8a', marginTop: '4px' }}>
                  {selectedReceipt.receiptNumber || 'RCPT-SUN-OFFICIAL'}
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', marginBottom: '14px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>CUSTOMER DETAILS:</span>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>{selectedReceipt.customerName}</div>
                <div style={{ color: '#475569', fontSize: '0.74rem' }}>{selectedReceipt.customerPhone || selectedReceipt.customerEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>TRANSACTION DATE:</span>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>{new Date(selectedReceipt.timestamp).toLocaleDateString()}</div>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{new Date(selectedReceipt.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Transaction Specifics */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Order Number:</span>
                <span style={{ fontWeight: 700, color: '#0b2540' }}>#{selectedReceipt.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Milestone Purpose:</span>
                <span style={{ fontWeight: 700, color: '#0e5a8a' }}>{selectedReceipt.milestone || 'Milestone Payment'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600 }}>{selectedReceipt.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Transaction Reference / UTR:</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{selectedReceipt.referenceNo || 'Direct Handover'}</span>
              </div>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b2540' }}>AMOUNT RECEIVED:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
                  ₹{Number(selectedReceipt.amountReceived || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Audit & Staff Verification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <div>
                Verified By: <b>{selectedReceipt.updatedBy || 'Accounts Desk'}</b>
                <div style={{ fontSize: '0.7rem' }}>Delivery: {selectedReceipt.notificationChannel || 'WhatsApp & SMS Dispatched'}</div>
              </div>
              <div style={{ textAlign: 'right', border: '1px dashed #94a3b8', padding: '4px 8px', borderRadius: '4px', background: '#fafafa' }}>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>SunPower Accounts</div>
                <div style={{ fontSize: '0.68rem', color: '#15803d' }}>Electronically Certified</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
              <a
                href={generateWhatsAppReceiptLink(
                  selectedReceipt.customerPhone,
                  selectedReceipt.customerName,
                  selectedReceipt.orderNumber,
                  selectedReceipt.receiptNumber,
                  selectedReceipt.amountReceived,
                  selectedReceipt.milestone,
                  selectedReceipt.currentBalance || 0
                )}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700
                }}
              >
                <span>📲</span> Send on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
              >
                🖨️ Print Receipt Slip
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Customize Dispatch Items Prior to Truck Dispatch */}
      {editingDispatchItemsOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 70,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '680px',
              borderRadius: '16px',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.2rem' }}>
                  ✏️ Customize Items to Dispatch: Order #{editingDispatchItemsOrder.orderNumber}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Customer: <b>{editingDispatchItemsOrder.customerName}</b> ({editingDispatchItemsOrder.capacityKw} kW {editingDispatchItemsOrder.systemType})
                </p>
              </div>
              <button
                onClick={() => setEditingDispatchItemsOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '12px' }}>
              Items are fixed automatically from quote/package BOM upon booking. Admin can adjust quantities, add warehouse inventory items, or remove items before confirming truck departure.
            </p>

            {/* Current Item Drafts Table */}
            <div style={{ overflowX: 'auto', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px' }}>SKU</th>
                    <th style={{ padding: '8px 10px' }}>Item Name</th>
                    <th style={{ padding: '8px 10px' }}>Category</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Dispatch Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Stock</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchItemDrafts.map((it, idx) => {
                    const invItem = inventory.find(
                      (inv) => (it.sku && inv.sku === it.sku) || inv.name.toLowerCase() === (it.name || '').toLowerCase()
                    )
                    const stock = invItem ? invItem.stockQty : 0
                    return (
                      <tr key={it.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 'bold' }}>{it.sku || 'N/A'}</td>
                        <td style={{ padding: '8px 10px', color: '#0b2540' }}>{it.name}</td>
                        <td style={{ padding: '8px 10px', textTransform: 'capitalize', color: '#64748b' }}>{it.category}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <input
                            type="number"
                            min="1"
                            value={it.qty}
                            onChange={(e) => {
                              const newQty = Math.max(1, Number(e.target.value) || 1)
                              const updated = [...dispatchItemDrafts]
                              updated[idx].qty = newQty
                              setDispatchItemDrafts(updated)
                            }}
                            style={{ width: '60px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
                          />
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', color: stock >= it.qty ? '#15803d' : '#b91c1c' }}>
                          {stock}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setDispatchItemDrafts(dispatchItemDrafts.filter((_, i) => i !== idx))
                            }}
                            style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Item from Warehouse Inventory Catalog */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '6px' }}>
                + Add Component from Warehouse Stock
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={addInventorySkuSelect}
                  onChange={(e) => setAddInventorySkuSelect(e.target.value)}
                  style={{ flex: 1, minWidth: '220px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="">-- Choose item from Warehouse Inventory --</option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.sku}>
                      {inv.name} (SKU: {inv.sku} • Stock: {inv.stockQty})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={addInventoryQty}
                  onChange={(e) => setAddInventoryQty(Math.max(1, Number(e.target.value) || 1))}
                  placeholder="Qty"
                  style={{ width: '70px', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.82rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomInventoryItem}
                  disabled={!addInventorySkuSelect}
                  style={{
                    background: addInventorySkuSelect ? '#0e5a8a' : '#cbd5e1',
                    color: '#fff',
                    border: 'none',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    cursor: addInventorySkuSelect ? 'pointer' : 'not-allowed'
                  }}
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingDispatchItemsOrder(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '9px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDispatchItems}
                style={{ background: '#15803d', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(21,128,61,0.25)' }}
              >
                ✓ Save Dispatch Items Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Raise Complaint on Behalf of Customer */}
      {showRaiseTicketModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 70,
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '560px',
              borderRadius: '16px',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.2rem' }}>
                  ➕ Raise Support / Service Complaint on Behalf of Customer
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  SunPower Service Desk • Log customer follow-up call & dispatch technician
                </p>
              </div>
              <button
                onClick={() => setShowRaiseTicketModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {raiseTicketSuccessMsg && (
              <div style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '14px' }}>
                {raiseTicketSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSubmitRaiseTicketOnBehalf} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Customer Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select Customer *
                </label>
                <select
                  required
                  value={raiseTicketForm.customerEmail}
                  onChange={(e) => {
                    const matchedCust = registeredUsers.find((u) => u.email === e.target.value)
                    if (matchedCust) {
                      setRaiseTicketForm({
                        ...raiseTicketForm,
                        customerEmail: matchedCust.email,
                        customerName: matchedCust.name,
                        phone: matchedCust.phone || ''
                      })
                    } else {
                      setRaiseTicketForm({
                        ...raiseTicketForm,
                        customerEmail: e.target.value
                      })
                    }
                  }}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="">-- Choose Registered Customer --</option>
                  {registeredUsers
                    .filter((u) => u.role === 'customer')
                    .map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.email} • {u.phone})
                      </option>
                    ))}
                </select>
              </div>

              {/* Customer Specific Purchased Equipment / Serial */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select Specific Dispatched Equipment / Serial # *
                </label>
                <select
                  value={raiseTicketForm.serialNumber}
                  onChange={(e) => {
                    const selSn = e.target.value
                    const matchedWar = warranties.find((w) => w.serialNumber === selSn)
                    setRaiseTicketForm({
                      ...raiseTicketForm,
                      serialNumber: selSn,
                      selectedEquipment: matchedWar ? matchedWar.equipmentName : (selSn || 'General System Breakdown'),
                      equipmentType: matchedWar ? matchedWar.equipmentType : 'Inverter'
                    })
                  }}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="">-- Select Specific Dispatched Unit or General Issue --</option>
                  <option value="GENERAL-SOLAR-ISSUE">General System Breakdown / Trouble Troubleshooting</option>
                  {warranties
                    .filter(
                      (w) => !raiseTicketForm.customerEmail ||
                             (w.customerEmail && w.customerEmail.toLowerCase() === raiseTicketForm.customerEmail.toLowerCase()) ||
                             (w.customerName && w.customerName.toLowerCase() === raiseTicketForm.customerName.toLowerCase())
                    )
                    .map((w) => (
                      <option key={w.id} value={w.serialNumber}>
                        {w.equipmentName} (SN: {w.serialNumber} • Dispatched: {w.startDate})
                      </option>
                    ))}
                </select>
              </div>

              {/* Fault Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Fault Code / Symptom
                  </label>
                  <select
                    value={raiseTicketForm.faultCode}
                    onChange={(e) => setRaiseTicketForm({ ...raiseTicketForm, faultCode: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="E04 - Heavy Rain Grid Isolation Error">E04 - Heavy Rain Grid Isolation Error</option>
                    <option value="E02 - Inverter Low DC Voltage / Zero Power">E02 - Inverter Low DC Voltage / Zero Power</option>
                    <option value="E09 - Earthing Leakage Fault">E09 - Earthing Leakage Fault</option>
                    <option value="F12 - Fan Breakdown / Overheat">F12 - Fan Breakdown / Overheat</option>
                    <option value="B01 - Battery BMS Communication Fault">B01 - Battery BMS Communication Fault</option>
                    <option value="OTH - General Physical / Performance Issue">OTH - General Physical / Performance Issue</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Assign Field Technician *
                  </label>
                  <select
                    value={raiseTicketForm.technicianAssigned}
                    onChange={(e) => setRaiseTicketForm({ ...raiseTicketForm, technicianAssigned: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={`${t.name} (${t.role || 'Tech'})`}>
                        {t.name} ({t.crew})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Customer Breakdown Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={raiseTicketForm.description}
                  onChange={(e) => setRaiseTicketForm({ ...raiseTicketForm, description: e.target.value })}
                  placeholder="e.g. Homeowner called stating inverter display went off after thunderstorms. Zero solar generation."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', resize: 'vertical' }}
                />
              </div>

              {/* Difficulty Troubleshooting Checkbox & Notes */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'bold', color: '#92400e', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={raiseTicketForm.troubleshootingDifficulty}
                    onChange={(e) => setRaiseTicketForm({ ...raiseTicketForm, troubleshootingDifficulty: e.target.checked })}
                  />
                  Customer unable to troubleshoot on their own (Needs rapid technician follow-up)
                </label>
                {raiseTicketForm.troubleshootingDifficulty && (
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="text"
                      value={raiseTicketForm.difficultyNotes}
                      onChange={(e) => setRaiseTicketForm({ ...raiseTicketForm, difficultyNotes: e.target.value })}
                      placeholder="Notes on customer difficulty (e.g. Homeowner checked AC switch, unable to test DC voltage safely)"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #fcd34d', fontSize: '0.8rem', background: '#fff' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowRaiseTicketModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '9px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(14,90,138,0.25)' }}
                >
                  🚀 Dispatch Technician & Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
