import { useState, useCallback } from 'react'
import type { Agent, Conversation } from '@/../product/sections/agent-runtime/types'
import { RuntimePanel } from './RuntimePanel'
import { ChatPanel } from './ChatPanel'

export interface AgentRuntimeViewProps {
  /** The agent being configured/run */
  agent: Agent | null
  /** Active conversation for the selected agent */
  conversation: Conversation | null
  /** Whether a message is being sent */
  isLoading?: boolean
  /** Callback when returning to agent list */
  onBackToList?: () => void
  /** Callback when runtime field value changes */
  onRuntimeFieldChange?: (fieldId: string, value: string | string[] | boolean) => void
  /** Callback when sending a message */
  onSendMessage?: (content: string) => void
  /** Callback when clearing conversation */
  onClearConversation?: () => void
}

export function AgentRuntimeView({
  agent,
  conversation,
  isLoading = false,
  onBackToList,
  onRuntimeFieldChange,
  onSendMessage,
  onClearConversation
}: AgentRuntimeViewProps) {
  const [runtimeFieldValues, setRuntimeFieldValues] = useState<Record<string, string | string[] | boolean>>({})
  const [isToolsExpanded, setIsToolsExpanded] = useState(true)

  // Handle runtime field value change
  const handleFieldChange = useCallback((fieldId: string, value: string | string[] | boolean) => {
    setRuntimeFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    onRuntimeFieldChange?.(fieldId, value)
  }, [onRuntimeFieldChange])

  // Handle send message
  const handleSendMessage = useCallback((content: string) => {
    onSendMessage?.(content)
  }, [onSendMessage])

  // Handle clear conversation
  const handleClearConversation = useCallback(() => {
    onClearConversation?.()
  }, [onClearConversation])

  // Handle back to list
  const handleBackToList = useCallback(() => {
    onBackToList?.()
  }, [onBackToList])

  if (!agent) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">No agent selected</p>
          <button
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            Back to Agent List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white dark:bg-slate-950 overflow-hidden">
      {/* Left Panel - Runtime Fields + Tools (35-40%) */}
      <div className="w-[380px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
        <RuntimePanel
          agent={agent}
          runtimeFieldValues={runtimeFieldValues}
          isToolsExpanded={isToolsExpanded}
          onRuntimeFieldChange={handleFieldChange}
        />
      </div>

      {/* Right Panel - Chat Interface (60-65%) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation bar */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Agents
          </button>
        </div>

        {/* Chat Panel */}
        <ChatPanel
          agent={agent}
          conversation={conversation}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClearConversation={handleClearConversation}
        />
      </div>
    </div>
  )
}
