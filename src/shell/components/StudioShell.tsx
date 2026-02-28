import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { StudioSidebar } from './StudioSidebar'
import { Plus, Bot, Folder, Zap, Play } from 'lucide-react'
import { PromptLibrary } from '@/sections/prompt-library/components/PromptLibrary'
import { AgentFormBuilder } from '@/sections/agent-builder/components/AgentFormBuilder'
import promptLibraryData from '@/../product/sections/prompt-library/data.json'
import agentBuilderData from '@/../product/sections/agent-builder/data.json'
import type {
  PromptLibraryProps,
  FileSystemNode,
  PromptFragment,
  Directory,
  NewFileForm,
  NewFolderForm,
} from '@/../product/sections/prompt-library/types'
import type {
  AgentBuilderScreenProps,
  FormFieldValue,
  AttachedFlow,
} from '@/../product/sections/agent-builder/types'
import { DUMMY_WORKSPACES, type Workspace } from './WorkspaceSelector'

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
  const { domainId, agentId } = useParams()
  const navigate = useNavigate()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed)

  // Workspace state
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(DUMMY_WORKSPACES[0])

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

  // Extract domains from prompt library data
  const domains = useMemo(() => {
    const fileSystem = (promptLibraryData as any).fileSystem as FileSystemNode
    if (!fileSystem.children) return []

    return fileSystem.children
      .filter((child) => child.type === 'directory' && child.config?.renderAs === 'section')
      .map((dir) => ({
        id: dir.id,
        name: dir.name,
        label: dir.config?.label || dir.name,
        description: dir.config?.description || '',
        icon: dir.config?.icon || 'folder',
        color: dir.config?.color || '#6366f1',
        path: dir.path,
      })) as Domain[]
  }, [])

  // Extract agents from agent builder data
  const agents = useMemo(() => {
    const savedConfigs = (agentBuilderData as any).savedAgentConfigs as AgentConfig[]
    return savedConfigs || []
  }, [])

  // Get the active domain
  const activeDomain = domainId
    ? domains.find((d) => d.id === domainId) || null
    : null

  // Get the active agent
  const activeAgent = agentId
    ? agents.find((a) => a.id === agentId) || null
    : null

  // Load agent data when agentId changes
  useMemo(() => {
    if (activeAgent) {
      setSelectedDomainIds(activeAgent.selectedDomains || [])
      setFormValues(activeAgent.formValues || {})
      setMainInstruction(activeAgent.mainInstruction || '')
      setEnabledTools(activeAgent.enabledTools || [])
      setEmptyFieldsForRuntime(activeAgent.emptyFieldsForRuntime || [])
      setAttachedFlows(activeAgent.attachedFlows || [])
    } else {
      // Reset state when no agent selected
      setSelectedDomainIds([])
      setFormValues({})
      setMainInstruction('')
      setEnabledTools([])
      setEmptyFieldsForRuntime([])
      setAttachedFlows([])
    }
  }, [activeAgent])

  // Determine view mode from URL params
  const viewMode: 'list' | 'domain-detail' | 'agent-detail' = agentId
    ? 'agent-detail'
    : domainId
      ? 'domain-detail'
      : 'list'

  // Get filtered file system for the selected domain
  const domainFileSystem = useMemo(() => {
    if (!activeDomain) return null

    const fileSystem = (promptLibraryData as any).fileSystem as Directory
    const domainNode = fileSystem.children?.find(
      (child) => child.id === activeDomain.id && child.type === 'directory'
    ) as Directory | undefined

    if (!domainNode) return null

    return {
      ...fileSystem,
      id: 'root',
      name: 'root',
      type: 'directory' as const,
      path: '/',
      children: [domainNode],
    } as Directory
  }, [activeDomain])

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
    setUnsavedChanges(true)
    onEditContent?.(content)
  }, [onEditContent])

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

  const handleSaveAgent = useCallback((name: string, description: string) => {
    console.log('Save agent:', name, description)
  }, [])

  const handleNewAgent = useCallback(() => {
    setSelectedDomainIds([])
    setFormValues({})
    setMainInstruction('')
    setEnabledTools([])
    setEmptyFieldsForRuntime([])
    setAttachedFlows([])
    navigate('/studio')
  }, [navigate])

  const handleOpenFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(true)
  }, [])

  const handleCloseFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(false)
  }, [])

  const handleAttachFlow = useCallback((
    flowId: string,
    commandId: string,
    name: string,
    description: string
  ) => {
    const newAttachedFlow: AttachedFlow = {
      flowId,
      flowName: name,
      flowDescription: description,
      slashCommand: {
        id: `sc_${Date.now()}`,
        commandId,
        name,
        description,
        flowId,
        flowName: name,
        enabled: true,
      },
    }
    setAttachedFlows(prev => [...prev, newAttachedFlow])
  }, [])

  const handleDetachFlow = useCallback((slashCommandId: string) => {
    setAttachedFlows(prev => prev.filter(af => af.slashCommand?.id !== slashCommandId))
  }, [])

  const handleToggleSlashCommand = useCallback((slashCommandId: string, enabled: boolean) => {
    setAttachedFlows(prev =>
      prev.map(af => {
        if (af.slashCommand?.id === slashCommandId) {
          return { ...af, slashCommand: { ...af.slashCommand, enabled } }
        }
        return af
      })
    )
  }, [])

  const handleEditSlashCommand = useCallback((
    slashCommandId: string
  ) => {
    // Find the attached flow to get the commandId
    const attachedFlow = attachedFlows.find(af => af.slashCommand?.id === slashCommandId)
    if (!attachedFlow) {
      console.log('Flow not found for slash command:', slashCommandId)
      return
    }

    // Navigate to the agent flow editing route
    navigate(`/studio/agent/${agentId}/commands/${attachedFlow.slashCommand.commandId}`)
  }, [navigate, agentId, attachedFlows])

  // Navigation helpers
  const handleBackToList = useCallback(() => {
    navigate('/studio')
  }, [navigate])

  const handleCreateAgent = useCallback(() => {
    onCreateAgent?.()
  }, [onCreateAgent])

  const handleCreateDomain = useCallback(() => {
    onCreateDomain?.()
  }, [onCreateDomain])

  const handleEditAgentClick = useCallback((agentId: string) => {
    onEditAgent?.(agentId)
  }, [onEditAgent])

  const handleDeleteAgentClick = useCallback((agentId: string) => {
    onDeleteAgent?.(agentId)
  }, [onDeleteAgent])

  const handleEditDomainClick = useCallback((domainId: string) => {
    onEditDomain?.(domainId)
  }, [onEditDomain])

  const handleDeleteDomainClick = useCallback((domainId: string) => {
    onDeleteDomain?.(domainId)
  }, [onDeleteDomain])
  useEffect(() => {
    handleExpandAll()
  },[domainFileSystem])
  // Prompt preview from data
  const promptPreview = (agentBuilderData as any).promptPreview

  // Build agent builder props
  const agentBuilderProps: AgentBuilderScreenProps = {
    domains: (agentBuilderData as any).domains,
    toolLibrary: (agentBuilderData as any).toolLibrary,
    savedAgentConfigs: (agentBuilderData as any).savedAgentConfigs,
    selectedDomainIds,
    formValues,
    enabledTools,
    emptyFieldsForRuntime,
    attachedFlows,
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
    onToggleSlashCommand: handleToggleSlashCommand,
    onEditSlashCommand: handleEditSlashCommand,
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
        onWorkspaceChange={setCurrentWorkspace}
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
              to="/shell"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors text-violet-700 dark:text-violet-300"
              title="Go to Shell"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m0 0l3-3 3m-3 3V9" />
              </svg>
              <span className="text-sm font-medium">Go to Shell</span>
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
                  Prompt Library Studio
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage domains and agents for your prompt library.
                </p>
              </div>

              {/* Domains Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-emerald-500" />
                    Domains
                  </h3>
                  <button
                    onClick={handleCreateDomain}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    + Create Domain
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => (
                    <Link
                      key={domain.id}
                      to={`/studio/domain/${domain.id}`}
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
                    const slashCommand = agent.attachedFlows?.find((f) => f.slashCommand?.enabled)
                    return (
                      <Link
                        key={agent.id}
                        to={`/studio/agent/${agent.id}`}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-lg transition-all bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            {slashCommand && (
                              <span className="px-2 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-full">
                                /{slashCommand.slashCommand?.name}
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
                          <span>{agent.selectedDomains.length} domains</span>
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
