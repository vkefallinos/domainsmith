import { useState } from 'react'
import data from '@/../product/sections/agent-runtime/data.json'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { AgentList } from './components/AgentList'
import { AgentRuntimeView } from './components/AgentRuntimeView'

export default function AgentRuntimePreview() {
  const [view, setView] = useState<'list' | 'runtime'>('list')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [runtimeFieldValues, setRuntimeFieldValues] = useState<Record<string, string | string[] | boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  // Handle agent selection
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId)

    // Load conversations for this agent
    const agentConversations = (data.conversations as unknown as Conversation[]).filter(
      (c) => c.agentId === agentId
    )
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
  }

  // Handle back to list
  const handleBackToList = () => {
    setView('list')
    setSelectedAgentId(null)
    setActiveConversationId(null)
  }

  // Handle runtime field change
  const handleRuntimeFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setRuntimeFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    console.log('Field changed:', fieldId, value)
  }

  // Handle send message
  const handleSendMessage = (content: string) => {
    setIsLoading(true)
    console.log('Send message:', content)
    // Simulate response
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Handle select conversation
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    console.log('Select conversation:', conversationId)
  }

  // Handle create conversation
  const handleCreateConversation = () => {
    if (!selectedAgentId) return

    const selectedAgent = (data.agents as unknown as Agent[]).find(
      (a) => a.id === selectedAgentId
    )
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
  }

  // Handle delete conversation
  const handleDeleteConversation = (conversationId: string) => {
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
  }

  // Get agents and selected agent
  const agents = data.agents as unknown as Agent[]

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
