'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type {
  ExtractedDataStructure,
  WorkspaceData,
  Agent,
  Flow,
  KnowledgeNode,
  PackageJson,
  AgentListItem,
  FlowListItem,
  KnowledgeItem,
} from '@/types/workspace-data'

/**
 * WorkspaceDataContext
 *
 * Loads workspace state from extracted_data_structure.json
 * instead of fetching from GitHub API
 */

interface WorkspaceDataContextValue {
  // Current workspace info
  currentWorkspace: string | null
  workspaceData: WorkspaceData | null
  isLoading: boolean
  error: string | null

  // Direct data access
  agents: Record<string, Agent>
  flows: Record<string, Flow>
  knowledge: KnowledgeNode[]
  packageJson: PackageJson | null

  // Computed lists for UI
  agentList: AgentListItem[]
  flowList: FlowListItem[]
  knowledgeTree: KnowledgeItem[]

  // Actions
  setCurrentWorkspace: (workspaceId: string) => void
  reload: () => Promise<void>
}

const WorkspaceDataContext = createContext<WorkspaceDataContextValue | undefined>(undefined)

interface WorkspaceDataProviderProps {
  children: ReactNode
}

/**
 * Convert internal Agent to AgentListItem
 */
function toAgentListItem(agent: Agent): AgentListItem {
  return {
    id: agent.id,
    name: agent.frontmatter.name || agent.id,
    description: agent.frontmatter.description || '',
  }
}

/**
 * Convert internal Flow to FlowListItem
 */
function toFlowListItem(flow: Flow): FlowListItem {
  return {
    id: flow.id,
    name: flow.frontmatter.name || flow.id,
    description: flow.description,
    taskCount: parseInt(flow.frontmatter.taskCount || '0', 10),
    status: flow.frontmatter.status || 'unknown',
    tags: flow.frontmatter.tags || [],
  }
}

/**
 * Convert internal KnowledgeNode to KnowledgeItem
 */
function toKnowledgeItem(node: KnowledgeNode): KnowledgeItem {
  const item: KnowledgeItem = {
    path: node.path,
    type: node.config?.renderAs === 'field' ? 'field' :
      node.config?.renderAs === 'section' ? 'section' : 'file',
    label: node.config?.label,
    description: node.config?.description,
    icon: node.config?.icon,
    color: node.config?.color,
    variableName: node.config?.variableName,
    fieldType: node.config?.fieldType,
    required: node.config?.required,
    default: node.config?.default,
  }

  if (node.children) {
    item.children = node.children.map(toKnowledgeItem)
  }

  return item
}

import staticData from '@/extracted_data_structure.json'

export function WorkspaceDataProvider({
  children,
}: WorkspaceDataProviderProps) {
  const [data, setData] = useState<ExtractedDataStructure | null>(null)
  // Start with null — layouts will call setCurrentWorkspace once they know the workspace from the URL
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from JSON file
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const jsonData = staticData as unknown as ExtractedDataStructure
      setData(jsonData)
      // Do NOT pick a default workspace here — let the consumer (layout) decide
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Failed to load workspace data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Computed values
  const workspaceData: WorkspaceData | null = currentWorkspace && data
    ? data.workspaces[currentWorkspace]
    : null

  const agents: Record<string, Agent> = workspaceData?.agents || {}
  const flows: Record<string, Flow> = workspaceData?.flows || {}
  const knowledge: KnowledgeNode[] = workspaceData?.knowledge || []
  const packageJson: PackageJson | null = workspaceData?.packageJson || null

  const agentList: AgentListItem[] = Object.values(agents).map(toAgentListItem)
  const flowList: FlowListItem[] = Object.values(flows).map(toFlowListItem)
  const knowledgeTree: KnowledgeItem[] = knowledge.map(toKnowledgeItem)

  const value: WorkspaceDataContextValue = {
    currentWorkspace,
    workspaceData,
    isLoading,
    error,
    agents,
    flows,
    knowledge,
    packageJson,
    agentList,
    flowList,
    knowledgeTree,
    setCurrentWorkspace,
    reload: loadData,
  }

  return (
    <WorkspaceDataContext.Provider value={value}>
      {children}
    </WorkspaceDataContext.Provider>
  )
}

export function useWorkspaceData(): WorkspaceDataContextValue {
  const context = useContext(WorkspaceDataContext)

  if (!context) {
    throw new Error('useWorkspaceData must be used within a WorkspaceDataProvider')
  }

  return context
}
