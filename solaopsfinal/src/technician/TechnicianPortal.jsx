import React, { useState, useRef } from 'react'
import { useSolarStore, generateWhatsAppReceiptLink, generateWhatsAppTrackingLink } from '../lib/store'

export function TechnicianPortal({ onGoHome }) {
  const {
    currentUser,
    logout,
    enquiries,
    surveys,
    orders,
    installations,
    tickets,
    technicians,
    createOrUpdateSurvey,
    submitRoofHandover,
    updateOrderTrackingStatus,
    recordOrderPayment,
    markOrderCompleted,
    resolveServiceTicket,
    addTechnicianShowcaseItem,
    updateTechnicianChecklist,
    updateTechnicianHandling,
    updateDailyRouteTask
  } = useSolarStore()

  // Match technician identity and assigned crew
  const myName = currentUser?.name || 'Amit Singh'
  const myTechRecord = technicians.find(
    (t) =>
      t.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
      t.name?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      currentUser?.name?.toLowerCase().includes(t.name?.toLowerCase())
  ) || technicians[0] || {
    id: 'tech-1',
    name: myName,
    role: 'Lead Solar PV Engineer',
    crew: 'Crew Alpha',
    employeeId: 'TECH-SOL-101',
    email: currentUser?.email || 'tech@sunpowersolutions.in',
    phone: '+91 98141 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    licenseNo: 'MNRE-NABL-PV-2024-8841',
    bloodGroup: 'B+',
    emergencyContact: '+91 98140 99881',
    joiningDate: '2023-03-15',
    safetyClearance: 'Class-A: HT / Working at Heights (IS 3521)',
    stats: { totalKwInstalled: 64.5, surveysCompleted: 38, customerRating: 4.95, safetyScore: '100% Zero-Incident' },
    certifications: ['NISE Suryamitra Certified', 'CEA Grade-A Supervisor License', 'IS 3521 Heights Safety'],
    showcaseGallery: [],
    workHandling: {
      currentStatus: 'On Roof - Testing & Earthing Sync',
      currentCustomer: 'Rajesh Sharma',
      address: 'Plot 42, Model Town, Jalandhar',
      activeStage: 'Inverter Synchronization & Net Metering',
      dailyRoute: [],
      checklist: { ppeSafety: true, bomUnboxing: true, structureAnchoring: true, dcArrayStringing: true, earthingResistance: true, netMeterSync: false, customerSignoff: false }
    }
  }
  const myCrew = myTechRecord?.crew || 'Crew Alpha'

  // STRICT ASSIGNMENT FILTERS (Technician can ONLY see their assigned customers and jobs)
  const myEnquiries = enquiries.filter((e) => {
    const isDirectlyAssigned =
      e.assignedTechName?.toLowerCase().includes(myName.toLowerCase()) ||
      (e.assignedCrew && e.assignedCrew.toLowerCase().includes(myCrew.toLowerCase()))
    const hasMySurvey = surveys.some(
      (s) =>
        s.enquiryId === e.id &&
        (s.technicianName?.toLowerCase().includes(myName.toLowerCase()) ||
         s.approvedByName?.toLowerCase().includes(myName.toLowerCase()))
    )
    return isDirectlyAssigned || hasMySurvey
  })

  const mySurveys = surveys.filter(
    (s) =>
      s.technicianName?.toLowerCase().includes(myName.toLowerCase()) ||
      s.approvedByName?.toLowerCase().includes(myName.toLowerCase())
  )

  const myInstallations = installations.filter(
    (i) =>
      i.crewName?.toLowerCase().includes(myCrew.toLowerCase()) ||
      i.crewName?.toLowerCase().includes(myName.toLowerCase()) ||
      i.assignedTechName?.toLowerCase().includes(myName.toLowerCase())
  )

  const myOrders = orders.filter(
    (o) =>
      o.assignedCrew?.toLowerCase().includes(myCrew.toLowerCase()) ||
      o.assignedCrew?.toLowerCase().includes(myName.toLowerCase()) ||
      o.assignedTechName?.toLowerCase().includes(myName.toLowerCase())
  )

  const myTickets = tickets.filter(
    (t) =>
      t.technicianAssigned?.toLowerCase().includes(myName.toLowerCase()) ||
      t.technicianAssigned?.toLowerCase().includes(myCrew.toLowerCase())
  )

  // Tabs: 'surveys' | 'installations' | 'tracking' | 'service'
  const [activeTab, setActiveTab] = useState('surveys')

  // Survey Form Modal State
  const [selectedEnquiryForSurvey, setSelectedEnquiryForSurvey] = useState(null)
  const [surveyDecision, setSurveyDecision] = useState('approved') // 'approved' | 'rejected'
  const [surveyData, setSurveyData] = useState({
    shadowFreeRoofSqft: 350,
    monthlyBill: 3500,
    gridConnectionType: 'Residential 1-Phase 230V',
    roofDirection: 'South (Optimal 180°)',
    roofTiltDegrees: 22,
    cableRunDistanceMeters: 18,
    structuralIntegrity: 'Reinforced Concrete (RCC) - Sturdy',
    disapprovalReason: '',
    surveyorNotes: 'Optimal sunlight incidence. Parapet height suitable for standard metal stands.'
  })

  // Installation Handover Form State
  const [selectedInstForHandover, setSelectedInstForHandover] = useState(null)
  const [handoverData, setHandoverData] = useState({
    startTime: '09:30 AM',
    finishTime: '04:15 PM',
    powerGenerationTestedKw: 3.1,
    signerName: '',
    notes: 'Structure anchored with chemical fasteners. Earthing resistance measured at 1.8 Ohms. ACDB/DCDB tested.',
    photos: [
      { url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80', label: 'Rooftop Solar Array Mounted' },
      { url: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80', label: 'Inverter & ACDB/DCDB Distribution Box' }
    ]
  })
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  // Tracking Update State
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null)
  const [trackingStage, setTrackingStage] = useState('Mounting Structure Anchored on Roof')
  const [trackingNotes, setTrackingNotes] = useState('')

  // Service Ticket Resolution State
  const [selectedTicketForResolution, setSelectedTicketForResolution] = useState(null)
  const [ticketResolutionNotes, setTicketResolutionNotes] = useState('')

  // IDP, Showcase & Work Handling State
  const [showAddShowcaseModal, setShowAddShowcaseModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [idPassSide, setIdPassSide] = useState('front') // 'front' | 'back'
  const [newShowcase, setNewShowcase] = useState({
    title: '',
    capacity: '3.0 kW',
    customer: '',
    location: 'Punjab',
    photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
    review: 'Fast and high quality rooftop execution. Highly satisfied with safety and neat cabling.',
    highlights: 'Bi-facial Tier-1 solar panels with 3.3 kW dual-MPPT inverter and net-metering sync.',
    rating: 5
  })
  const [activeHandlingStatus, setActiveHandlingStatus] = useState(
    myTechRecord?.workHandling?.currentStatus || 'On Roof - System Testing & Earthing Sync'
  )

  const handleToggleChecklist = async (key) => {
    const currentVal = myTechRecord?.workHandling?.checklist?.[key] || false
    await updateTechnicianChecklist({
      technicianId: myTechRecord.id,
      checkKey: key,
      isChecked: !currentVal
    })
  }

  const handleUpdateHandlingStatus = async (status) => {
    setActiveHandlingStatus(status)
    await updateTechnicianHandling({
      technicianId: myTechRecord.id,
      updates: { currentStatus: status }
    })
  }

  const handleRouteTaskStatus = async (idx, status) => {
    await updateDailyRouteTask({
      technicianId: myTechRecord.id,
      taskIndex: idx,
      status
    })
  }

  const handleSaveShowcase = async (e) => {
    e.preventDefault()
    if (!newShowcase.title.trim() || !newShowcase.customer.trim()) {
      alert('Project title and customer name are required.')
      return
    }
    await addTechnicianShowcaseItem({
      technicianId: myTechRecord.id,
      project: newShowcase
    })
    setShowAddShowcaseModal(false)
    setNewShowcase({
      title: '',
      capacity: '3.0 kW',
      customer: '',
      location: 'Punjab',
      photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
      review: 'Fast and high quality rooftop execution. Highly satisfied with safety and neat cabling.',
      highlights: 'Bi-facial Tier-1 solar panels with 3.3 kW dual-MPPT inverter and net-metering sync.',
      rating: 5
    })
    alert('Project successfully added to your public Work Showcase!')
  }

  // Signature Pad Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0b2540'
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  // Handle Technician Survey Submit
  const handleSaveSurvey = async (e) => {
    e.preventDefault()
    if (!selectedEnquiryForSurvey) return

    if (surveyDecision === 'rejected' && !surveyData.disapprovalReason.trim()) {
      alert('Mandatory Requirement: Please explain the technical reason for disapproving feasibility.')
      return
    }

    await createOrUpdateSurvey({
      enquiryId: selectedEnquiryForSurvey.id,
      customerName: selectedEnquiryForSurvey.customerName,
      technicianName: currentUser?.name || 'Amit Singh (Lead Tech)',
      surveyDate: new Date().toISOString().slice(0, 10),
      timeSlot: 'Morning (09:00 AM - 01:00 PM)',
      shadowFreeRoofSqft: surveyData.shadowFreeRoofSqft,
      monthlyBill: surveyData.monthlyBill,
      gridConnectionType: surveyData.gridConnectionType,
      roofDirection: surveyData.roofDirection,
      roofTiltDegrees: surveyData.roofTiltDegrees,
      cableRunDistanceMeters: surveyData.cableRunDistanceMeters,
      structuralIntegrity: surveyData.structuralIntegrity,
      status: surveyDecision,
      disapprovalReason: surveyDecision === 'rejected' ? surveyData.disapprovalReason : null,
      surveyorNotes: surveyData.surveyorNotes
    })

    setSelectedEnquiryForSurvey(null)
    alert(`Technical Site Survey ${surveyDecision === 'approved' ? 'APPROVED' : 'DISAPPROVED'} successfully recorded!`)
  }

  // Handle Installation Handover Submit
  const handleSaveHandover = async (e) => {
    e.preventDefault()
    if (!selectedInstForHandover) return

    if (!handoverData.signerName.trim()) {
      alert('Customer signer name is required.')
      return
    }

    let signatureSvg = null
    if (canvasRef.current && hasSignature) {
      signatureSvg = canvasRef.current.toDataURL()
    }

    await submitRoofHandover(selectedInstForHandover.id, {
      startTime: handoverData.startTime,
      finishTime: handoverData.finishTime,
      powerGenerationTestedKw: Number(handoverData.powerGenerationTestedKw),
      customerSignerName: handoverData.signerName,
      signatureSvg: signatureSvg,
      notes: handoverData.notes,
      photos: handoverData.photos
    })

    setSelectedInstForHandover(null)
    alert('Rooftop Handover successfully submitted! System marked commissioned and customer warranty clock initiated.')
  }

  // Handle Tracking Milestone Update
  const handleSaveTracking = async (e) => {
    e.preventDefault()
    if (!selectedOrderForTracking) return

    await updateOrderTrackingStatus({
      orderId: selectedOrderForTracking.id,
      stage: trackingStage,
      notes: trackingNotes || `Field progress updated to: ${trackingStage}`,
      updatedBy: currentUser?.name || `${myName} (${myCrew})`,
      sendCustomerAlert: true
    })

    setSelectedOrderForTracking(null)
    setTrackingNotes('')
    alert(`Order ${selectedOrderForTracking.orderNumber} tracking milestone updated to "${trackingStage}" & customer alert dispatched!`)
  }

  // Handle Service Ticket Resolution
  const handleSaveTicketResolution = async (e) => {
    e.preventDefault()
    if (!selectedTicketForResolution) return

    await resolveServiceTicket(
      selectedTicketForResolution.id,
      ticketResolutionNotes || 'Issue diagnosed and resolved on site. System operational.'
    )

    setSelectedTicketForResolution(null)
    setTicketResolutionNotes('')
    alert(`Service Ticket ${selectedTicketForResolution.ticketNumber} marked RESOLVED!`)
  }

  // Count badges (Strictly for assigned work)
  const pendingSurveysCount = myEnquiries.filter(
    (e) => !surveys.some((s) => s.enquiryId === e.id && s.status !== 'pending')
  ).length
  const activeInstallsCount = myInstallations.filter((i) => i.status !== 'signed_off').length
  const openTicketsCount = myTickets.filter((t) => t.status === 'open').length

  // Orders Tab Segment Filter & Payment Updating State (Technician Authority)
  const [orderFilterTab, setOrderFilterTab] = useState('pending') // 'pending' | 'completed' | 'all'
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null)
  const [viewingPaymentOrder, setViewingPaymentOrder] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [orderPaymentForm, setOrderPaymentForm] = useState({
    amountReceived: '',
    paymentMode: 'Cash Collected On-Site',
    milestone: 'Commissioning & Handover (25%)',
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

  const pendingMyOrders = myOrders.filter((o) => !isOrderCompleted(o))
  const completedMyOrders = myOrders.filter((o) => isOrderCompleted(o))
  const displayedMyOrders =
    orderFilterTab === 'pending'
      ? pendingMyOrders
      : orderFilterTab === 'completed'
      ? completedMyOrders
      : myOrders

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
      updatedBy: `${myName} (${myCrew})`,
      sendCustomerReceipt: orderPaymentForm.sendCustomerReceipt
    })

    if (res.success) {
      setOrderPaymentMsg(`✓ Payment of ₹${amt.toLocaleString()} recorded! Receipt: ${res.receiptNumber || 'Generated'}. Remaining balance: ₹${res.order.balanceDue.toLocaleString()}`)
      setTimeout(() => {
        setOrderPaymentMsg('')
        setSelectedOrderForPayment(null)
        setOrderPaymentForm({
          amountReceived: '',
          paymentMode: 'Cash Collected On-Site',
          milestone: 'Commissioning & Handover (25%)',
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
    if (!window.confirm('Mark this assigned rooftop order as completed & commissioned? It will move to your Completed Orders archive.')) return
    const res = await markOrderCompleted({
      orderId,
      completionNotes: `Installation and testing completed on site by ${myName} (${myCrew}). System running.`,
      updatedBy: `${myName} (${myCrew})`
    })
    if (res.success) {
      alert('Order successfully marked as Completed! Moved to Completed Orders section.')
    }
  }

  // Actual dynamic work metrics for the technician
  const myCompletedSurveys = surveys.filter(
    (s) =>
      (s.technicianName?.toLowerCase().includes(myName.toLowerCase()) ||
       s.approvedByName?.toLowerCase().includes(myName.toLowerCase())) &&
      (s.status === 'approved' || s.status === 'rejected')
  ).length
  const myCompletedInstalls = installations.filter(
    (i) =>
      (i.crewName?.toLowerCase().includes(myCrew.toLowerCase()) ||
       i.crewName?.toLowerCase().includes(myName.toLowerCase()) ||
       i.technicianName?.toLowerCase().includes(myName.toLowerCase())) &&
      i.status === 'signed_off'
  )
  const myActualKwInstalled = myCompletedInstalls.reduce(
    (acc, i) => acc + (Number(i.systemSizeKw) || 0),
    0
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* Top Header */}
      <header
        style={{
          background: '#0b2540',
          color: '#fff',
          padding: '1rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#f59e0b',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.4rem'
            }}
          >
            👷
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.15rem' }}>SolarOps</span>
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0b2540',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Field Technician Portal
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Logged in as: <b>{currentUser?.name || 'Field Technician'}</b> ({currentUser?.email}) • Crew On Duty
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onGoHome}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            ← Public Website
          </button>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 4vw' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {[
            { id: 'idp', label: 'My Digital ID Pass (IDP)', icon: '🪪' },
            { id: 'handling', label: 'Work Handling & Operations', icon: '⚡' },
            { id: 'showcase', label: 'Work Showcase & Portfolio', icon: '🌟', count: (myTechRecord?.showcaseGallery || []).length },
            { id: 'surveys', label: 'Site Surveys & Feasibility', icon: '📐', count: pendingSurveysCount },
            { id: 'installations', label: 'Rooftop Installations & Handover', icon: '🔧', count: activeInstallsCount },
            { id: 'tracking', label: 'Assigned Orders & Live Tracking', icon: '🚚', count: pendingMyOrders.length },
            { id: 'service', label: 'Service & Breakdown Tickets', icon: '🛠️', count: openTicketsCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #f59e0b' : '3px solid transparent',
                color: activeTab === tab.id ? '#0b2540' : '#64748b',
                fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background: activeTab === tab.id ? '#f59e0b' : '#e2e8f0',
                    color: activeTab === tab.id ? '#0b2540' : '#475569',
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontWeight: '800'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Data Privacy & Crew Isolation Banner */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '1.2rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <span>
              <b>Crew Assignment Isolation Active:</b> Logged in as <b>{myName}</b> ({myCrew}). Under operational privacy rules, you can view and update <b>only your assigned customers</b> and scheduled tasks.
            </span>
          </div>
          <span style={{ background: '#dcfce7', color: '#14532d', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.74rem' }}>
            ● My Assigned Customers: {myEnquiries.length + myInstallations.length}
          </span>
        </div>

        {/* ======================================================== */}
        {/* TAB 0A: OFFICIAL DIGITAL ID PASS (IDP) & FIELD CREDENTIAL */}
        {/* ======================================================== */}
        {activeTab === 'idp' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🪪</span> Official Digital Technician ID Pass (IDP)
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Government & MNRE Recognized Digital Smart ID Pass for on-site verification, safety compliance, and customer presentation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIdPassSide(idPassSide === 'front' ? 'back' : 'front')}
                  style={{
                    background: '#f1f5f9',
                    color: '#0b2540',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🔄</span> Flip Card ({idPassSide === 'front' ? 'View Back Side' : 'View Front Side'})
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  style={{
                    background: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📱</span> Show Field QR Seal
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    background: '#0b2540',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🖨️</span> Print Official ID Pass
                </button>
              </div>
            </div>

            {/* Smart ID Card Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
              {/* ID Card Display */}
              <div
                style={{
                  background: idPassSide === 'front'
                    ? 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 60%, #0369a1 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#ffffff',
                  boxShadow: '0 12px 30px rgba(11,37,64,0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid rgba(245,158,11,0.5)',
                  minHeight: '260px',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Holographic Security Overlay Pattern */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                {idPassSide === 'front' ? (
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>☀️</span>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.5px' }}>SOLAROPS OPERATIONS</div>
                          <div style={{ fontSize: '0.62rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            MNRE & CEA Certified Solar PV Installer
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: '#f59e0b', color: '#0b2540', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                          VERIFIED CREW
                        </span>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>📡 RFID ENABLED</div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
                          {myTechRecord.employeeId || 'MNRE'}
                        </div>
                        <div style={{ fontSize: '0.52rem', color: '#93c5fd', fontWeight: 700 }}>
                          GOVT REG
                        </div>
                        <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          ● ACTIVE
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                          {myTechRecord.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 600 }}>
                          {myTechRecord.role}
                        </div>
                        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px', color: '#e0f2fe' }}>
                          {myTechRecord.crew}
                        </div>

                        <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                          <div>Badge ID: <b style={{ color: '#fff' }}>{myTechRecord.employeeId || 'TECH-SOL-101'}</b></div>
                          <div>License: <b style={{ color: '#fff' }}>{myTechRecord.licenseNo || 'MNRE-PB-8841'}</b></div>
                          <div>Valid Thru: <b style={{ color: '#86efac' }}>DEC 2028</b></div>
                          <div>Blood: <b style={{ color: '#fca5a5' }}>{myTechRecord.bloodGroup || 'B+'}</b></div>
                        </div>
                      </div>

                      {/* Scannable SVG QR Code */}
                      <div style={{ textAlign: 'center', background: '#ffffff', padding: '6px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                        <svg width="76" height="76" viewBox="0 0 100 100">
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
                          <rect x="42" y="14" width="8" height="8" fill="#0b2540" />
                          <rect x="46" y="38" width="12" height="12" fill="#f59e0b" />
                          <rect x="20" y="44" width="8" height="8" fill="#0b2540" />
                          <rect x="72" y="44" width="8" height="8" fill="#0b2540" />
                          <rect x="42" y="66" width="8" height="8" fill="#0b2540" />
                          <rect x="64" y="74" width="10" height="10" fill="#0b2540" />
                        </svg>
                        <div style={{ fontSize: '0.55rem', color: '#0b2540', fontWeight: 800, marginTop: '2px' }}>SCAN TO VERIFY</div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#93c5fd' }}>
                      <span>Safety: {myTechRecord.safetyClearance || 'Class-A: Working at Heights (IS 3521)'}</span>
                      <span style={{ color: '#fef08a' }}>SunPower Solutions Certified Tech</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Back of Card */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b' }}>
                        CREDENTIAL & EMERGENCY VERIFICATION
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>BACK SIDE</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.76rem', lineHeight: '1.6' }}>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>OFFICIAL EMAIL</div>
                        <div style={{ fontWeight: 600 }}>{myTechRecord.email || currentUser?.email}</div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>CONTACT PHONE</div>
                        <div style={{ fontWeight: 600 }}>{myTechRecord.phone || '+91 98141 11223'}</div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>EMERGENCY CONTACT</div>
                        <div style={{ fontWeight: 600, color: '#fca5a5' }}>{myTechRecord.emergencyContact || '+91 98140 99881 (Family)'}</div>
                      </div>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>JOINING DATE</div>
                        <div style={{ fontWeight: 600 }}>{myTechRecord.joiningDate || '15 Mar 2023'}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '8px', fontSize: '0.68rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      This card certifies that the bearer is an authorized field solar engineer of SunPower Solutions Pvt Ltd.
                      Authorized to conduct rooftop site surveys, electrical LT/HT wiring, chemical earthing tests, and net-metering synchronization.
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.68rem', color: '#94a3b8' }}>
                      <div>
                        <div>Emergency SOS: <b>+91 1800 200 4455</b></div>
                        <div>Verify Online: <code>sunpowersolutions.in/verify</code></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontStyle: 'italic', color: '#fef08a' }}>A. Sharma</div>
                        <div style={{ borderTop: '1px solid #64748b', paddingTop: '2px', fontSize: '0.62rem' }}>Director of Operations</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Accreditations & Safety Clearances Box */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#0b2540', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🛡️</span> Verified Government & Industry Certifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(myTechRecord.certifications || [
                    'National Institute of Solar Energy (NISE) Suryamitra Certified',
                    'Central Electricity Authority (CEA) Grade-A Supervisor License',
                    'Industrial Working at Heights & Fall-Arrest Compliance (IS 3521)',
                    'Fronius & GoodWe Multi-String Inverter Commissioning Specialist'
                  ]).map((cert, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#059669', fontSize: '1.1rem' }}>✓</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{cert}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Accredited & Verified • Active Standing</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', background: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.78rem', color: '#1e40af' }}>
                  💡 <b>Field Presentation Tip:</b> When presenting this pass to homeowners or DISCOM inspectors, click <b>"Show Field QR Seal"</b> for instant offline optical verification.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 0B: WORK HANDLING & DAILY OPERATIONS */}
        {/* ======================================================== */}
        {activeTab === 'handling' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚡</span> Active Field Work Handling & Operations Workbench
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Step-by-step installation execution checklist, active rooftop status updater, and daily customer itinerary.
                </p>
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Live Status:</span>
                <select
                  value={activeHandlingStatus}
                  onChange={(e) => handleUpdateHandlingStatus(e.target.value)}
                  style={{
                    background: '#0b2540',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <option value="On Roof - System Testing & Earthing Sync">On Roof - System Testing & Earthing Sync</option>
                  <option value="Dispatched & En Route to Site">Dispatched & En Route to Site</option>
                  <option value="Arrived on Site & Unboxing BOM">Arrived on Site & Unboxing BOM</option>
                  <option value="Mounting Structure & Module Array Laying">Mounting Structure & Module Array Laying</option>
                  <option value="Inverter Cabling & DC Stringing">Inverter Cabling & DC Stringing</option>
                  <option value="Earthing Resistance Test (<2.0 Ohms)">Earthing Resistance Test (&lt;2.0 Ohms)</option>
                  <option value="DISCOM Net-Meter Synchronization">DISCOM Net-Meter Synchronization</option>
                  <option value="Ready for Customer Handover & Sign-Off">Ready for Customer Handover & Sign-Off</option>
                </select>
              </div>
            </div>

            {/* Current Active Job Highlight */}
            <div style={{ background: 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)', borderRadius: '12px', padding: '18px 24px', color: '#fff', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(11,37,64,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                    CURRENT FIELD DISPATCH ASSIGNMENT
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                    {myTechRecord?.workHandling?.currentCustomer || 'Rajesh Sharma (ORD-SUN-2026-088)'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                    📍 {myTechRecord?.workHandling?.address || 'Plot 42, Model Town, Jalandhar'} • {myCrew}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#059669', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ● {activeHandlingStatus}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginTop: '6px' }}>
                    Current Stage: <b>{myTechRecord?.workHandling?.activeStage || 'Inverter Synchronization & Net Metering'}</b>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
              {/* Mandatory 7-Step Field Checklist */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>
                    ✅ Mandatory Rooftop Execution Checklist
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Click to toggle completed items
                  </span>
                </div>

                {/* Progress bar */}
                {(() => {
                  const checklist = myTechRecord?.workHandling?.checklist || {}
                  const keys = ['ppeSafety', 'bomUnboxing', 'structureAnchoring', 'dcArrayStringing', 'earthingResistance', 'netMeterSync', 'customerSignoff']
                  const doneCount = keys.filter((k) => checklist[k]).length
                  const pct = Math.round((doneCount / keys.length) * 100)
                  return (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        <span>Completion Progress</span>
                        <span>{doneCount} of 7 Steps ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#059669' : '#f59e0b', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  )
                })()}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'ppeSafety', icon: '🦺', title: '1. PPE & Fall-Arrest Gear Verified', desc: 'Full body safety harness anchored, hard hat, insulated 1000V gloves' },
                    { key: 'bomUnboxing', icon: '📦', title: '2. BOM & Serial Numbers Unboxed', desc: 'Panels, Inverter & ACDB/DCDB serial barcodes verified against order' },
                    { key: 'structureAnchoring', icon: '🏗️', title: '3. Roof Chemical Fasteners & 22° Tilt', desc: 'Torqued to 45 Nm, zero water-proofing leakage verified' },
                    { key: 'dcArrayStringing', icon: '🔌', title: '4. DC Stringing & UV Conduits', desc: 'Voc within MPPT limits (<1000V DC), neat cable trays installed' },
                    { key: 'earthingResistance', icon: '⚡', title: '5. Dual Earthing Pit Resistance Test', desc: 'Megger earth resistance measured at <2.0 Ohms (Equipment + Lightning)' },
                    { key: 'netMeterSync', icon: '📊', title: '6. Inverter Sync & DISCOM Net-Meter', desc: 'Anti-islanding tested, generation telemetry active' },
                    { key: 'customerSignoff', icon: '✍️', title: '7. Customer Handover & Digital Signature', desc: 'Solar app configured on phone, warranty certificate activated' }
                  ].map((step) => {
                    const isChecked = myTechRecord?.workHandling?.checklist?.[step.key] || false
                    return (
                      <div
                        key={step.key}
                        onClick={() => handleToggleChecklist(step.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: isChecked ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                          background: isChecked ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div click
                          style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#059669', width: '16px', height: '16px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isChecked ? '#065f46' : '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{step.icon}</span>
                            <span>{step.title}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: isChecked ? '#047857' : '#64748b', marginTop: '2px' }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('installations')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 6px rgba(5,150,105,0.2)'
                    }}
                  >
                    <span>⚡</span> Proceed to Customer Handover & Signature Form →
                  </button>
                </div>
              </div>

              {/* Today's Route & Timeline */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>
                    🗺️ Today's Field Route & Execution Timeline
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
                    ● Live Tracking
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(myTechRecord?.workHandling?.dailyRoute || [
                    { time: '08:30 AM', task: 'Crew Alpha Morning Safety Briefing & Tool Kit Inspection', status: 'completed' },
                    { time: '10:00 AM', task: 'Site Feasibility Verification - Plot 42, Model Town', status: 'completed' },
                    { time: '01:30 PM', task: 'Mounting Structure & Module Array Laying (3 kW)', status: 'completed' },
                    { time: '03:45 PM', task: 'Inverter Synchronization & Net-Meter Testing', status: 'in_progress' },
                    { time: '05:00 PM', task: 'Customer Handover, App Setup & Digital Signature', status: 'pending' }
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #f1f5f9',
                        background: item.status === 'in_progress' ? '#eff6ff' : item.status === 'completed' ? '#f0fdf4' : '#f8fafc',
                        borderLeft: item.status === 'in_progress' ? '4px solid #2563eb' : item.status === 'completed' ? '4px solid #059669' : '4px solid #cbd5e1'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0b2540' }}>
                          ⏰ {item.time}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleRouteTaskStatus(idx, 'completed')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: item.status === 'completed' ? '#059669' : '#e2e8f0',
                              color: item.status === 'completed' ? '#fff' : '#475569'
                            }}
                          >
                            Done
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRouteTaskStatus(idx, 'in_progress')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: item.status === 'in_progress' ? '#2563eb' : '#e2e8f0',
                              color: item.status === 'in_progress' ? '#fff' : '#475569'
                            }}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRouteTaskStatus(idx, 'pending')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: item.status === 'pending' ? '#64748b' : '#e2e8f0',
                              color: item.status === 'pending' ? '#fff' : '#475569'
                            }}
                          >
                            Wait
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                        {item.task}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 0C: WORK SHOWCASE & PORTFOLIO */}
        {/* ======================================================== */}
        {activeTab === 'showcase' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌟</span> My Solar Installation Showcase & Portfolio
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Showcase of completed rooftop solar installations, verified generation outputs, and verified customer testimonials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddShowcaseModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(11,37,64,0.15)'
                }}
              >
                <span>➕</span> Add Installation to Showcase
              </button>
            </div>

            {/* KPI Performance Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Capacity Installed</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0b2540', marginTop: '4px' }}>
                  {myActualKwInstalled > 0 ? myActualKwInstalled.toFixed(1) : (myTechRecord?.stats?.totalKwInstalled || 0)} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>kW</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '2px' }}>● 100% Grid & Off-grid Sync</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Surveys Completed</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0b2540', marginTop: '4px' }}>
                  {myCompletedSurveys > 0 ? myCompletedSurveys : (myTechRecord?.stats?.surveysCompleted || 0)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '2px' }}>● Feasibility Approved & Inspected</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Customer Rating</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                  ★ {myTechRecord?.stats?.customerRating || 4.95} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 5.0</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>● Based on Verified Handover</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Safety Compliance</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  {myTechRecord?.stats?.safetyScore || '100% Zero-Incident'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '2px' }}>● Zero Fall / Electrical Mishaps</div>
              </div>
            </div>

            {/* Showcase Project Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
              {(myTechRecord.showcaseGallery || []).length === 0 ? (
                <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
                  <div style={{ fontWeight: 600, color: '#0b2540' }}>No Showcase Projects Yet</div>
                  <p style={{ margin: '4px 0 12px', fontSize: '0.82rem' }}>
                    Click "Add Installation to Showcase" to upload photos and customer reviews of your completed solar rooftops!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddShowcaseModal(true)}
                    style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Add First Installation
                  </button>
                </div>
              ) : (
                myTechRecord.showcaseGallery.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Project Photo */}
                    <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                      <img
                        src={proj.photo}
                        alt={proj.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: 10, right: 10, background: '#0b2540', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        ⚡ {proj.capacity}
                      </div>
                      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}>
                        📍 {proj.location}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0b2540', fontWeight: 700 }}>
                            {proj.title}
                          </h4>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                            ★ {proj.rating || 5.0}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                          Client: <b>{proj.customer}</b> • Completed: {proj.date}
                        </div>

                        {proj.review && (
                          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontStyle: 'italic', fontSize: '0.78rem', color: '#334155', marginBottom: '10px' }}>
                            "{proj.review}"
                          </div>
                        )}
                      </div>

                      {proj.highlights && (
                        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                          💡 {proj.highlights}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: SITE SURVEYS & FEASIBILITY (TECHNICIAN AUTHORITY) */}
        {/* ======================================================== */}
        {activeTab === 'surveys' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0 }}>
                  Technical Site Surveys & Feasibility Assessment
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Inspect roof conditions, verify shadow-free space and electrical service cable distance. You have the operational authority to Approve or Disapprove feasibility.
                </p>
              </div>
            </div>

            {/* Pending Inquiries Awaiting Survey */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0b2540' }}>
                  My Assigned Inquiries Scheduled for Site Survey
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Pending Surveys: <b>{pendingSurveysCount}</b>
                </span>
              </div>

              {myEnquiries.length === 0 ? (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.85rem' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>📋</span>
                  No customer inquiries are currently dispatched to you ({myName}). Inquiries assigned by the Operations Coordinator will automatically appear here.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Phone</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Site Address & City</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Tariff & Roof</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Requested System</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myEnquiries.map((enq) => {
                        const surv = surveys.find((s) => s.enquiryId === enq.id)
                        return (
                          <tr key={enq.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#0b2540' }}>
                              {enq.customerName}
                            </td>
                            <td style={{ padding: '10px 12px' }}>{enq.phone}</td>
                            <td style={{ padding: '10px 12px' }}>{enq.address}, {enq.city}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {enq.connectionCategory}
                              </span>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                {enq.roofAreaSqft} sq.ft • {enq.roofType?.slice(0, 20)}
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: '600', color: '#0e5a8a' }}>
                              {enq.systemPreference}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              {surv && surv.status !== 'pending' ? (
                                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                                  <span
                                    style={{
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      fontWeight: 'bold',
                                      fontSize: '0.75rem',
                                      background: surv.status === 'rejected' ? '#fee2e2' : '#dcfce7',
                                      color: surv.status === 'rejected' ? '#991b1b' : '#166534'
                                    }}
                                  >
                                    {surv.status === 'rejected' ? '✕ Disapproved' : '✓ Feasibility Approved'}
                                  </span>
                                  {surv.adminOverwritten && (
                                    <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 'bold' }}>
                                      👑 Overwritten by Admin
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                  {surv?.status === 'pending' && (
                                    <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                      ⏳ Site Approval Pending
                                    </span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedEnquiryForSurvey(enq)
                                      setSurveyData({
                                        ...surveyData,
                                        shadowFreeRoofSqft: enq.roofAreaSqft || 350,
                                        monthlyBill: enq.monthlyElectricityBill || 3500,
                                        gridConnectionType: enq.connectionType || 'Residential 1-Phase 230V'
                                      })
                                    }}
                                    style={{
                                      background: '#f59e0b',
                                      color: '#0b2540',
                                      border: 'none',
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: 'bold',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    📐 Conduct Survey & Approve Feasibility
                                  </button>
                                </div>
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

            {/* Completed Surveys List */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem', color: '#0b2540' }}>
                Completed Feasibility Reports by {myName}
              </h3>
              {mySurveys.filter((s) => s.status !== 'pending').length === 0 ? (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.85rem' }}>
                  No completed feasibility assessments logged by your account yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {mySurveys.filter((s) => s.status !== 'pending').map((s) => (
                    <div
                      key={s.id}
                      style={{
                        background: s.status === 'rejected' ? '#fff5f5' : '#f8fafc',
                        padding: '14px',
                        borderRadius: '8px',
                        border: s.status === 'rejected' ? '1px solid #fecaca' : '1px solid #cbd5e1'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <b style={{ color: '#0b2540' }}>{s.customerName}</b>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            background: s.status === 'rejected' ? '#fee2e2' : '#dcfce7',
                            color: s.status === 'rejected' ? '#991b1b' : '#166534'
                          }}
                        >
                          {s.status === 'rejected' ? '✕ Disapproved' : '✓ Feasibility Approved'}
                        </span>
                      </div>

                      {/* Admin Overwrite Notice Banner */}
                      {s.adminOverwritten && (
                        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '8px' }}>
                          <b>👑 Admin Overwrite Active:</b> Decision was modified by {s.overwrittenBy || 'Admin'}. Reason: <em>"{s.adminOverwriteReason}"</em>
                        </div>
                      )}

                      <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
                        <div>Shadow-free Roof: <b>{s.shadowFreeRoofSqft} sq.ft</b></div>
                        <div>Direction & Tilt: <b>{s.roofDirection} @ {s.roofTiltDegrees}°</b></div>
                        <div>Cable Distance: <b>{s.cableRunDistanceMeters}m</b> ({s.gridConnectionType})</div>
                        <div>Surveyor: <b>{s.technicianName}</b> • Date: {s.surveyDate}</div>
                      </div>

                      {s.status === 'rejected' ? (
                        <div style={{ marginTop: '8px', background: '#fee2e2', color: '#991b1b', padding: '6px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>
                          <b>Disapproval Reason:</b> {s.disapprovalReason}
                        </div>
                      ) : (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '6px', fontSize: '0.76rem', color: '#64748b' }}>
                          "{s.surveyorNotes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ROOFTOP INSTALLATIONS & DIGITAL HANDOVER */}
        {/* ======================================================== */}
        {activeTab === 'installations' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0 }}>
                Rooftop Installations Assigned to {myCrew} ({myName})
              </h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                Complete mechanical & electrical mounting, measure tested generation output in kW, upload site photos, and collect customer digital sign-off.
              </p>
            </div>

            {myInstallations.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>⚡</span>
                <b style={{ color: '#0b2540' }}>No Rooftop Installations Currently Assigned</b>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  There are no active rooftop installations dispatched to your crew ({myCrew}) at this moment.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                {myInstallations.map((inst) => {
                  const isCompleted = inst.status === 'signed_off'
                  return (
                    <div
                      key={inst.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '1.4rem',
                        border: isCompleted ? '1px solid #86efac' : '1px solid #cbd5e1',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#0b2540' }}>
                          {inst.customerName}
                        </span>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            background: isCompleted ? '#dcfce7' : '#fef3c7',
                            color: isCompleted ? '#166534' : '#92400e'
                          }}
                        >
                          {isCompleted ? '✓ Commissioned & Signed' : '● Scheduled / In Progress'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                        <div>Site Address: <b>{inst.address}</b></div>
                        <div>System Size: <b>{inst.systemSizeKw} kW Rooftop Solar</b></div>
                        <div>Assigned Crew: <b>{inst.crewName}</b> ({inst.technicianCount} Technicians)</div>
                        <div>Scheduled Date: <b>{inst.scheduledDate}</b></div>
                        {isCompleted && (
                          <div style={{ color: '#166534', fontWeight: 'bold' }}>
                            Tested Generation: {inst.powerGenerationTestedKw} kW Output
                          </div>
                        )}
                      </div>

                      {isCompleted ? (
                        <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.78rem' }}>
                          <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '4px' }}>
                            ✓ Digital Handover Signed by: {inst.customerSignerName}
                          </div>
                          <div style={{ color: '#64748b' }}>"{inst.handoverNotes}"</div>
                          {inst.customerSignature && (
                            <div style={{ marginTop: '8px' }}>
                              <img src={inst.customerSignature} alt="Customer Signature" style={{ maxHeight: '40px', background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedInstForHandover(inst)
                            setHandoverData({
                              ...handoverData,
                              powerGenerationTestedKw: inst.systemSizeKw || 3.0,
                              signerName: inst.customerName
                            })
                          }}
                          style={{
                            width: '100%',
                            background: '#0b2540',
                            color: '#fff',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          ✍️ Execute Handover & Customer Sign-off
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ASSIGNED ORDERS, PAYMENT TRACKING & LIVE PROGRESS */}
        {/* ======================================================== */}
        {activeTab === 'tracking' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span> Assigned Orders & Live Milestones ({myCrew})
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  Track active on-site installation tasks, verify customer payments, and log received amounts directly from the field.
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
                  ⚡ Pending Tasks ({pendingMyOrders.length})
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
                  ✅ Completed Archive ({completedMyOrders.length})
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
                  📋 All ({myOrders.length})
                </button>
              </div>
            </div>

            {/* Quick KPI Bar for Assigned Work & Collections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.2rem' }}>
              <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Tasks to Execute</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0b2540' }}>{pendingMyOrders.length} Tasks</div>
                <div style={{ fontSize: '0.7rem', color: '#0e5a8a' }}>Assigned to {myCrew}</div>
              </div>

              <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Completed & Handed Over</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>{completedMyOrders.length} Projects</div>
                <div style={{ fontSize: '0.7rem', color: '#059669' }}>100% Commissioned</div>
              </div>

              <div style={{ background: '#fef2f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Balance to Collect</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b91c1c' }}>
                  ₹{pendingMyOrders.reduce((acc, o) => acc + Number(o.balanceDue || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>Pending collection across active jobs</div>
              </div>
            </div>

            {displayedMyOrders.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>
                  {orderFilterTab === 'completed' ? '🎉' : '🚚'}
                </span>
                <b style={{ color: '#0b2540' }}>No {orderFilterTab === 'completed' ? 'completed' : 'pending'} orders in this view</b>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  {orderFilterTab === 'completed'
                    ? 'Orders will be neatly archived here once marked completed on site.'
                    : `No pending orders currently queued for ${myName} (${myCrew}).`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                {displayedMyOrders.map((order) => {
                  const completed = isOrderCompleted(order)
                  const isPaid = Number(order.balanceDue || 0) <= 0 || Number(order.advancePaid || 0) >= Number(order.totalAmount || 0)

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '1.4rem',
                        border: completed ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Order Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <b style={{ color: '#0b2540', fontSize: '1.05rem' }}>{order.orderNumber}</b>
                            {completed && (
                              <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                                ✓ COMPLETED
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {order.capacityKw} kW • {order.systemType}
                          </span>
                        </div>

                        {/* Customer & Location */}
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                          <div>Customer: <b style={{ color: '#0b2540' }}>{order.customerName}</b> ({order.phone})</div>
                          <div>Address: <b>{order.address}</b></div>
                          <div>Scheduled: <b>{order.scheduledDate || 'In Progress'}</b> • Assigned: <b>{order.assignedCrew}</b></div>
                        </div>

                        {/* PAYMENT STATUS & AMOUNT RECEIVED (POINT 1) */}
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>💳 Order Payment Status</span>
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                background: isPaid ? '#dcfce7' : '#fef3c7',
                                color: isPaid ? '#15803d' : '#92400e'
                              }}
                            >
                              {isPaid ? '✓ Fully Paid' : '⏳ Partial Balance'}
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
                            <div style={{ background: '#fff', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>TOTAL</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0b2540' }}>
                                ₹{Number(order.totalAmount || 0).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ background: '#fff', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>RECEIVED</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16a34a' }}>
                                ₹{Number(order.advancePaid || 0).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ background: '#fff', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>BALANCE</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isPaid ? '#15803d' : '#b91c1c' }}>
                                ₹{Number(order.balanceDue || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForPayment(order)
                                setOrderPaymentForm({
                                  amountReceived: order.balanceDue > 0 ? order.balanceDue : '',
                                  paymentMode: 'Cash Collected On-Site',
                                  milestone: 'Commissioning & Handover (25%)',
                                  referenceNo: '',
                                  notes: '',
                                  sendCustomerReceipt: true
                                })
                              }}
                              style={{
                                background: '#0e5a8a',
                                color: '#fff',
                                border: 'none',
                                padding: '7px 8px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>💵</span> + Collect Cash/UPI
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewingPaymentOrder(order)}
                              style={{
                                background: '#f1f5f9',
                                color: '#0e5a8a',
                                border: '1px solid #cbd5e1',
                                padding: '7px 8px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>💳</span> Milestones ({order.paymentHistory?.length || 0})
                            </button>
                          </div>
                        </div>

                        {/* Current Stage */}
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#64748b' }}>Current Stage:</span> <b style={{ color: '#0b2540' }}>{order.trackingStage}</b>
                          {order.trackingHistory && order.trackingHistory[0]?.notes && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontStyle: 'italic' }}>
                              "{order.trackingHistory[0].notes.slice(0, 60)}..."
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedOrderForTracking(order)
                            setTrackingStage(order.trackingStage || 'Mounting Structure Anchored on Roof')
                          }}
                          style={{
                            flex: 1,
                            background: '#f59e0b',
                            color: '#0b2540',
                            border: 'none',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          📍 Push Milestone Stage
                        </button>
                        {!completed && (
                          <button
                            onClick={() => handleMarkOrderCompleted(order.id)}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SERVICE & BREAKDOWN TICKETS */}
        {/* ======================================================== */}
        {activeTab === 'service' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0b2540', margin: 0 }}>
                Field Service & Breakdown Tickets Assigned to {myName}
              </h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                On-site warranty breakdown visits, rain surge issues, and inverter troubleshooting assigned to you.
              </p>
            </div>

            {myTickets.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🛠️</span>
                <b style={{ color: '#0b2540' }}>No Service Breakdown Tickets Assigned</b>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  No open breakdown tickets are currently assigned to {myName}.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                {myTickets.map((tkt) => {
                  const isResolved = tkt.status === 'resolved'
                  return (
                    <div
                      key={tkt.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '1.4rem',
                        border: isResolved ? '1px solid #86efac' : '1px solid #fecaca',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <b style={{ color: '#0b2540' }}>{tkt.ticketNumber}</b>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            background: isResolved ? '#dcfce7' : '#fee2e2',
                            color: isResolved ? '#166534' : '#991b1b'
                          }}
                        >
                          {isResolved ? '✓ Resolved' : '● Open Action'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6', marginBottom: '10px' }}>
                        <div>Customer: <b>{tkt.customerName}</b> ({tkt.phone})</div>
                        <div>Fault Code: <b style={{ color: '#dc2626' }}>{tkt.faultCode}</b></div>
                        <div>Equipment: <b>{tkt.equipmentType}</b> (S/N: {tkt.serialNumber || 'N/A'})</div>
                        <div>Issue: <em>"{tkt.description}"</em></div>
                        <div style={{ marginTop: '4px' }}>
                          Warranty Status:{' '}
                          <span style={{ fontWeight: 'bold', color: tkt.isUnderWarranty ? '#166534' : '#b45309' }}>
                            {tkt.isUnderWarranty ? '✓ Under OEM Warranty' : 'Expired Warranty'}
                          </span>
                        </div>
                      </div>

                      {isResolved ? (
                        <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#166534' }}>
                          <b>Resolution:</b> {tkt.resolutionNotes}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTicketForResolution(tkt)
                            setTicketResolutionNotes('')
                          }}
                          style={{
                            width: '100%',
                            background: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          🔧 Log Fix & Mark Ticket Resolved
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: CONDUCT SITE SURVEY & FEASIBILITY FORM */}
      {/* ======================================================== */}
      {selectedEnquiryForSurvey && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540' }}>
                  Technical Site Survey: {selectedEnquiryForSurvey.customerName}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  {selectedEnquiryForSurvey.address}, {selectedEnquiryForSurvey.city} • Preference: {selectedEnquiryForSurvey.systemPreference}
                </p>
              </div>
              <button onClick={() => setSelectedEnquiryForSurvey(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSaveSurvey} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Shadow-Free Roof Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={surveyData.shadowFreeRoofSqft}
                    onChange={(e) => setSurveyData({ ...surveyData, shadowFreeRoofSqft: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Monthly Electricity Bill (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={surveyData.monthlyBill}
                    onChange={(e) => setSurveyData({ ...surveyData, monthlyBill: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Roof Direction / Azimuth *
                  </label>
                  <select
                    value={surveyData.roofDirection}
                    onChange={(e) => setSurveyData({ ...surveyData, roofDirection: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="South (Optimal 180°)">South (Optimal 180°)</option>
                    <option value="South-West (210°)">South-West (210°)</option>
                    <option value="South-East (150°)">South-East (150°)</option>
                    <option value="West (Flat Rooftop)">West (Flat Rooftop)</option>
                    <option value="North (Heavily Shaded / Unsuitable)">North (Heavily Shaded / Unsuitable)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Roof Tilt (Degrees) *
                  </label>
                  <input
                    type="number"
                    required
                    value={surveyData.roofTiltDegrees}
                    onChange={(e) => setSurveyData({ ...surveyData, roofTiltDegrees: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Cable Distance to Net Meter (Meters) *
                  </label>
                  <input
                    type="number"
                    required
                    value={surveyData.cableRunDistanceMeters}
                    onChange={(e) => setSurveyData({ ...surveyData, cableRunDistanceMeters: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                    Grid Connection Type
                  </label>
                  <select
                    value={surveyData.gridConnectionType}
                    onChange={(e) => setSurveyData({ ...surveyData, gridConnectionType: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Residential 1-Phase 230V">Residential 1-Phase 230V</option>
                    <option value="Residential 3-Phase 415V">Residential 3-Phase 415V</option>
                    <option value="Commercial 3-Phase 415V">Commercial 3-Phase 415V</option>
                    <option value="Industrial HT 11kV/33kV">Industrial HT 11kV/33kV</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                  Structural Integrity & Mounting Safety
                </label>
                <input
                  type="text"
                  value={surveyData.structuralIntegrity}
                  onChange={(e) => setSurveyData({ ...surveyData, structuralIntegrity: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>
                  Field Observations & Cable Route
                </label>
                <textarea
                  rows={2}
                  value={surveyData.surveyorNotes}
                  onChange={(e) => setSurveyData({ ...surveyData, surveyorNotes: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Feasibility Decision Toggle */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px' }}>
                  ⚖️ Site Technician Feasibility Verdict:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSurveyDecision('approved')}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: surveyDecision === 'approved' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: surveyDecision === 'approved' ? '#dcfce7' : '#fff',
                      color: surveyDecision === 'approved' ? '#166534' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Feasibility Approved
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurveyDecision('rejected')}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: surveyDecision === 'rejected' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                      background: surveyDecision === 'rejected' ? '#fee2e2' : '#fff',
                      color: surveyDecision === 'rejected' ? '#991b1b' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Disapprove Feasibility
                  </button>
                </div>

                {surveyDecision === 'rejected' && (
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>
                      Reason for Disapproval (Mandatory) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Surrounding structures create heavy shade (> 50% daytime shadow). Roof slab shows cracks and cannot withstand high wind thrust."
                      value={surveyData.disapprovalReason}
                      onChange={(e) => setSurveyData({ ...surveyData, disapprovalReason: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #f87171', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiryForSurvey(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: surveyDecision === 'approved' ? '#16a34a' : '#dc2626',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {surveyDecision === 'approved' ? '✓ Submit Feasibility Approval' : '✕ Submit Feasibility Disapproval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EXECUTE ROOFTOP HANDOVER & SIGNATURE */}
      {/* ======================================================== */}
      {selectedInstForHandover && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540' }}>
                  Commissioning & Handover: {selectedInstForHandover.customerName}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  System Size: {selectedInstForHandover.systemSizeKw} kW Rooftop Solar
                </p>
              </div>
              <button onClick={() => setSelectedInstForHandover(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSaveHandover} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Start Time</label>
                  <input
                    type="text"
                    value={handoverData.startTime}
                    onChange={(e) => setHandoverData({ ...handoverData, startTime: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Finish Time</label>
                  <input
                    type="text"
                    value={handoverData.finishTime}
                    onChange={(e) => setHandoverData({ ...handoverData, finishTime: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Tested Generation (kW) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={handoverData.powerGenerationTestedKw}
                    onChange={(e) => setHandoverData({ ...handoverData, powerGenerationTestedKw: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Handover Technical Notes</label>
                <textarea
                  rows={2}
                  value={handoverData.notes}
                  onChange={(e) => setHandoverData({ ...handoverData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '3px' }}>Customer Signer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={handoverData.signerName}
                  onChange={(e) => setHandoverData({ ...handoverData, signerName: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Digital Signature Pad */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>
                    Customer Digital Touch Signature (Draw on Canvas) *
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Clear Signature
                  </button>
                </div>
                <div style={{ border: '2px dashed #94a3b8', borderRadius: '8px', background: '#fafafa' }}>
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ width: '100%', height: '120px', cursor: 'crosshair', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  Sign with finger, stylus or mouse to confirm installation completion and activate the warranty.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedInstForHandover(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0b2540', color: '#fff', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  ✓ Complete Handover & Activate Warranty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: LIVE ORDER TRACKING MILESTONE UPDATE */}
      {/* ======================================================== */}
      {selectedOrderForTracking && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0b2540' }}>
                Update Tracking: {selectedOrderForTracking.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderForTracking(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSaveTracking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Select Current Milestone Stage *
                </label>
                <select
                  value={trackingStage}
                  onChange={(e) => setTrackingStage(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Dispatched on Truck (Serials Scanned)">Dispatched on Truck (Serials Scanned)</option>
                  <option value="Material Unloaded at Site">Material Unloaded at Site</option>
                  <option value="Mounting Structure Anchored on Roof">Mounting Structure Anchored on Roof</option>
                  <option value="Solar Panels Fixed & DC Cabling">Solar Panels Fixed & DC Cabling</option>
                  <option value="Inverter & ACDB/DCDB Mounted">Inverter & ACDB/DCDB Mounted</option>
                  <option value="Testing & Grid Synchronization">Testing & Grid Synchronization</option>
                  <option value="Commissioned & Handover Complete">Commissioned & Handover Complete</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Field Progress Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Structure anchored to RCC roof. DC cabling conduits completed."
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForTracking(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#f59e0b', color: '#0b2540', border: 'none', fontWeight: 'bold', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Save Milestone Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: SERVICE TICKET RESOLUTION */}
      {/* ======================================================== */}
      {selectedTicketForResolution && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0b2540' }}>
                Resolve Ticket: {selectedTicketForResolution.ticketNumber}
              </h3>
              <button onClick={() => setSelectedTicketForResolution(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSaveTicketResolution} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <div>Customer: <b>{selectedTicketForResolution.customerName}</b></div>
                <div>Reported Fault: <b style={{ color: '#dc2626' }}>{selectedTicketForResolution.faultCode}</b></div>
                <div>Equipment: {selectedTicketForResolution.equipmentType}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Field Resolution Notes & Actions Taken *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Replaced faulty surge protector device (SPD) in ACDB box. Inverter rebooted and synchronized at 3.2 kW output. Customer confirmed full operation."
                  value={ticketResolutionNotes}
                  onChange={(e) => setTicketResolutionNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTicketForResolution(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#16a34a', color: '#fff', border: 'none', fontWeight: 'bold', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  ✓ Confirm Ticket Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD NEW WORK SHOWCASE PROJECT */}
      {/* ======================================================== */}
      {showAddShowcaseModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🌟</span> Add Installation to My Showcase & Portfolio
              </h3>
              <button
                onClick={() => setShowAddShowcaseModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveShowcase} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 kW Commercial Dairy Plant"
                    value={newShowcase.title}
                    onChange={(e) => setNewShowcase({ ...newShowcase, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Capacity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5.0 kW"
                    value={newShowcase.capacity}
                    onChange={(e) => setNewShowcase({ ...newShowcase, capacity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Customer / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Patel"
                    value={newShowcase.customer}
                    onChange={(e) => setNewShowcase({ ...newShowcase, customer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ludhiana, Punjab"
                    value={newShowcase.location}
                    onChange={(e) => setNewShowcase({ ...newShowcase, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Installation Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newShowcase.photo}
                  onChange={(e) => setNewShowcase({ ...newShowcase, photo: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', marginBottom: '6px' }}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setNewShowcase({ ...newShowcase, photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80' })}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    📷 Rooftop Panels Array
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewShowcase({ ...newShowcase, photo: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&q=80' })}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    📷 Inverter & Battery Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewShowcase({ ...newShowcase, photo: 'https://images.unsplash.com/photo-1548611716-ad38321a4050?w=800&q=80' })}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    📷 Industrial Superstructure
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Customer Review / Testimonial
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Excellent workmanship and clean cable conduits. Seamless handover."
                  value={newShowcase.review}
                  onChange={(e) => setNewShowcase({ ...newShowcase, review: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Technical Highlights & Specs
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10x 550W Tier-1 Bi-facial panels, dual earthing pits (<1.8 Ohms)"
                  value={newShowcase.highlights}
                  onChange={(e) => setNewShowcase({ ...newShowcase, highlights: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddShowcaseModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #0b2540 0%, #1e3a8a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  Publish to My Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: DIGITAL QR CREDENTIAL VERIFICATION SEAL */}
      {/* ======================================================== */}
      {showQrModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                OFFICIAL FIELD VERIFICATION
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', marginBottom: '14px' }}>
                <svg width="180" height="180" viewBox="0 0 100 100">
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
                  <rect x="42" y="14" width="8" height="8" fill="#0b2540" />
                  <rect x="46" y="38" width="12" height="12" fill="#f59e0b" />
                  <rect x="20" y="44" width="8" height="8" fill="#0b2540" />
                  <rect x="72" y="44" width="8" height="8" fill="#0b2540" />
                  <rect x="42" y="66" width="8" height="8" fill="#0b2540" />
                  <rect x="64" y="74" width="10" height="10" fill="#0b2540" />
                </svg>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b2540' }}>
                {myTechRecord.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                ● VERIFIED SOLAR FIELD ENGINEER
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Badge: <b>{myTechRecord.employeeId || 'TECH-SOL-101'}</b> • {myTechRecord.crew}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                License: <code>{myTechRecord.licenseNo || 'MNRE-PB-8841'}</code>
              </div>

              <div style={{ marginTop: '12px', background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                ✓ Official Verification Hash: SHA256-SOLAR-OPS-PB-{myTechRecord.id}
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              style={{
                marginTop: '14px',
                width: '100%',
                background: '#0b2540',
                color: '#fff',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Close Seal View
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: RECORD / UPDATE ORDER PAYMENT (TECHNICIAN PORTAL) */}
      {/* ======================================================== */}
      {selectedOrderForPayment && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💵</span> Record On-Site Payment
                </h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                  Order: <b>{selectedOrderForPayment.orderNumber}</b> • Customer: <b>{selectedOrderForPayment.customerName}</b>
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
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0b2540' }}>
                    ₹{Number(selectedOrderForPayment.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>RECEIVED</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{Number(selectedOrderForPayment.advancePaid || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>BALANCE DUE</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b91c1c' }}>
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
                    Amount Collected Now (₹) *
                  </label>
                  {Number(selectedOrderForPayment.balanceDue || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setOrderPaymentForm({ ...orderPaymentForm, amountReceived: selectedOrderForPayment.balanceDue })}
                      style={{ background: 'none', border: 'none', color: '#0e5a8a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Collect Full Balance (₹{Number(selectedOrderForPayment.balanceDue).toLocaleString()})
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
                  placeholder="e.g. 25000"
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
                    <option value="Commissioning & Handover (25%)">Milestone 3: Commissioning & Handover (25%)</option>
                    <option value="Material Staging & Dispatch (40%)">Milestone 2: Material Staging & Dispatch (40%)</option>
                    <option value="Booking Advance (35%)">Milestone 1: Booking Advance (35%)</option>
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
                    <option value="Cash Collected On-Site">Cash Collected On-Site</option>
                    <option value="UPI / Online QR">UPI / QR (PhonePe, GPay)</option>
                    <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Receipt / Cheque / UTR #
                  </label>
                  <input
                    type="text"
                    value={orderPaymentForm.referenceNo}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, referenceNo: e.target.value })}
                    placeholder="e.g. CASH-REC-01 / UPI-Ref"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Handover Notes / Details
                  </label>
                  <input
                    type="text"
                    value={orderPaymentForm.notes}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, notes: e.target.value })}
                    placeholder="e.g. Collected on site upon physical panel mounting"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Real-time Customer Alert & Receipt Slip Toggle */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#0b2540' }}>
                  <input
                    type="checkbox"
                    checked={orderPaymentForm.sendCustomerReceipt}
                    onChange={(e) => setOrderPaymentForm({ ...orderPaymentForm, sendCustomerReceipt: e.target.checked })}
                    style={{ accentColor: '#0e5a8a', width: '16px', height: '16px' }}
                  />
                  <span>📜 Issue Digital Receipt & Broadcast Alert to Customer (WhatsApp/SMS)</span>
                </label>
                {orderPaymentForm.sendCustomerReceipt && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#047857', background: '#ecfdf5', padding: '6px 8px', borderRadius: '4px' }}>
                    ✓ Generates unique receipt number and notifies customer phone immediately.
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
                  style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  ✓ Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PROJECT MILESTONES & PAYMENT HISTORY LEDGER (TECHNICIAN VIEW) */}
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
              maxWidth: '650px',
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
                  <span>💳</span> Milestones & Payment Ledger
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
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0b2540' }}>
                    ₹{Number(viewingPaymentOrder.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>COLLECTED</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{Number(viewingPaymentOrder.advancePaid || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>REMAINING DUE</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: Number(viewingPaymentOrder.balanceDue || 0) > 0 ? '#b91c1c' : '#15803d' }}>
                    ₹{Number(viewingPaymentOrder.balanceDue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Stage Milestone Schedule */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#0b2540' }}>Milestone Verification Schedule</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  {
                    name: 'Milestone 1: Booking Advance (35%)',
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.35)
                  },
                  {
                    name: 'Milestone 2: Material Staging & Dispatch (40%)',
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.40)
                  },
                  {
                    name: 'Milestone 3: Commissioning & Handover (25%)',
                    target: Math.round(Number(viewingPaymentOrder.totalAmount || 0) * 0.25)
                  }
                ].map((m, idx) => {
                  const cumulativeThreshold = Math.round(Number(viewingPaymentOrder.totalAmount || 0) * (idx === 0 ? 0.35 : idx === 1 ? 0.75 : 1.0))
                  const isSatisfied = Number(viewingPaymentOrder.advancePaid || 0) >= cumulativeThreshold
                  return (
                    <div key={idx} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isSatisfied ? '#bbf7d0' : '#e2e8f0'}`, background: isSatisfied ? '#f0fdf4' : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: isSatisfied ? '#15803d' : '#0b2540' }}>
                          {isSatisfied ? '✓ ' : '⏳ '} {m.name}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: isSatisfied ? '#15803d' : '#475569' }}>
                          ₹{m.target.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Receipts Ledger */}
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0b2540' }}>Recorded Receipts ({viewingPaymentOrder.paymentHistory?.length || 0})</h4>
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
                            {new Date(ph.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>
                          ₹{Number(ph.amountReceived || 0).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.74rem', color: '#475569' }}>
                        <div>
                          <b>{ph.milestone || 'Milestone Payment'}</b> • {ph.paymentMode} ({ph.referenceNo || 'Direct Handover'})
                        </div>
                        <button
                          onClick={() => setSelectedReceipt({
                            ...ph,
                            orderNumber: viewingPaymentOrder.orderNumber,
                            customerName: viewingPaymentOrder.customerName,
                            customerPhone: viewingPaymentOrder.phone,
                            orderTotal: viewingPaymentOrder.totalAmount,
                            currentBalance: viewingPaymentOrder.balanceDue
                          })}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0e5a8a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          📜 View Digital Slip
                        </button>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                        Logged By: <b>{ph.updatedBy || 'Field Staff'}</b>
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

      {/* MODAL: VIEW / PRINT DIGITAL PAYMENT RECEIPT (TECHNICIAN VIEW) */}
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
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>CUSTOMER:</span>
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
                Verified By: <b>{selectedReceipt.updatedBy || 'Field Staff'}</b>
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
    </div>
  )
}
