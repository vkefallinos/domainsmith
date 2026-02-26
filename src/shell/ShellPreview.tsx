import { useNavigate } from 'react-router-dom'
import { AppShell, type NavigationItem } from './components'
import {
  LayoutDashboard,
  FileText,
  Bot,
  Play,
  Users
} from 'lucide-react'

export default function ShellPreview() {
  const navigate = useNavigate()
  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, isActive: true },
    { label: 'Prompt Library', href: '/sections/prompt-library/screen-designs/PromptLibraryView/fullscreen', icon: FileText },
    { label: 'Agent Builder', href: '/sections/agent-builder/screen-designs/AgentBuilderView/fullscreen', icon: Bot },
    { label: 'Agent Runtime', href: '/sections/agent-runtime/screen-designs/AgentRuntime/fullscreen', icon: Play },
    { label: 'Workspaces', href: '/sections/workspaces/screen-designs/Workspaces/fullscreen', icon: Users },
  ]
  console.log('ShellPreview navigationItems:', navigationItems) // Debug log
  const user = {
    name: 'Alex Morgan',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => navigate(href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back, Alex
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Here's what's happening in your workspace today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Prompts</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">24</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Agents</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">8</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Workspaces</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">3</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-900 hover:bg-violet-100 dark:hover:bg-violet-950/50 transition-colors text-left">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="font-medium text-violet-900 dark:text-violet-100">New Prompt Fragment</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors text-left">
                <Bot className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-900 dark:text-amber-100">Build Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
