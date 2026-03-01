import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatSidebar } from './ChatSidebar'
import { AgentsDashboard } from './AgentsDashboard'
import { AgentRuntimeView } from '@/sections/agent-runtime/components'
import { useRuntimeAgents, useAgents } from '@/lib/workspaceContext'
import type { Conversation, MessageRole } from '@/../product/sections/agent-runtime/types'
import { workspaceToSlug, type Workspace } from './WorkspaceSelector'
import { useWorkspaces } from '@/hooks/useWorkspaces'

// Helper to get workspace from URL param
function useWorkspace(workspaceName?: string): Workspace {
  const { data: workspaces } = useWorkspaces()

  return useMemo(() => {
    const defaultWorkspace = { id: 'default', name: workspaceName || 'Workspace', color: '#10b981' }
    if (!workspaces) return defaultWorkspace

    if (workspaceName) {
      const found = workspaces.find(w => workspaceToSlug(w.name) === workspaceName)
      if (found) {
        return { id: found.id.toString(), name: found.name, color: '#10b981' }
      }
    }

    const first = workspaces[0]
    return first ? { id: first.id.toString(), name: first.name, color: '#10b981' } : defaultWorkspace
  }, [workspaceName, workspaces])
}

export interface AppShellProps {
  // User props
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
  onOpenSettings?: () => void
  // Sidebar state
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  // Callbacks for agent actions
  onNewAgent?: () => void
  onEditAgent?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
}

export function AppShell({
  onOpenSettings,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  onNewAgent,
  onEditAgent,
  onDeleteAgent,
}: AppShellProps) {
  const { agentId, chatId, workspaceName } = useParams()
  const navigate = useNavigate()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed)
  const [isLoading, setIsLoading] = useState(false)

  // Use the new state hooks
  const agents = useRuntimeAgents()
  const { agents: agentsMap } = useAgents()

  // Workspace - derived directly from URL
  const currentWorkspace = useWorkspace(workspaceName)

  // Build workspace-aware path helper
  const chatPath = workspaceName ? `/workspace/${workspaceName}/chat` : '/chat'

  // Collect all conversations from all agents
  const allConversations = useMemo(() => {
    const conversations: Conversation[] = []
    for (const agent of Object.values(agentsMap)) {
      if (agent.conversations) {
        for (const conv of agent.conversations) {
          conversations.push({
            id: conv.id,
            agentId: conv.agentId,
            agentName: conv.agentName,
            messages: conv.messages
              .filter(msg => msg.role === 'user' || msg.role === 'assistant')
              .map(msg => ({
                id: msg.id,
                role: msg.role as MessageRole,
                content: msg.content,
                timestamp: msg.timestamp,
              })),
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          })
        }
      }
    }
    return conversations
  }, [agentsMap])

  // Get the active agent
  const activeAgent = agentId
    ? agents.find((a) => a.id === agentId) || null
    : null

  // Get conversations for the active agent
  const agentConversations = useMemo(
    () => (agentId ? allConversations.filter((c) => c.agentId === agentId) : []),
    [agentId, allConversations]
  )

  // Create a new temporary conversation when chatId starts with "new-"
  const isNewConversation = chatId?.startsWith('new-') && activeAgent

  // Build the conversations list to pass to AgentRuntimeView
  const conversationsForView = useMemo(() => {
    let convs = [...agentConversations]

    if (isNewConversation && activeAgent) {
      const newConv: Conversation = {
        id: chatId!,
        agentId: activeAgent.id,
        agentName: activeAgent.name,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      convs = [newConv, ...convs]
    }

    return convs
  }, [agentConversations, isNewConversation, activeAgent, chatId])

  // Determine view mode from URL params
  const viewMode: 'dashboard' | 'chat' = chatId || agentId ? 'chat' : 'dashboard'

  // Handle back to dashboard
  const handleBackToDashboard = useCallback(() => {
    navigate(chatPath)
  }, [navigate, chatPath])

  // Handle runtime field change
  const handleRuntimeFieldChange = useCallback((fieldId: string, value: string | string[] | boolean) => {
    console.log('Runtime field changed:', fieldId, value)
  }, [])

  // Handle send message
  const handleSendMessage = useCallback((content: string) => {
    setIsLoading(true)
    console.log('Send message:', content)
    // Simulate response
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Handle select conversation
  const handleSelectConversation = useCallback((conversationId: string) => {
    if (agentId) {
      navigate(`${chatPath}/agent/${agentId}/chat/${conversationId}`)
    } else {
      // Find the agent for this conversation
      const conv = allConversations.find(c => c.id === conversationId)
      if (conv) {
        navigate(`${chatPath}/agent/${conv.agentId}/chat/${conversationId}`)
      }
    }
  }, [navigate, agentId, allConversations, chatPath])

  // Handle create conversation
  const handleCreateConversation = useCallback(() => {
    if (!activeAgent) return

    const newChatId = `new-${activeAgent.id}-${Date.now()}`
    navigate(`${chatPath}/agent/${activeAgent.id}/chat/${newChatId}`)
  }, [activeAgent, navigate, chatPath])

  // Handle delete conversation
  const handleDeleteConversation = useCallback((conversationId: string) => {
    console.log('Delete conversation:', conversationId)
    // In a real app, this would update the data store
    if (chatId === conversationId) {
      // Switch to another conversation or back to dashboard
      const remaining = agentConversations.filter(c => c.id !== conversationId)
      if (remaining.length > 0) {
        navigate(`${chatPath}/agent/${agentId}/chat/${remaining[0].id}`)
      } else {
        navigate(chatPath)
      }
    }
  }, [chatId, agentConversations, agentId, navigate, chatPath])

  // Handle agent selection from dashboard
  const handleOpenAgent = useCallback((agentId: string) => {
    navigate(`${chatPath}/agent/${agentId}`)
  }, [navigate, chatPath])

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          const newState = !isSidebarCollapsed
          setIsSidebarCollapsed(newState)
          onSidebarCollapsedChange?.(newState)
        }}
        activeChatId={chatId}
        onOpenSettings={onOpenSettings}
        workspace={currentWorkspace}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Mode */}
        {viewMode === 'dashboard' && (
          <AgentsDashboard
            onNewAgent={onNewAgent}
            onOpenAgent={handleOpenAgent}
            onEditAgent={onEditAgent}
            onDeleteAgent={onDeleteAgent}
          />
        )}

        {/* Chat Mode - Agent Runtime View */}
        {viewMode === 'chat' && (
          <AgentRuntimeView
            agent={activeAgent}
            conversations={conversationsForView}
            activeConversationId={chatId || null}
            isLoading={isLoading}
            onBackToList={handleBackToDashboard}
            onRuntimeFieldChange={handleRuntimeFieldChange}
            onSendMessage={handleSendMessage}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={handleCreateConversation}
            onDeleteConversation={handleDeleteConversation}
            hideTopNav
          />
        )}
      </div>
    </div>
  )
}
