import type { AgentConfig } from '@/../product/sections/agent-builder/types'
import { useState } from 'react'

interface SavedAgentsListProps {
  agents: AgentConfig[]
  loadedAgentId: string | null
  onLoadAgent: (agentId: string) => void
  onDeleteAgent: (agentId: string) => void
}

/**
 * SavedAgentsList - Slide-out drawer showing saved agent configurations
 *
 * Displays all saved agents with load, edit, and delete actions.
 */
export function SavedAgentsList({
  agents,
  loadedAgentId,
  onLoadAgent,
  onDeleteAgent
}: SavedAgentsListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Sort by updated date
  const sortedAgents = [...agents].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-20
          flex items-center gap-2 px-3 py-6 rounded-l-xl
          bg-slate-800 border-y border-l border-slate-700
          text-slate-400 hover:text-slate-200
          transition-all duration-200
          ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium whitespace-nowrap">
          Saved Agents
        </span>
      </button>

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-16 bottom-0 w-80 bg-slate-900 border-l border-slate-800
          transition-transform duration-300 ease-out z-10 overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <h3 className="font-semibold text-slate-200">Saved Agents</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedAgents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">No saved agents yet</p>
            </div>
          ) : (
            sortedAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isLoaded={loadedAgentId === agent.id}
                isDeleting={deleteConfirm === agent.id}
                onLoad={() => {
                  onLoadAgent(agent.id)
                  setIsOpen(false)
                }}
                onDelete={() => {
                  if (deleteConfirm === agent.id) {
                    onDeleteAgent(agent.id)
                    setDeleteConfirm(null)
                  } else {
                    setDeleteConfirm(agent.id)
                    // Auto-reset after 3 seconds
                    setTimeout(() => setDeleteConfirm(null), 3000)
                  }
                }}
                onCancelDelete={() => setDeleteConfirm(null)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-600">
            {agents.length} saved agent{agents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </>
  )
}

interface AgentCardProps {
  agent: AgentConfig
  isLoaded: boolean
  isDeleting: boolean
  onLoad: () => void
  onDelete: () => void
  onCancelDelete: () => void
}

function AgentCard({ agent, isLoaded, isDeleting, onLoad, onDelete, onCancelDelete }: AgentCardProps) {
  return (
    <div
      className={`
        rounded-lg border transition-all duration-200 overflow-hidden
        ${isLoaded
          ? 'bg-violet-500/10 border-violet-500/40'
          : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      {/* Main content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          {/* Name & description */}
          <button
            onClick={onLoad}
            className="flex-1 text-left"
          >
            <h4 className="font-medium text-sm text-slate-200 hover:text-violet-300 transition-colors">
              {agent.name}
              {isLoaded && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-300">
                  Loaded
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {agent.description}
            </p>
          </button>

          {/* Actions */}
          {!isDeleting && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors"
              title="Delete agent"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] text-slate-600">
            {agent.selectedDomains.length} domain{agent.selectedDomains.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[10px] text-slate-600">
            Updated {new Date(agent.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Delete confirmation */}
      {isDeleting && (
        <div className="px-3 py-2 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between">
          <span className="text-xs text-red-400">Delete this agent?</span>
          <div className="flex gap-2">
            <button
              onClick={onCancelDelete}
              className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
