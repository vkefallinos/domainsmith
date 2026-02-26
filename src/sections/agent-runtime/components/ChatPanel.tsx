import type { Agent, Conversation, Message, ChatPanelProps } from '@/../product/sections/agent-runtime/types'
import { useState, useRef, useEffect } from 'react'

// Format timestamp for display
function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Format date for conversation list
function formatConversationDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

// Conversation item for the switcher
interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  const messageCount = conversation.messages.length

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg transition-all
        ${isActive
          ? 'bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {formatConversationDate(conversation.createdAt)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </span>
          </div>
          {lastMessage && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
              {lastMessage.role === 'user' ? 'You: ' : ''}{lastMessage.content}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </button>
  )
}

// Message input component
interface MessageInputProps {
  agentName: string
  onSend: (content: string) => void
  isLoading?: boolean
  onCreateConversation?: () => void
}

function MessageInput({ agentName, onSend, isLoading = false, onCreateConversation }: MessageInputProps) {
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
              bg-slate-50 dark:bg-slate-900 px-4 py-3 pr-24
              text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {onCreateConversation && (
              <button
                onClick={onCreateConversation}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-600 dark:text-slate-400 transition-colors"
                title="New conversation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
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
  const [showConversationList, setShowConversationList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = activeConversation?.messages || []
  const hasMessages = messages.length > 0

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation?.(conversationId)
    setShowConversationList(false)
  }

  // Handle conversation deletion
  const handleDeleteConversation = (conversationId: string) => {
    onDeleteConversation?.(conversationId)
  }

  // Handle create new conversation
  const handleCreateConversation = () => {
    onCreateConversation?.()
    setShowConversationList(false)
  }

  // Handle send message
  const handleSendMessage = (content: string) => {
    onSendMessage?.(content)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {agent.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {agent.description}
            </p>
          </div>

          {/* Conversation Switcher */}
          <div className="flex items-center gap-2">
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

            {/* Conversations dropdown button */}
            <div className="relative">
              <button
                onClick={() => setShowConversationList(!showConversationList)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-slate-100 dark:bg-slate-800
                  hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-700 dark:text-slate-300
                  text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Conversations</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">
                  {conversations.length}
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${showConversationList ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showConversationList && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowConversationList(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900
                    rounded-xl border border-slate-200 dark:border-slate-700
                    shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <button
                        onClick={handleCreateConversation}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2
                          rounded-lg bg-violet-600 hover:bg-violet-700
                          text-white text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Conversation
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {conversations.length === 0 ? (
                        <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
                          No conversations yet
                        </div>
                      ) : (
                        conversations.map((conv) => (
                          <div key={conv.id} className="group">
                            <ConversationItem
                              conversation={conv}
                              isActive={activeConversation?.id === conv.id}
                              onClick={() => handleSelectConversation(conv.id)}
                              onDelete={() => handleDeleteConversation(conv.id)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
        onCreateConversation={conversations.length > 0 ? handleCreateConversation : undefined}
      />
    </div>
  )
}
