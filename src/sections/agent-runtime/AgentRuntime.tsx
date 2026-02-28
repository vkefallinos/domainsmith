import { useState, useCallback, useMemo } from 'react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { AgentList } from './components/AgentList'
import { AgentRuntimeView } from './components/AgentRuntimeView'

type AgentRuntimeData = {
  agents: Agent[]
  conversations: Conversation[]
}

export default function AgentRuntimePreview() {
  const { data, loading, error } = useWorkspaceData<AgentRuntimeData>('agent-runtime')
  const [view, setView] = useState<'list' | 'runtime'>('list')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [runtimeFieldValues, setRuntimeFieldValues] = useState<Record<string, string | string[] | boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const agents = useMemo(() => (data?.agents as Agent[]) || [], [data])

  // Handle agent selection
  const handleSelectAgent = useCallback((agentId: string) => {
    setSelectedAgentId(agentId)

    // Load conversations for this agent
    const agentConversations = (data?.conversations as unknown as Conversation[])?.filter(
      (c) => c.agentId === agentId
    ) || []
    setConversations(agentConversations)

    // Set active conversation to the most recently updated one
    if (agentConversations.length > 0) {
      const sorted = [...agentConversations].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setActiveConversationId(sorted[0].id)
    } else {
      setActiveConversationId(null)
    }

    setView('runtime')
  }, [data])

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setView('list')
    setSelectedAgentId(null)
    setActiveConversationId(null)
  }, [])

  // Handle runtime field change
  const handleRuntimeFieldChange = useCallback((fieldId: string, value: string | string[] | boolean) => {
    setRuntimeFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    console.log('Field changed:', fieldId, value)
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
    setActiveConversationId(conversationId)
    console.log('Select conversation:', conversationId)
  }, [])

  // Handle create conversation
  const handleCreateConversation = useCallback(() => {
    if (!selectedAgentId) return

    const selectedAgent = agents.find((a) => a.id === selectedAgentId)
    if (!selectedAgent) return

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      agentId: selectedAgentId,
      agentName: selectedAgent.name,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    console.log('Create new conversation')
  }, [selectedAgentId, agents])

  // Handle delete conversation
  const handleDeleteConversation = useCallback((conversationId: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== conversationId)
      // If we deleted the active conversation, switch to another one or null
      if (activeConversationId === conversationId) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id)
        } else {
          setActiveConversationId(null)
        }
      }
      return filtered
    })
    console.log('Delete conversation:', conversationId)
  }, [activeConversationId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  if (error || !data) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading data</div>
  }

  // Show list view or runtime view
  if (view === 'list') {
    return (
      <AgentList
        agents={agents}
        selectedAgentId={selectedAgentId}
        isLoading={false}
        onSelectAgent={handleSelectAgent}
      />
    )
  }

  // Runtime view
  return (
    <AgentRuntimeView
      agent={agents.find((a) => a.id === selectedAgentId) || null}
      conversations={conversations}
      activeConversationId={activeConversationId}
      isLoading={isLoading}
      onBackToList={handleBackToList}
      onRuntimeFieldChange={handleRuntimeFieldChange}
      onSendMessage={handleSendMessage}
      onSelectConversation={handleSelectConversation}
      onCreateConversation={handleCreateConversation}
      onDeleteConversation={handleDeleteConversation}
    />
  )
}
