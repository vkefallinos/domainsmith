import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react'

export interface AgentCategoryProps {
  icon: LucideIcon
  label: string
  isCollapsed: boolean
  isExpanded: boolean
  onToggle: () => void
  count?: number
  children?: React.ReactNode
}

export function AgentCategory({
  icon: Icon,
  label,
  isCollapsed,
  isExpanded,
  onToggle,
  count = 0,
  children,
}: AgentCategoryProps) {
  if (isCollapsed) {
    return (
      <div className="mb-2">
        <div
          className="flex items-center justify-center px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400"
          title={label}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-2">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="flex-1 text-left">{label}</span>
        {count > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {count}
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        )}
      </button>

      {/* Category Content */}
      {isExpanded && children && (
        <div className="mt-1 ml-2">
          {children}
        </div>
      )}
    </div>
  )
}
