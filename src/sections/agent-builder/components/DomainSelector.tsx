import type { Domain } from '@/../product/sections/agent-builder/types'
import { useState } from 'react'

interface DomainSelectorProps {
  domains: Domain[]
  selectedDomainIds: string[]
  onDomainsChange: (domainIds: string[]) => void
}

const categoryColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Teaching: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-400',
  },
  Curriculum: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    darkBg: 'dark:bg-emerald-900/20',
    darkText: 'dark:text-emerald-400',
  },
  Assessment: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    darkBg: 'dark:bg-violet-900/20',
    darkText: 'dark:text-violet-400',
  },
  Collaboration: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    darkBg: 'dark:bg-amber-900/20',
    darkText: 'dark:text-amber-400',
  },
  Communication: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    darkBg: 'dark:bg-rose-900/20',
    darkText: 'dark:text-rose-400',
  },
  'Special Education': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    darkBg: 'dark:bg-cyan-900/20',
    darkText: 'dark:text-cyan-400',
  },
  Reporting: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    darkBg: 'dark:bg-slate-900/20',
    darkText: 'dark:text-slate-400',
  },
}

export function DomainSelector({ domains, selectedDomainIds, onDomainsChange }: DomainSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

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
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Domains</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {selectedDomainIds.length} selected
          </span>
        </div>
        <button
          onClick={() => onDomainsChange([])}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Domain Pills - Scrollable */}
      <div className="px-6 pb-3">
        <div className="flex flex-wrap gap-2">
          {domains.map(domain => {
            const isSelected = selectedDomainIds.includes(domain.id)
            const colors = categoryColors[domain.category] || categoryColors.Teaching

            return (
              <button
                key={domain.id}
                onClick={() => toggleDomain(domain.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                  ${isSelected
                    ? 'bg-violet-600 text-white shadow-sm'
                    : `bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700`
                  }
                `}
                title={domain.description}
              >
                <span className="text-sm">{domain.icon}</span>
                <span>{domain.name}</span>
                {isSelected && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
