import data from '@/../product/sections/flow-builder/data.json'
import type { Flow, Task } from '@/../product/sections/flow-builder/types'
import { FlowDetailEditor } from './components'

// shell a flow with its tasks for preview
const previewFlow: Flow = data.flows[0] // Customer Onboarding Analysis
const previewTasks: Task[] = data.tasks.filter((t: Task) => t.flowId === previewFlow.id)

export default function FlowDetailPreview() {
  const handleUpdateFlow = (updates: Partial<Flow>) => {
    console.log('Update flow:', previewFlow.id, updates)
  }

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    console.log('Add task to flow:', previewFlow.id, task)
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    console.log('Update task:', taskId, updates)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId)
  }

  const handleDuplicateTask = (taskId: string) => {
    console.log('Duplicate task:', taskId)
  }

  const handleReorderTasks = (taskIds: string[]) => {
    console.log('Reorder tasks:', taskIds)
  }

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
