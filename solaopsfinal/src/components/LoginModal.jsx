import React, { useState, useEffect } from 'react'
import { useSolarStore } from '../lib/store'

export function LoginModal({ isOpen, onClose, onSelectView, initialMode = 'login', initialPortal = 'user' }) {
  const { loginUser, registerUser } = useSolarStore()

  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [portalType, setPortalType] = useState(initialPortal) // 'user' | 'admin' | 'technician'

  // Sync state whenever modal opens or portal mode changes
  useEffect(() => {
    if (isOpen) {
      setPortalType(initialPortal || 'user')
      setMode(initialMode || 'login')
      setLoginError('')
    }
  }, [isOpen, initialPortal, initialMode])

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sign up form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: 'Jalandhar',
    connectionCategory: 'Residential',
    connectionType: 'Residential 1-Phase 230V',
    discomAccount: ''
  })
  const [signupError, setSignupError] = useState('')

  if (!isOpen) return null

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    const res = await loginUser({
      email: loginEmail,
      password: loginPassword,
      portalType
    })

    setLoading(false)

    if (res.success) {
      if (res.user?.role === 'technician') {
        onSelectView('technician')
      } else if (res.user?.role === 'admin') {
        onSelectView('admin')
      } else {
        onSelectView('customer')
      }
      onClose()
    } else {
      setLoginError(res.error)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setSignupError('')

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match. Please re-enter.')
      return
    }

    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    const res = await registerUser(signupData)
    setLoading(false)

    if (res.success) {
      onSelectView('customer')
      onClose()
    } else {
      setSignupError(res.error)
    }
  }

  // Update connection types based on category
  const handleCategoryChange = (cat) => {
    let defType = 'Residential 1-Phase 230V'
    if (cat === 'Commercial') defType = 'Commercial 3-Phase 415V'
    if (cat === 'Industrial') defType = 'Industrial HT 11kV/33kV'
    if (cat === 'Agricultural') defType = 'Agricultural 3-Phase Solar Pump'
    setSignupData({
      ...signupData,
      connectionCategory: cat,
      connectionType: defType
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#0b2540', margin: 0 }}>
              {mode === 'login' ? 'Sign In to SolarOps' : 'Create Customer Account (Sign Up)'}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
              {mode === 'login'
                ? 'Only registered database users can log in and access system portals.'
                : 'Register your residential, commercial, or industrial rooftop connection.'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#64748b' }}>
            ×
          </button>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '1.2rem' }}>
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setLoginError('')
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'login' ? '#fff' : 'transparent',
              color: mode === 'login' ? '#0b2540' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setSignupError('')
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'signup' ? '#fff' : 'transparent',
              color: mode === 'signup' ? '#0b2540' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign Up (New User)
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: SIGN IN FORM */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Role-Based Portal Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                Select Portal Access Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                <div
                  onClick={() => setPortalType('user')}
                  style={{
                    border: portalType === 'user' ? '2px solid #10b981' : '1px solid #cbd5e1',
                    background: portalType === 'user' ? '#f0fdf4' : '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.86rem', color: '#0f172a' }}>Customer Portal</div>
                    <div style={{ fontSize: '0.70rem', color: '#64748b' }}>Quotes & Tracking</div>
                  </div>
                </div>

                <div
                  onClick={() => setPortalType('technician')}
                  style={{
                    border: portalType === 'technician' ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                    background: portalType === 'technician' ? '#fffbeb' : '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👷</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.86rem', color: '#0f172a' }}>Site Technician</div>
                    <div style={{ fontSize: '0.70rem', color: '#64748b' }}>Surveys & Handover</div>
                  </div>
                </div>

                <div
                  onClick={() => setPortalType('admin')}
                  style={{
                    border: portalType === 'admin' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: portalType === 'admin' ? '#eff6ff' : '#fff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.86rem', color: '#0f172a' }}>Admin Dashboard</div>
                    <div style={{ fontSize: '0.70rem', color: '#64748b' }}>Company Operations</div>
                  </div>
                </div>
              </div>
            </div>

            {loginError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Account Password *
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: portalType === 'admin' ? '#0b2540' : portalType === 'technician' ? '#b45309' : '#0e5a8a',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading
                ? 'Authenticating...'
                : `Sign In to ${
                    portalType === 'admin'
                      ? 'Admin Dashboard'
                      : portalType === 'technician'
                      ? 'Site Technician Portal'
                      : 'Customer Portal'
                  }`}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SIGN UP / REGISTRATION MODULE */}
        {/* ========================================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {signupError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                {signupError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balwinder Singh"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 XXXXX"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Email Address (Login Username) *
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com or you@gmail.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* COMMERCIAL CONNECTIONS SUPPORT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Connection Category *
                </label>
                <select
                  value={signupData.connectionCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="Residential">Residential (Home & Villa)</option>
                  <option value="Commercial">Commercial (Offices, Retail, Dairy, Cold Storage)</option>
                  <option value="Industrial">Industrial (Factories, Mills, Warehouses)</option>
                  <option value="Agricultural">Agricultural (Solar Pumps & Farms)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Grid Connection Type *
                </label>
                <select
                  value={signupData.connectionType}
                  onChange={(e) => setSignupData({ ...signupData, connectionType: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  {signupData.connectionCategory === 'Residential' && (
                    <>
                      <option value="Residential 1-Phase 230V">Residential 1-Phase 230V (Standard)</option>
                      <option value="Residential 3-Phase 415V">Residential 3-Phase 415V (High Load)</option>
                    </>
                  )}
                  {signupData.connectionCategory === 'Commercial' && (
                    <>
                      <option value="Commercial 3-Phase 415V">Commercial 3-Phase 415V (LT Tariff)</option>
                      <option value="Commercial 1-Phase 230V">Commercial 1-Phase 230V (Shops/Kiosks)</option>
                    </>
                  )}
                  {signupData.connectionCategory === 'Industrial' && (
                    <>
                      <option value="Industrial HT 11kV/33kV">Industrial High Tension (HT 11kV/33kV)</option>
                      <option value="Industrial LT 3-Phase 415V">Industrial Low Tension (LT 3-Phase 415V)</option>
                    </>
                  )}
                  {signupData.connectionCategory === 'Agricultural' && (
                    <>
                      <option value="Agricultural 3-Phase Solar Pump">Agricultural 3-Phase Solar Pump</option>
                      <option value="Farm Shed Off-Grid">Farm Shed Off-Grid (Battery Storage)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  Installation Site Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street / Sector / Industrial Area"
                  value={signupData.address}
                  onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.city}
                  onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Electricity Board Consumer ID / Account No. (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PSPCL-JL-129034"
                value={signupData.discomAccount}
                onChange={(e) => setSignupData({ ...signupData, discomAccount: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '6px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account in Database...' : 'Register & Enter Customer Portal'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
