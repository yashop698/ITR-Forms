import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function AccordionItem({ title, children, defaultOpen = false, badge, badgeColor = 'bg-primary' }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-border-light rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-main">{title}</span>
          {badge && (
            <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-bold`}>
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-border-light bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export function Accordion({ children }) {
  return <div>{children}</div>
}
