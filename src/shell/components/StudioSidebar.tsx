import {
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folder,
  Bot,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import promptLibraryData from '@/../product/sections/prompt-library/data.json'
import agentBuilderData from '@/../product/sections/agent-builder/data.json'
import logo from '@/assets/logo.png'
import { WorkspaceSelector } from './WorkspaceSelector'
import type { Workspace } from './WorkspaceSelector'

type FileSystemNode = {
  id: string
  name: string
  type: 'directory' | 'file'
  path: string
  config?: {
    label?: string
    description?: string
    icon?: string
    color?: string
    renderAs?: 'section' | 'field'
  }
  children?: FileSystemNode[]
}

type Domain = {
  id: string
  name: string
  label: string
  description: string
  icon: string
  color: string
  path: string
  childCount: number
}

type AgentConfig = {
  id: string
  name: string
  description: string
  selectedDomains: string[]
  formValues: Record<string, string | string[] | boolean>
  enabledTools: Array<{ toolId: string; source: string }>
  attachedFlows: Array<{
    flowId: string
    flowName: string
    slashCommand?: { name: string; commandId: string }
  }>
}

export interface StudioSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  activeDomainId?: string
  activeAgentId?: string
  onOpenSettings?: () => void
  onCreateDomain?: () => void
  onCreateAgent?: () => void
  workspace?: Workspace
  onWorkspaceChange?: (workspace: Workspace) => void
}

export function StudioSidebar({
  isCollapsed = false,
  onToggleCollapse,
  activeDomainId,
  activeAgentId,
  onOpenSettings,
  onCreateDomain,
  onCreateAgent,
  workspace,
  onWorkspaceChange,
}: StudioSidebarProps) {
  const location = useLocation()
  const [domainsExpanded, setDomainsExpanded] = useState(true)
  const [agentsExpanded, setAgentsExpanded] = useState(true)

  // Extract domains from prompt library data (top-level directories with renderAs='section')
  const domains = useMemo(() => {
    const fileSystem = (promptLibraryData as any).fileSystem as FileSystemNode
    if (!fileSystem.children) return []

    return fileSystem.children
      .filter((child) => child.type === 'directory' && child.config?.renderAs === 'section')
      .map((dir) => ({
        id: dir.id,
        name: dir.name,
        label: dir.config?.label || dir.name,
        description: dir.config?.description || '',
        icon: dir.config?.icon || 'folder',
        color: dir.config?.color || '#6366f1',
        path: dir.path,
        childCount: dir.children?.filter((c) => c.type === 'directory').length || 0,
      })) as Domain[]
  }, [])

  // Extract agents from agent builder data
  const agents = useMemo(() => {
    const savedConfigs = (agentBuilderData as any).savedAgentConfigs as AgentConfig[]
    return savedConfigs || []
  }, [])

  const toggleDomains = () => {
    setDomainsExpanded((prev) => !prev)
  }

  const toggleAgents = () => {
    setAgentsExpanded((prev) => !prev)
  }

  return (
    <aside
      className={`
        flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transition-all duration-200 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-[280px]'}
      `}
    >
      {/* Logo and App Name */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <div
          className={`
            flex items-center gap-2
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <Link
            to="/"
            className="flex items-center gap-2"
            title="lmthing"
          >
            <img src={logo} alt="lmthing logo" className="w-8 h-8 rounded-md" />
          </Link>
          {!isCollapsed && (
            <WorkspaceSelector
              workspace={workspace}
              onWorkspaceChange={onWorkspaceChange}
              isCollapsed={false}
            />
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <WorkspaceSelector
              workspace={workspace}
              onWorkspaceChange={onWorkspaceChange}
              isCollapsed={true}
            />
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-8">
        {!isCollapsed ? (
          <div className="space-y-6">
            {/* Domains Section */}
            <section>
              <button
                onClick={toggleDomains}
                className="flex items-center gap-1 px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {domainsExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRightSmall className="w-3 h-3" />
                )}
                Domains
                <span className="ml-1 text-slate-400 dark:text-slate-500">
                  ({domains.length})
                </span>
              </button>

              {domainsExpanded && (
                <div className="space-y-0.5">
                  {domains.map((domain) => {
                    const href = `/studio/domain/${domain.id}`
                    const isActive = location.pathname === href || activeDomainId === domain.id

                    return (
                      <Link
                        key={domain.id}
                        to={href}
                        className={`
                          flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
                          ${isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }
                        `}
                      >
                        <Folder
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: domain.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{domain.label}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                            {domain.childCount} categories
                          </div>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Create Domain Link */}
                  <button
                    onClick={onCreateDomain}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Create Domain</span>
                  </button>
                </div>
              )}
            </section>

            {/* Agents Section */}
            <section>
              <button
                onClick={toggleAgents}
                className="flex items-center gap-1 px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {agentsExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRightSmall className="w-3 h-3" />
                )}
                Agents
                <span className="ml-1 text-slate-400 dark:text-slate-500">
                  ({agents.length})
                </span>
              </button>

              {agentsExpanded && (
                <div className="space-y-0.5">
                  {agents.map((agent) => {
                    const href = `/studio/agent/${agent.id}`
                    const isActive = location.pathname === href || activeAgentId === agent.id
                    const hasSlashCommand = agent.attachedFlows?.some(
                      (f) => f.slashCommand?.enabled
                    )

                    return (
                      <Link
                        key={agent.id}
                        to={href}
                        className={`
                          flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
                          ${isActive
                            ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }
                        `}
                      >
                        <Bot className="w-4 h-4 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium flex items-center gap-2">
                            {agent.name}
                            {hasSlashCommand && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded">
                                /
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                            {agent.selectedDomains.length} domains
                          </div>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Create Agent Link */}
                  <button
                    onClick={onCreateAgent}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Create Agent</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Collapsed state - show quick icons */
          <div className="space-y-4">
            <div
              className="flex items-center justify-center px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400"
              title={`${domains.length} domains`}
            >
              <Folder className="w-5 h-5" />
            </div>
            <div
              className="flex items-center justify-center px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400"
              title={`${agents.length} agents`}
            >
              <Bot className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Shell, Settings & Collapse */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          {/* Shell */}
          <Link
            to="/shell"
            className={`
              flex items-center gap-3
              text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300
              hover:bg-violet-50 dark:hover:bg-violet-950/30
              rounded-lg transition-colors
              ${isCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
            `}
            title={isCollapsed ? 'Go to Shell' : ''}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m0 0l3-3 3m-3 3V9" />
            </svg>
            {!isCollapsed && (
              <span className="text-sm font-medium">Shell</span>
            )}
          </Link>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className={`
              flex items-center gap-3
              text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              rounded-lg transition-colors
              ${isCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
            `}
            title={isCollapsed ? 'Settings' : ''}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className={`
              flex items-center gap-3
              text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              rounded-lg transition-colors
              ${isCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
            `}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
