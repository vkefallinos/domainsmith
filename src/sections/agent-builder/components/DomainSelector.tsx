import type { Domain } from '@/../product/sections/agent-builder/types'

interface DomainSelectorProps {
  domains: Domain[]
  selectedDomainIds: string[]
  onDomainsChange: (domainIds: string[]) => void
}

const categoryColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Security: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    darkBg: 'dark:bg-rose-900/20',
    darkText: 'dark:text-rose-400',
  },
  Infrastructure: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    darkBg: 'dark:bg-sky-900/20',
    darkText: 'dark:text-sky-400',
  },
  Compliance: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    darkBg: 'dark:bg-emerald-900/20',
    darkText: 'dark:text-emerald-400',
  },
  Development: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    darkBg: 'dark:bg-amber-900/20',
    darkText: 'dark:text-amber-400',
  },
}

const categoryIcons: Record<string, string> = {
  Security: '🛡️',
  Infrastructure: '⚙️',
  Compliance: '✓',
  Development: '💻',
}

export function DomainSelector({ domains, selectedDomainIds, onDomainsChange }: DomainSelectorProps) {
  // Group domains by category
  const groupedDomains = domains.reduce((acc, domain) => {
    if (!acc[domain.category]) acc[domain.category] = []
    acc[domain.category].push(domain)
    return acc
  }, {} as Record<string, Domain[]>)

  const toggleDomain = (domainId: string) => {
    const isSelected = selectedDomainIds.includes(domainId)
    const newSelection = isSelected
      ? selectedDomainIds.filter(id => id !== domainId)
      : [...selectedDomainIds, domainId]
    onDomainsChange(newSelection)
  }

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Domains</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {selectedDomainIds.length} of {domains.length} selected
        </p>
      </div>

      {/* Domain List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(groupedDomains).map(([category, domains]) => (
          <div key={category}>
            {/* Category Label */}
            <div className="px-2 mb-2 flex items-center gap-2">
              <span className="text-lg">{categoryIcons[category] || '📁'}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                {category}
              </span>
            </div>

            {/* Domains in this category */}
            <div className="space-y-1.5">
              {domains.map(domain => {
                const isSelected = selectedDomainIds.includes(domain.id)
                const colors = categoryColors[category] || categoryColors.Development

                return (
                  <button
                    key={domain.id}
                    onClick={() => toggleDomain(domain.id)}
                    className={`
                      w-full text-left p-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                      ${isSelected
                        ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }
                    `}
                  >
                    {/* Background pattern for selected state */}
                    {isSelected && (
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <pattern
                              id="grid-pattern"
                              width="10"
                              height="10"
                              patternUnits="userSpaceOnUse"
                            >
                              <circle cx="1" cy="1" r="0.5" fill="white" />
                            </pattern>
                          </defs>
                          <rect width="100" height="100" fill="url(#grid-pattern)" />
                        </svg>
                      </div>
                    )}

                    <div className="relative flex items-start gap-3">
                      {/* Checkbox indicator */}
                      <div
                        className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5
                          ${isSelected
                            ? 'border-white bg-white/20'
                            : 'border-slate-300 dark:border-slate-600 group-hover:border-violet-400'
                          }
                        `}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Domain info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`
                            }`}
                          >
                            {domain.category}
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}
                        >
                          {domain.name}
                        </h3>
                        <p
                          className={`text-xs mt-0.5 line-clamp-2 ${isSelected ? 'text-violet-100' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                          {domain.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Select multiple domains to combine expertise
        </p>
      </div>
    </aside>
  )
}
