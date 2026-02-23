import { useState } from 'react'
import type { Task, TaskType, TaskConfig, JSONSchema, TransformationRule } from '@/../product/sections/flow-builder/types'

interface TaskConfigPanelProps {
  task: Task | null
  availableTools: Array<{ id: string; name: string; description: string }>
  isOpen: boolean
  onClose: () => void
  onSave: (config: TaskConfig) => void
}

const TASK_TYPES: { type: TaskType; label: string; description: string }[] = [
  { type: 'schema-output', label: 'Schema Output', description: 'Define structured output with JSON Schema' },
  { type: 'tool-calling', label: 'Tool Calling', description: 'Invoke a tool from the Tool Library' },
  { type: 'data-transformation', label: 'Data Transformation', description: 'Transform and map data between tasks' },
  { type: 'llm-prompt', label: 'LLM Prompt', description: 'Generate text using a language model' },
]

export function TaskConfigPanel({ task, availableTools, isOpen, onClose, onSave }: TaskConfigPanelProps) {
  const [selectedType, setSelectedType] = useState<TaskType>(task?.type || 'schema-output')
  const [taskName, setTaskName] = useState(task?.name || '')
  const [taskDescription, setTaskDescription] = useState(task?.description || '')

  if (!isOpen) return null

  const isEditMode = task !== null

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
              <div className="grid grid-cols-2 gap-3">
                {TASK_TYPES.map(({ type, label, description }) => (
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
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</div>
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

          {/* Type-specific configuration */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            {selectedType === 'schema-output' && <SchemaOutputForm initialConfig={task?.config} />}
            {selectedType === 'tool-calling' && <ToolCallingForm initialConfig={task?.config} availableTools={availableTools} />}
            {selectedType === 'data-transformation' && <DataTransformationForm initialConfig={task?.config} />}
            {selectedType === 'llm-prompt' && <LLMPromptForm initialConfig={task?.config} />}
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
            onClick={() => {
              // In a real implementation, this would build the config from form state
              onSave({} as TaskConfig)
            }}
            className="px-5 py-2.5 rounded-lg font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25"
          >
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SchemaOutputForm({ initialConfig }: { initialConfig?: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Output Schema</h3>
      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
        <textarea
          defaultValue={initialConfig ? JSON.stringify((initialConfig as any).outputSchema, null, 2) : '{\n  "type": "object",\n  "properties": {\n    "output": { "type": "string" }\n  }\n}'}
          rows={8}
          className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
          placeholder="Define JSON Schema for output..."
        />
      </div>
      <p className="text-xs text-slate-500">
        Define the structure of data this task will output using JSON Schema format.
      </p>
    </div>
  )
}

function ToolCallingForm({ initialConfig, availableTools }: { initialConfig?: any; availableTools: Array<{ id: string; name: string; description: string }> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tool Selection</h3>
      <select
        defaultValue={initialConfig?.toolId || ''}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">Select a tool...</option>
        {availableTools.map((tool) => (
          <option key={tool.id} value={tool.id}>
            {tool.name}
          </option>
        ))}
      </select>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pt-2">Parameters</h3>
      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
        <textarea
          defaultValue={initialConfig ? JSON.stringify((initialConfig as any).parameters, null, 2) : '{\n  "parameter": "value"\n}'}
          rows={6}
          className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
          placeholder="Define tool parameters as JSON..."
        />
      </div>
    </div>
  )
}

function DataTransformationForm({ initialConfig }: { initialConfig?: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transformation Rules</h3>
      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
        <textarea
          defaultValue={initialConfig ? JSON.stringify((initialConfig as any).transformationRules, null, 2) : '[\n  {\n    "outputField": "result",\n    "transform": "expression",\n    "expression": "input * 2"\n  }\n]'}
          rows={8}
          className="w-full font-mono text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
          placeholder="Define transformation rules as JSON array..."
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">mapping</span>
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">bucket</span>
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">expression</span>
      </div>
    </div>
  )
}

function LLMPromptForm({ initialConfig }: { initialConfig?: any }) {
  const config = initialConfig || { model: 'claude-3-5-sonnet', temperature: 0.7 }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prompt Template</h3>
      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
        <textarea
          defaultValue={config?.promptTemplate || ''}
          rows={6}
          className="w-full text-sm bg-transparent text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
          placeholder="Enter your prompt template... Use {{variable}} for dynamic values."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Model
          </label>
          <select
            defaultValue={config?.model || 'claude-3-5-sonnet'}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Temperature: {config?.temperature || 0.7}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue={config?.temperature || 0.7}
            className="w-full mt-3 accent-violet-500"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>
      </div>
    </div>
  )
}
