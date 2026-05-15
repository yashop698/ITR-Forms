import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted mb-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home size={14} />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} />
          {i === items.length - 1 ? (
            <span className="text-text-main font-medium">{item.label}</span>
          ) : (
            <Link to={item.to} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
