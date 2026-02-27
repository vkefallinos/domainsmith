import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatSidebar } from './ChatSidebar'
import { AgentsDashboard } from './AgentsDashboard'
import { AgentRuntimeView } from '@/sections/agent-runtime/components'
import agentRuntimeData from '@/../product/sections/agent-runtime/data.json'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { DUMMY_WORKSPACES, type Workspace } from './WorkspaceSelector'

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
  const { agentId, chatId } = useParams()
  const navigate = useNavigate()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed)
  const [isLoading, setIsLoading] = useState(false)

  // Workspace state
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(DUMMY_WORKSPACES[0])

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
    navigate('/shell')
  }, [navigate])

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
      navigate(`/shell/agent/${agentId}/chat/${conversationId}`)
    } else {
      // Find the agent for this conversation
      const conv = allConversations.find(c => c.id === conversationId)
      if (conv) {
        navigate(`/shell/agent/${conv.agentId}/chat/${conversationId}`)
      }
    }
  }, [navigate, agentId, allConversations])

  // Handle create conversation
  const handleCreateConversation = useCallback(() => {
    if (!activeAgent) return

    const newChatId = `new-${activeAgent.id}-${Date.now()}`
    navigate(`/shell/agent/${activeAgent.id}/chat/${newChatId}`)
  }, [activeAgent, navigate])

  // Handle delete conversation
  const handleDeleteConversation = useCallback((conversationId: string) => {
    console.log('Delete conversation:', conversationId)
    // In a real app, this would update the data store
    if (chatId === conversationId) {
      // Switch to another conversation or back to dashboard
      const remaining = agentConversations.filter(c => c.id !== conversationId)
      if (remaining.length > 0) {
        navigate(`/shell/agent/${agentId}/chat/${remaining[0].id}`)
      } else {
        navigate('/shell')
      }
    }
  }, [chatId, agentConversations, agentId, navigate])

  // Handle agent selection from dashboard
  const handleOpenAgent = useCallback((agentId: string) => {
    navigate(`/shell/agent/${agentId}`)
  }, [navigate])

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
        onWorkspaceChange={setCurrentWorkspace}
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
