import React, { useState } from 'react'
import { useSolarStore } from '../lib/store'
import { StatusBadge } from './StatusBadge'

export function TrackByPhoneModal({ isOpen, onClose }) {
  const { getRecordsByPhone, submitPaymentProofByCustomer } = useSolarStore()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState(null)

  // Payment proof form state
  const [activeQuoteForPay, setActiveQuoteForPay] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    transactionRef: '',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankName: '',
    notes: ''
  })
  const [proofSubmitted, setProofSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSearch = (e) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return
    const data = getRecordsByPhone(phoneNumber)
    setResults(data)
    setSearched(true)
  }

  const handleProofSubmit = (e) => {
    e.preventDefault()
    if (!activeQuoteForPay) return
    submitPaymentProofByCustomer(activeQuoteForPay.id, paymentForm)
    setProofSubmitted(true)
    setTimeout(() => {
      setProofSubmitted(false)
      setActiveQuoteForPay(null)
      // Refresh results
      const refreshed = getRecordsByPhone(phoneNumber)
      setResults(refreshed)
    }, 2000)
  }

  const hasAnyRecord =
    results &&
    (results.enquiries.length > 0 ||
      results.surveys.length > 0 ||
      results.quotations.length > 0 ||
      results.orders.length > 0)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#0b2540', margin: 0 }}>
              Track Inquiry & Quotation by Mobile Number
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
              Check your rooftop feasibility, survey approval status, itemized quote, and live order tracking without logging in.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#64748b' }}>
            ×
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <input
            type="tel"
            required
            placeholder="Enter your 10-digit mobile number (e.g. 9814012345)..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '8px',
              border: '2px solid #0e5a8a',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#ffb81c',
              color: '#0b2540',
              border: 'none',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            🔍 Track Status
          </button>
        </form>

        {searched && !hasAnyRecord && (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
            <h3 style={{ margin: '0 0 6px', color: '#0b2540' }}>No Records Found for {phoneNumber}</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
              We could not find any active rooftop inquiry or quotation linked with this mobile number. Please check the number or submit a new inquiry.
            </p>
          </div>
        )}

        {searched && hasAnyRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. INQUIRY & FEASIBILITY / SURVEY STATUS (POINT 1 & 3) */}
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📝</span> Rooftop Inquiry & Feasibility Survey Response:
              </div>

              {results.enquiries.map((enq) => {
                const survey = results.surveys.find((s) => s.enquiryId === enq.id)
                return (
                  <div key={enq.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1.2rem', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <b style={{ fontSize: '1.05rem', color: '#0b2540' }}>{enq.customerName}</b>
                          <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {enq.connectionCategory}
                          </span>
                          <StatusBadge status={enq.status} />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Site: {enq.address}, {enq.city} • Preferred: <b>{enq.systemPreference}</b>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
                        <div>Monthly Bill: <b>₹{enq.monthlyElectricityBill.toLocaleString()}</b></div>
                        <div>Roof Area: <b>{enq.roofAreaSqft} sq.ft</b> ({enq.roofType})</div>
                      </div>
                    </div>

                    {/* Survey Status Box (Point 3: Approved or Disapproved with reason) */}
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                      {survey ? (
                        survey.status === 'approved' ? (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                            <div style={{ color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>✓</span> Site Survey & Technical Feasibility APPROVED
                            </div>
                            <div style={{ color: '#15803d', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                              <span>Shadow-free Space: <b>{survey.shadowFreeRoofSqft} sq.ft</b></span>
                              <span>Direction: <b>{survey.roofDirection}</b></span>
                              <span>Tilt: <b>{survey.roofTiltDegrees}°</b></span>
                              <span>Cable Distance: <b>{survey.cableRunDistanceMeters}m</b></span>
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '4px' }}>
                              Technician: {survey.technicianName} • Notes: "{survey.surveyorNotes}"
                            </div>
                          </div>
                        ) : (
                          // Point 3: Disapproved with option/reason for writing people
                          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                            <div style={{ color: '#991b1b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>⚠️</span> Technical Feasibility DISAPPROVED / REJECTED
                            </div>
                            <div style={{ color: '#b91c1c', marginTop: '4px', fontWeight: '500' }}>
                              <b>Reason for Disapproval:</b> {survey.disapprovalReason || 'Site does not meet required structural or solar radiation standards.'}
                            </div>
                            <div style={{ color: '#7f1d1d', fontSize: '0.78rem', marginTop: '4px' }}>
                              Inspected by: {survey.technicianName} on {survey.surveyDate}. Please contact engineering desk to explore alternate ground mounting or structural retrofitting.
                            </div>
                          </div>
                        )
                      ) : (
                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e' }}>
                          ⏳ Site survey is currently assigned and being reviewed by our technical engineering desk.
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 2. QUOTATION & BILL OF MATERIALS (POINT 1 & 4) */}
            {results.quotations.length > 0 && (
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📑</span> Approved Quotation & Bill of Materials (Exact Parts List):
                </div>

                {results.quotations.map((q) => (
                  <div key={q.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '2px solid #0e5a8a', boxShadow: '0 4px 12px rgba(14,90,138,0.08)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0b2540' }}>{q.capacityKw} kW {q.systemType === 'on_grid' ? 'On-Grid' : 'Off-Grid'} System</h3>
                          <StatusBadge status={q.status} />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Quote #{q.quoteNumber} • Category: {q.connectionCategory} • Valid until {q.validUntil}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total System Value: ₹{q.subtotalAmount.toLocaleString()}</div>
                        {q.subsidyDiscount > 0 && (
                          <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: '600' }}>
                            - Govt Subsidy: ₹{q.subsidyDiscount.toLocaleString()}
                          </div>
                        )}
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0b2540' }}>
                          Net Payable: ₹{q.netPayableAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* BOM parts preview */}
                    <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                      <b style={{ color: '#0e5a8a' }}>Hardware Components (BOM):</b>
                      <ul style={{ margin: '6px 0 0', paddingLeft: '1.2rem', color: '#475569', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4px' }}>
                        {q.items.map((it, idx) => (
                          <li key={idx}>
                            {it.qty}x {it.item} ({it.warranty})
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Payment Status & Submission (Point 4: Staff in control) */}
                    <div style={{ marginTop: '1rem', padding: '12px 14px', borderRadius: '8px', background: q.paymentConfirmedByAdmin ? '#f0fdf4' : '#fffbeb', border: q.paymentConfirmedByAdmin ? '1px solid #bbf7d0' : '1px solid #fef3c7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: q.paymentConfirmedByAdmin ? '#166534' : '#92400e' }}>
                            {q.paymentConfirmedByAdmin
                              ? `✓ Payment Verified & Confirmed by Staff (₹${q.advancePaid.toLocaleString()})`
                              : q.status === 'pending_verification'
                              ? '⏳ Payment Reference Submitted — Awaiting Staff Bank Verification'
                              : `Advance Required to Book Order: ₹${q.advanceRequired.toLocaleString()}`}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            {q.paymentConfirmedByAdmin
                              ? `Verified by: ${q.paymentVerification?.confirmedBy} • Ref: ${q.paymentVerification?.transactionRef}`
                              : 'Order booking & warehouse kit packing is triggered strictly after admin/staff payment confirmation.'}
                          </div>
                        </div>

                        {!q.paymentConfirmedByAdmin && (
                          <button
                            onClick={() => {
                              setActiveQuoteForPay(q)
                              setPaymentForm({
                                amount: q.advanceRequired,
                                transactionRef: '',
                                paymentMode: 'Bank Transfer (NEFT/RTGS)',
                                bankName: '',
                                notes: ''
                              })
                            }}
                            style={{
                              background: '#0e5a8a',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 'bold',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            📤 Submit Bank Transfer / UTR Reference
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. ORDER & LIVE TRACKING STATUS (POINT 5) */}
            {results.orders.length > 0 && (
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0b2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span> Live Order & Installation Tracking:
                </div>

                {results.orders.map((ord) => (
                  <div key={ord.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0b2540' }}>Order #{ord.orderNumber}</h4>
                          <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>
                            {ord.trackingStage || 'Order Booked'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Assigned: <b>{ord.assignedCrew}</b> • Scheduled Install Date: <b>{ord.scheduledDate}</b>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
                        <div>Advance Confirmed: <b style={{ color: '#16a34a' }}>₹{ord.advancePaid.toLocaleString()}</b></div>
                        <div>Balance Due: <b>₹{ord.balanceDue.toLocaleString()}</b></div>
                      </div>
                    </div>

                    {/* Progress tracking updates timeline (Point 5) */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                        Live Updates from Admin & Assigned Technician:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(ord.trackingHistory || []).map((tr, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', borderLeft: '4px solid #0e5a8a', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0e5a8a', fontWeight: 'bold' }}>
                              <span>{tr.stage}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{new Date(tr.timestamp).toLocaleString()}</span>
                            </div>
                            <div style={{ color: '#475569', marginTop: '2px' }}>{tr.notes}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Updated by: {tr.updatedBy}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENT PROOF SUBMISSION DIALOG (POINT 4) */}
        {activeQuoteForPay && (
          <div style={{ marginTop: '1.5rem', background: '#f1f5f9', padding: '1.2rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#0b2540' }}>
                Submit Payment Reference for Quote #{activeQuoteForPay.quoteNumber}
              </h4>
              <button onClick={() => setActiveQuoteForPay(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>

            {proofSubmitted ? (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                ✓ Payment proof recorded! Staff accounts desk has been notified to verify the transfer in the bank account.
              </div>
            ) : (
              <form onSubmit={handleProofSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Transferred Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Transaction UTR / Cheque # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR1908241094"
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Payment Method *</label>
                  <select
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Customer Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC / SBI"
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveQuoteForPay(null)}
                    style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#0e5a8a', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Submit for Staff Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
