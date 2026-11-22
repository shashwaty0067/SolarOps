import React from 'react'

export function StatusBadge({ status }) {
  const map = {
    // Enquiries
    new: { label: 'New Inquiry', bg: '#eff6ff', color: '#1d4ed8' },
    contacted: { label: 'Contacted', bg: '#fef3c7', color: '#b45309' },
    survey_scheduled: { label: 'Survey Scheduled', bg: '#f3e8ff', color: '#6b21a8' },
    survey_completed: { label: 'Survey Done', bg: '#dcfce7', color: '#15803d' },
    quoted: { label: 'Quote Sent', bg: '#e0e7ff', color: '#3730a3' },
    converted: { label: 'Order Confirmed', bg: '#ccfbf1', color: '#0f766e' },

    // Surveys
    pending: { label: 'Pending Review', bg: '#fef3c7', color: '#b45309' },
    approved: { label: 'Survey Approved', bg: '#dcfce7', color: '#15803d' },
    rejected: { label: 'Needs Re-check', bg: '#fee2e2', color: '#991b1b' },

    // Quotations
    draft: { label: 'Draft', bg: '#f1f5f9', color: '#475569' },
    sent: { label: 'Sent to Customer', bg: '#e0e7ff', color: '#3730a3' },
    advance_paid: { label: 'Advance Paid', bg: '#dcfce7', color: '#15803d' },
    accepted: { label: 'Accepted', bg: '#dcfce7', color: '#15803d' },

    // Orders / Dispatch
    pending_packing: { label: 'Warehouse Packing', bg: '#fef3c7', color: '#b45309' },
    packed: { label: 'Packed & Staged', bg: '#f3e8ff', color: '#6b21a8' },
    dispatched: { label: 'Truck Dispatched', bg: '#dbeafe', color: '#1d4ed8' },
    delivered: { label: 'Delivered to Site', bg: '#dcfce7', color: '#15803d' },

    // Installations
    scheduled: { label: 'Crew Scheduled', bg: '#fef3c7', color: '#b45309' },
    in_progress: { label: 'Mounting on Roof', bg: '#dbeafe', color: '#1d4ed8' },
    completed: { label: 'Handover Done', bg: '#dcfce7', color: '#15803d' },
    signed_off: { label: 'Signed by Customer', bg: '#15803d', color: '#ffffff' },

    // Tickets
    open: { label: 'Ticket Open', bg: '#fee2e2', color: '#b91c1c' },
    assigned: { label: 'Technician Dispatched', bg: '#fef3c7', color: '#b45309' },
    in_repair: { label: 'In Repair', bg: '#dbeafe', color: '#1d4ed8' },
    resolved: { label: 'Issue Resolved', bg: '#dcfce7', color: '#15803d' },
    closed: { label: 'Closed', bg: '#f1f5f9', color: '#475569' }
  }

  const conf = map[status] || { label: status, bg: '#f1f5f9', color: '#475569' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.78rem',
        fontWeight: '600',
        backgroundColor: conf.bg,
        color: conf.color,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap'
      }}
    >
      {conf.label}
    </span>
  )
}
