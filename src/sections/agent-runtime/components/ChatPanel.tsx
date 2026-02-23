import type { Agent, Conversation, Message, ChatPanelProps } from '@/../product/sections/agent-runtime/types'

// Format timestamp for display
function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Message bubble component
interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[85%] rounded-2xl px-4 py-3
        ${isUser
          ? 'bg-violet-600 text-white rounded-br-md'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md'
        }
      `}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span className={`text-[10px] mt-1 block ${
          isUser ? 'text-violet-200' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

// Loading indicator for agent response
function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// Empty state when no conversation
function EmptyConversationState({ agentName }: { agentName: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-amber-100
        dark:from-violet-900/30 dark:to-amber-900/30 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Start a conversation
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Send a message to <span className="font-medium text-violet-600 dark:text-violet-400">{agentName}</span> to begin testing.
      </p>
    </div>
  )
}

// Message input component
interface MessageInputProps {
  agentName: string
  onSend: (content: string) => void
  isLoading?: boolean
  onClear?: () => void
}

function MessageInput({ agentName, onSend, isLoading = false, onClear }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const target = e.currentTarget
      if (target.value.trim() && !isLoading) {
        onSend(target.value)
        target.value = ''
      }
    }
  }

  const handleSendClick = () => {
    const textarea = document.querySelector('textarea[data-input-id="chat-input"]') as HTMLTextAreaElement
    if (textarea?.value.trim() && !isLoading) {
      onSend(textarea.value)
      textarea.value = ''
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-950">
      {/* Clear button when there are messages */}
      {onClear && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onClear}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300
              flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear conversation
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            data-input-id="chat-input"
            placeholder={`Message ${agentName}...`}
            rows={1}
            className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-900 px-4 py-3 pr-12
              text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendClick}
            className="absolute right-2 bottom-2 p-1.5 rounded-lg
              bg-violet-600 hover:bg-violet-700 text-white
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}

// Main Chat Panel component
export function ChatPanel({
  agent,
  conversation,
  isLoading = false,
  onSendMessage,
  onClearConversation
}: ChatPanelProps) {
  const messages = conversation?.messages || []
  const hasMessages = messages.length > 0

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {agent.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {agent.description}
            </p>
          </div>
          {/* Domain badges */}
          <div className="flex items-center gap-2">
            {agent.domains.slice(0, 2).map((domain) => (
              <span
                key={domain}
                className="px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-950/50
                  text-violet-700 dark:text-violet-300
                  text-xs font-medium border border-violet-200 dark:border-violet-800"
              >
                {domain}
              </span>
            ))}
            {agent.domains.length > 2 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                +{agent.domains.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!hasMessages ? (
          <EmptyConversationState agentName={agent.name} />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
      </div>

      {/* Input Area */}
      <MessageInput
        agentName={agent.name}
        onSend={(content) => onSendMessage?.(content)}
        isLoading={isLoading}
        onClear={hasMessages ? onClearConversation : undefined}
      />
    </div>
  )
}
