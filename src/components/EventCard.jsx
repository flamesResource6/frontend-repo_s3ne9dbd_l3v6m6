export default function EventCard({ event, onBook }) {
  const date = new Date(event.date)
  return (
    <div className="group bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        <img src={event.image_url || 'https://images.unsplash.com/photo-1498654077810-12f23ab5f40e?q=80&w=600&auto=format&fit=crop'} alt="event" className="w-28 h-28 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{event.title}</h3>
            <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{event.category}</span>
          </div>
          <p className="text-slate-600 text-sm mt-1 line-clamp-2">{event.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-2">
            <span>📍 {event.venue ? `${event.venue}, ` : ''}{event.city}</span>
            <span>🗓️ {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
            <span>💵 {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}</span>
            {typeof event.capacity === 'number' && (
              <span>👥 {event.capacity} spots</span>
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={() => onBook(event)} className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-700">Book</button>
          </div>
        </div>
      </div>
    </div>
  )
}
