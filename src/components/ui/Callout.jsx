import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const VARIANTS = {
  info: {
    container: 'bg-blue-50 border-primary text-blue-900',
    icon: Info,
    iconColor: 'text-primary',
  },
  warning: {
    container: 'bg-orange-50 border-warning text-orange-900',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  error: {
    container: 'bg-red-50 border-error text-red-900',
    icon: AlertCircle,
    iconColor: 'text-error',
  },
  success: {
    container: 'bg-green-50 border-success text-green-900',
    icon: CheckCircle,
    iconColor: 'text-success',
  },
}

export default function Callout({ variant = 'info', title, children }) {
  const { container, icon: Icon, iconColor } = VARIANTS[variant]
  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${container}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
