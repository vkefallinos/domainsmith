'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import { useGithub } from '@/lib/github/GithubContext'
import { loadWorkspaceDataFromGithubRepo } from '@/lib/github/workspaceLoader'
import { fromWorkspaceRouteParam, parseWorkspaceRepoRef } from '@/lib/workspaces'
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
  upsertAgent: (agent: Agent) => void
  deleteAgent: (agentId: string) => void
  upsertFlow: (flow: Flow) => void
  deleteFlow: (flowId: string) => void
  updateKnowledgeFileContent: (filePath: string, content: string) => void
  updateKnowledgeFileFrontmatter: (filePath: string, frontmatter: Record<string, unknown>) => void
  updateKnowledgeDirectoryConfig: (directoryPath: string, config: Record<string, unknown>) => void
  reload: () => Promise<void>
}

function updateKnowledgeNodeContent(
  node: KnowledgeNode,
  targetPath: string,
  content: string
): KnowledgeNode {
  if (node.type === 'file' && node.path === targetPath) {
    return {
      ...node,
      content,
    }
  }

  if (!node.children || node.children.length === 0) {
    return node
  }

  const nextChildren = node.children.map((child) =>
    updateKnowledgeNodeContent(child, targetPath, content)
  )

  return {
    ...node,
    children: nextChildren,
  }
}

function updateKnowledgeNodeFrontmatter(
  node: KnowledgeNode,
  targetPath: string,
  frontmatter: Record<string, unknown>
): KnowledgeNode {
  if (node.type === 'file' && node.path === targetPath) {
    return {
      ...node,
      frontmatter: {
        ...(node.frontmatter || {}),
        ...frontmatter,
      },
    }
  }

  if (!node.children || node.children.length === 0) {
    return node
  }

  const nextChildren = node.children.map((child) =>
    updateKnowledgeNodeFrontmatter(child, targetPath, frontmatter)
  )

  return {
    ...node,
    children: nextChildren,
  }
}

