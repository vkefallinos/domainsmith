import { type LucideIcon, Layout as DefaultIcon } from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
  icon?: LucideIcon
  isActive?: boolean
}

export interface MainNavProps {
  items: NavigationItem[]
  isCollapsed?: boolean
  onNavigate?: (href: string) => void
  onCloseMobile?: () => void
}

export function MainNav({ items, isCollapsed = false, onNavigate, onCloseMobile }: MainNavProps) {
  const handleClick = (href: string) => {
    onNavigate?.(href)
    onCloseMobile?.()
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon || DefaultIcon
        const activeClass = item.isActive
          ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-l-4 border-violet-500'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-l-4 border-transparent'

        return (
          <button
            key={item.href}
            onClick={() => handleClick(item.href)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-r-lg transition-all duration-150 ${activeClass}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
