import { useCallback } from 'react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import type { Flow, Task } from '@/../product/sections/flow-builder/types'
import { FlowDetailEditor } from './components'

type FlowBuilderData = {
  flows: Flow[]
  tasks: Task[]
}

export default function FlowDetailPreview() {
  const { data, loading, error } = useWorkspaceData<FlowBuilderData>('flow-builder')

  const handleUpdateFlow = useCallback((updates: Partial<Flow>) => {
    console.log('Update flow:', updates)
  }, [])

  const handleAddTask = useCallback((task: Omit<Task, 'id'>) => {
    console.log('Add task to flow:', task)
  }, [])

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log('Update task:', taskId)
  }, [])

  const handleDeleteTask = useCallback((taskId: string) => {
    console.log('Delete task:', taskId)
  }, [])

  const handleDuplicateTask = useCallback((taskId: string) => {
    console.log('Duplicate task:', taskId)
  }, [])

  const handleReorderTasks = useCallback((taskIds: string[]) => {
    console.log('Reorder tasks:', taskIds)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  if (error || !data?.flows?.[0]) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading data</div>
  }

  const previewFlow: Flow = data.flows[0]
  const previewTasks: Task[] = data.tasks.filter((t: Task) => t.flowId === previewFlow.id)

  return (
    <FlowDetailEditor
      flow={previewFlow}
      tasks={previewTasks}
      onUpdateFlow={handleUpdateFlow}
      onAddTask={handleAddTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onDuplicateTask={handleDuplicateTask}
      onReorderTasks={handleReorderTasks}
      onBack={() => console.log('Navigate back to flow list')}
    />
  )
}
