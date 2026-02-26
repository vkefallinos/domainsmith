import { Menu } from 'lucide-react'
import { useState } from 'react'
import { MainNav, type NavigationItem } from './MainNav'
import { UserMenu } from './UserMenu'

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}
import {
  LayoutDashboard,
  FileText,
  Bot,
  Play,
  Users
} from 'lucide-react'
export function AppShell({
  children,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, isActive: true },
    { label: 'Prompt Library', href: '/sections/prompt-library/screen-designs/PromptLibraryView/fullscreen', icon: FileText },
    { label: 'Agent Builder', href: '/sections/agent-builder/screen-designs/AgentBuilderView/fullscreen', icon: Bot },
    { label: 'Flow Builder', href: '/sections/flow-builder/screen-designs/FlowBuilderView/fullscreen', icon: Bot },
    { label: 'Agent Runtime', href: '/sections/agent-runtime/screen-designs/AgentRuntime/fullscreen', icon: Play },
    { label: 'Tool Library', href: '/sections/tool-library/screen-designs/ToolLibraryView/fullscreen', icon: FileText },
    { label: 'Workspaces', href: '/sections/workspaces/screen-designs/Workspaces/fullscreen', icon: Users },
  ]
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100 hidden sm:block">
                DomainSmith
              </span>
            </div>
          </div>

          {/* User Menu */}
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-transform duration-200 z-40
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <MainNav
            items={navigationItems}
            onNavigate={onNavigate}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
