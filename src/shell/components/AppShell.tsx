import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChatSidebar } from './ChatSidebar'
import { AgentsDashboard } from './AgentsDashboard'
import { AgentRuntimeView } from '@/sections/agent-runtime/components'
import agentRuntimeData from '@/../mock_data/workspaces/education/sections/agent-runtime/data.json'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { DUMMY_WORKSPACES, workspaceToSlug, type Workspace } from './WorkspaceSelector'

// Helper to get workspace from URL param
function useWorkspace(workspaceName?: string): Workspace {
  return useMemo(() => {
    if (workspaceName) {
      const found = DUMMY_WORKSPACES.find(w => workspaceToSlug(w.name) === workspaceName)
      return found || DUMMY_WORKSPACES[0]
    }
    return DUMMY_WORKSPACES[0]
  }, [workspaceName])
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
  user,
  onLogout,
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

  // Workspace - derived directly from URL
  const currentWorkspace = useWorkspace(workspaceName)

  // Build workspace-aware path helper
  const chatPath = workspaceName ? `/workspace/${workspaceName}/chat` : '/chat'

  // Load agents and conversations from runtime data
  const agents = (agentRuntimeData.agents || []) as Agent[]
  const allConversations = (agentRuntimeData.conversations || []) as Conversation[]

  // Get the active agent
  const activeAgent = agentId
    ? agents.find((a) => a.id === agentId) || null
    : null

  // Get conversations for the active agent
  const agentConversations = agentId
    ? allConversations.filter((c) => c.agentId === agentId)
    : []

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
