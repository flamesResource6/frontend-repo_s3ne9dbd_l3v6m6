import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import EventCard from './components/EventCard'
import BookingModal from './components/BookingModal'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [events, setEvents] = useState([])
  const [filters, setFilters] = useState({ city: '', category: '' })
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (filters.city) qs.set('city', filters.city)
    if (filters.category) qs.set('category', filters.category)
    const res = await fetch(`${baseUrl}/api/events?${qs.toString()}`)
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onBook = (ev) => {
    setSelected(ev)
    setOpen(true)
  }

  const categories = useMemo(() => {
    const set = new Set(events.map(e => e.category))
    return ['All', ...Array.from(set)]
  }, [events])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      <Header />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
          <h2 className="text-3xl font-extrabold text-slate-900">Easy, laid‑back bookings for local food festivals</h2>
          <p className="text-slate-700 mt-2 max-w-2xl">Discover pop-ups, bites and beats around town. Reserve your spot in seconds—no fuss, just good vibes.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input placeholder="Search by city" className="px-3 py-2 rounded-md border bg-white" value={filters.city} onChange={e=>setFilters({...filters, city: e.target.value})} />
            <select className="px-3 py-2 rounded-md border bg-white" value={filters.category || 'All'} onChange={e=>setFilters({...filters, category: e.target.value === 'All' ? '' : e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={load} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700">Find Events</button>
          </div>
        </div>
      </section>

      {/* Events list */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <p className="text-slate-600">Loading events…</p>
        ) : events.length === 0 ? (
          <EmptyState baseUrl={baseUrl} onCreated={load} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev => (
              <EventCard key={ev.id} event={ev} onBook={onBook} />
            ))}
          </div>
        )}
      </section>

      <BookingModal open={open} event={selected} onClose={() => setOpen(false)} onSuccess={load} />
    </div>
  )
}

function EmptyState({ baseUrl, onCreated }) {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', city: '', venue: '', date: '', price: 0, capacity: 50, category: 'Food Festival', image_url: ''
  })

  const create = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price || 0), capacity: parseInt(form.capacity || 0) }
    const res = await fetch(`${baseUrl}/api/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (res.ok) {
      onCreated && onCreated()
      setShow(false)
    } else {
      const j = await res.json().catch(()=>({detail:'error'}))
      alert(j.detail || 'Failed to create event')
    }
  }

  if (!show) {
    return (
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No events yet</h3>
        <p className="text-slate-600 mb-4">Start by adding a local food festival to showcase.</p>
        <button onClick={() => setShow(true)} className="px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600">Add your first event</button>
      </div>
    )
  }

  return (
    <form onSubmit={create} className="bg-white border rounded-xl p-6 shadow-sm grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded-md px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input className="border rounded-md px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <input className="border rounded-md px-3 py-2" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required />
        <input className="border rounded-md px-3 py-2" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} />
        <input type="datetime-local" className="border rounded-md px-3 py-2" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
        <input type="number" min="0" step="0.01" className="border rounded-md px-3 py-2" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
        <input type="number" min="0" className="border rounded-md px-3 py-2" placeholder="Capacity" value={form.capacity} onChange={e=>setForm({...form, capacity:e.target.value})} />
        <input className="border rounded-md px-3 py-2 col-span-full" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} />
      </div>
      <textarea className="border rounded-md px-3 py-2" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setShow(false)} className="px-4 py-2 rounded-md border">Cancel</button>
        <button className="px-4 py-2 rounded-md bg-slate-900 text-white">Create event</button>
      </div>
    </form>
  )
}

export default App
