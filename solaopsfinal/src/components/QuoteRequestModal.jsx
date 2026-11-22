import React, { useState, useEffect } from 'react'
import { useSolarStore } from '../lib/store'

export function QuoteRequestModal({ isOpen, onClose, defaultSystem = '3 kW On-Grid' }) {
  const { addEnquiry, currentUser } = useSolarStore()
  const [submitted, setSubmitted] = useState(false)
  const [submittedRecord, setSubmittedRecord] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Jalandhar',
    connectionCategory: 'Residential',
    connectionType: 'Residential 1-Phase 230V',
    sanctionedLoadKw: 5,
    roofType: 'Reinforced Concrete (RCC Flat Roof)',
    monthlyElectricityBill: 3500,
    roofAreaSqft: 400,
    systemPreference: defaultSystem,
    subsidyInterested: true,
    discomAccount: '',
    notes: ''
  })

  // Pre-fill if current user is logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        connectionCategory: currentUser.connectionCategory || prev.connectionCategory,
        connectionType: currentUser.connectionType || prev.connectionType,
        discomAccount: currentUser.discomAccount || prev.discomAccount,
        systemPreference: defaultSystem || prev.systemPreference
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        systemPreference: defaultSystem || prev.systemPreference
      }))
    }
  }, [currentUser, isOpen, defaultSystem])

  if (!isOpen) return null

  const handleCategorySelect = (cat) => {
    let defType = 'Residential 1-Phase 230V'
    let defSystem = '3 kW On-Grid'
    let defSubsidy = true

    if (cat === 'Commercial') {
      defType = 'Commercial 3-Phase 415V'
      defSystem = '10 kW Commercial Three-Phase Grid-Tied System'
      defSubsidy = false
    } else if (cat === 'Industrial') {
      defType = 'Industrial HT 11kV/33kV'
      defSystem = '25 kW Industrial High-Demand Solar Plant'
      defSubsidy = false
    } else if (cat === 'Agricultural') {
      defType = 'Agricultural 3-Phase Solar Pump'
      defSystem = '5 kW Off-Grid Powerhouse (Heavy Battery Bank)'
      defSubsidy = false
    }

    setFormData({
      ...formData,
      connectionCategory: cat,
      connectionType: defType,
      systemPreference: defSystem,
      subsidyInterested: defSubsidy
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const rec = await addEnquiry(formData)
    setSubmittedRecord(rec)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setSubmittedRecord(null)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0b2540', margin: 0 }}>
              Rooftop Solar Feasibility & Quote Inquiry
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Scene 1: Lands with sales and engineering desk for technical shadow & tariff check
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#64748b' }}>
            ×
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🎉</div>
            <h3 style={{ color: '#15803d', margin: '0 0 8px' }}>Enquiry Successfully Logged!</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.2rem', lineHeight: '1.5' }}>
              Your rooftop solar inquiry (Ref: <b>#{submittedRecord?.id}</b>) has been recorded in the database. Our certified survey technicians have received your roof area ({formData.roofAreaSqft} sq.ft) and {formData.connectionType} connection details.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.82rem' }}>
              <div><b>Customer:</b> {formData.name} ({formData.phone})</div>
              <div><b>Tariff Type:</b> {formData.connectionCategory} ({formData.connectionType})</div>
              <div><b>Preferred System:</b> {formData.systemPreference}</div>
              <div><b>Monthly Bill:</b> ₹{Number(formData.monthlyElectricityBill).toLocaleString()}</div>
            </div>

            <button
              onClick={handleReset}
              style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* CONNECTION CATEGORY SELECTOR */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                1. Tariff / Connection Category *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {[
                  { id: 'Residential', label: '🏠 Residential', sub: 'Domestic Homes' },
                  { id: 'Commercial', label: '🏢 Commercial', sub: 'Offices / Dairy / C&I' },
                  { id: 'Industrial', label: '🏭 Industrial', sub: 'Factories / Mills' },
                  { id: 'Agricultural', label: '🌾 Agricultural', sub: 'Farms & Pumps' }
                ].map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      border: formData.connectionCategory === cat.id ? '2px solid #0e5a8a' : '1px solid #cbd5e1',
                      background: formData.connectionCategory === cat.id ? '#eff6ff' : '#fff',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '0.82rem', color: '#0b2540' }}>{cat.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{cat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOMER CONTACT DETAILS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  City / Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Site / Rooftop Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="Plot / Street / Industrial Focal Point"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            {/* TECHNICAL CONNECTION & ROOF DETAILS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Grid Connection Type *
                </label>
                <select
                  value={formData.connectionType}
                  onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {formData.connectionCategory === 'Residential' && (
                    <>
                      <option value="Residential 1-Phase 230V">Residential 1-Phase 230V</option>
                      <option value="Residential 3-Phase 415V">Residential 3-Phase 415V</option>
                    </>
                  )}
                  {formData.connectionCategory === 'Commercial' && (
                    <>
                      <option value="Commercial 3-Phase 415V">Commercial 3-Phase 415V (LT Tariff)</option>
                      <option value="Commercial 1-Phase 230V">Commercial 1-Phase 230V</option>
                    </>
                  )}
                  {formData.connectionCategory === 'Industrial' && (
                    <>
                      <option value="Industrial HT 11kV/33kV">Industrial High Tension (HT 11kV/33kV)</option>
                      <option value="Industrial LT 3-Phase 415V">Industrial Low Tension (LT 3-Phase 415V)</option>
                    </>
                  )}
                  {formData.connectionCategory === 'Agricultural' && (
                    <>
                      <option value="Agricultural 3-Phase Solar Pump">Agricultural 3-Phase Solar Pump</option>
                      <option value="Farm Shed Off-Grid">Farm Shed Off-Grid</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Rooftop Mounting Type *
                </label>
                <select
                  value={formData.roofType}
                  onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Reinforced Concrete (RCC Flat Roof)">Reinforced Concrete (RCC Flat Roof)</option>
                  <option value="Industrial Metal Tin Shed">Industrial Metal Tin Shed</option>
                  <option value="Elevated Superstructure">Elevated Superstructure (Walkable)</option>
                  <option value="Ground Mount / Agricultural Land">Ground Mount / Agricultural Land</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Shadow-Free Roof Area (sq.ft) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.roofAreaSqft}
                  onChange={(e) => setFormData({ ...formData, roofAreaSqft: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>~100 sq.ft required per 1 kW</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Monthly Electricity Bill (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyElectricityBill}
                  onChange={(e) => setFormData({ ...formData, monthlyElectricityBill: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Preferred System Package *
              </label>
              <select
                value={formData.systemPreference}
                onChange={(e) => setFormData({ ...formData, systemPreference: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <optgroup label="Residential Systems (1 kW - 5 kW)">
                  <option value="1 kW On-Grid">1 kW On-Grid (1-2 BHK Home)</option>
                  <option value="2 kW On-Grid">2 kW On-Grid (2-3 BHK Home)</option>
                  <option value="3 kW On-Grid">3 kW On-Grid (Homeowner Favorite / Max ₹78k Subsidy)</option>
                  <option value="5 kW On-Grid">5 kW On-Grid (Large Villa)</option>
                  <option value="3 kW Off-Grid">3 kW Off-Grid (With Lithium Battery)</option>
                  <option value="5 kW Off-Grid">5 kW Off-Grid (Heavy Battery Bank)</option>
                </optgroup>
                <optgroup label="Commercial & Industrial Connections">
                  <option value="10 kW Commercial Three-Phase Grid-Tied System">10 kW Commercial Three-Phase Grid-Tied System</option>
                  <option value="25 kW Industrial High-Demand Solar Plant">25 kW Industrial High-Demand Solar Plant</option>
                </optgroup>
              </select>
            </div>

            {/* POINT 2: SUBSIDY OPTION ONLY FOR RESIDENTIAL ON-GRID */}
            {formData.connectionCategory === 'Residential' && !formData.systemPreference?.includes('Off-Grid') ? (
              <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#166534' }}>
                  <input
                    type="checkbox"
                    checked={formData.subsidyInterested}
                    onChange={(e) => setFormData({ ...formData, subsidyInterested: e.target.checked })}
                  />
                  Apply for PM Surya Ghar National Subsidy (Direct Benefit Transfer up to ₹78,000)
                </label>
                <div style={{ marginTop: '4px', fontSize: '0.74rem', color: '#15803d' }}>
                  Central government financial assistance applicable for Residential On-Grid installations.
                </div>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
                <div style={{ fontWeight: '600', color: '#475569' }}>
                  ℹ️ Government Subsidy Policy Notice:
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  {formData.systemPreference?.includes('Off-Grid')
                    ? 'Off-Grid battery backup systems are NOT eligible for government subsidy. Standard non-subsidized commercial tariff applies.'
                    : 'Commercial, Industrial, and Agricultural connections are NOT eligible for PM Surya Ghar national subsidy.'}
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: '6px',
                background: '#ffb81c',
                color: '#0b2540',
                border: 'none',
                fontWeight: '800',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Submit Feasibility Inquiry to Sales & Tech Desk
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
