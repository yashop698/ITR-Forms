export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-border-light">
      <nav className="-mb-px flex gap-0 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'
              }
            `}
            aria-selected={activeTab === tab.id}
          >
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
            {tab.badge && (
              <span className="ml-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
