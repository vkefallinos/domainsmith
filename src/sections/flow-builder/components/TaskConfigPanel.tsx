import { useState } from 'react'
import type { Task, TaskType, TaskConfig } from '@/../product/sections/flow-builder/types'

interface TaskConfigPanelProps {
  task: Task | null
  availableTools: Array<{ id: string; name: string; description: string }>
  isOpen: boolean
  onClose: () => void
  onSave: (config: TaskConfig) => void
}

const TASK_TYPES: { type: TaskType; label: string; description: string; passesData: boolean }[] = [
  {
    type: 'updateFlowOutput',
    label: 'Update Flow Output',
    description: 'Update flow output and pass structured data to the next task',
    passesData: true
  },
  {
    type: 'executeTask',
    label: 'Execute Task',
    description: 'Execute operations without passing data to the next task',
    passesData: false
  },
]

export function TaskConfigPanel({ task, availableTools, isOpen, onClose, onSave }: TaskConfigPanelProps) {
  const [selectedType, setSelectedType] = useState<TaskType>(task?.type || 'updateFlowOutput')
  const [taskName, setTaskName] = useState(task?.name || '')
  const [taskDescription, setTaskDescription] = useState(task?.description || '')

  // Config states
  const [outputSchema, setOutputSchema] = useState(
    task?.config?.outputSchema ? JSON.stringify(task.config.outputSchema, null, 2) : ''
  )
  const [fieldUpdates, setFieldUpdates] = useState(
    task?.config?.fieldUpdates?.map(f => `${f.field}=${f.value}`).join('\n') || ''
  )
  const [arrayPushes, setArrayPushes] = useState(
    task?.config?.arrayPushes?.map(p => `${p.arrayField}=${JSON.stringify(p.items)}`).join('\n') || ''
  )
  const [enabledTools, setEnabledTools] = useState<string[]>(task?.config?.enabledTools || [])
  const [taskInstructions, setTaskInstructions] = useState(task?.config?.taskInstructions || '')
  const [model, setModel] = useState(task?.config?.model || 'claude-3-5-sonnet')
  const [temperature, setTemperature] = useState(task?.config?.temperature ?? 0.7)

  if (!isOpen) return null

  const isEditMode = task !== null
  const taskConfig = TASK_TYPES.find(t => t.type === selectedType)

  const handleSave = () => {
    const config: TaskConfig = {}

    if (outputSchema.trim()) {
      try {
        config.outputSchema = JSON.parse(outputSchema)
      } catch (e) {
        // Invalid JSON - in real app would show error
      }
    }

    if (fieldUpdates.trim()) {
      config.fieldUpdates = fieldUpdates.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [field, ...valueParts] = line.split('=')
          return { field: field.trim(), value: valueParts.join('=').trim() }
        })
    }

    if (arrayPushes.trim()) {
      config.arrayPushes = arrayPushes.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [field, ...valueParts] = line.split('=')
          const valueStr = valueParts.join('=')
          try {
            return { arrayField: field.trim(), items: JSON.parse(valueStr) }
          } catch {
            return { arrayField: field.trim(), items: valueStr.trim() }
          }
        })
    }

    if (enabledTools.length > 0) {
      config.enabledTools = enabledTools
    }

    if (taskInstructions.trim()) {
      config.taskInstructions = taskInstructions.trim()
    }

    config.model = model
    config.temperature = temperature

    onSave(config)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Edit Task' : 'Add Task'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure task settings and behavior
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Task Type Selector */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Task Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {TASK_TYPES.map(({ type, label, description, passesData }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${selectedType === type
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 ring-2 ring-violet-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</div>
                      </div>
                      {passesData && (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M7 7h10v10" />
                          </svg>
                          Passes Data
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g., Extract Customer Data"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Briefly describe what this task does..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Task Configuration */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-6">
            {/* Output Schema */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Output Schema {selectedType === 'updateFlowOutput' && (
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs ml-1">(Passed to next task)</span>
                )}
              </label>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                <textarea
                  value={outputSchema}
                  onChange={(e) => setOutputSchema(e.target.value)}
                  rows={6}
                  className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                  placeholder='{\n  "type": "object",\n  "properties": {\n    "output": { "type": "string" }\n  }\n}'
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Define JSON Schema for structured output (optional)
              </p>
            </div>

            {/* Field Updates */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Field Updates
              </label>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                <textarea
                  value={fieldUpdates}
                  onChange={(e) => setFieldUpdates(e.target.value)}
                  rows={3}
                  className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                  placeholder="fieldName=value&#10;anotherField={{dynamicValue}}"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Add or update fields in flow output (one per line: field=value)
              </p>
            </div>

            {/* Array Pushes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Array Pushes
              </label>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                <textarea
                  value={arrayPushes}
                  onChange={(e) => setArrayPushes(e.target.value)}
                  rows={3}
                  className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                  placeholder='arrayField=["item1", "item2"]&#10;anotherArray=singleValue'
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Push items to array fields (one per line: field=items)
              </p>
            </div>

            {/* Enabled Tools */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enabled Tools
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setEnabledTools(prev =>
                        prev.includes(tool.id)
                          ? prev.filter(id => id !== tool.id)
                          : [...prev, tool.id]
                      )
                    }}
                    className={`
                      p-3 rounded-lg text-left text-sm transition-all
                      ${enabledTools.includes(tool.id)
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{tool.name}</div>
                    <div className="text-xs text-slate-500 truncate">{tool.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Instructions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Task Instructions
              </label>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                <textarea
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                  placeholder="Describe what this task should do..."
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Natural language instructions for task execution
              </p>
            </div>

            {/* Model Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full mt-3 accent-violet-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25"
          >
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
