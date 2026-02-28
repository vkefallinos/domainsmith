import {
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  MessageSquare,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  FolderOpen,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import agentRuntimeData from '@/../mock_data/workspaces/education/sections/agent-runtime/data.json'
import logo from '@/assets/logo.png'
import { WorkspaceSelector } from './WorkspaceSelector'
import type { Workspace } from './WorkspaceSelector'

type Agent = {
  id: string
  name: string
  description: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

type Conversation = {
  id: string
  agentId: string
  agentName: string
  messages?: Message[]
  createdAt: string
  updatedAt: string
}

export interface ChatSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  activeChatId?: string
  onOpenSettings?: () => void
  workspace?: Workspace
}

export function ChatSidebar({
  isCollapsed = false,
  onToggleCollapse,
  activeChatId,
  onOpenSettings,
  workspace,
}: ChatSidebarProps) {
  const location = useLocation()
  const { workspaceName } = useParams<{ workspaceName: string }>()
  const [conversationsExpanded, setConversationsExpanded] = useState(true)

  // Build workspace-aware path helper
  const chatPath = workspaceName ? `/workspace/${workspaceName}/chat` : '/chat'
  const studioPath = workspaceName ? `/workspace/${workspaceName}/studio` : '/studio'

  // Load agents from runtime data (same source as AppShell)
  const agents = useMemo(() => {
    return (agentRuntimeData.agents || []) as Agent[]
  }, [])

  // Load conversations from runtime data
  const conversations = useMemo(() => {
    return (agentRuntimeData.conversations || []) as Conversation[]
  }, [])

  // Group conversations by agent
  const conversationsByAgent = useMemo(() => {
    const grouped: Record<string, Conversation[]> = {}
    conversations.forEach((conv) => {
      if (!grouped[conv.agentId]) {
        grouped[conv.agentId] = []
      }
      grouped[conv.agentId].push(conv)
    })
    return grouped
  }, [conversations])

  const toggleConversations = () => {
    setConversationsExpanded(prev => !prev)
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
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 ">
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
              currentWorkspace={workspace}
              isCollapsed={false}
            />
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <WorkspaceSelector
              currentWorkspace={workspace}
              isCollapsed={true}
            />
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-8">
        {!isCollapsed ? (
          <div className="space-y-6">
            {/* Agents Section */}
            <section>
              <h2 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Agents
              </h2>
              <div className="space-y-0.5">
                {agents.map((agent) => {
                  const href = `${chatPath}/agent/${agent.id}`
                  const isActive = location.pathname === href

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
                      <span className="flex-1 text-left truncate">{agent.name}</span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Conversations Section */}
            {conversations.length > 0 && (
              <section>
                <button
                  onClick={toggleConversations}
                  className="flex items-center gap-1 px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {conversationsExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRightSmall className="w-3 h-3" />
                  )}
                  Conversations
                  <span className="ml-1 text-slate-400 dark:text-slate-500">
                    ({conversations.length})
                  </span>
                </button>

                {conversationsExpanded && (
                  <div className="space-y-2">
                    {Object.entries(conversationsByAgent).map(([agentId, agentConvs]) => {
                      const agent = agents.find(a => a.id === agentId)
                      const agentName = agent?.name || agentConvs[0]?.agentName || 'Unknown Agent'

                      return (
                        <div key={agentId} className="space-y-0.5">
                          {/* Agent label for this conversation group */}
                          <div className="px-3 py-1 text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Bot className="w-3 h-3" />
                            {agentName}
                          </div>

                          {/* Conversations for this agent */}
                          {agentConvs.map((conv) => {
                            const href = `${chatPath}/agent/${agentId}/chat/${conv.id}`
                            const isActive = location.pathname === href

                            return (
                              <Link
                                key={conv.id}
                                to={href}
                                className={`
                                  flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-lg transition-colors text-left ml-4
                                  ${isActive
                                    ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                  }
                                `}
                              >
                                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                                <span className="truncate flex-1">
                                  {conv.messages?.[0]?.content.slice(0, 30) || 'New chat'}...
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        ) : (
          /* Collapsed state - show quick icons */
          <div className="space-y-4">
            {conversations.length > 0 && (
              <div
                className="flex items-center justify-center px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400"
                title={`${conversations.length} conversations`}
              >
                <MessageSquare className="w-5 h-5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Settings & Collapse */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          {/* Studio */}
          <Link
            to={studioPath}
            className={`
              flex items-center gap-3
              text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              rounded-lg transition-colors
              ${isCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
            `}
            title={isCollapsed ? 'Studio' : ''}
          >
            <FolderOpen className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Studio</span>
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
