import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { StudioSidebar } from './StudioSidebar'
import { Plus, Bot, Folder, Zap, Play } from 'lucide-react'
import { PromptLibrary } from '@/sections/prompt-library/components/PromptLibrary'
import { AgentFormBuilder } from '@/sections/agent-builder/components/AgentFormBuilder'
import { useAgents, useKnowledgeSections, useFlows } from '@/lib/workspaceContext'
import { useWorkspaceData } from '@/lib/workspaceDataContext'
import type { KnowledgeNode } from '@/types/workspace-data'
import type {
  PromptLibraryProps,
  FileSystemNode,
  PromptFragment,
  Directory,
  NewFileForm,
  NewFolderForm,
  PromptFrontmatter,
} from '@/../product/sections/prompt-library/types'
import type {
  AgentBuilderScreenProps,
  FormFieldValue,
  AttachedFlow,
} from '@/../product/sections/agent-builder/types'
import { workspaceToSlug, type Workspace } from './WorkspaceSelector'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { flattenEmptyFieldsForRuntime } from '@/lib/utils'
import type { Agent as WorkspaceAgent } from '@/types/workspace-data'

function toAgentId(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || `agent-${Date.now()}`
}

function areAgentDraftsEqual(a: WorkspaceAgent, b: WorkspaceAgent): boolean {
  return (
    a.id === b.id &&
    JSON.stringify(a.frontmatter) === JSON.stringify(b.frontmatter) &&
    a.mainInstruction === b.mainInstruction &&
    JSON.stringify(a.slashActions) === JSON.stringify(b.slashActions) &&
    JSON.stringify(a.config) === JSON.stringify(b.config) &&
    JSON.stringify(a.formValues) === JSON.stringify(b.formValues)
  )
}

// Helper to get workspace from URL param
function useWorkspace(workspaceName?: string): Workspace {
  const { data: workspaces } = useWorkspaces()

  return useMemo(() => {
    const defaultWorkspace = { id: 'default', name: workspaceName || 'Workspace', color: '#10b981' }
    if (!workspaces) return defaultWorkspace

    if (workspaceName) {
      const found = workspaces.find(w => workspaceToSlug(w.name) === workspaceName)
      if (found) {
        return { id: found.id.toString(), name: found.name, color: '#10b981' }
      }
    }

    const first = workspaces[0]
    return first ? { id: first.id.toString(), name: first.name, color: '#10b981' } : defaultWorkspace
  }, [workspaceName, workspaces])
}

type StudioState = {
  sidebarCollapsed: boolean
}

export interface StudioShellProps {
  // User props
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
  onOpenSettings?: () => void
  // Sidebar state
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  // Callbacks for domain actions
  onCreateDomain?: () => void
  onEditDomain?: (domainId: string) => void
  onDeleteDomain?: (domainId: string) => void
  // Callbacks for agent actions
  onCreateAgent?: () => void
  onEditAgent?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
  // Prompt Library callbacks
  onSelectFile?: (file: PromptFragment) => void
  onToggleFolder?: (path: string) => void
  onExpandAll?: () => void
  onCollapseAll?: () => void
  onEditContent?: (content: string) => void
  onSave?: () => void
  onCreateFile?: (form: NewFileForm) => void
  onCreateFolder?: (form: NewFileForm) => void
  onRename?: (nodeId: string, newName: string) => void
  onMove?: (nodeId: string, newParentPath: string) => void
  onDelete?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
}

type Domain = {
  id: string
  name: string
  label: string
  description: string
  icon: string
  color: string
  path: string
}

/**
 * Recursively convert a raw KnowledgeNode (from workspace JSON) into the
 * Directory | PromptFragment shape required by PromptLibrary.
 * File nodes carry markdown `content`; directory nodes carry nested children.
 */
