import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { StudioShell } from './components'
import { FlowEditorModal } from '@/sections/agent-builder/components/FlowEditorModal'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import type {
  PromptFragment,
  NewFileForm,
} from '@/../product/sections/prompt-library/types'
import type { Flow, Task } from '@/../product/sections/flow-builder/types'
import type { AttachedFlow } from '@/../product/sections/agent-builder/types'

type AgentBuilderData = {
  savedAgentConfigs: Array<{
    id: string
    attachedFlows?: AttachedFlow[]
  }>
}

type FlowBuilderData = {
  flows: Flow[]
  tasks: Task[]
}

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
  const { agentId, commandId } = useParams()
  const [state, setState] = useState<StudioState>(loadState)

  // Load workspace data dynamically
  const { data: agentBuilderData } = useWorkspaceData<AgentBuilderData>('agent-builder')
  const { data: flowBuilderData } = useWorkspaceData<FlowBuilderData>('flow-builder')

  // Flow editor state
  const [currentEditingFlow, setCurrentEditingFlow] = useState<Flow | null>(null)
  const [currentEditingTasks, setCurrentEditingTasks] = useState<Task[]>([])

  // Get attached flows from agent builder data (memoized to prevent infinite loop)
  const attachedFlows = useMemo(() => {
    if (!agentBuilderData?.savedAgentConfigs) return []
    const agentConfig = agentBuilderData.savedAgentConfigs?.find(
      (config: { id: string }) => config.id === agentId
    )
    return (agentConfig?.attachedFlows || []) as AttachedFlow[]
  }, [agentBuilderData, agentId])

  // Handle URL parameter for flow editing
  useEffect(() => {
    if (!flowBuilderData || !commandId) {
      setCurrentEditingFlow(null)
      setCurrentEditingTasks([])
      return
    }

    // Find the attached flow with this command ID
    const attachedFlow = attachedFlows.find(af => af.slashCommand?.commandId === commandId)
    if (!attachedFlow) {
      setCurrentEditingFlow(null)
      setCurrentEditingTasks([])
      return
    }

    // Get the full flow data from flow builder data
    const fullFlow = flowBuilderData.flows?.find((f: Flow) => f.id === attachedFlow.flowId)
    if (!fullFlow) {
      setCurrentEditingFlow(null)
      setCurrentEditingTasks([])
      return
    }

    // Get the tasks for this flow
    const flowTasks = flowBuilderData.tasks?.filter((t: Task) => t.flowId === attachedFlow.flowId) || []

    setCurrentEditingFlow(fullFlow)
    setCurrentEditingTasks(flowTasks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandId, attachedFlows, flowBuilderData])

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
          setState((prev) => ({ ...prev, sidebarCollapsed: collapsed }))
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
