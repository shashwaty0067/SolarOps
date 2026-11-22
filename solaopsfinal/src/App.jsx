import React, { useState, useEffect } from 'react'
import { useSolarStore } from './lib/store'
import { PublicWebsite } from './public/PublicWebsite'
import { CustomerPortal } from './customer/CustomerPortal'
import { AdminDashboard } from './admin/AdminDashboard'
import { TechnicianPortal } from './technician/TechnicianPortal'

export default function App() {
  const { currentUser } = useSolarStore()
  // Current view: 'public' | 'customer' | 'admin' | 'technician'
  const [view, setView] = useState('public')

  // Keep view synchronized with authenticated role
  useEffect(() => {
    if (!currentUser) {
      setView('public')
    } else if (currentUser.role === 'admin') {
      setView('admin')
    } else if (currentUser.role === 'technician') {
      setView('technician')
    } else if (currentUser.role === 'customer') {
      setView('customer')
    }
  }, [currentUser])

  // Strict role guards: Customer CANNOT see or access admin dashboard
  if (currentUser?.role === 'customer' && view === 'customer') {
    return (
      <CustomerPortal
        onGoHome={() => setView('public')}
      />
    )
  }

  if (currentUser?.role === 'technician' && view === 'technician') {
    return (
      <TechnicianPortal
        onGoHome={() => setView('public')}
      />
    )
  }

  if (currentUser?.role === 'admin' && view === 'admin') {
    return (
      <AdminDashboard
        onGoHome={() => setView('public')}
      />
    )
  }

  // Public website for visitors and when navigating back to home
  return (
    <PublicWebsite
      onSelectView={(selected) => {
        // Enforce authorization
        if (selected === 'admin') {
          if (currentUser?.role === 'admin') {
            setView('admin')
          }
        } else if (selected === 'technician') {
          if (currentUser?.role === 'technician' || currentUser?.role === 'admin') {
            setView('technician')
          }
        } else if (selected === 'customer') {
          if (currentUser?.role === 'customer') {
            setView('customer')
          }
        } else {
          setView('public')
        }
      }}
    />
  )
}
