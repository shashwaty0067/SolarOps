import React, { useState } from 'react'
import { useSolarStore, generateWhatsAppReceiptLink, generateWhatsAppTrackingLink } from '../lib/store'
import { StatusBadge } from '../components/StatusBadge'
import { QuoteRequestModal } from '../components/QuoteRequestModal'

export function CustomerPortal({ onGoHome }) {
  const {
    currentUser,
    enquiries,
    surveys,
    quotations,
    orders,
    installations,
    warranties,
    tickets,
    submitPaymentProofByCustomer,
    fileServiceTicket,
    logout
  } = useSolarStore()

  const [activeTab, setActiveTab] = useState('enquiries')
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(null)
  const [selectedCustomerReceipt, setSelectedCustomerReceipt] = useState(null)
  const [showNotifDrawer, setShowNotifDrawer] = useState(false)
  const [dismissedNotifBanner, setDismissedNotifBanner] = useState(false)

  // Customer Payment Proof Submission Modal State (Point 4)
  const [selectedQuoteForPay, setSelectedQuoteForPay] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentType: 'advance', // 'advance' | 'full'
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankName: 'State Bank of India',
    transactionRef: '',
    notes: ''
  })
  const [proofSubmitted, setProofSubmitted] = useState(false)

  // Service ticket form state (Rainy season breakdown & troubleshooting follow-up)
  const [ticketForm, setTicketForm] = useState({
    issueTarget: 'specific_item', // 'specific_item' | 'troubleshooting_difficulty'
    reportedItem: '',
    serialNumber: '',
    equipmentType: 'Inverter',
    faultCode: 'E04 - Heavy Rain Grid Isolation Error',
    description: '',
    troubleshootingDifficulty: true,
    difficultyNotes: '',
    needsFollowUp: true
  })
  const [troubleStepsChecked, setTroubleStepsChecked] = useState({
    acMcb: false,
    dcSwitch: false,
    displayLed: false,
    gridActive: false
  })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  // Customer identification
  const custEmail = (currentUser?.email || '').toLowerCase()
  const custId = currentUser?.id || ''
  const custName = currentUser?.name || 'Customer'

  // Accurate per-user data filtering
  const myEnquiries = enquiries.filter(
    (e) => (e.customerId && e.customerId === custId) || (e.email && e.email.toLowerCase() === custEmail) || (e.customerName && e.customerName.toLowerCase() === custName.toLowerCase())
  )
  const myQuotes = quotations.filter(
    (q) => (q.customerId && q.customerId === custId) || (q.customerEmail && q.customerEmail.toLowerCase() === custEmail) || (q.customerName && q.customerName.toLowerCase() === custName.toLowerCase())
  )
  const myOrders = orders.filter(
    (o) => (o.customerId && o.customerId === custId) || (o.customerEmail && o.customerEmail.toLowerCase() === custEmail) || (o.customerName && o.customerName.toLowerCase() === custName.toLowerCase())
  )
  const myInstallations = installations.filter(
    (i) => (i.customerEmail && i.customerEmail.toLowerCase() === custEmail) || (i.customerName && i.customerName.toLowerCase() === custName.toLowerCase())
  )
  const myWarranties = warranties.filter(
    (w) => (w.customerEmail && w.customerEmail.toLowerCase() === custEmail) || (w.customerName && w.customerName.toLowerCase() === custName.toLowerCase())
  )
  const myTickets = tickets.filter(
    (t) => (t.customerEmail && t.customerEmail.toLowerCase() === custEmail) || (t.customerName && t.customerName.toLowerCase() === custName.toLowerCase())
  )

  // Real-time payment receipts and tracking alert broadcasts for this customer
  const myNotifications = myOrders.flatMap((o) => {
    const paymentNotifs = (o.paymentHistory || []).map((p) => ({
      id: `pay-${p.id || p.receiptNumber}`,
      type: 'payment',
      title: `💳 Payment Verified: ₹${Number(p.amountReceived || 0).toLocaleString()}`,
      subtitle: `${p.milestone || 'Milestone Payment'} • Receipt #${p.receiptNumber}`,
      message: `Your payment of ₹${Number(p.amountReceived || 0).toLocaleString()} was confirmed via ${p.paymentMode}. Remaining balance due: ₹${Number(o.balanceDue || 0).toLocaleString()}.`,
      timestamp: p.timestamp,
      channel: p.notificationChannel || 'WhatsApp + SMS + Email',
      recipient: o.phone || currentUser?.phone || 'Your Registered Mobile',
      orderNumber: o.orderNumber,
      receiptData: {
        ...p,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.phone,
        orderTotal: o.totalAmount,
        currentBalance: o.balanceDue
      },
      waLink: generateWhatsAppReceiptLink(
        o.phone || currentUser?.phone,
        o.customerName,
        o.orderNumber,
        p.receiptNumber,
        p.amountReceived,
        p.milestone,
        o.balanceDue
      )
    }))

    const trackingNotifs = (o.trackingHistory || []).filter((th) => !th.isPaymentMilestone).map((th, idx) => ({
      id: `track-${o.id}-${idx}`,
      type: 'tracking',
      title: `⚡ Stage Update: ${th.stage}`,
      subtitle: `Order #${o.orderNumber} • ${th.updatedBy || 'Operations Desk'}`,
      message: th.notes || `Your solar installation has progressed to: ${th.stage}`,
      timestamp: th.timestamp,
      channel: th.notificationChannel || 'WhatsApp + SMS + Email',
      recipient: o.phone || currentUser?.phone || 'Your Registered Mobile',
      orderNumber: o.orderNumber,
      waLink: generateWhatsAppTrackingLink(
        o.phone || currentUser?.phone,
        o.customerName,
        o.orderNumber,
        th.stage,
        th.notes
      )
    }))

    return [...paymentNotifs, ...trackingNotifs]
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleOpenPaymentModal = (quote) => {
    setSelectedQuoteForPay(quote)
    setPaymentForm({
      amount: quote.advanceRequired,
      paymentType: 'advance',
      paymentMode: 'Bank Transfer (NEFT/RTGS)',
      bankName: 'State Bank of India',
      transactionRef: '',
      notes: ''
    })
  }

  const handleSubmitPaymentProof = (e) => {
    e.preventDefault()
    if (!selectedQuoteForPay) return
    submitPaymentProofByCustomer(selectedQuoteForPay.id, paymentForm)
    setProofSubmitted(true)
    setTimeout(() => {
      setProofSubmitted(false)
      setSelectedQuoteForPay(null)
    }, 2000)
  }

  const handleCreateTicket = (e) => {
    e.preventDefault()
    fileServiceTicket({
      customerName: custName,
      customerEmail: custEmail,
      phone: currentUser?.phone || '+91 98140 12345',
      serialNumber: ticketForm.serialNumber,
      equipmentType: ticketForm.equipmentType,
      reportedItem: ticketForm.reportedItem || ticketForm.equipmentType,
      faultCode: ticketForm.faultCode,
      description: ticketForm.description,
      troubleshootingDifficulty: ticketForm.troubleshootingDifficulty,
      difficultyNotes: ticketForm.difficultyNotes,
      needsFollowUp: ticketForm.needsFollowUp
    })
    setTicketSubmitted(true)
    setTimeout(() => {
      setTicketSubmitted(false)
      setTicketForm({
        issueTarget: 'specific_item',
        reportedItem: '',
        serialNumber: '',
        equipmentType: 'Inverter',
        faultCode: 'E04 - Heavy Rain Grid Isolation Error',
        description: '',
        troubleshootingDifficulty: true,
        difficultyNotes: '',
        needsFollowUp: true
      })
      setTroubleStepsChecked({
        acMcb: false,
        dcSwitch: false,
        displayLed: false,
        gridActive: false
      })
    }, 4000)
  }

  const handleRaiseForWarrantyUnit = (w) => {
    setTicketForm({
      issueTarget: 'specific_item',
      reportedItem: w.equipmentName,
      serialNumber: w.serialNumber,
      equipmentType: w.equipmentType || 'Inverter',
      faultCode: 'E04 - Heavy Rain Grid Isolation Error',
      description: `Issue observed with ${w.equipmentName} (Serial: ${w.serialNumber}). Unit not generating expected power.`,
      troubleshootingDifficulty: true,
      difficultyNotes: 'Homeowner verified physical connections, system shows fault code.',
      needsFollowUp: true
    })
    setActiveTab('service')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* Top Navbar: STRICTLY CUSTOMER SCOPE (NO ADMIN OPTION VISIBLE) */}
      <header
        style={{
          background: '#0b2540',
          color: '#fff',
          padding: '0.8rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
            ☀️ SolarOps <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'normal' }}>| Customer Portal</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Real-time Notification Bell & Drawer */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              style={{
                background: showNotifDrawer ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              title="View SMS & WhatsApp Live Payment / Progress Alerts"
            >
              <span style={{ fontSize: '1rem' }}>🔔</span>
              <span>Alerts</span>
              {myNotifications.length > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '1px 6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  {myNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifDrawer && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '360px',
                  background: '#fff',
                  color: '#0b2540',
                  borderRadius: '12px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                  border: '1px solid #cbd5e1',
                  zIndex: 100,
                  maxHeight: '440px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b style={{ fontSize: '0.9rem' }}>🔔 Live Broadcast Feed</b>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {myNotifications.length} alerts logged for {custName}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifDrawer(false)}
                    style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#64748b' }}
                  >
                    ✕
                  </button>
                </div>

                {myNotifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                    No alerts received yet. Once a payment or tracking update is recorded by staff, your alert will appear here.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {myNotifications.map((notif, idx) => (
                      <div
                        key={notif.id || idx}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid #f1f5f9',
                          background: idx === 0 ? '#f0fdf4' : '#fff'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: notif.type === 'payment' ? '#15803d' : '#0e5a8a' }}>
                            {notif.title}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', marginBottom: '6px' }}>
                          {notif.message}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.66rem', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            📱 {notif.channel}
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {notif.type === 'payment' && (
                              <button
                                onClick={() => {
                                  setShowNotifDrawer(false)
                                  setSelectedCustomerReceipt(notif.receiptData)
                                }}
                                style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '2px 7px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}
                              >
                                📜 Slip
                              </button>
                            )}
                            <a
                              href={notif.waLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{ background: '#25D366', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, textDecoration: 'none' }}
                            >
                              📲 WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{custName}</div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
              {currentUser?.connectionCategory || 'Residential'} • {currentUser?.email}
            </div>
          </div>
          {/* Note: STRICTLY NO SWITCH TO ADMIN BUTTON! Only Sign Out */}
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Welcome Ribbon */}
      <div style={{ background: 'linear-gradient(135deg, #0e5a8a, #0b2540)', color: '#fff', padding: '1.8rem 4vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
              REGISTERED CLIENT ACCOUNT
            </span>
            <h1 style={{ fontSize: '1.8rem', margin: '8px 0 4px', fontWeight: '800' }}>
              Welcome, {custName}
            </h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
              {currentUser?.address} • Tariff Connection: <b>{currentUser?.connectionType || 'Residential 1-Phase'}</b>
            </p>
          </div>

          <button
            onClick={() => setShowEnquiryModal(true)}
            style={{
              background: '#ffb81c',
              color: '#0b2540',
              border: 'none',
              fontWeight: '800',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            + Request New Rooftop Survey
          </button>
        </div>
      </div>

      {/* Live Payment & Tracking Broadcast Banner */}
      {myNotifications.length > 0 && !dismissedNotifBanner && (
        <div style={{ background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', padding: '10px 4vw' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#065f46' }}>
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <span>
                <b>Real-Time Payment Alert:</b> {myNotifications[0].title} ({myNotifications[0].subtitle}) — Dispatched to <b>{myNotifications[0].recipient}</b> via WhatsApp & SMS.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {myNotifications[0].type === 'payment' && (
                <button
                  onClick={() => setSelectedCustomerReceipt(myNotifications[0].receiptData)}
                  style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  📜 View Receipt Slip
                </button>
              )}
              <a
                href={myNotifications[0].waLink}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#25D366', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>📲</span> Open in WhatsApp
              </a>
              <button
                onClick={() => setDismissedNotifBanner(true)}
                style={{ background: 'none', border: 'none', color: '#047857', fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px' }}
                title="Dismiss Banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Navigation (Matches Architecture Diagram EXACTLY) */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 4vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'enquiries', label: 'My enquiries', icon: '📝', count: myEnquiries.length },
            { id: 'quotations', label: 'My quotations', icon: '📜', count: myQuotes.length },
            { id: 'orders', label: 'My orders', icon: '📦', count: myOrders.length },
            { id: 'installations', label: 'Installation status', icon: '👷', count: myInstallations.length },
            { id: 'warranty', label: 'Warranty', icon: '🛡️', count: myWarranties.length },
            { id: 'service', label: 'Service requests', icon: '🔧', count: myTickets.length },
            { id: 'profile', label: 'Profile', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 16px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ffb81c' : '3px solid transparent',
                color: activeTab === tab.id ? '#0b2540' : '#64748b',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    background: activeTab === tab.id ? '#ffb81c' : '#f1f5f9',
                    color: '#0b2540',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: 'bold'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 4vw' }}>
        {/* TAB 1: MY ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>My Rooftop Enquiries</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Track your initial rooftop requests, grid connection type, and engineering survey results
                </p>
              </div>
              <button
                onClick={() => setShowEnquiryModal(true)}
                style={{
                  background: '#ffb81c',
                  color: '#0b2540',
                  border: 'none',
                  fontWeight: '700',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.88rem'
                }}
              >
                + Submit New Enquiry
              </button>
            </div>

            {myEnquiries.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
                <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>No enquiries submitted yet</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Ready to go solar? Request an engineering rooftop survey.</p>
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}
                >
                  Request a Quote Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myEnquiries.map((enq) => {
                  const survey = surveys.find((s) => s.enquiryId === enq.id)
                  return (
                    <div
                      key={enq.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '1.4rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0b2540' }}>{enq.systemPreference}</h3>
                            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                              {enq.connectionCategory || 'Residential'}
                            </span>
                            <StatusBadge status={enq.status} />
                          </div>
                          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                            Site Address: {enq.address}, {enq.city} • Enquired on {new Date(enq.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Monthly Electricity Bill:</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0e5a8a' }}>₹{enq.monthlyElectricityBill.toLocaleString()}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                        <div>
                          <small style={{ color: '#64748b' }}>Roof Space & Type</small>
                          <div style={{ fontWeight: '600' }}>{enq.roofAreaSqft} sq.ft ({enq.roofType || 'RCC'})</div>
                        </div>
                        <div>
                          <small style={{ color: '#64748b' }}>Grid Tariff Connection</small>
                          <div style={{ fontWeight: '600' }}>{enq.connectionType}</div>
                        </div>
                        <div>
                          <small style={{ color: '#64748b' }}>Sanctioned Load</small>
                          <div style={{ fontWeight: '600' }}>{enq.sanctionedLoadKw || 5} kW</div>
                        </div>
                        <div>
                          <small style={{ color: '#64748b' }}>Subsidy / Depreciation</small>
                          <div style={{ fontWeight: '600', color: enq.subsidyInterested ? '#16a34a' : '#0369a1' }}>
                            {enq.subsidyInterested ? '✓ PM Surya Ghar Subsidy' : '40% Accelerated Tax Dep.'}
                          </div>
                        </div>
                      </div>

                      {survey && (
                        <div style={{ marginTop: '12px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f766e', marginBottom: '4px' }}>
                            🔬 Field Technician Roof Survey Measurements:
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                            <span><b>Shadow-Free Roof:</b> {survey.shadowFreeRoofSqft} sq.ft</span>
                            <span><b>Roof Orientation:</b> {survey.roofDirection}</span>
                            <span><b>Tilt Angle:</b> {survey.roofTiltDegrees}°</span>
                            <span><b>Cable Run:</b> {survey.cableRunDistanceMeters}m to meter</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                            Surveyor Notes: "{survey.surveyorNotes}"
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY QUOTATIONS (Scene 2: Getting the Kit Right) */}
        {activeTab === 'quotations' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>My Quotations</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Scene 2: Ready Bill of Materials (BOM) quotations. Review exact parts list and approve advance to schedule dispatch.
              </p>
            </div>

            {paymentSuccess && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontWeight: 'bold' }}>
                ✓ Advance payment confirmed! Warehouse has received your packing kit and crew schedule is activated.
              </div>
            )}

            {myQuotes.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b' }}>No quotations generated yet. Quotations are generated immediately after technical site survey approval.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {myQuotes.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0b2540' }}>{q.capacityKw} kW {q.systemType === 'on_grid' ? 'On-Grid' : 'Off-Grid'} Solar System</h3>
                          <StatusBadge status={q.status} />
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          Quote Ref: #{q.quoteNumber} • Category: {q.connectionCategory || 'Standard'} • Valid until {q.validUntil}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total System Value: ₹{q.subtotalAmount.toLocaleString()}</div>
                        {q.subsidyDiscount > 0 && (
                          <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600' }}>
                            - Government Subsidy: ₹{q.subsidyDiscount.toLocaleString()}
                          </div>
                        )}
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0b2540', marginTop: '2px' }}>
                          Net Payable: ₹{q.netPayableAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Ready Bill of Materials (BOM) Parts Table */}
                    <div style={{ marginTop: '1.2rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0e5a8a', marginBottom: '8px' }}>
                        📦 Included Hardware & Bill of Materials (Exact Parts List):
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: '#edf2f7', color: '#475569' }}>
                              <th style={{ padding: '8px 12px' }}>Component / Hardware</th>
                              <th style={{ padding: '8px 12px' }}>Quantity</th>
                              <th style={{ padding: '8px 12px' }}>OEM Warranty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.items.map((it, idx) => (
                              <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '8px 12px', fontWeight: '500', color: '#1e293b' }}>{it.item}</td>
                                <td style={{ padding: '8px 12px', color: '#64748b' }}>{it.qty} {it.unit}</td>
                                <td style={{ padding: '8px 12px', color: '#0f766e', fontWeight: '600' }}>{it.warranty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Advance payment action (Point 4: Confirmation strictly in hands of Admin / Staff) */}
                    <div style={{ marginTop: '1.4rem', background: '#fffbeb', padding: '14px 18px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#92400e' }}>
                            Advance Required to Lock Warehouse Dispatch: ₹{q.advanceRequired.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '2px' }}>
                            {q.status === 'pending_verification' ? (
                              <span>⏳ Payment Reference Submitted (UTR: <b>{q.paymentDetails?.transactionRef}</b>) — Awaiting Admin verification.</span>
                            ) : q.advancePaid > 0 ? (
                              <span style={{ color: '#15803d', fontWeight: 'bold' }}>✓ Payment of ₹{q.advancePaid.toLocaleString()} Verified by Staff ({q.paymentVerification?.confirmedBy || 'Accounts Desk'})</span>
                            ) : (
                              <span>Submit transaction reference below. Admin / Staff will verify funds and issue order confirmation.</span>
                            )}
                          </div>
                        </div>

                        {q.status === 'sent' || q.status === 'draft' ? (
                          <button
                            onClick={() => handleOpenPaymentModal(q)}
                            style={{
                              background: '#ffb81c',
                              color: '#0b2540',
                              border: 'none',
                              fontWeight: '800',
                              padding: '10px 22px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            💳 Submit Payment Proof / UTR
                          </button>
                        ) : q.status === 'pending_verification' ? (
                          <div style={{ background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', border: '1px solid #fde68a' }}>
                            ⏳ Under Staff Verification
                          </div>
                        ) : (
                          <div style={{ color: '#15803d', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ✓ Order Confirmed by Staff
                          </div>
                        )}
                      </div>

                      {/* Payment Verification notice */}
                      <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#78350f', background: 'rgba(254, 243, 199, 0.6)', padding: '6px 10px', borderRadius: '6px' }}>
                        🛡️ <b>Company Security Policy:</b> Payment confirmation is strictly authorized by SunPower staff after bank credit verification. Orders are released to warehouse staging only after staff confirmation.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>My Active Orders</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Track payment settlement, warehouse dispatch, and field crew deployment
              </p>
            </div>

            {myOrders.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b' }}>No confirmed orders yet. Approve your quotation advance to schedule warehouse packing.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myOrders.map((o) => (
                  <div
                    key={o.id}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '1.4rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0b2540' }}>Order #{o.orderNumber}</h3>
                          <StatusBadge status={o.dispatchStatus} />
                        </div>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                          System: {o.capacityKw} kW {o.systemType === 'on_grid' ? 'On-Grid' : 'Off-Grid'} • Assigned: {o.assignedCrew}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Advance Paid: ₹{o.advancePaid.toLocaleString()}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: o.balanceDue > 0 ? '#b45309' : '#15803d' }}>
                          Balance Due: ₹{o.balanceDue.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* 6-Stage Visual Stepper */}
                    <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '3px', background: '#e2e8f0', zIndex: 0 }} />
                      {[
                        { step: '1', title: 'Advance Paid', done: o.advancePaid > 0 },
                        { step: '2', title: 'Kit BOM Packed', done: o.dispatchStatus !== 'pending_packing' },
                        { step: '3', title: 'Dispatched', done: o.dispatchStatus === 'dispatched' || o.dispatchStatus === 'delivered' },
                        { step: '4', title: 'Delivered', done: o.dispatchStatus === 'delivered' || o.installationStatus === 'completed' },
                        { step: '5', title: 'Mounting & Wiring', done: o.installationStatus === 'in_progress' || o.installationStatus === 'completed' || o.installationStatus === 'commissioned' },
                        { step: '6', title: 'Commissioned', done: o.installationStatus === 'completed' || o.installationStatus === 'commissioned' }
                      ].map((st, i) => (
                        <div key={i} style={{ textAlign: 'center', zIndex: 1, background: '#fff', padding: '0 4px', maxWidth: '80px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: st.done ? '#10b981' : '#e2e8f0',
                              color: st.done ? '#fff' : '#64748b',
                              display: 'grid',
                              placeItems: 'center',
                              margin: '0 auto 4px',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          >
                            {st.done ? '✓' : st.step}
                          </div>
                          <span style={{ fontSize: '0.68rem', fontWeight: '600', color: st.done ? '#0b2540' : '#94a3b8', lineHeight: 1.2, display: 'block' }}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 3-Stage Milestone Payment Schedule Card */}
                    <div style={{ marginTop: '1.2rem', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0b2540' }}>
                          💳 Project Milestone Payment Schedule
                        </span>
                        <span style={{ fontSize: '0.78rem', color: o.balanceDue > 0 ? '#b45309' : '#15803d', fontWeight: 700 }}>
                          {o.balanceDue > 0 ? `Remaining Balance: ₹${o.balanceDue.toLocaleString()}` : '✓ All Milestones Cleared'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {[
                          {
                            title: 'Milestone 1: Booking Advance (35%)',
                            amt: Math.round(Number(o.totalAmount || 0) * 0.35),
                            satisfied: Number(o.advancePaid || 0) >= Math.round(Number(o.totalAmount || 0) * 0.35),
                            note: 'Initiates DISCOM net-metering file'
                          },
                          {
                            title: 'Milestone 2: Material Dispatch (40%)',
                            amt: Math.round(Number(o.totalAmount || 0) * 0.40),
                            satisfied: Number(o.advancePaid || 0) >= Math.round(Number(o.totalAmount || 0) * 0.75),
                            note: 'Prior to truck dispatch'
                          },
                          {
                            title: 'Milestone 3: Handover (25%)',
                            amt: Math.round(Number(o.totalAmount || 0) * 0.25),
                            satisfied: Number(o.advancePaid || 0) >= Number(o.totalAmount || 0),
                            note: 'Upon rooftop testing & sync'
                          }
                        ].map((m, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: m.satisfied ? '#f0fdf4' : '#fff',
                              border: `1px solid ${m.satisfied ? '#86efac' : '#cbd5e1'}`
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: m.satisfied ? '#15803d' : '#334155' }}>
                                {m.satisfied ? '✓ Paid' : '⏳ Pending'}
                              </span>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b2540' }}>
                                ₹{m.amt.toLocaleString()}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{m.title}</div>
                            <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>{m.note}</div>
                          </div>
                        ))}
                      </div>

                      {/* Payment Receipts Ledger for this order */}
                      {o.paymentHistory && o.paymentHistory.length > 0 && (
                        <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>
                            Official Payment Receipts & Slips:
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                            {o.paymentHistory.map((ph, phIdx) => (
                              <div
                                key={ph.id || phIdx}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: '#fff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  fontSize: '0.75rem'
                                }}
                              >
                                <div>
                                  <span style={{ fontWeight: 800, color: '#0e5a8a' }}>{ph.receiptNumber || `RCPT-${phIdx + 1}`}</span>
                                  <span style={{ color: '#64748b', marginLeft: '6px' }}>• {new Date(ph.timestamp).toLocaleDateString()}</span>
                                  <span style={{ color: '#334155', marginLeft: '6px' }}>({ph.milestone || 'Milestone Payment'})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 800, color: '#16a34a' }}>₹{Number(ph.amountReceived || 0).toLocaleString()}</span>
                                  <button
                                    onClick={() => setSelectedCustomerReceipt({
                                      ...ph,
                                      orderNumber: o.orderNumber,
                                      customerName: o.customerName,
                                      customerPhone: o.phone,
                                      orderTotal: o.totalAmount,
                                      currentBalance: o.balanceDue
                                    })}
                                    style={{
                                      background: '#0e5a8a',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      cursor: 'pointer',
                                      fontWeight: 600
                                    }}
                                  >
                                    📜 View Receipt
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Point 5: Live Order Tracking Stage & Field Technician Updates */}
                    <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#0b2540' }}>
                          ⚡ Live Order Tracking Stage: <span style={{ color: '#0e5a8a', fontWeight: '800' }}>{o.trackingStage || 'Payment Confirmed & Order Booked'}</span>
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📅 Scheduled: <b>{o.scheduledDate}</b></span>
                      </div>

                      {/* Timeline of updates with Broadcast Alert Confirmation Badges */}
                      {o.trackingHistory && o.trackingHistory.length > 0 && (
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
                            Recent Status Updates & Alerts:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {o.trackingHistory.map((th, idx) => (
                              <div key={idx} style={{ background: '#fff', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #ffb81c', fontSize: '0.76rem', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0b2540', fontWeight: 'bold' }}>
                                  <span>{th.stage}</span>
                                  <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '0.72rem' }}>
                                    {new Date(th.timestamp).toLocaleString()} • {th.updatedBy}
                                  </span>
                                </div>
                                <div style={{ color: '#475569', marginTop: '3px' }}>{th.notes}</div>
                                {th.notificationSent && (
                                  <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>📱</span>
                                    <span>Alert broadcasted to your phone & email ({th.notificationChannel || 'WhatsApp & SMS'})</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveTab('installations')}
                        style={{ background: 'none', border: 'none', color: '#0e5a8a', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem' }}
                      >
                        View Live Installation Progress & Handover Certificate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INSTALLATION STATUS (Scene 4: On the roof) */}
        {activeTab === 'installations' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>Installation Status & Rooftop Handover</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Scene 4: On the Roof - Field crew execution, power generation tests, photo uploads and homeowner digital acceptance
              </p>
            </div>

            {myInstallations.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b' }}>No installations in progress right now.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myInstallations.map((inst) => (
                  <div
                    key={inst.id}
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0b2540' }}>{inst.crewName}</h3>
                          <StatusBadge status={inst.status} />
                        </div>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                          Site: {inst.address} • Crew Size: {inst.technicianCount} Certified Technicians
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Installed Capacity:</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#16a34a' }}>
                          {inst.systemSizeKw} kW Array
                        </div>
                      </div>
                    </div>

                    {/* Timing & Testing Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '1.2rem', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div>
                        <small style={{ color: '#64748b' }}>Start Time</small>
                        <div style={{ fontWeight: 'bold' }}>{inst.startTime || 'Pending dispatch'}</div>
                      </div>
                      <div>
                        <small style={{ color: '#64748b' }}>Finish Time</small>
                        <div style={{ fontWeight: 'bold' }}>{inst.finishTime || 'In progress'}</div>
                      </div>
                      <div>
                        <small style={{ color: '#64748b' }}>Tested Peak Generation</small>
                        <div style={{ fontWeight: 'bold', color: '#0e5a8a' }}>
                          {inst.powerGenerationTestedKw ? `⚡ ${inst.powerGenerationTestedKw} kW Output` : 'Pending sync'}
                        </div>
                      </div>
                      <div>
                        <small style={{ color: '#64748b' }}>Digital Sign-off</small>
                        <div style={{ fontWeight: 'bold', color: inst.customerSigned ? '#16a34a' : '#b45309' }}>
                          {inst.customerSigned ? '✓ Accepted by Customer' : 'Pending Roof Signature'}
                        </div>
                      </div>
                    </div>

                    {/* Photo Proof Gallery */}
                    {inst.photos && inst.photos.length > 0 && (
                      <div style={{ marginTop: '1.2rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0b2540', marginBottom: '8px' }}>
                          📸 High-Resolution Rooftop Completion Proof:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                          {inst.photos.map((ph, idx) => (
                            <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#000' }}>
                              <img src={ph.url} alt={ph.label} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#fff', background: '#1e293b' }}>
                                {ph.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Digital Signature Acceptance Box */}
                    {inst.customerSigned && (
                      <div style={{ marginTop: '1.2rem', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#166534' }}>
                            ✓ Digital Work Acceptance Certificate Signed On Screen
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                            Certified by {inst.customerSignerName || inst.customerName} • 20-Year Warranty Clock Started
                          </div>
                        </div>
                        {inst.customerSignature && (
                          <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Customer Signature:</span>
                            <img src={inst.customerSignature} alt="Customer Digital Signature" style={{ height: '36px', display: 'block' }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: WARRANTY (Scene 3 & 5: Warranty Clock) */}
        {activeTab === 'warranty' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>Dispatched Units & OEM Lifetime Warranties</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Scene 3 & 5: Automated warranty clock commenced from the exact date of dispatch for each unit: 20 years for solar panels, 2 years for inverters & batteries.
              </p>
            </div>

            {myWarranties.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b' }}>No active warranties registered under this account yet. Warranties are automatically initiated upon warehouse truck dispatch.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {myWarranties.map((w) => {
                  const today = new Date().toISOString().slice(0, 10)
                  const isExpired = w.endDate && w.endDate < today

                  return (
                    <div
                      key={w.id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '1.4rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', bottom: 0, background: !isExpired ? '#10b981' : '#ef4444' }} />

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                            {w.equipmentType || 'Solar Component'}
                          </span>
                          <span
                            style={{
                              background: !isExpired ? '#dcfce7' : '#fee2e2',
                              color: !isExpired ? '#15803d' : '#b91c1c',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            {!isExpired ? '● Active Warranty' : 'Expired'}
                          </span>
                        </div>

                        <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#0b2540' }}>{w.equipmentName}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#0e5a8a', fontWeight: 'bold' }}>
                            Serial #: {w.serialNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(w.serialNumber)
                              alert(`Copied serial number: ${w.serialNumber}`)
                            }}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                          >
                            Copy
                          </button>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Dispatched On</span>
                            <b style={{ color: '#0b2540' }}>{w.startDate || w.dispatchDate || '2026-11-14'}</b>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Warranty Valid Until</span>
                            <b style={{ color: '#0e5a8a' }}>{w.endDate}</b>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Duration</span>
                            <b>{w.warrantyYears} Years</b>
                          </div>
                        </div>

                        <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>
                          <b>Coverage Terms:</b> {w.coverage || `${w.warrantyYears}-Year OEM replacement & on-site labour.`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRaiseForWarrantyUnit(w)}
                        style={{
                          background: '#f0fdf4',
                          color: '#15803d',
                          border: '1px solid #bbf7d0',
                          padding: '7px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        ⚡ Raise Complaint / Service for this Unit
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SERVICE REQUESTS (Scene 5: The Rainy Season Breakdown) */}
        {activeTab === 'service' && (
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>Service Requests & Fault Diagnostics</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Scene 5: Rainy Season Breakdown - Choose a specific purchased item or report troubleshooting difficulty. Our team provides fast follow-up and on-site support.
              </p>
            </div>

            {/* Guided Complaint Wizard */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', color: '#0b2540' }}>
                Report an Issue with Your Solar System
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#64748b' }}>
                You can select a specific unit from your purchase, review initial safety checks, or indicate that you are unable to troubleshoot for immediate team assistance.
              </p>

              {ticketSubmitted ? (
                <div style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  ✓ Breakdown Ticket Successfully Filed! Our technical engineering desk has received your troubleshooting follow-up request. A lead technician will call your registered number and dispatch on-site support.
                </div>
              ) : (
                <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Step 1: Target Option */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      1. What are you reporting an issue with?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      <label
                        style={{
                          border: ticketForm.issueTarget === 'specific_item' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                          background: ticketForm.issueTarget === 'specific_item' ? '#f0f9ff' : '#fff',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <input
                          type="radio"
                          name="issueTarget"
                          value="specific_item"
                          checked={ticketForm.issueTarget === 'specific_item'}
                          onChange={() => setTicketForm({ ...ticketForm, issueTarget: 'specific_item' })}
                        />
                        <div>
                          <b style={{ fontSize: '0.85rem', color: '#0b2540' }}>A Specific Purchased Unit</b>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Select inverter, battery, or panels from your order</div>
                        </div>
                      </label>

                      <label
                        style={{
                          border: ticketForm.issueTarget === 'troubleshooting_difficulty' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                          background: ticketForm.issueTarget === 'troubleshooting_difficulty' ? '#f0f9ff' : '#fff',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <input
                          type="radio"
                          name="issueTarget"
                          value="troubleshooting_difficulty"
                          checked={ticketForm.issueTarget === 'troubleshooting_difficulty'}
                          onChange={() => setTicketForm({ ...ticketForm, issueTarget: 'troubleshooting_difficulty', serialNumber: 'GENERAL-DIAG', reportedItem: 'Overall Solar System (Troubleshooting Difficulty)' })}
                        />
                        <div>
                          <b style={{ fontSize: '0.85rem', color: '#0b2540' }}>General System Difficulty</b>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>System not generating / Unable to diagnose specific part</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Step 2: Choose Equipment if Specific */}
                  {ticketForm.issueTarget === 'specific_item' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                          Select Purchased Equipment / Serial # *
                        </label>
                        <select
                          value={ticketForm.serialNumber}
                          onChange={(e) => {
                            const selSn = e.target.value
                            const matched = myWarranties.find((w) => w.serialNumber === selSn)
                            setTicketForm({
                              ...ticketForm,
                              serialNumber: selSn,
                              reportedItem: matched ? matched.equipmentName : (selSn || 'Purchased Component'),
                              equipmentType: matched ? matched.equipmentType : 'Inverter'
                            })
                          }}
                          required={ticketForm.issueTarget === 'specific_item'}
                          style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        >
                          <option value="">-- Choose your purchased unit --</option>
                          {myWarranties.map((w) => (
                            <option key={w.id} value={w.serialNumber}>
                              {w.equipmentName} (SN: {w.serialNumber} • Dispatched: {w.startDate})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                          Fault Code / Observable Symptom
                        </label>
                        <select
                          value={ticketForm.faultCode}
                          onChange={(e) => setTicketForm({ ...ticketForm, faultCode: e.target.value })}
                          style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        >
                          <option value="E04 - Heavy Rain Grid Isolation Error">E04 - Heavy Rain Grid Isolation Error</option>
                          <option value="E02 - Inverter Low DC Voltage / Zero Power">E02 - Inverter Low DC Voltage / Zero Power</option>
                          <option value="E09 - Earthing Leakage Fault">E09 - Earthing Leakage Fault</option>
                          <option value="F12 - Fan Breakdown / Overheat">F12 - Fan Breakdown / Overheat</option>
                          <option value="B01 - Battery BMS Communication Fault">B01 - Battery BMS Communication Fault</option>
                          <option value="OTH - Unknown Display Error / Zero Generation">OTH - Unknown Display Error / Zero Generation</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Interactive Troubleshooting Checkpoints */}
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '6px' }}>
                      🔧 Quick Homeowner Troubleshooting Checks:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '6px', fontSize: '0.78rem', color: '#475569' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={troubleStepsChecked.acMcb}
                          onChange={(e) => setTroubleStepsChecked({ ...troubleStepsChecked, acMcb: e.target.checked })}
                        />
                        AC Main Isolator / MCB in Distribution Box is ON
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={troubleStepsChecked.dcSwitch}
                          onChange={(e) => setTroubleStepsChecked({ ...troubleStepsChecked, dcSwitch: e.target.checked })}
                        />
                        DC Rotary Disconnect on inverter is turned to '1' (ON)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={troubleStepsChecked.gridActive}
                          onChange={(e) => setTroubleStepsChecked({ ...troubleStepsChecked, gridActive: e.target.checked })}
                        />
                        PSPCL DISCOM grid power is active at your premises
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={troubleStepsChecked.displayLed}
                          onChange={(e) => setTroubleStepsChecked({ ...troubleStepsChecked, displayLed: e.target.checked })}
                        />
                        Inverter LED / LCD screen indicates error or alarm
                      </label>
                    </div>
                  </div>

                  {/* Step 4: Troubleshooting Difficulty & Urgent Follow-up Request */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: '#92400e', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={ticketForm.troubleshootingDifficulty}
                        onChange={(e) => setTicketForm({ ...ticketForm, troubleshootingDifficulty: e.target.checked })}
                      />
                      I am having difficulty troubleshooting this / Cannot resolve myself (Request SunPower engineer follow-up)
                    </label>

                    {ticketForm.troubleshootingDifficulty && (
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#78350f', fontWeight: '600', marginBottom: '3px' }}>
                          What difficulties or symptoms did you observe while troubleshooting?
                        </label>
                        <input
                          type="text"
                          value={ticketForm.difficultyNotes}
                          onChange={(e) => setTicketForm({ ...ticketForm, difficultyNotes: e.target.value })}
                          placeholder="e.g. Checked AC switch, but inverter still shows red LED; afraid to touch DC wiring during rain."
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #fcd34d', fontSize: '0.8rem', background: '#fff' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step 5: Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                      Detailed Description of Breakdown *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Inverter showing fault code after continuous rain, zero power output on generation meter."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        background: '#0e5a8a',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '10px 24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        boxShadow: '0 2px 8px rgba(14,90,138,0.25)'
                      }}
                    >
                      ⚡ Submit Breakdown Ticket for Rapid Follow-up
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* List of Tickets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: '#0b2540' }}>
                My Support Tickets & Follow-Up Status ({myTickets.length})
              </h3>
              {myTickets.length === 0 ? (
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                  No service tickets reported. All your solar equipment is operating normally!
                </div>
              ) : (
                myTickets.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <b style={{ color: '#0b2540' }}>Ticket #{t.ticketNumber}</b>
                          <StatusBadge status={t.status} />
                          {t.troubleshootingDifficulty && (
                            <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                              ⚠️ Team Follow-up Dispatched (Unable to Troubleshoot)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#0e5a8a', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '2px' }}>
                          Unit: {t.reportedItem || t.equipmentType} • Serial: {t.serialNumber || 'N/A'} • Fault: {t.faultCode}
                        </div>
                        {t.raisedBy && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Raised by: <b>{t.raisedBy}</b>
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
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {t.isUnderWarranty ? '● 100% Free Under Warranty (₹0)' : `Chargeable (₹${t.estimatedCost.toLocaleString()})`}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '8px 0', fontSize: '0.82rem', color: '#334155' }}>
                      "{t.description}"
                    </p>

                    {t.difficultyNotes && (
                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '6px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#78350f', marginBottom: '8px' }}>
                        <b>Homeowner Difficulty Note:</b> {t.difficultyNotes}
                      </div>
                    )}

                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                      <b>Assigned Engineer:</b> {t.technicianAssigned} • <b>Status Note:</b> {t.resolutionNotes}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: '0 0 1.2rem' }}>Customer Profile & Connection Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Full Name</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{custName}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Registered Email (Username)</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{currentUser?.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Primary Contact Phone</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{currentUser?.phone || '+91 98140 12345'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Connection Category</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0e5a8a' }}>
                  {currentUser?.connectionCategory || 'Residential'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Grid Tariff Connection</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {currentUser?.connectionType || 'Residential 1-Phase 230V'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>DISCOM Consumer / CA Number</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0e5a8a' }}>
                  {currentUser?.discomAccount || 'PSPCL-REG-001'}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Installation Site Address</label>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{currentUser?.address || 'Punjab, India'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Payment Submission Modal (Point 4) */}
      {selectedQuoteForPay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
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
                  Submit Payment Reference (UTR)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Quote #{selectedQuoteForPay.quoteNumber} • Required Advance: ₹{selectedQuoteForPay.advanceRequired.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuoteForPay(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {proofSubmitted ? (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✓</div>
                <div style={{ fontWeight: 'bold' }}>Payment Reference Submitted!</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Awaiting Admin / Staff verification in company bank account. Your order will be confirmed once verified.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitPaymentProof} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Company Bank Account for NEFT/RTGS/UPI:</div>
                  <div style={{ fontSize: '0.82rem', color: '#0b2540' }}>
                    <div>Account Name: <b>SunPower Solutions Pvt Ltd</b></div>
                    <div>Bank: <b>HDFC Bank Ltd, Model Town Branch</b></div>
                    <div>Account No: <b>50200088992211</b> • IFSC: <b>HDFC0001234</b></div>
                    <div>UPI ID: <b>sunpower.billing@hdfcbank</b></div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Payment Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentType: 'advance', amount: selectedQuoteForPay.advanceRequired })}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: paymentForm.paymentType === 'advance' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                        background: paymentForm.paymentType === 'advance' ? '#eff6ff' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Partial Advance (₹{selectedQuoteForPay.advanceRequired.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentType: 'full', amount: selectedQuoteForPay.netPayableAmount })}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: paymentForm.paymentType === 'full' ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                        background: paymentForm.paymentType === 'full' ? '#eff6ff' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Full Net Amount (₹{selectedQuoteForPay.netPayableAmount.toLocaleString()})
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Amount Paid (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                      Payment Method *
                    </label>
                    <select
                      value={paymentForm.paymentMode}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    >
                      <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                      <option value="UPI Transfer (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                      <option value="Net Banking Direct">Net Banking Direct</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SBI, HDFC, ICICI"
                      value={paymentForm.bankName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Bank UTR # / Transaction Reference / Cheque No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR1984729184 or UPI-9042"
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Transferred from savings account"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedQuoteForPay(null)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#0e5a8a', color: '#fff', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Submit Proof to Admin Desk
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT DIGITAL PAYMENT RECEIPT */}
      {selectedCustomerReceipt && (
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
                  {selectedCustomerReceipt.receiptNumber || 'RCPT-SUN-OFFICIAL'}
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', marginBottom: '14px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>CUSTOMER:</span>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>{selectedCustomerReceipt.customerName}</div>
                <div style={{ color: '#475569', fontSize: '0.74rem' }}>{selectedCustomerReceipt.customerPhone || selectedCustomerReceipt.customerEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>TRANSACTION DATE:</span>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>{new Date(selectedCustomerReceipt.timestamp).toLocaleDateString()}</div>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{new Date(selectedCustomerReceipt.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Transaction Specifics */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Order Number:</span>
                <span style={{ fontWeight: 700, color: '#0b2540' }}>#{selectedCustomerReceipt.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Milestone Purpose:</span>
                <span style={{ fontWeight: 700, color: '#0e5a8a' }}>{selectedCustomerReceipt.milestone || 'Milestone Payment'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600 }}>{selectedCustomerReceipt.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>Transaction Reference / UTR:</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{selectedCustomerReceipt.referenceNo || 'Direct Handover'}</span>
              </div>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b2540' }}>AMOUNT PAID:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
                  ₹{Number(selectedCustomerReceipt.amountReceived || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Audit & Staff Verification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <div>
                Verified By: <b>{selectedCustomerReceipt.updatedBy || 'Accounts Desk'}</b>
                <div style={{ fontSize: '0.7rem' }}>Delivery: {selectedCustomerReceipt.notificationChannel || 'WhatsApp & SMS Dispatched'}</div>
              </div>
              <div style={{ textAlign: 'right', border: '1px dashed #94a3b8', padding: '4px 8px', borderRadius: '4px', background: '#fafafa' }}>
                <div style={{ fontWeight: 700, color: '#0b2540' }}>SunPower Accounts</div>
                <div style={{ fontSize: '0.68rem', color: '#15803d' }}>Official Digital Slip</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setSelectedCustomerReceipt(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
              <a
                href={generateWhatsAppReceiptLink(
                  selectedCustomerReceipt.customerPhone,
                  selectedCustomerReceipt.customerName,
                  selectedCustomerReceipt.orderNumber,
                  selectedCustomerReceipt.receiptNumber,
                  selectedCustomerReceipt.amountReceived,
                  selectedCustomerReceipt.milestone,
                  selectedCustomerReceipt.currentBalance || 0
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
                <span>📲</span> Send Receipt to WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <QuoteRequestModal isOpen={showEnquiryModal} onClose={() => setShowEnquiryModal(false)} />
    </div>
  )
}
