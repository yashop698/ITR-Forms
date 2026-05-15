import { Link, useLocation } from 'react-router-dom'
import { X, ChevronRight, Home, GitBranch, FileText, BookOpen, CreditCard, ClipboardList, Database } from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { to: '/', icon: Home, label: 'Home' },
      { to: '/selector', icon: GitBranch, label: 'ITR Form Selector' },
    ],
  },
  {
    label: 'ITR Forms',
    items: [
      { to: '/forms/itr1', icon: FileText, label: 'ITR-1 (Sahaj)' },
      { to: '/forms/itr2', icon: FileText, label: 'ITR-2' },
      { to: '/forms/itr3', icon: FileText, label: 'ITR-3' },
      { to: '/forms/itr4', icon: FileText, label: 'ITR-4 (Sugam)' },
      { to: '/forms/itr5', icon: FileText, label: 'ITR-5' },
      { to: '/forms/itr6', icon: FileText, label: 'ITR-6' },
      { to: '/forms/itr7', icon: FileText, label: 'ITR-7' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { to: '/income', icon: BookOpen, label: 'Income Guides' },
      { to: '/deductions', icon: CreditCard, label: 'Deduction Guides' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { to: '/procedures', icon: ClipboardList, label: 'Post-Filing Procedures' },
      { to: '/reference', icon: Database, label: 'Reference & Downloads' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const isActive = (to) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border-light
          transform transition-transform duration-300 z-30 overflow-y-auto
          lg:sticky lg:translate-x-0 lg:block lg:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-4 border-b border-border-light lg:hidden">
          <span className="font-semibold text-text-main">Navigation</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <nav className="p-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-1">
                {section.label}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors
                      ${active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-main hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={16} className={active ? 'text-primary' : 'text-text-muted'} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight size={14} className="text-primary" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* FY badge */}
        <div className="mx-3 mb-4 p-3 bg-accent/10 rounded-lg border border-accent/30">
          <div className="text-xs font-semibold text-accent-dark">Active Assessment Year</div>
          <div className="text-sm font-bold text-text-main mt-0.5">AY 2026-27 (FY 2025-26)</div>
          <div className="text-xs text-text-muted mt-1">Filing deadline: 31 Jul 2026</div>
        </div>
      </aside>
    </>
  )
}
