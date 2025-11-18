import { useState, useEffect } from 'react'

export default function BookingModal({ open, onClose, event, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [qty, setQty] = useState(1)
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (open && event?.id) {
      fetch(`${baseUrl}/api/events/${event.id}/availability`)
        .then(r => r.json())
        .then(setAvailability)
        .catch(() => setAvailability(null))
    }
  }, [open, event?.id])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, name, email, quantity: qty })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error'}))
        alert(err.detail || 'Booking failed')
      } else {
        onSuccess && onSuccess()
        onClose()
      }
    } catch (err) {
      alert('Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Book: {event.title}</h3>
            {availability && (
              <p className="text-xs text-slate-500">Remaining: {availability.remaining} / {availability.capacity}</p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded-md px-3 py-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input type="email" className="w-full border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Tickets</label>
            <input type="number" min={1} max={10} className="border rounded-md px-2 py-1 w-24" value={qty} onChange={e=>setQty(parseInt(e.target.value || '1'))} />
          </div>
          <button disabled={loading} className="w-full bg-slate-900 text-white rounded-md py-2 hover:bg-slate-700 disabled:opacity-50">
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
