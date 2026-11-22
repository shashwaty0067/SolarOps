import React, { useState, useEffect } from 'react'
import { useSolarStore } from '../lib/store'
import { LoginModal } from '../components/LoginModal'
import { QuoteRequestModal } from '../components/QuoteRequestModal'
import { TrackByPhoneModal } from '../components/TrackByPhoneModal'

const heroSlides = [
  {
    title: 'Rooftop installations, tracked end to end',
    subtitle: 'From initial site survey to the 20-year warranty, in one digital backbone.',
    cta: 'Explore Packages',
    href: '#packages'
  },
  {
    title: 'Residential & Commercial Solar Plants',
    subtitle: 'From 1 kW – 5 kW home systems to 10 kW – 25 kW commercial & industrial connections.',
    cta: 'Calculate Savings',
    href: '#calculator'
  },
  {
    title: '15 Field Technicians & 40+ Projects a Month',
    subtitle: 'Digital roof handovers, serial barcode scanning, and instant warranty tracking.',
    cta: 'Our Journey',
    href: '#journey'
  }
]

export function PublicWebsite({ onSelectView }) {
  const { packages, currentUser } = useSolarStore()
  const [slideIdx, setSlideIdx] = useState(0)

  // Login & Sign up modal control
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginModalMode, setLoginModalMode] = useState('login') // 'login' | 'signup'
  const [loginModalPortal, setLoginModalPortal] = useState('user') // 'user' | 'admin'

  // Quote modal
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [selectedPackageForQuote, setSelectedPackageForQuote] = useState('3 kW On-Grid')

  // Unauthenticated Mobile Number Tracking Modal (Point 1)
  const [isTrackOpen, setIsTrackOpen] = useState(false)

  // Interactive Solar Calculator State (Supports Residential & High-Load Commercial)
  const [monthlyBill, setMonthlyBill] = useState(6000)
  const recommendedKw =
    monthlyBill <= 2200
      ? 1
      : monthlyBill <= 5000
      ? 3
      : monthlyBill <= 10000
      ? 5
      : monthlyBill <= 30000
      ? 10
      : 25

  const estimatedSavingsMonth = Math.round(monthlyBill * 0.88)
  const estimatedAnnualSavings = estimatedSavingsMonth * 12
  const estimatedSystemCost =
    recommendedKw === 1
      ? 35000
      : recommendedKw === 3
      ? 107000
      : recommendedKw === 5
      ? 217000
      : recommendedKw === 10
      ? 560000
      : 1350000

  const paybackYears = (estimatedSystemCost / estimatedAnnualSavings).toFixed(1)

  useEffect(() => {
    if (isLoginOpen || isQuoteOpen || isTrackOpen) return
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isLoginOpen, isQuoteOpen, isTrackOpen])

  const handleOpenQuote = (pkgName) => {
    setSelectedPackageForQuote(pkgName)
    setIsQuoteOpen(true)
  }

  const handleOpenLogin = (portal = 'user', mode = 'login') => {
    setLoginModalPortal(portal)
    setLoginModalMode(mode)
    setIsLoginOpen(true)
  }

  return (
    <div style={{ color: '#1e293b', background: '#fff' }}>
      {/* Top Contact Bar */}
      <div
        style={{
          background: '#07192e',
          color: '#cfdbe7',
          padding: '6px 4vw',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>📞 Toll-Free: <b>1800 000 000</b></span>
          <span>📍 Phagwara & Jalandhar Hub, Punjab</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#calculator" style={{ color: '#ffb81c' }}>Solar Calculator</a>
          <a href="#packages" style={{ color: '#cfdbe7' }}>Residential & Commercial</a>
          <a href="#services" style={{ color: '#cfdbe7' }}>Services</a>
          <a href="#contact" style={{ color: '#cfdbe7' }}>Contact</a>
        </div>
      </div>

      {/* Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(11, 37, 64, 0.96)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          padding: '0.8rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffb81c', display: 'grid', placeItems: 'center', color: '#0b2540', fontSize: '1.4rem', fontWeight: 'bold' }}>
            ☀️
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '1.3rem', letterSpacing: '-0.02em' }}>SolarOps</strong>
            <small style={{ display: 'block', fontSize: '0.72rem', color: '#cbd5e1' }}>Digital Solar Management System</small>
          </div>
        </a>

        <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
          <a href="#packages" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Packages</a>
          <a href="#products" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Hardware</a>
          <a href="#services" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Services</a>
          <a href="#calculator" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Savings Calculator</a>
          <a href="#journey" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Process</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsTrackOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#ffb81c',
              border: '1px solid rgba(255, 184, 28, 0.4)',
              fontWeight: '700',
              padding: '0.55rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🔍</span> Track by Mobile
          </button>

          <button
            onClick={() => handleOpenQuote('3 kW On-Grid')}
            style={{
              background: '#ffb81c',
              color: '#0b2540',
              fontWeight: '800',
              border: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Request a Quote
          </button>

          {/* If already logged in, show direct portal button */}
          {currentUser ? (
            <button
              onClick={() => onSelectView(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'technician' ? 'technician' : 'customer')}
              style={{
                background: currentUser.role === 'admin' ? '#0b2540' : currentUser.role === 'technician' ? '#b45309' : '#10b981',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                padding: '0.5rem 1.1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Go to {currentUser.role === 'admin' ? 'Admin Dashboard' : currentUser.role === 'technician' ? 'Technician Portal' : 'My Portal'} →
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleOpenLogin('user', 'login')}
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  color: '#fff',
                  fontWeight: '700',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenLogin('user', 'signup')}
                style={{
                  background: '#0e5a8a',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: '700',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #07192e 0%, #0e5a8a 60%, #1e3a8a 100%)',
          color: '#fff',
          padding: '6rem 4vw 4rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255, 184, 28, 0.2)', color: '#ffb81c', padding: '4px 12px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 'bold' }}>
              ⚡ Rooftop Solar for Homes, C&I & Factories
            </span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: '800', lineHeight: 1.15, margin: '1rem 0' }}>
              {heroSlides[slideIdx].title}
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '520px', lineHeight: 1.6, marginBottom: '2rem' }}>
              {heroSlides[slideIdx].subtitle}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenQuote('3 kW On-Grid')}
                style={{
                  background: '#ffb81c',
                  color: '#0b2540',
                  border: 'none',
                  fontWeight: '800',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Get Free Rooftop Survey
              </button>
              <button
                onClick={() => setIsTrackOpen(true)}
                style={{
                  background: 'rgba(255, 184, 28, 0.2)',
                  border: '1.5px solid #ffb81c',
                  color: '#ffb81c',
                  fontWeight: '700',
                  padding: '14px 24px',
                  borderRadius: '999px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📱 Track Inquiry / Quote by Mobile
              </button>
              <button
                onClick={() => handleOpenLogin('user', 'signup')}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: '700',
                  padding: '14px 24px',
                  borderRadius: '999px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Create Account (Sign Up)
              </button>
            </div>
          </div>

          {/* Feature Highlights Box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '18px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', color: '#ffb81c' }}>Why SunPower Solutions?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: 'Residential & Commercial Connections', desc: 'Single-phase 230V, three-phase 415V, and HT 11kV/33kV for factories & dairies.' },
                { title: 'PM Surya Ghar National Subsidy', desc: 'Up to ₹78,000 direct bank transfer subsidy on domestic 3 kW rooftop plants.' },
                { title: 'Commercial Accelerated Depreciation', desc: '40% tax write-off on commercial and industrial solar investments in year one.' },
                { title: '20-Year Solar Panel Guarantee', desc: 'Automated serial tracking with 2-year inverter & 20-year panel warranty clock.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#ffb81c', fontSize: '1.1rem' }}>✓</span>
                  <div>
                    <b style={{ display: 'block', fontSize: '0.92rem' }}>{item.title}</b>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Strip */}
      <section style={{ maxWidth: '1200px', margin: '-2rem auto 3rem', padding: '0 4vw', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: '#fff', borderRadius: '14px', boxShadow: '0 12px 35px rgba(0,0,0,0.08)', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {[
            { num: '40+', label: 'Monthly Installations' },
            { num: '1 kW - 25 kW', label: 'Residential & Commercial Kits' },
            { num: '15 Crew', label: 'Certified Field Technicians' },
            { num: '20 Years', label: 'Linear Power Warranty' }
          ].map((st, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '10px', borderRight: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0e5a8a' }}>{st.num}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES SECTION (Residential & Commercial) */}
      <section id="packages" style={{ padding: '4rem 4vw', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#0e5a8a', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Turnkey Solar Packages
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0b2540', margin: '6px 0 10px' }}>
              Residential & Commercial Solar Systems
            </h2>
            <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Ready-made systems from 1 kW to 25 kW. Complete with Tier-1 panels, inverters, elevated structures, wiring protection boxes, and net-metering synchronization.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {packages.map((pkg) => {
              const isPopular = pkg.id === 'pkg-3kw-ongrid'
              const isCommercial = pkg.capacityKw >= 10
              return (
                <div
                  key={pkg.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: isPopular ? '2.5px solid #ffb81c' : isCommercial ? '2px solid #0e5a8a' : '1px solid #e2e8f0',
                    boxShadow: isPopular ? '0 12px 30px rgba(255,184,28,0.18)' : '0 4px 12px rgba(0,0,0,0.04)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {isPopular && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '20px',
                        background: '#ffb81c',
                        color: '#0b2540',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 12px',
                        borderRadius: '999px'
                      }}
                    >
                      ★ MOST POPULAR (MAX SUBSIDY)
                    </span>
                  )}

                  {isCommercial && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '20px',
                        background: '#0e5a8a',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 12px',
                        borderRadius: '999px'
                      }}
                    >
                      🏢 COMMERCIAL 3-PHASE (C&I)
                    </span>
                  )}

                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: pkg.systemType === 'on_grid' ? '#1d4ed8' : '#b45309',
                          background: pkg.systemType === 'on_grid' ? '#eff6ff' : '#fef3c7',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {pkg.systemType === 'on_grid' ? 'On-Grid (Connected to Grid)' : 'Off-Grid (Battery Backup)'}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {pkg.connectionCategory || 'Residential'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#0b2540', margin: '4px 0 6px' }}>{pkg.name}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', minHeight: '38px', lineHeight: 1.5 }}>{pkg.description}</p>

                    <div style={{ margin: '1.2rem 0', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>System Value:</span>
                        <b style={{ fontSize: '1.1rem', color: '#0b2540' }}>₹{pkg.basePrice.toLocaleString()}</b>
                      </div>
                      {pkg.subsidyAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#16a34a', fontSize: '0.82rem', marginTop: '4px' }}>
                          <span>Govt Subsidy:</span>
                          <b>- ₹{pkg.subsidyAmount.toLocaleString()}</b>
                        </div>
                      )}
                      <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0e5a8a' }}>Net Payable:</span>
                        <b style={{ fontSize: '1.35rem', color: '#0e5a8a' }}>
                          ₹{(pkg.basePrice - pkg.subsidyAmount).toLocaleString()}
                        </b>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Included Hardware Parts:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5' }}>
                      {pkg.bom.slice(0, 4).map((b, idx) => (
                        <li key={idx}>
                          {b.qty}x {b.item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenQuote(pkg.name)}
                    style={{
                      marginTop: '1.5rem',
                      width: '100%',
                      background: isPopular ? '#ffb81c' : isCommercial ? '#0e5a8a' : '#0b2540',
                      color: isPopular ? '#0b2540' : '#fff',
                      border: 'none',
                      fontWeight: 'bold',
                      padding: '11px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Select & Request Quote
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SOLAR SAVINGS CALCULATOR (RESIDENTIAL & COMMERCIAL) */}
      <section id="calculator" style={{ padding: '4rem 4vw', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, #0b2540, #0e5a8a)', color: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 20px 50px rgba(11,37,64,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ background: '#ffb81c', color: '#0b2540', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800' }}>
              SOLAR SAVINGS CALCULATOR
            </span>
            <h2 style={{ fontSize: '2rem', margin: '10px 0 6px' }}>
              Calculate Residential or Commercial Electricity Savings
            </h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              See how fast your 1 kW – 5 kW home solar or 10 kW – 25 kW commercial plant pays for itself.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>
                Your Monthly Electricity Bill: <b style={{ color: '#ffb81c', fontSize: '1.25rem' }}>₹{monthlyBill.toLocaleString()}</b>
              </label>
              <input
                type="range"
                min="1500"
                max="80000"
                step="500"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                style={{ width: '100%', height: '8px', borderRadius: '4px', accentColor: '#ffb81c', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
                <span>₹1,500 / mo (Domestic)</span>
                <span>₹80,000 / mo (Commercial / Factory)</span>
              </div>

              <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.85rem' }}>Recommended System Capacity:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffb81c' }}>
                  {recommendedKw} kW {recommendedKw >= 10 ? 'Commercial 3-Phase Solar Plant' : 'Rooftop Solar System'}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', color: '#1e293b', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Estimated Annual Electricity Savings</span>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#16a34a', margin: '4px 0' }}>
                ₹{estimatedAnnualSavings.toLocaleString()} / year
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem' }}>
                Estimated payback period: <b>~{paybackYears} Years</b> (Remaining 18+ years free electricity!)
              </p>
              <button
                onClick={() => handleOpenQuote(`${recommendedKw} kW On-Grid`)}
                style={{
                  width: '100%',
                  background: '#ffb81c',
                  color: '#0b2540',
                  border: 'none',
                  fontWeight: 'bold',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Book Survey for {recommendedKw} kW System
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOLAR PRODUCTS SECTION */}
      <section id="products" style={{ padding: '4rem 4vw', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#0e5a8a', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Tier-1 Hardware Catalog
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0b2540', margin: '6px 0 10px' }}>
              High-Value Stock & Components
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              Every unit is barcoded and tracked in our warehouse before leaving for customer sites.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Mono PERC Bi-facial Panels', cat: 'Solar Panels', desc: '540W / 550W Tier-1 high efficiency modules with 20-year linear power warranty.', badge: '20-Year OEM' },
              { name: 'Smart Dual-MPPT Inverters', cat: 'Inverters', desc: 'Grid-tie string inverters with built-in Wi-Fi real-time mobile app telemetry.', badge: '2-Year Warranty' },
              { name: 'LiFePO4 Storage Batteries', cat: 'Batteries', desc: '48V 100Ah & 200Ah deep-cycle lithium batteries for uninterrupted backup.', badge: '2-Year Warranty' },
              { name: 'HDG Elevated Rooftop Stands', cat: 'Structures', desc: 'Hot-dip galvanized steel mounting designed for 150 km/h wind gusts.', badge: '5-Year Warranty' }
            ].map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                  {p.cat}
                </span>
                <h4 style={{ fontSize: '1.15rem', color: '#0b2540', margin: '8px 0 6px' }}>{p.name}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ marginTop: '10px', fontSize: '0.78rem', fontWeight: 'bold', color: '#16a34a' }}>
                  ✓ {p.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" style={{ padding: '4rem 4vw', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#0e5a8a', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Full Operational Services
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0b2540', margin: '6px 0 10px' }}>
              What Our 15 Field Technicians Deliver
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { icon: '📐', title: 'Site Feasibility Survey', desc: 'Measuring shadow-free space, azimuth, roof tilt, and cable run distance.' },
              { icon: '⚡', title: 'Turnkey Installation', desc: 'Mounting stands, laying panels, wiring protection boxes, and earthing pits.' },
              { icon: '📋', title: 'Net-Metering & Subsidy', desc: 'Liaising with electricity board (PSPCL) for bidirectional meter commissioning.' },
              { icon: '🔧', title: 'AMC & Breakdown Support', desc: 'Rapid service calls during rainy seasons. In-warranty parts replaced at ₹0.' }
            ].map((s, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{s.icon}</div>
                <h4 style={{ fontSize: '1.1rem', color: '#0b2540', margin: '0 0 6px' }}>{s.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS JOURNEY */}
      <section id="journey" style={{ padding: '4.5rem 4vw', background: '#0b2540', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#ffb81c', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              END-TO-END SOLAR OPERATIONS WORKFLOW
            </span>
            <h2 style={{ fontSize: '2.2rem', margin: '8px 0 10px', fontWeight: '800' }}>The 5-Step Digital Backbone</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
              How SolarOps standardizes and automates rooftop project workflows from initial feasibility analysis to lifelong warranty service.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            {[
              {
                step: '01',
                phase: 'FEASIBILITY & SURVEY',
                title: 'Rooftop Feasibility Analysis',
                desc: 'Homeowner submits connection details. Certified surveyor conducts on-site shadow measurement, azimuth tilt check, and electrical sanction audit.'
              },
              {
                step: '02',
                phase: 'QUOTATION & MILESTONES',
                title: 'Dynamic Quotation & BOM',
                desc: 'System auto-generates custom hardware bill-of-materials, PSPCL subsidy rebate, and multi-stage milestone payment schedule (35% booking, 40% dispatch, 25% handover).'
              },
              {
                step: '03',
                phase: 'INVENTORY & LOGISTICS',
                title: 'Serial Allocation & Dispatch',
                desc: 'Warehouse checks live SKU stock, binds unique panel & inverter serials to the customer record, and dispatches truck delivery with live customer SMS & WhatsApp alerts.'
              },
              {
                step: '04',
                phase: 'ROOFTOP EXECUTION',
                title: 'Mounting, Wiring & Commissioning',
                desc: 'Certified crew erects RCC mountings, clamps PV arrays, and completes MPPT inverter grid sync. Homeowner inspects generation and signs digital handover on tablet.'
              },
              {
                step: '05',
                phase: 'LIFECYCLE MANAGEMENT',
                title: 'Warranty Activation & AMC Support',
                desc: 'Dispatch date automatically initiates 25-year component warranties. Customers track live status and log targeted item breakdown tickets for rapid field resolution.'
              }
            ].map((j, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '1.4rem',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffb81c' }}>{j.step}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.5px', color: '#93c5fd', background: 'rgba(59,130,246,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {j.phase}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.02rem', color: '#fff', margin: '0 0 8px', fontWeight: '700', lineHeight: 1.35 }}>
                  {j.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.55 }}>
                  {j.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: '#07192e', color: '#94a3b8', padding: '4rem 4vw 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
              ☀️ SolarOps
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              The digital solar management system for solar EPC and installation companies. Managing rooftop projects from feasibility quote to 20-year warranty lifecycle.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', margin: '0 0 10px', fontSize: '0.95rem' }}>Packages</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <a href="#packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>3 kW Residential Subsidy Kit</a>
              <a href="#packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>5 kW Off-Grid Battery Powerhouse</a>
              <a href="#packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>10 kW Commercial Three-Phase</a>
              <a href="#packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>25 kW Industrial High-Demand</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', margin: '0 0 10px', fontSize: '0.95rem' }}>Portal Access</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <button
                onClick={() => handleOpenLogin('user', 'login')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Customer Portal Login →
              </button>
              <button
                onClick={() => handleOpenLogin('user', 'signup')}
                style={{ background: 'none', border: 'none', color: '#10b981', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                New Customer Registration (Sign Up) →
              </button>
              <button
                onClick={() => handleOpenLogin('technician', 'login')}
                style={{ background: 'none', border: 'none', color: '#f59e0b', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                👷 Site Technician Portal Login →
              </button>
              <button
                onClick={() => handleOpenLogin('admin', 'login')}
                style={{ background: 'none', border: 'none', color: '#ffb81c', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                🛡️ Admin & Operations Login →
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', margin: '0 0 10px', fontSize: '0.95rem' }}>Contact SunPower</h4>
            <p style={{ fontSize: '0.85rem', margin: '0 0 6px' }}>Toll Free: 1800 000 000</p>
            <p style={{ fontSize: '0.85rem', margin: '0 0 6px' }}>Email: support@sunpowersolutions.in</p>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Hubs: Jalandhar, Ludhiana, Phagwara, Punjab</p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 SolarOps Digital Solar Management Systems. All rights reserved.
        </div>
      </footer>

      {/* Role Selection & Auth Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSelectView={onSelectView}
        initialMode={loginModalMode}
        initialPortal={loginModalPortal}
      />

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultSystem={selectedPackageForQuote}
      />

      {/* Unauthenticated Track By Phone Modal (Point 1) */}
      <TrackByPhoneModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />
    </div>
  )
}