function knowledgeNodeToFileSystem(node: KnowledgeNode): Directory | PromptFragment {
  if (node.type === 'file') {
    const fileName = node.path.split('/').pop() || node.path
    return {
      id: node.path,
      name: fileName,
      type: 'file',
      path: node.path,
      content: node.content || '',
      frontmatter: node.frontmatter
        ? {
          title: node.frontmatter.title as string | undefined,
          description: node.frontmatter.description as string | undefined,
          order: node.frontmatter.order !== undefined
            ? Number(node.frontmatter.order)
            : undefined,
        }
        : undefined,
    } as PromptFragment
  }

  // Directory node
  const dirName = node.path.split('/').pop() || node.path
  return {
    id: node.path,
    name: node.config?.label || dirName,
    type: 'directory',
    path: node.path,
    config: node.config,
    children: (node.children || []).map(knowledgeNodeToFileSystem),
  } as Directory
}

type AgentConfig = {
  id: string
  name: string
  description: string
  selectedDomains: string[]
  formValues: Record<string, FormFieldValue>
  enabledTools: Array<{ toolId: string; source: string; config?: Record<string, unknown> }>
  emptyFieldsForRuntime?: string[]
  attachedFlows: AttachedFlow[]
  mainInstruction?: string
  createdAt: string
  updatedAt: string
}

