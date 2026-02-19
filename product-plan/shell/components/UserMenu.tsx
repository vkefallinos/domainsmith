import { LogOut, Settings, User } from 'lucide-react'
import { useState } from 'react'

export interface UserMenuProps {
  user?: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
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
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
