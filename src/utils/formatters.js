export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—'
  if (amount === 0) return '₹0'
  const abs = Math.abs(amount)
  let formatted
  if (abs >= 10000000) {
    formatted = (abs / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr'
  } else if (abs >= 100000) {
    formatted = (abs / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L'
  } else if (abs >= 1000) {
    formatted = (abs / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K'
  } else {
    formatted = abs.toString()
  }
  return (amount < 0 ? '−₹' : '₹') + formatted
}

export function formatINR(amount) {
  if (amount === null || amount === undefined) return '—'
  return '₹' + Number(amount).toLocaleString('en-IN')
}

export function severityColor(severity) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'text-error bg-error/10 border-error/30'
    case 'high': return 'text-warning bg-warning/10 border-warning/30'
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default: return 'text-text-muted bg-gray-50 border-gray-200'
  }
}

export function severityBadgeClass(severity) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'bg-error text-white'
    case 'high': return 'bg-warning text-white'
    case 'medium': return 'bg-yellow-400 text-white'
    default: return 'bg-gray-400 text-white'
  }
}