export function StudioShell({
  user,
  onLogout,
  onOpenSettings,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  onCreateDomain,
  onEditDomain,
  onDeleteDomain,
  onCreateAgent,
  onEditAgent,
  onDeleteAgent,
  onSelectFile,
  onToggleFolder,
  onExpandAll,
  onCollapseAll,
  onEditContent,
  onSave,
  onCreateFile,
  onCreateFolder,
  onRename,
  onMove,
  onDelete,
  onDuplicate,
}: StudioShellProps) {
  const { domainId, agentId, workspaceName } = useParams()
  const navigate = useNavigate()

  // Use the new state hooks
  const knowledgeSections = useKnowledgeSections()
  const { agents: agentsMap } = useAgents()
  const { flows: flowsMap } = useFlows()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed)

  // Workspace - derived directly from URL
  const currentWorkspace = useWorkspace(workspaceName)

  // Build workspace-aware path helper
  const studioPath = workspaceName ? `/workspace/${workspaceName}/studio` : '/studio'
  const chatPath = workspaceName ? `/workspace/${workspaceName}/chat` : '/chat'

  // Prompt Library state
  const [selectedFile, setSelectedFile] = useState<PromptFragment | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Agent Builder state
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([])
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>({})
  const [mainInstruction, setMainInstruction] = useState<string>('')
  const [enabledTools, setEnabledTools] = useState<Array<{ toolId: string; source: string; config?: Record<string, unknown> }>>([])
  const [emptyFieldsForRuntime, setEmptyFieldsForRuntime] = useState<string[]>([])
  const [toolLibraryOpen, setToolLibraryOpen] = useState(false)
  const [flowBuilderOpen, setFlowBuilderOpen] = useState(false)
  const [attachedFlows, setAttachedFlows] = useState<AttachedFlow[]>([])
  const hydratedAgentIdRef = useRef<string | null>(null)
  const lastAutoSavedSnapshotRef = useRef<string>('')

  // Extract domains from knowledge sections
  const domains = useMemo(() => {
    return knowledgeSections.map(section => {
      // Build field nodes from field-type children
      const fieldNodes = (section.children || [])
        .filter(c => c.type === 'field')
        .map(field => ({
          id: field.path,
          type: 'field' as const,
          label: field.label || field.path,
          description: field.description || '',
          variableName: field.variableName || field.path.split('/').pop() || field.path,
          fieldType: field.fieldType || 'select',
          required: field.required || false,
          runtimeOptional: true,
          options: (field.children || []).map(opt => {
            const stem = opt.path.split('/').pop()?.replace(/\.md$/, '') ?? opt.path
            return {
              id: opt.path,
              value: stem,
              label: opt.label || stem,
              filePath: opt.path,
            }
          }),
        }))

      return {
        id: section.path,           // Use path directly (e.g. 'plant-profile')
        name: section.label || section.path,
        label: section.label || section.path,
        description: section.description || '',
        icon: section.icon || '📁',
        color: section.color || '#6366f1',
        path: section.path,
        directoryPath: section.path,
        category: 'Knowledge',
        schema: {
          root: {
            id: section.path,
            type: 'section' as const,
            label: section.label || section.path,
            description: section.description || '',
            children: fieldNodes,
          },
        },
        fields: fieldNodes,
      }
    })
  }, [knowledgeSections])

  // Access raw knowledge nodes and in-memory mutators from workspace context
  const {
    knowledge: rawKnowledge,
    upsertAgent,
    deleteAgent,
    updateKnowledgeFileContent,
    updateKnowledgeFileFrontmatter,
  } = useWorkspaceData()

  // Extract agents from agents map
  const agents = useMemo(() => {
    return Object.values(agentsMap).map(agent => ({
      id: agent.id,
      name: agent.frontmatter.name || agent.id,
      description: agent.frontmatter.description || '',
      selectedDomains: (agent.frontmatter.selectedDomains || []).map(id =>
        // Normalize: 'domain-plant-profile' → 'plant-profile' to match knowledge section paths
        id.startsWith('domain-') ? id.slice('domain-'.length) : id
      ),
      formValues: agent.formValues,
      enabledTools: [],
      emptyFieldsForRuntime: flattenEmptyFieldsForRuntime(agent.config.emptyFieldsForRuntime),
      attachedFlows: (agent.slashActions || []).map(sa => ({
        flowId: sa.flowId,
        flowName: sa.name,
        flowDescription: sa.description,
        taskCount: flowsMap[sa.flowId]?.tasks?.length || 0,
        slashAction: {
          id: `sa_${sa.actionId}`,
          actionId: sa.actionId,
          name: sa.name,
          description: sa.description,
          enabled: true,
        },
      })),
      mainInstruction: agent.mainInstruction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as AgentConfig[]
  }, [agentsMap, flowsMap])

  // Get the active domain
  const activeDomain = useMemo(
    () => (domainId ? domains.find((d) => d.id === domainId) || null : null),
    [domainId, domains]
  )

  // Get the active agent
  const activeAgent = useMemo(
    () => (agentId ? agents.find((a) => a.id === agentId) || null : null),
    [agentId, agents]
  )

  // Load agent data only when the route agent changes
  useEffect(() => {
    if (!agentId) {
      hydratedAgentIdRef.current = null
      lastAutoSavedSnapshotRef.current = ''

      // Reset state when no agent selected
      setSelectedDomainIds([])
      setFormValues({})
      setMainInstruction('')
      setEnabledTools([])
      setEmptyFieldsForRuntime([])
      setAttachedFlows([])
      return
    }

    if (hydratedAgentIdRef.current === agentId) {
      return
    }

    const sourceAgent = agentsMap[agentId]
    if (!sourceAgent) {
      return
    }

    const mappedAgent = agents.find((a) => a.id === agentId) || null

    setSelectedDomainIds(mappedAgent?.selectedDomains || [])
    setFormValues((sourceAgent.formValues || {}) as Record<string, FormFieldValue>)
    setMainInstruction(sourceAgent.mainInstruction || '')
    setEnabledTools([])
    setEmptyFieldsForRuntime(flattenEmptyFieldsForRuntime(sourceAgent.config?.emptyFieldsForRuntime))
    setAttachedFlows(mappedAgent?.attachedFlows || [])

    hydratedAgentIdRef.current = agentId
    lastAutoSavedSnapshotRef.current = JSON.stringify(sourceAgent)
  }, [agentId, agentsMap, agents])

  // Determine view mode from URL params
  const viewMode: 'list' | 'domain-detail' | 'agent-detail' = agentId
    ? 'agent-detail'
    : domainId
      ? 'domain-detail'
      : 'list'

  // Get filtered file system for the selected domain
  // knowledgeNodeToFileSystem is a module-level pure function – no useCallback needed
  const domainFileSystem = useMemo(() => {
    if (!activeDomain) return null

    // Find the raw knowledge section (contains content on file nodes)
    const section = rawKnowledge.find(s => s.path === activeDomain.path)
    if (!section) return null

    // Build a root Directory wrapping the section
    return {
      id: 'root',
      name: 'root',
      type: 'directory' as const,
      path: '/',
      children: [knowledgeNodeToFileSystem(section)],
    } as Directory
  }, [activeDomain, rawKnowledge])

  // Available flows (empty for now, would come from flow builder data)
  const availableFlows: any[] = []

  // Prompt library callbacks
  const handleSelectFile = useCallback((file: PromptFragment) => {
    setSelectedFile(file)
    setUnsavedChanges(false)
    onSelectFile?.(file)
  }, [onSelectFile])

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
    onToggleFolder?.(path)
  }, [onToggleFolder])

  const handleExpandAll = useCallback(() => {
    const allPaths: string[] = []
    const collectPaths = (node: FileSystemNode) => {
      if (node.type === 'directory') {
        allPaths.push(node.path)
        node.children?.forEach(collectPaths)
      }
    }
    if (domainFileSystem) {
      domainFileSystem.children?.forEach(collectPaths)
    }
    setExpandedFolders(allPaths)
    onExpandAll?.()
  }, [domainFileSystem, onExpandAll])

  const handleCollapseAll = useCallback(() => {
    setExpandedFolders([])
    onCollapseAll?.()
  }, [onCollapseAll])

  const handleEditContent = useCallback((content: string) => {
    if (selectedFile?.path) {
      updateKnowledgeFileContent(selectedFile.path, content)
      setSelectedFile((prev) => (prev ? { ...prev, content } : prev))
    }
    setUnsavedChanges(false)
    onEditContent?.(content)
  }, [onEditContent, selectedFile, updateKnowledgeFileContent])

  const handleEditFrontmatter = useCallback((frontmatter: PromptFrontmatter) => {
    if (selectedFile?.path) {
      updateKnowledgeFileFrontmatter(selectedFile.path, frontmatter as Record<string, unknown>)
      setSelectedFile((prev) => (prev ? { ...prev, frontmatter } : prev))
    }
  }, [selectedFile, updateKnowledgeFileFrontmatter])

  const handleSave = useCallback(() => {
    setUnsavedChanges(false)
    onSave?.()
  }, [onSave])

  const handleCreateFile = useCallback((form: NewFileForm) => {
    onCreateFile?.(form)
  }, [onCreateFile])

  const handleCreateFolder = useCallback((form: NewFileForm) => {
    onCreateFolder?.(form)
  }, [onCreateFolder])

  const handleRename = useCallback((nodeId: string, newName: string) => {
    onRename?.(nodeId, newName)
  }, [onRename])

  const handleMove = useCallback((nodeId: string, newParentPath: string) => {
    onMove?.(nodeId, newParentPath)
  }, [onMove])

  const handleDelete = useCallback((nodeId: string) => {
    onDelete?.(nodeId)
  }, [onDelete])

  const handleDuplicate = useCallback((nodeId: string) => {
    onDuplicate?.(nodeId)
  }, [onDuplicate])

  // Agent Builder callbacks
  const handleDomainsChange = useCallback((domainIds: string[]) => {
    setSelectedDomainIds(domainIds)
    setEmptyFieldsForRuntime([])
  }, [])

  const handleFieldValueChange = useCallback((fieldId: string, value: FormFieldValue) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const handleEnableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => [...prev, fieldId])
  }, [])

  const handleDisableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => prev.filter(id => id !== fieldId))
  }, [])

  const handleMainInstructionChange = useCallback((instruction: string) => {
    setMainInstruction(instruction)
  }, [])

  const handleOpenToolLibrary = useCallback(() => {
    setToolLibraryOpen(true)
  }, [])

  const handleCloseToolLibrary = useCallback(() => {
    setToolLibraryOpen(false)
  }, [])

  const handleAddTool = useCallback((toolId: string, config?: Record<string, unknown>) => {
    setEnabledTools(prev => {
      if (prev.some(t => t.toolId === toolId)) return prev
      return [...prev, { toolId, source: 'manual', config }]
    })
  }, [])

  const handleRemoveTool = useCallback((toolId: string) => {
    setEnabledTools(prev => prev.filter(t => t.toolId !== toolId))
  }, [])

  const handleConfigureTool = useCallback((toolId: string, config: Record<string, unknown>) => {
    console.log('Configure tool:', toolId, config)
  }, [])

  const handleGeneratePreview = useCallback(() => {
    console.log('Generate preview')
  }, [])

  const buildAgentPayload = useCallback(
    (targetAgentId: string, name: string, description: string): WorkspaceAgent => {
      const existingAgent = agentsMap[targetAgentId]
      const slashActions = attachedFlows
        .filter((af) => Boolean(af.slashAction?.actionId))
        .map((af) => ({
          name: af.slashAction?.name || af.flowName,
          description: af.slashAction?.description || af.flowDescription || '',
          flowId: af.flowId,
          actionId: af.slashAction?.actionId || '',
        }))

      return {
        id: targetAgentId,
        frontmatter: {
          ...(existingAgent?.frontmatter || {}),
          name,
          description,
          selectedDomains: selectedDomainIds,
          tools: enabledTools.map((tool) => tool.toolId),
        },
        mainInstruction,
        slashActions,
        config: {
          ...(existingAgent?.config || {}),
          emptyFieldsForRuntime,
        },
        formValues,
        conversations: existingAgent?.conversations || [],
      }
    },
    [agentsMap, attachedFlows, selectedDomainIds, enabledTools, mainInstruction, emptyFieldsForRuntime, formValues]
  )

  // Auto-save draft in memory for existing agents whenever form state changes
  useEffect(() => {
    if (!agentId) return

    const existingAgent = agentsMap[agentId]
    if (!existingAgent) return

    const draft = buildAgentPayload(
      agentId,
      (existingAgent.frontmatter.name as string) || agentId,
      (existingAgent.frontmatter.description as string) || ''
    )

    const nextSnapshot = JSON.stringify(draft)
    if (lastAutoSavedSnapshotRef.current === nextSnapshot) return

    if (areAgentDraftsEqual(existingAgent, draft)) {
      lastAutoSavedSnapshotRef.current = nextSnapshot
      return
    }

    lastAutoSavedSnapshotRef.current = nextSnapshot
    upsertAgent(draft)
  }, [
    agentId,
    agentsMap,
    selectedDomainIds,
    formValues,
    mainInstruction,
    enabledTools,
    emptyFieldsForRuntime,
    attachedFlows,
    buildAgentPayload,
    upsertAgent,
  ])

  const handleSaveAgent = useCallback((name: string, description: string) => {
    const nextAgentId = agentId || toAgentId(name)
    upsertAgent(buildAgentPayload(nextAgentId, name, description))

    if (!agentId) {
      navigate(`${studioPath}/agent/${nextAgentId}`, { replace: true })
    }
  }, [
    agentId,
    navigate,
    studioPath,
    upsertAgent,
    buildAgentPayload,
  ])

  const handleNewAgent = useCallback(() => {
    setSelectedDomainIds([])
    setFormValues({})
    setMainInstruction('')
    setEnabledTools([])
    setEmptyFieldsForRuntime([])
    setAttachedFlows([])
    navigate(studioPath)
  }, [navigate, studioPath])

  const handleOpenFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(true)
  }, [])

  const handleCloseFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(false)
  }, [])

  const handleAttachFlow = useCallback((
    flowId: string,
    actionId: string,
    name: string,
    description: string
  ) => {
    const newAttachedFlow: AttachedFlow = {
      flowId,
      flowName: name,
      flowDescription: description,
      taskCount: flowsMap[flowId]?.tasks?.length || 0,
      slashAction: {
        id: `sc_${Date.now()}`,
        actionId,
        name,
        description,
        flowId,
        flowName: name,
        enabled: true,
      },
    }
    setAttachedFlows(prev => [...prev, newAttachedFlow])
  }, [])

  const handleDetachFlow = useCallback((slashActionId: string) => {
    setAttachedFlows(prev => prev.filter(af => af.slashAction?.id !== slashActionId))
  }, [])

  const handleToggleSlashAction = useCallback((slashActionId: string, enabled: boolean) => {
    setAttachedFlows(prev =>
      prev.map(af => {
        if (af.slashAction?.id === slashActionId) {
          return { ...af, slashAction: { ...af.slashAction, enabled } }
        }
        return af
      })
    )
  }, [])

  const handleEditSlashAction = useCallback((
    slashActionId: string
  ) => {
    // Find the attached flow to get the actionId
    const attachedFlow = attachedFlows.find(af => af.slashAction?.id === slashActionId)
    if (!attachedFlow) {
      console.log('Flow not found for slash action:', slashActionId)
      return
    }

    // Navigate to the agent flow editing route
    navigate(`${studioPath}/agent/${agentId}/actions/${attachedFlow.slashAction.actionId}`)
  }, [navigate, agentId, attachedFlows, studioPath])

  // Navigation helpers
  const handleBackToList = useCallback(() => {
    navigate(studioPath)
  }, [navigate, studioPath])

  const handleCreateAgent = useCallback(() => {
    onCreateAgent?.()
  }, [onCreateAgent])

  const handleCreateDomain = useCallback(() => {
    onCreateDomain?.()
  }, [onCreateDomain])

  const handleEditAgentClick = useCallback((agentId: string) => {
    onEditAgent?.(agentId)
  }, [onEditAgent])

  const handleDeleteAgentClick = useCallback((targetAgentId: string) => {
    deleteAgent(targetAgentId)
    onDeleteAgent?.(targetAgentId)

    if (agentId === targetAgentId) {
      navigate(studioPath)
    }
  }, [agentId, deleteAgent, navigate, onDeleteAgent, studioPath])

  const handleEditDomainClick = useCallback((domainId: string) => {
    onEditDomain?.(domainId)
  }, [onEditDomain])

  const handleDeleteDomainClick = useCallback((domainId: string) => {
    onDeleteDomain?.(domainId)
  }, [onDeleteDomain])
  useEffect(() => {
    handleExpandAll()
  }, [domainFileSystem, handleExpandAll])

  // Show loading state while data loads (new hooks don't have loading, so we check if data exists)
  if (knowledgeSections.length === 0 && Object.keys(agentsMap).length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-500">Loading workspace data...</div>
      </div>
    )
  }

  // Prompt preview - create a default one
  const promptPreview = {
    agentId: agentId || 'default',
    domains: selectedDomainIds,
    generatedPrompt: mainInstruction || '',
    tokenCount: mainInstruction?.length || 0,
    lastGenerated: new Date().toISOString(),
  }

  // Build agent builder props using new data structure
  const agentBuilderProps: AgentBuilderScreenProps = {
    domains,
    toolLibrary: [], // Empty for now - tool library not in extracted data
    savedAgentConfigs: agents,
    selectedDomainIds,
    formValues,
    enabledTools: enabledTools.map(t => ({ ...t, source: 'manual' as const })),
    emptyFieldsForRuntime,
    attachedFlows: attachedFlows.map(af => ({
      ...af,
      taskCount: af.taskCount || flowsMap[af.flowId]?.tasks?.length || 0
    })),
    availableFlows,
    mainInstruction,
    promptPreview,
    validationErrors: {},
    toolLibraryOpen,
    flowBuilderOpen,
    loadedAgentId: agentId || null,
    onDomainsChange: handleDomainsChange,
    onFieldValueChange: handleFieldValueChange,
    onEnableFieldForRuntime: handleEnableFieldForRuntime,
    onDisableFieldForRuntime: handleDisableFieldForRuntime,
    onMainInstructionChange: handleMainInstructionChange,
    onOpenToolLibrary: handleOpenToolLibrary,
    onCloseToolLibrary: handleCloseToolLibrary,
    onAddTool: handleAddTool,
    onRemoveTool: handleRemoveTool,
    onConfigureTool: handleConfigureTool,
    onGeneratePreview: handleGeneratePreview,
    onSaveAgent: handleSaveAgent,
    onNewAgent: handleNewAgent,
    onOpenFlowBuilder: handleOpenFlowBuilder,
    onCloseFlowBuilder: handleCloseFlowBuilder,
    onAttachFlow: handleAttachFlow,
    onDetachFlow: handleDetachFlow,
    onToggleSlashAction: handleToggleSlashAction,
    onEditSlashAction: handleEditSlashAction,
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <StudioSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          const newState = !isSidebarCollapsed
          setIsSidebarCollapsed(newState)
          onSidebarCollapsedChange?.(newState)
        }}
        activeDomainId={domainId}
        activeAgentId={agentId}
        onOpenSettings={onOpenSettings}
        onCreateDomain={handleCreateDomain}
        onCreateAgent={handleCreateAgent}
        workspace={currentWorkspace}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            {(activeDomain || activeAgent) && (
              <button
                onClick={handleBackToList}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {activeAgent ? activeAgent.name : activeDomain ? activeDomain.label : 'Studio'}
            </h1>
            {(activeDomain || activeAgent) && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {activeAgent?.description || activeDomain?.description}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={chatPath}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors text-violet-700 dark:text-violet-300"
              title="Go to Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m0 0l3-3 3m-3 3V9" />
              </svg>
              <span className="text-sm font-medium">Go to Chat</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Main List View */}
          {viewMode === 'list' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Manage knowledge and agents
                </h2>
              </div>

              {/* Domains Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-emerald-500" />
                    Knowledge
                  </h3>
                  <button
                    onClick={handleCreateDomain}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    + Create Knowledge Area
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => (
                    <Link
                      key={domain.id}
                      to={`${studioPath}/domain/${domain.id}`}
                      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${domain.color}20` }}
                        >
                          <div
                            className="w-5 h-5 rounded"
                            style={{ backgroundColor: domain.color }}
                          />
                        </div>
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {domain.label}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {domain.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Agents Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-violet-500" />
                    Agents
                  </h3>
                  <button
                    onClick={handleCreateAgent}
                    className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
                  >
                    + Create Agent
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => {
                    const slashAction = agent.attachedFlows?.find((f) => f.slashAction?.enabled)
                    return (
                      <Link
                        key={agent.id}
                        to={`${studioPath}/agent/${agent.id}`}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-lg transition-all bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            {slashAction && (
                              <span className="px-2 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-full">
                                /{slashAction.slashAction?.name}
                              </span>
                            )}
                            <svg
                              className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {agent.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                          {agent.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                          <span>{agent.selectedDomains.length} knowledge areas</span>
                          <span>{agent.enabledTools?.length || 0} tools</span>
                          <span>{agent.attachedFlows?.length || 0} flows</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Domain Detail View - Use PromptLibrary Component */}
          {viewMode === 'domain-detail' && domainFileSystem && (
            <PromptLibrary
              fileSystem={domainFileSystem}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              unsavedChanges={unsavedChanges}
              onSelectFile={handleSelectFile}
              onToggleFolder={handleToggleFolder}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              onEditContent={handleEditContent}
              onEditFrontmatter={handleEditFrontmatter}
              onSave={handleSave}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onRename={handleRename}
              onMove={handleMove}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}

          {/* Agent Detail View - Use AgentFormBuilder Component */}
          {viewMode === 'agent-detail' && (
            <div className="h-full flex flex-col">
              <AgentFormBuilder {...agentBuilderProps} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
