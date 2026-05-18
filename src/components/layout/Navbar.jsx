import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, ChevronDown, Download } from 'lucide-react'
import { useState } from 'react'

const FORMS = [
  { id: 'itr1', label: 'ITR-1 (Sahaj)' },
  { id: 'itr2', label: 'ITR-2' },
  { id: 'itr3', label: 'ITR-3' },
  { id: 'itr4', label: 'ITR-4 (Sugam)' },
  { id: 'itr5', label: 'ITR-5' },
  { id: 'itr6', label: 'ITR-6' },
  { id: 'itr7', label: 'ITR-7' },
]

export default function Navbar({ onMenuClick, onSearchClick }) {
  const location = useLocation()
  const [formsOpen, setFormsOpen] = useState(false)

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-light transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <svg viewBox="0 0 200 200" width="32" height="32" xmlns="http://www.w3.org/2000/svg" aria-label="ITR Filing Guide logo">
                <line x1="35" y1="60" x2="165" y2="60" stroke="#ffffff" strokeWidth="1.2" opacity="0.4"/>
                <line x1="35" y1="100" x2="165" y2="100" stroke="#ffffff" strokeWidth="1.2" opacity="0.5"/>
                <line x1="35" y1="140" x2="165" y2="140" stroke="#ffffff" strokeWidth="1.2" opacity="0.4"/>
                <line x1="60" y1="35" x2="60" y2="165" stroke="#ffffff" strokeWidth="1.2" opacity="0.4"/>
                <line x1="100" y1="35" x2="100" y2="165" stroke="#ffffff" strokeWidth="1.2" opacity="0.5"/>
                <line x1="140" y1="35" x2="140" y2="165" stroke="#ffffff" strokeWidth="1.2" opacity="0.4"/>
                <path d="M 35 100 Q 70 80 100 100 Q 130 120 165 100" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9"/>
                <circle cx="100" cy="100" r="2.5" fill="#ffffff"/>
              </svg>
              <div>
                <div className="font-bold text-sm leading-none">ITR Filing Guide</div>
                <div className="text-xs text-blue-200 leading-none mt-0.5">FY 2025-26 | AY 2026-27</div>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-primary-light' : 'hover:bg-primary-light'
              }`}
            >
              Home
            </Link>

            <Link
              to="/selector"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/selector') ? 'bg-primary-light' : 'hover:bg-primary-light'
              }`}
            >
              ITR Selector
            </Link>

            {/* Forms dropdown */}
            <div className="relative">
              <button
                onClick={() => setFormsOpen(!formsOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/forms') ? 'bg-primary-light' : 'hover:bg-primary-light'
                }`}
              >
                All Forms
                <ChevronDown size={14} className={`transition-transform ${formsOpen ? 'rotate-180' : ''}`} />
              </button>
              {formsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white text-text-main rounded-xl shadow-xl border border-border-light py-2 min-w-[180px] z-50"
                  onMouseLeave={() => setFormsOpen(false)}
                >
                  {FORMS.map((f) => (
                    <Link
                      key={f.id}
                      to={`/forms/${f.id}`}
                      onClick={() => setFormsOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {f.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/income"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/income') || isActive('/deductions') ? 'bg-primary-light' : 'hover:bg-primary-light'
              }`}
            >
              Guides
            </Link>

            <Link
              to="/procedures"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/procedures') ? 'bg-primary-light' : 'hover:bg-primary-light'
              }`}
            >
              Procedures
            </Link>

            <Link
              to="/reference"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/reference') ? 'bg-primary-light' : 'hover:bg-primary-light'
              }`}
            >
              Reference
            </Link>

            <Link
              to="/downloads"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/downloads')
                  ? 'bg-accent text-white'
                  : 'bg-accent/20 text-accent hover:bg-accent/30'
              }`}
            >
              <Download size={14} />
              Downloads
              <span className="text-[10px] bg-green-400 text-white px-1.5 py-0.5 rounded-full leading-none font-bold">
                NEW
              </span>
            </Link>
          </nav>

          {/* Search */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 bg-primary-light hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-colors"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline text-blue-200">Search...</span>
            <kbd className="hidden sm:inline text-xs bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
