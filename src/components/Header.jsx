export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Local Bites & Beats</h1>
            <p className="text-xs text-slate-500 -mt-1">Laid‑back bookings for local food festivals</p>
          </div>
        </div>
        <a href="/test" className="text-sm text-slate-600 hover:text-slate-900 underline">System Check</a>
      </div>
    </header>
  )
}
