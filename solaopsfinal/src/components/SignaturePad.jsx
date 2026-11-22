import React, { useRef, useState, useEffect } from 'react'

export function SignaturePad({ onSave, onCancel, customerName = 'Customer' }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0e5a8a'
  }, [])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    setHasDrawn(true)
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const handleConfirm = () => {
    if (!hasDrawn) {
      alert('Please ask the customer to sign on the pad before saving.')
      return
    }
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }

  return (
    <div className="sig-modal-backdrop">
      <div className="sig-modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0b2540' }}>Digital Roof Handover Acceptance</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Sign on the screen below to confirm completion & testing of the solar installation.
            </p>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}>
            ×
          </button>
        </div>

        <div style={{ border: '2px dashed #94a3b8', borderRadius: '8px', background: '#f8fafc', padding: '8px', textAlign: 'center', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={460}
            height={180}
            style={{ width: '100%', height: '180px', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasDrawn && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', color: '#94a3b8', fontSize: '0.9rem' }}>
              ✍️ Sign here with finger or mouse ({customerName})
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={clearCanvas}
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}
          >
            Clear Pad
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              style={{ background: '#ffb81c', color: '#0b2540', border: 'none', fontWeight: 'bold', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Save & Accept Handover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
