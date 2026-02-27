import { Settings, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export interface ChatHeaderProps {
  agentName?: string
  onEditAgent?: () => void
  showEditLink?: boolean
  user?: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
  onOpenSettings?: () => void
}

export function ChatHeader({
  agentName,
  onEditAgent,
  showEditLink = true,
  user,
  onLogout,
  onOpenSettings,
}: ChatHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Agent Name */}
      <div className="flex items-center gap-3">
        {agentName && (
          <>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {agentName}
            </h1>
            {showEditLink && (
              <button
                onClick={onEditAgent}
                className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Edit Agent
              </button>
            )}
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
              <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                {initials}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {user?.name}
          </span>
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 z-20">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.name}
                </p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    onOpenSettings?.()
                    setIsUserMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    onLogout?.()
                    setIsUserMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
