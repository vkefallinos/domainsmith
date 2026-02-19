import data from '@/../product/sections/agent-runtime/data.json'
import { AgentRuntime } from './components/AgentRuntime'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'

// Simulated state for preview
let selectedAgentId = data.agents[0].id
let isPromptPanelExpanded = false

export default function AgentRuntimePreview() {
  // Find conversation for selected agent
  const conversation = data.conversations.find(c => c.agentId === selectedAgentId) || null

  return (
    <AgentRuntime
      agents={data.agents as Agent[]}
      selectedAgentId={selectedAgentId}
      conversation={conversation as Conversation | null}
      isPromptPanelExpanded={isPromptPanelExpanded}
      isLoading={false}
      onSelectAgent={(id) => {
        selectedAgentId = id
        console.log('Selected agent:', id)
      }}
      onSendMessage={(content) => {
        console.log('Send message:', content)
      }}
      onTogglePromptPanel={() => {
        isPromptPanelExpanded = !isPromptPanelExpanded
        console.log('Toggle prompt panel:', isPromptPanelExpanded)
      }}
      onClearConversation={() => {
        console.log('Clear conversation')
      }}
    />
  )
}
