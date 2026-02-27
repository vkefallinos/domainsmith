import data from '@/../product/sections/agent-builder/data.json'
import flowBuilderData from '@/../product/sections/flow-builder/data.json'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AgentFormBuilder } from './components/AgentFormBuilder'
import { SavedAgentsList } from './components/SavedAgentsList'
import { ToolLibraryModal } from './components/ToolLibraryModal'
import { FlowBuilderModal } from './components/FlowBuilderModal'
import { FlowEditorModal } from './components/FlowEditorModal'
import type { FormFieldValue, AttachedFlow } from '@/../product/sections/agent-builder/types'
import type { Flow, Task } from '@/../product/sections/flow-builder/types'

/**
 * Preview wrapper for Agent Builder view
 *
 * This is a DESIGN ONLY component for visualization in Design OS.
 * It imports sample data and feeds it to the props-based component.
 *
 * For production use, import AgentFormBuilder directly from components/
 * and pass your own data via props.
 */
export default function AgentBuilderPreview() {
  const navigate = useNavigate()
  const [view, setView] = useState<'builder' | 'agents'>('builder')

  // Initial state with sample data - using the first saved agent config
  const firstAgent = data.savedAgentConfigs[0]
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>(firstAgent.selectedDomains)
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>(firstAgent.formValues)
  const [mainInstruction, setMainInstruction] = useState<string>(firstAgent.mainInstruction || '')
  const [enabledTools, setEnabledTools] = useState(data.savedAgentConfigs[0].enabledTools || [])
  const [emptyFieldsForRuntime, setEmptyFieldsForRuntime] = useState<string[]>(firstAgent.emptyFieldsForRuntime || [])
  const [toolLibraryOpen, setToolLibraryOpen] = useState(false)
  const [flowBuilderOpen, setFlowBuilderOpen] = useState(false)
  const [flowEditorOpen, setFlowEditorOpen] = useState(false)
  const [currentEditingFlow, setCurrentEditingFlow] = useState<Flow | null>(null)
  const [currentEditingTasks, setCurrentEditingTasks] = useState<Task[]>([])

  // Sample attached flows for demo - use from first agent if available
  const [attachedFlows, setAttachedFlows] = useState<AttachedFlow[]>(firstAgent.attachedFlows || [])

  // Available flows for attaching
  const availableFlows = [

  ]

  // Domain handlers
  const handleDomainsChange = useCallback((domainIds: string[]) => {
    setSelectedDomainIds(domainIds)
    setEmptyFieldsForRuntime([])
  }, [])

  // Field handlers
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

  // Tool handlers
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

  // Agent actions
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
    setView('agents')
  }, [])

  const handleLoadAgent = useCallback((agentId: string) => {
    console.log('Load agent:', agentId)
    const agent = data.savedAgentConfigs.find(a => a.id === agentId)
    if (agent) {
      setSelectedDomainIds(agent.selectedDomains)
      setFormValues(agent.formValues)
      setMainInstruction(agent.mainInstruction || '')
      setEnabledTools(agent.enabledTools)
      setEmptyFieldsForRuntime(agent.emptyFieldsForRuntime)
      setView('builder')
    }
  }, [])

  const handleDeleteAgent = useCallback((agentId: string) => {
    console.log('Delete agent:', agentId)
  }, [])

  const handleDuplicateAgent = useCallback((agentId: string) => {
    console.log('Duplicate agent:', agentId)
  }, [])

  // Flow handlers
  const handleOpenFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(true)
  }, [])

  const handleCloseFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(false)
  }, [])

  const handleAttachFlow = useCallback(
    (flowId: string, commandId: string, name: string, description: string) => {
      const flow = availableFlows.find(f => f.id === flowId)
      if (!flow) return

      const newAttachedFlow: AttachedFlow = {
        flowId,
        flowName: flow.name,
        flowDescription: flow.description,
        taskCount: flow.taskCount,
        slashCommand: {
          id: `sc_${Date.now()}`,
          commandId,
          name,
          description,
          flowId,
          flowName: flow.name,
          enabled: true,
        },
      }

      setAttachedFlows(prev => [...prev, newAttachedFlow])
      console.log('Attach flow:', flowId, 'as command:', commandId)
    },
    [availableFlows]
  )

  const handleDetachFlow = useCallback((slashCommandId: string) => {
    setAttachedFlows(prev => prev.filter(af => af.slashCommand.id !== slashCommandId))
    console.log('Detach flow with command:', slashCommandId)
  }, [])

  const handleToggleSlashCommand = useCallback((slashCommandId: string, enabled: boolean) => {
    setAttachedFlows(prev =>
      prev.map(af => {
        if (af.slashCommand.id === slashCommandId) {
          return { ...af, slashCommand: { ...af.slashCommand, enabled } }
        }
        return af
      })
    )
    console.log('Toggle command:', slashCommandId, 'enabled:', enabled)
  }, [])

  // Find the attached flow by slash command ID
  const handleEditSlashCommand = useCallback(
    (slashCommandId: string) => {
      const attachedFlow = attachedFlows.find(af => af.slashCommand.id === slashCommandId)
      if (!attachedFlow) return

      // Get the full flow data from flow builder data
      const fullFlow = flowBuilderData.flows.find(f => f.id === attachedFlow.flowId)
      if (!fullFlow) return

      // Get the tasks for this flow
      const flowTasks = flowBuilderData.tasks.filter((t: Task) => t.flowId === attachedFlow.flowId)

      setCurrentEditingFlow(fullFlow)
      setCurrentEditingTasks(flowTasks)
      setFlowEditorOpen(true)

      // Navigate to a route based on the command name
      navigate(`/agent-builder/flow/${attachedFlow.slashCommand.commandId}`)

      console.log('Edit flow:', attachedFlow.flowName, 'with', flowTasks.length, 'tasks')
    },
    [attachedFlows, navigate]
  )

  // Flow editor handlers
  const handleCloseFlowEditor = useCallback(() => {
    setFlowEditorOpen(false)
    setCurrentEditingFlow(null)
    setCurrentEditingTasks([])
    // Navigate back to agent builder
    navigate('/agent-builder')
  }, [navigate])

  const handleUpdateFlow = useCallback((updates: Partial<Flow>) => {
    if (!currentEditingFlow) return
    setCurrentEditingFlow(prev => prev ? { ...prev, ...updates } : null)
    console.log('Update flow:', currentEditingFlow.id, updates)
  }, [currentEditingFlow])

  const handleAddTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
    }
    setCurrentEditingTasks(prev => [...prev, newTask])
    console.log('Add task to flow:', currentEditingFlow?.id)
  }, [currentEditingFlow])

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setCurrentEditingTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    )
    console.log('Update task:', taskId)
  }, [])

  const handleDeleteTask = useCallback((taskId: string) => {
    setCurrentEditingTasks(prev => prev.filter(t => t.id !== taskId))
    console.log('Delete task:', taskId)
  }, [])

  const handleDuplicateTask = useCallback((taskId: string) => {
    setCurrentEditingTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task) return prev
      const newTask: Task = {
        ...task,
        id: `task_${Date.now()}`,
        name: `${task.name} (copy)`,
        order: prev.length + 1,
      }
      return [...prev, newTask]
    })
    console.log('Duplicate task:', taskId)
  }, [])

  const handleReorderTasks = useCallback((taskIds: string[]) => {
    setCurrentEditingTasks(prev => {
      const taskMap = new Map(prev.map(t => [t.id, t]))
      return taskIds.map((id, index) => {
        const task = taskMap.get(id)
        return task ? { ...task, order: index + 1 } : prev[index]
      })
    })
    console.log('Reorder tasks:', taskIds)
  }, [])

  const promptPreview = data.promptPreview

  const builderProps = {
    domains: data.domains,
    toolLibrary: data.toolLibrary,
    savedAgentConfigs: data.savedAgentConfigs,
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
    loadedAgentId: 'preview-agent',
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

  const agentsProps = {
    domains: data.domains,
    toolLibrary: data.toolLibrary,
    savedAgentConfigs: data.savedAgentConfigs,
    onLoadAgent: handleLoadAgent,
    onDuplicateAgent: handleDuplicateAgent,
    onDeleteAgent: handleDeleteAgent,
    onNewAgent: handleNewAgent,
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* View Toggle */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-1 px-4">
          <button
            onClick={() => setView('builder')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === 'builder'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Agent Builder
          </button>
          <button
            onClick={() => setView('agents')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === 'agents'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Saved Agents ({data.savedAgentConfigs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'builder' ? (
          <AgentFormBuilder {...builderProps} />
        ) : (
          <SavedAgentsList {...agentsProps} />
        )}
      </div>

      {/* Tool Library Modal */}
      <ToolLibraryModal
        toolLibrary={data.toolLibrary}
        enabledTools={enabledTools}
        isOpen={toolLibraryOpen}
        onClose={handleCloseToolLibrary}
        onAddTool={handleAddTool}
        onRemoveTool={handleRemoveTool}
        onConfigureTool={handleConfigureTool}
      />

      {/* Flow Builder Modal */}
      <FlowBuilderModal
        isOpen={flowBuilderOpen}
        onClose={handleCloseFlowBuilder}
        agentId="preview-agent"
        availableFlows={availableFlows}
        onAttachFlow={handleAttachFlow}
        onCreateNewFlow={() => console.log('Create new flow')}
      />

      {/* Flow Editor Modal */}
      {currentEditingFlow && (
        <FlowEditorModal
          isOpen={flowEditorOpen}
          onClose={handleCloseFlowEditor}
          flow={currentEditingFlow}
          tasks={currentEditingTasks}
          onUpdateFlow={handleUpdateFlow}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onDuplicateTask={handleDuplicateTask}
          onReorderTasks={handleReorderTasks}
        />
      )}
    </div>
  )
}
