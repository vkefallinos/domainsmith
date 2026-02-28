import { Search, Plus, Bot } from 'lucide-react'
import { useState, useMemo } from 'react'
import agentRuntimeData from '@/../mock_data/workspaces/education/sections/agent-runtime/data.json'

type Agent = {
  id: string
  name: string
  description: string
}

export interface AgentsDashboardProps {
  onNewAgent?: () => void
  onOpenAgent?: (agentId: string) => void
  onEditAgent?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
}

export function AgentsDashboard({
  onNewAgent,
  onOpenAgent,
  onEditAgent,
  onDeleteAgent,
}: AgentsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Load agents from runtime data (same source as AppShell)
  const agents: Agent[] = useMemo(() => {
    return (agentRuntimeData.agents || []) as Agent[]
  }, [])

  const filteredAgents = useMemo(() => {
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [agents, searchQuery])

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Agents
        </h1>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* New Agent Button */}
          <button
            onClick={onNewAgent}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Studio
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              {searchQuery ? 'No agents found' : 'No agents yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first agent to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={onNewAgent}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go to Studio
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onOpenAgent?.(agent.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {/* Agent Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>

                    {/* Plus icon to indicate conversation creation */}
                    <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-800/50 transition-colors">
                      <Plus className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {agent.name}
                  </h3>

                  {/* Agent Description */}
                  {agent.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {agent.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
