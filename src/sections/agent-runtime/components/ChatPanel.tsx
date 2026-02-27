import type { Agent, Message, ChatPanelProps } from '@/../product/sections/agent-runtime/types'
import { useState, useRef, useEffect } from 'react'

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
  isStreaming?: boolean
}

function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`
        max-w-[85%] rounded-2xl px-4 py-3
        ${isUser
          ? 'bg-violet-600 text-white rounded-br-md'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md'
        }
      `}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-1 h-4 bg-violet-400 ml-1 animate-pulse" />
          )}
        </p>
        {!isStreaming && (
          <span className={`text-[10px] mt-1 block ${
            isUser ? 'text-violet-200' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        )}
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
}

function MessageInput({ agentName, onSend, isLoading = false }: MessageInputProps) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSend(value)
        setValue('')
      }
    }
  }

  const handleSendClick = () => {
    if (value.trim() && !isLoading) {
      onSend(value)
      setValue('')
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-950">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
          <div className="absolute right-2 bottom-2">
            <button
              onClick={handleSendClick}
              className="p-1.5 rounded-lg
                bg-violet-600 hover:bg-violet-700 text-white
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !value.trim()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
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
  conversations,
  activeConversation,
  isLoading = false,
  isStreaming = false,
  onSendMessage,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onClearConversation
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = activeConversation?.messages || []
  const hasMessages = messages.length > 0

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle send message
  const handleSendMessage = (content: string) => {
    onSendMessage?.(content)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!hasMessages ? (
          <EmptyConversationState agentName={agent.name} />
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div key={message.id}>
                <MessageBubble
                  message={message}
                  isStreaming={isStreaming && idx === messages.length - 1}
                />
              </div>
            ))}
            {isLoading && !isStreaming && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <MessageInput
        agentName={agent.name}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}
