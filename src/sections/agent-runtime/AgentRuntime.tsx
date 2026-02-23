import { useState } from 'react'
import data from '@/../product/sections/agent-runtime/data.json'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { AgentList } from './components/AgentList'
import { AgentRuntimeView } from './components/AgentRuntimeView'

export default function AgentRuntimePreview() {
  const [view, setView] = useState<'list' | 'runtime'>('list')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [runtimeFieldValues, setRuntimeFieldValues] = useState<Record<string, string | string[] | boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Handle agent selection
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId)
    setView('runtime')
  }

  // Handle back to list
  const handleBackToList = () => {
    setView('list')
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

  // Handle clear conversation
  const handleClearConversation = () => {
    console.log('Clear conversation')
  }

  // Find selected agent and conversation
  const agents = data.agents as unknown as Agent[]
  const conversations = data.conversations as unknown as Conversation[]
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || null
  const conversation = selectedAgentId
    ? conversations.find((c) => c.agentId === selectedAgentId) || null
    : null

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
      agent={selectedAgent}
      conversation={conversation}
      isLoading={isLoading}
      onBackToList={handleBackToList}
      onRuntimeFieldChange={handleRuntimeFieldChange}
      onSendMessage={handleSendMessage}
      onClearConversation={handleClearConversation}
    />
  )
}
