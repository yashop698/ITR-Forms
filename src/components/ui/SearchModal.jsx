import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, BookOpen, ClipboardList, Database } from 'lucide-react'

const SEARCH_INDEX = [
  { type: 'Form', label: 'ITR-1 (Sahaj) — Salaried Individuals', path: '/forms/itr1', icon: FileText },
  { type: 'Form', label: 'ITR-2 — Capital Gains, NRI, Director', path: '/forms/itr2', icon: FileText },
  { type: 'Form', label: 'ITR-3 — Business / Professional Income', path: '/forms/itr3', icon: FileText },
  { type: 'Form', label: 'ITR-4 (Sugam) — Presumptive Income', path: '/forms/itr4', icon: FileText },
  { type: 'Form', label: 'ITR-5 — Partnership Firms, LLPs, AOP', path: '/forms/itr5', icon: FileText },
  { type: 'Form', label: 'ITR-6 — Companies', path: '/forms/itr6', icon: FileText },
  { type: 'Form', label: 'ITR-7 — Trusts, Universities, Political Parties', path: '/forms/itr7', icon: FileText },
  { type: 'Guide', label: 'Salary Income Guide — HRA, Perquisites, LTA', path: '/income/salary', icon: BookOpen },
  { type: 'Guide', label: 'House Property Income — Section 24(b)', path: '/income/house-property', icon: BookOpen },
  { type: 'Guide', label: 'Capital Gains — LTCG 112A, STCG 111A', path: '/income/capital-gains', icon: BookOpen },
  { type: 'Guide', label: 'Business/Professional Income — 44AD, 44ADA', path: '/income/business-professional', icon: BookOpen },
  { type: 'Guide', label: 'Section 80C — ₹1.5L Deduction Limit', path: '/deductions/80c', icon: BookOpen },
  { type: 'Guide', label: 'Section 80CCD — NPS Deductions (80CCD(2) 14%)', path: '/deductions/80ccd', icon: BookOpen },
  { type: 'Guide', label: 'Section 80D — Health Insurance Premium', path: '/deductions/80d', icon: BookOpen },
  { type: 'Procedure', label: 'E-Verification — 30-day window', path: '/procedures/e-verification', icon: ClipboardList },
  { type: 'Procedure', label: 'Revised Return — Section 139(5) until Mar 31, 2027', path: '/procedures/revised-return', icon: ClipboardList },
  { type: 'Procedure', label: 'Belated Return — Section 139(4) until Dec 31, 2026', path: '/procedures/belated-return', icon: ClipboardList },
  { type: 'Procedure', label: 'Interest & Penalties — 234A, 234B, 234C', path: '/procedures/interest-penalties', icon: ClipboardList },
  { type: 'Procedure', label: 'Refund Processing — Section 244A', path: '/procedures/refund-processing', icon: ClipboardList },
  { type: 'Reference', label: 'Important Dates & Deadlines FY 2025-26', path: '/reference/dates', icon: Database },
  { type: 'Reference', label: 'Form Applicability Matrix', path: '/reference/form-matrix', icon: Database },
  { type: 'Reference', label: 'TDS Rates on Different Payments', path: '/reference/tds-rates', icon: Database },
  { type: 'Reference', label: 'Tax Slabs FY 2025-26 — New & Old Regime', path: '/reference/tax-slabs', icon: Database },
]

const TYPE_COLOR = {
  Form: 'bg-primary/10 text-primary',
  Guide: 'bg-success/10 text-success',
  Procedure: 'bg-warning/10 text-warning',
  Reference: 'bg-accent/10 text-accent-dark',
}

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults(SEARCH_INDEX.slice(0, 8))
    } else {
      const q = query.toLowerCase()
      setResults(
        SEARCH_INDEX.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
        ).slice(0, 10)
      )
    }
  }, [query])

  const handleSelect = (item) => {
    navigate(item.path)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-border-light">
          <Search size={20} className="text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search forms, guides, procedures..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base outline-none text-text-main placeholder:text-text-muted"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No results found for "{query}"</div>
          ) : (
            <ul>
              {!query && (
                <li className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Quick Access
                </li>
              )}
              {results.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Icon size={18} className="text-text-muted flex-shrink-0" />
                      <span className="flex-1 text-sm text-text-main">{item.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[item.type]}`}>
                        {item.type}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border-light bg-gray-50 text-xs text-text-muted flex items-center gap-4">
          <span><kbd className="bg-white border border-border-light px-1.5 py-0.5 rounded text-xs">↑↓</kbd> navigate</span>
          <span><kbd className="bg-white border border-border-light px-1.5 py-0.5 rounded text-xs">↵</kbd> select</span>
          <span><kbd className="bg-white border border-border-light px-1.5 py-0.5 rounded text-xs">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
