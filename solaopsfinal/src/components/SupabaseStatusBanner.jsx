import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSolarStore } from '../lib/store'

export function SupabaseStatusBanner() {
  const { isSupabaseConnected, resetDemoData, syncAllToSupabase } = useSolarStore()
  const [showSqlModal, setShowSqlModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const handleSyncData = async () => {
    setSyncLoading(true)
    setSyncMessage('')
    const result = await syncAllToSupabase()
    setSyncLoading(false)
    if (result.success) {
      setSyncMessage('✓ Successfully synced all initial packages, users, enquiries, and orders to Supabase!')
      setTimeout(() => setSyncMessage(''), 5000)
    } else {
      setSyncMessage(`✕ Sync Error: ${result.error}. (Please run the updated supabase/schema.sql in Supabase SQL editor first).`)
    }
  }

  const copySqlNotice = () => {
    navigator.clipboard.writeText('-- Run supabase/schema.sql in your Supabase SQL Editor.')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div
        style={{
          background: isSupabaseConnected ? '#064e3b' : '#1e293b',
          color: '#e2e8f0',
          padding: '6px 4vw',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isSupabaseConnected ? '#34d399' : '#f59e0b',
              display: 'inline-block'
            }}
          />
          <span>
            <b>Backend Engine:</b>{' '}
            {isSupabaseConnected
              ? 'Connected to Supabase PostgreSQL (qnasbqpluwwicltxvurh)'
              : 'Supabase PostgreSQL Architecture (Running with Interactive Demo Store)'}
          </span>
          {syncMessage && (
            <span style={{ marginLeft: '10px', color: syncMessage.startsWith('✓') ? '#a7f3d0' : '#fca5a5', fontWeight: 'bold' }}>
              {syncMessage}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSupabaseConnected && (
            <button
              onClick={handleSyncData}
              disabled={syncLoading}
              style={{
                background: '#ffb81c',
                color: '#0b2540',
                border: 'none',
                fontWeight: 'bold',
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: syncLoading ? 'wait' : 'pointer'
              }}
            >
              {syncLoading ? 'Syncing...' : '⚡ Seed Data to Supabase'}
            </button>
          )}

          <button
            onClick={() => setShowSqlModal(true)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            📋 Supabase Schema & Permissions Fix
          </button>

          <button
            onClick={() => {
              if (confirm('Reset store back to clean SunPower demo state?')) {
                resetDemoData()
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {showSqlModal && (
        <div className="modal-backdrop" onClick={() => setShowSqlModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0b2540' }}>Supabase PostgreSQL Schema & Table Permissions</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Execute <code>supabase/schema.sql</code> in your Supabase SQL Editor to grant table privileges to the <code>anon</code> API key.
                </p>
              </div>
              <button onClick={() => setShowSqlModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                ×
              </button>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' }}>
              <b>Why entries fail if permissions are not granted:</b>
              <div style={{ marginTop: '4px' }}>
                PostgreSQL blocks the web application's <code>anon</code> API key with <code>permission denied (code: 42501)</code> unless <code>GRANT ALL ON ALL TABLES IN SCHEMA public TO anon</code> is executed in the Supabase SQL editor.
              </div>
            </div>

            <div style={{ background: '#0f172a', color: '#38bdf8', padding: '14px', borderRadius: '8px', fontSize: '0.78rem', maxHeight: '280px', overflowY: 'auto', fontFamily: 'monospace' }}>
              <pre style={{ margin: 0 }}>
{`-- Step 1: Grant permissions so web clients using anon key can insert & read:
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Step 2: Disable RLS for application CRM tables:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE serial_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE installations DISABLE ROW LEVEL SECURITY;
ALTER TABLE warranties DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_profitability DISABLE ROW LEVEL SECURITY;

-- Note: Full schema with clean drop & create definitions is in supabase/schema.sql`}
              </pre>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Copy the contents of <code>supabase/schema.sql</code> and paste into <b>Supabase Dashboard &gt; SQL Editor &gt; Run</b>.
              </div>
              <button
                onClick={copySqlNotice}
                style={{ background: '#0b2540', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                {copied ? '✓ Path Copied' : 'Copy File Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