function updateKnowledgeNodeDirectoryConfig(
  node: KnowledgeNode,
  targetPath: string,
  config: Record<string, unknown>
): KnowledgeNode {
  if (node.type === 'directory' && node.path === targetPath) {
    return {
      ...node,
      config: {
        ...(node.config || {}),
        ...config,
      },
    }
  }

  if (!node.children || node.children.length === 0) {
    return node
  }

  const nextChildren = node.children.map((child) =>
    updateKnowledgeNodeDirectoryConfig(child, targetPath, config)
  )

  return {
    ...node,
    children: nextChildren,
  }
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
  // For file nodes, the human-readable label lives in frontmatter.title (not config.label)
  // Fall back to stripping the .md extension from the filename
  const filenameStem = node.path.split('/').pop()?.replace(/\.md$/, '') ?? node.path

  const item: KnowledgeItem = {
    path: node.path,
    type: node.config?.renderAs === 'field' ? 'field' :
      node.config?.renderAs === 'section' ? 'section' : 'file',
    label: node.config?.label
      ?? (node.frontmatter?.title as string | undefined)
      ?? (node.type === 'file' ? filenameStem : undefined),
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

const WORKSPACE_DATA_STORAGE_KEY = 'domainsmith-workspace-data'

function loadPersistedWorkspaceData(): ExtractedDataStructure | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(WORKSPACE_DATA_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ExtractedDataStructure
  } catch {
    return null
  }
}

function persistWorkspaceData(data: ExtractedDataStructure) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(WORKSPACE_DATA_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export function WorkspaceDataProvider({
  children,
}: WorkspaceDataProviderProps) {
  const { octokit, isAuthenticated, user } = useGithub()
  const [data, setData] = useState<ExtractedDataStructure | null>(null)
  // Start with null — layouts will call setCurrentWorkspace once they know the workspace from the URL
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setCurrentWorkspaceSafe = useCallback((workspaceId: string) => {
    setCurrentWorkspace(fromWorkspaceRouteParam(workspaceId))
  }, [])

  // Load data from JSON file
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const persistedData = loadPersistedWorkspaceData()
      const jsonData = (persistedData || (staticData as unknown as ExtractedDataStructure))
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

  useEffect(() => {
    if (!data) return
    persistWorkspaceData(data)
  }, [data])

  useEffect(() => {
    const loadGithubWorkspace = async () => {
      if (!currentWorkspace || !octokit || !isAuthenticated) return

      const repoRef = parseWorkspaceRepoRef(currentWorkspace, user?.login)
      if (!repoRef) return

      try {
        setIsLoading(true)
        setError(null)

        const workspace = await loadWorkspaceDataFromGithubRepo({
          octokit,
          owner: repoRef.owner,
          repo: repoRef.repo,
          workspaceId: currentWorkspace,
        })

        setData((prev) => {
          const base: ExtractedDataStructure = prev || { workspaces: {} }
          return {
            ...base,
            workspaces: {
              ...base.workspaces,
              [currentWorkspace]: workspace,
            },
          }
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Failed to load GitHub workspace data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    void loadGithubWorkspace()
  }, [currentWorkspace, octokit, isAuthenticated, user?.login])

  const updateCurrentWorkspace = useCallback(
    (updater: (workspace: WorkspaceData) => WorkspaceData) => {
      setData((prev) => {
        if (!prev || !currentWorkspace) return prev

        const existingWorkspace = prev.workspaces[currentWorkspace]
        if (!existingWorkspace) return prev

        const updatedWorkspace = updater(existingWorkspace)

        return {
          ...prev,
          workspaces: {
            ...prev.workspaces,
            [currentWorkspace]: updatedWorkspace,
          },
        }
      })
    },
    [currentWorkspace]
  )

  const upsertAgent = useCallback(
    (agent: Agent) => {
      updateCurrentWorkspace((workspace) => ({
        ...workspace,
        agents: {
          ...workspace.agents,
          [agent.id]: agent,
        },
      }))
    },
    [updateCurrentWorkspace]
  )

  const deleteAgent = useCallback(
    (agentId: string) => {
      updateCurrentWorkspace((workspace) => {
        const remainingAgents = { ...workspace.agents }
        delete remainingAgents[agentId]
        return {
          ...workspace,
          agents: remainingAgents,
        }
      })
    },
    [updateCurrentWorkspace]
  )

  const upsertFlow = useCallback(
    (flow: Flow) => {
      updateCurrentWorkspace((workspace) => ({
        ...workspace,
        flows: {
          ...workspace.flows,
          [flow.id]: flow,
        },
      }))
    },
    [updateCurrentWorkspace]
  )

  const deleteFlow = useCallback(
    (flowId: string) => {
      updateCurrentWorkspace((workspace) => {
        const remainingFlows = { ...workspace.flows }
        delete remainingFlows[flowId]
        return {
          ...workspace,
          flows: remainingFlows,
        }
      })
    },
    [updateCurrentWorkspace]
  )

  const updateKnowledgeFileContent = useCallback(
    (filePath: string, content: string) => {
      updateCurrentWorkspace((workspace) => ({
        ...workspace,
        knowledge: workspace.knowledge.map((node) =>
          updateKnowledgeNodeContent(node, filePath, content)
        ),
      }))
    },
    [updateCurrentWorkspace]
  )

  const updateKnowledgeFileFrontmatter = useCallback(
    (filePath: string, frontmatter: Record<string, unknown>) => {
      updateCurrentWorkspace((workspace) => ({
        ...workspace,
        knowledge: workspace.knowledge.map((node) =>
          updateKnowledgeNodeFrontmatter(node, filePath, frontmatter)
        ),
      }))
    },
    [updateCurrentWorkspace]
  )

  const updateKnowledgeDirectoryConfig = useCallback(
    (directoryPath: string, config: Record<string, unknown>) => {
      updateCurrentWorkspace((workspace) => ({
        ...workspace,
        knowledge: workspace.knowledge.map((node) =>
          updateKnowledgeNodeDirectoryConfig(node, directoryPath, config)
        ),
      }))
    },
    [updateCurrentWorkspace]
  )

  // Computed values
  const workspaceData: WorkspaceData | null = useMemo(
    () => (currentWorkspace && data ? data.workspaces[currentWorkspace] : null),
    [currentWorkspace, data]
  )

  const agents = useMemo<Record<string, Agent>>(() => workspaceData?.agents || {}, [workspaceData])
  const flows = useMemo<Record<string, Flow>>(() => workspaceData?.flows || {}, [workspaceData])
  const knowledge = useMemo<KnowledgeNode[]>(() => workspaceData?.knowledge || [], [workspaceData])
  const packageJson = useMemo<PackageJson | null>(() => workspaceData?.packageJson || null, [workspaceData])

  const agentList = useMemo<AgentListItem[]>(() => Object.values(agents).map(toAgentListItem), [agents])
  const flowList = useMemo<FlowListItem[]>(() => Object.values(flows).map(toFlowListItem), [flows])
  const knowledgeTree = useMemo<KnowledgeItem[]>(() => knowledge.map(toKnowledgeItem), [knowledge])

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
    setCurrentWorkspace: setCurrentWorkspaceSafe,
    upsertAgent,
    deleteAgent,
    upsertFlow,
    deleteFlow,
    updateKnowledgeFileContent,
    updateKnowledgeFileFrontmatter,
    updateKnowledgeDirectoryConfig,
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
