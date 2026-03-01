import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { StudioShell } from './components'
import { useWorkspaceData } from '@/lib/workspaceDataContext'
import { FlowEditorModal } from '@/sections/agent-builder/components/FlowEditorModal'
import { useAgents, useFlows } from '@/lib/workspaceContext'
import type {
  PromptFragment,
  NewFileForm,
} from '@/../product/sections/prompt-library/types'
import type { Flow, Task } from '@/../product/sections/flow-builder/types'
import type { AttachedFlow } from '@/../product/sections/agent-builder/types'

type StudioState = {
  sidebarCollapsed: boolean
}

const STORAGE_KEY = 'studio-layout-state'

const DEFAULT_STATE: StudioState = {
  sidebarCollapsed: false,
}

function loadState(): StudioState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE
}

function saveState(state: StudioState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

export default function StudioLayout() {
  const { agentId, actionId, workspaceName } = useParams()
  const [state, setState] = useState<StudioState>(loadState)
  const { setCurrentWorkspace } = useWorkspaceData()

  // Sync URL workspace param into the data context
  useEffect(() => {
    if (workspaceName) {
      setCurrentWorkspace(workspaceName)
    }
  }, [workspaceName, setCurrentWorkspace])

  // Use the new state hooks
  const { agents: agentsMap } = useAgents()
  const { flows: flowsMap } = useFlows()

  // Flow editor state
  const [currentEditingFlow, setCurrentEditingFlow] = useState<Flow | null>(null)
  const [currentEditingTasks, setCurrentEditingTasks] = useState<Task[]>([])

  // Get attached flows from agent data (memoized to prevent infinite loop)
  const attachedFlows = useMemo(() => {
    const agent = agentsMap[agentId || '']
    if (!agent?.slashActions) return []

    return agent.slashActions.map(sa => ({
      flowId: sa.flowId,
      flowName: sa.name,
      flowDescription: sa.description,
      slashAction: {
        id: `sa_${sa.actionId}`,
        actionId: sa.actionId,
        name: sa.name,
        description: sa.description,
        enabled: true,
      },
    })) as AttachedFlow[]
  }, [agentsMap, agentId])

  // Handle URL parameter for flow editing
  useEffect(() => {
    if (!actionId) {
      setCurrentEditingFlow(null)
      setCurrentEditingTasks([])
      return
    }

    // Find the attached flow with this action ID
    const attachedFlow = attachedFlows.find(af => af.slashAction?.actionId === actionId)
    if (!attachedFlow) {
      setCurrentEditingFlow(null)
      setCurrentEditingTasks([])
      return
    }

    // Get the flow ID and source flow data first (needed for fullFlow construction)
    const flowId = attachedFlow.flowId
    const sourceFlow = flowId ? flowsMap[flowId] : null

    // Build the Flow object for the UI editor
    const fullFlow: Flow = {
      id: attachedFlow.flowId,
      name: attachedFlow.flowName,
      description: attachedFlow.flowDescription ?? '',
      agentId: agentId || '',
      status: 'active',
      scope: (sourceFlow?.frontmatter?.scope as Flow['scope']) ?? 'agent-specific',
      tags: [],
      taskCount: 0,
      lastRunAt: (sourceFlow?.frontmatter?.lastRunAt as string) ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const flowTasks: Task[] = (sourceFlow?.tasks ?? []).map(ft => ({
      id: `task_${ft.order}_${flowId}`,
      flowId: flowId,
      type: (ft.frontmatter?.type as Task['type']) ?? 'updateFlowOutput',
      order: ft.order,
      name: ft.name,
      description: ft.frontmatter?.description ?? '',
      config: {
        taskInstructions: ft.instructions,
        outputSchema: ft.outputSchema as import('@/../product/sections/flow-builder/types').JSONSchema | undefined,
        targetFieldName: ft.targetFieldName,
        model: ft.frontmatter?.model as string | undefined,
        temperature: ft.frontmatter?.temperature as number | undefined,
      },
      status: 'valid' as const,
    }))

    setCurrentEditingFlow(fullFlow)
    setCurrentEditingTasks(flowTasks)
  }, [actionId, attachedFlows, flowsMap, agentId])

  const handleCloseFlowEditor = useCallback(() => {
    setCurrentEditingFlow(null)
    setCurrentEditingTasks([])
    // Note: Navigation is handled by the router when URL changes
    window.history.back()
  }, [])

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

  // Persist state changes
  useEffect(() => {
    saveState(state)
  }, [state])

  // Prompt Library callbacks
  const handleSelectFile = useCallback((file: PromptFragment) => {
    console.log('Select file:', file.id)
  }, [])

  const handleToggleFolder = useCallback((path: string) => {
    console.log('Toggle folder:', path)
  }, [])

  const handleExpandAll = useCallback(() => {
    console.log('Expand all folders')
  }, [])

  const handleCollapseAll = useCallback(() => {
    console.log('Collapse all folders')
  }, [])

  const handleEditContent = useCallback((content: string) => {
    console.log('Edit content, length:', content.length)
  }, [])

  const handleSave = useCallback(() => {
    console.log('Save changes')
  }, [])

  const handleCreateFile = useCallback((form: NewFileForm) => {
    console.log('Create file:', form.filename, 'in', form.parentPath)
  }, [])

  const handleCreateFolder = useCallback((form: NewFileForm) => {
    console.log('Create folder:', form.filename, 'in', form.parentPath)
  }, [])

  const handleRename = useCallback((nodeId: string, newName: string) => {
    console.log('Rename node:', nodeId, 'to', newName)
  }, [])

  const handleMove = useCallback((nodeId: string, newParentPath: string) => {
    console.log('Move node:', nodeId, 'to', newParentPath)
  }, [])

  const handleDelete = useCallback((nodeId: string) => {
    console.log('Delete node:', nodeId)
  }, [])

  const handleDuplicate = useCallback((nodeId: string) => {
    console.log('Duplicate node:', nodeId)
  }, [])

  return (
    <>
      <StudioShell
        defaultSidebarCollapsed={state.sidebarCollapsed}
        onSidebarCollapsedChange={(collapsed) =>
          setState((prev) =>
            prev.sidebarCollapsed === collapsed
              ? prev
              : { ...prev, sidebarCollapsed: collapsed }
          )
        }
        onOpenSettings={() => console.log('Open settings')}
        onCreateDomain={() => console.log('Create domain')}
        onEditDomain={(id) => console.log('Edit domain:', id)}
        onDeleteDomain={(id) => console.log('Delete domain:', id)}
        onCreateAgent={() => console.log('Create agent')}
        onEditAgent={(id) => console.log('Edit agent:', id)}
        onDeleteAgent={(id) => console.log('Delete agent:', id)}
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
        user={{ name: 'Alex Morgan' }}
      />

      {/* Flow Editor Modal */}
      {currentEditingFlow && (
        <FlowEditorModal
          isOpen={!!currentEditingFlow}
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
    </>
  )
}
