import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import type { Agent, Conversation, Message } from '@/../product/sections/agent-runtime/types'
import { ChatPanel } from '../../agent-runtime/components/ChatPanel'

interface RuntimeFieldSummary {
  id: string
  label: string
  domain: string
}

interface AgentRuntimePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  enabledFilePaths: string[]
  generatedPrompt: string
  runtimeFields: RuntimeFieldSummary[]
}

export function AgentRuntimePreviewModal({
  isOpen,
  onClose,
  enabledFilePaths,
  generatedPrompt,
  runtimeFields,
}: AgentRuntimePreviewModalProps) {
  const timeoutRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Conversation>({
    id: 'preview-conversation',
    agentId: 'preview-agent',
    agentName: 'Runtime Preview Agent',
    messages: [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: 'Runtime preview ready. Try sending a message to test how this agent would respond in chat.',
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const previewAgent = useMemo<Agent>(
    () => ({
      id: 'preview-agent',
      name: 'Runtime Preview Agent',
      description: 'Simulated runtime conversation using current builder configuration.',
      domains: [...new Set(runtimeFields.map((field) => field.domain))],
      formValues: {},
      runtimeFields: runtimeFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: 'text',
        value: '',
        domain: field.domain,
      })),
      enabledTools: [],
      systemPrompt: generatedPrompt,
      slashCommands: [],
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      status: 'ready',
    }),
    [runtimeFields, generatedPrompt]
  )

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsLoading(false)
    onClose()
  }, [onClose])

  const handleSendMessage = useCallback((content: string) => {
    const now = new Date().toISOString()
    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: now,
    }

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: now,
    }))

    setIsLoading(true)

    timeoutRef.current = window.setTimeout(() => {
      const runtimeHint = runtimeFields.length
        ? `Still waiting on ${runtimeFields.length} runtime field${runtimeFields.length === 1 ? '' : 's'} from the user.`
        : 'All fields are currently prefilled.'

      const assistantMessage: Message = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: `Preview response: I would use your assembled prompt and enabled files to answer this request. ${runtimeHint}`,
        timestamp: new Date().toISOString(),
      }

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        updatedAt: assistantMessage.timestamp,
      }))

      setIsLoading(false)
    }, 700)
  }, [runtimeFields])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      <div
        className="relative flex flex-col w-full max-w-5xl min-w-[340px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        style={{ height: 'auto' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Runtime Conversation Preview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Inspect prompt inputs and test a simulated runtime chat.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 flex">
          <aside className="w-[420px] border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/40">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Fields Left to User</h3>
              {runtimeFields.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No runtime fields enabled.</p>
              ) : (
                <div className="space-y-2">
                  {runtimeFields.map((field) => (
                    <div key={field.id} className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{field.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{field.domain} · {field.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Enabled Knowledge Blocks</h3>
              {enabledFilePaths.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No selected file paths yet.</p>
              ) : (
                <div className="space-y-2.5" style={{ maxHeight: '16rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {enabledFilePaths.map((filePath, index) => (
                    <article
                      key={filePath}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30 text-[10px] font-semibold text-violet-700 dark:text-violet-400 px-1.5">
                          {index + 1}
                        </span>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Knowledge Block</p>
                      </div>
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                        {filePath}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Full Prompt</h3>
              {generatedPrompt ? (
                <pre className="text-xs font-mono whitespace-pre-wrap break-words max-h-72 overflow-y-auto p-3 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {generatedPrompt}
                </pre>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">Prompt preview is empty. Generate a prompt to inspect it here.</p>
              )}
            </section>
          </aside>

          <div className="flex-1 min-w-0">
            <ChatPanel
              agent={previewAgent}
              conversations={[conversation]}
              activeConversation={conversation}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
