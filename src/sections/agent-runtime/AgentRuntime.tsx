import data from '@/../product/sections/agent-runtime/data.json'
import { AgentRuntime } from './components/AgentRuntime'

// Simulated state for preview
let selectedAgentId = (data.agents as Agent[])[0].id
let isPromptPanelExpanded = false

export default function AgentRuntimePreview() {
  // Find conversation for selected agent
  const conversation = (data.conversations as Conversation[]).find(c => c.agentId === selectedAgentId) || null

  return (
    <AgentRuntime
      agents={data.agents}
      selectedAgentId={selectedAgentId}
      conversation={conversation}
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
