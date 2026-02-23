import type { Agent, RuntimePanelProps } from '@/../product/sections/agent-runtime/types'

// Runtime field input component
interface RuntimeFieldInputProps {
  field: Agent['runtimeFields'][number]
  value: string | string[] | boolean
  onChange: (value: string | string[] | boolean) => void
}

function RuntimeFieldInput({ field, value, onChange }: RuntimeFieldInputProps) {
  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all"
          />
        )

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all resize-none"
          />
        )

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm text-slate-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all"
          >
            <option value="">Select {field.label.toLowerCase()}...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        return (
          <MultiSelectInput
            options={field.options || []}
            value={value as string[]}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        )

      case 'toggle':
        return (
          <button
            type="button"
            onClick={() => onChange(!(value as boolean))}
            className={`
              relative w-11 h-6 rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
              ${value ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                transition-transform duration-200
                ${value ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        )
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {field.label}
        </label>
        {field.domain && (
          <span className="text-xs px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/50
            text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
            {field.domain}
          </span>
        )}
      </div>
      {renderInput()}
    </div>
  )
}

// Multi-select input component
interface MultiSelectInputProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function MultiSelectInput({ options, value, onChange, placeholder }: MultiSelectInputProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((selected) => (
          <span
            key={selected}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md
              bg-violet-100 dark:bg-violet-900/50
              text-violet-700 dark:text-violet-300
              text-sm border border-violet-200 dark:border-violet-800"
          >
            {selected}
            <button
              type="button"
              onClick={() => toggleOption(selected)}
              className="hover:text-violet-900 dark:hover:text-violet-100"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <select
        value=""
        onChange={(e) => e.target.value && toggleOption(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900
          text-sm text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-all"
      >
        <option value="">{placeholder || 'Add option...'}</option>
        {options
          .filter((opt) => !value.includes(opt))
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  )
}

// Enabled tool item component
interface EnabledToolItemProps {
  tool: Agent['enabledTools'][number]
}

function EnabledToolItem({ tool }: EnabledToolItemProps) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50
      border border-slate-200 dark:border-slate-700
      hover:border-slate-300 dark:hover:border-slate-600
      transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-xl flex-shrink-0">{tool.icon}</span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {tool.name}
            </h4>
            {tool.installed ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
                bg-emerald-100 dark:bg-emerald-900/50
                text-emerald-700 dark:text-emerald-400
                text-[10px] font-medium border border-emerald-200 dark:border-emerald-800">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Installed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
                bg-amber-100 dark:bg-amber-900/50
                text-amber-700 dark:text-amber-400
                text-[10px] font-medium border border-amber-200 dark:border-amber-800">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Not Installed
              </span>
            )}
          </div>

          {/* Package info */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {tool.package}@{tool.version}
          </p>

          {/* Source */}
          <div className="mt-2">
            {tool.source === 'field' && tool.sourceField ? (
              <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Enabled by field: {tool.sourceField}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Manually added</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Runtime Panel component
export function RuntimePanel({
  agent,
  runtimeFieldValues = {},
  isToolsExpanded = true,
  onRuntimeFieldChange
}: RuntimePanelProps) {
  // Group tools by source
  const fieldTools = agent.enabledTools.filter((t) => t.source === 'field')
  const manualTools = agent.enabledTools.filter((t) => t.source === 'manual')

  // Handle field value change
  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    onRuntimeFieldChange?.(fieldId, value)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Agent Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
          {agent.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Runtime Fields Section */}
        {agent.runtimeFields.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Runtime Fields
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {agent.runtimeFields.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              {agent.runtimeFields.map((field) => (
                <RuntimeFieldInput
                  key={field.id}
                  field={field}
                  value={runtimeFieldValues[field.id] ?? field.value}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tools Section */}
        {agent.enabledTools.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Enabled Tools
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {agent.enabledTools.length}
              </span>
            </div>

            {isToolsExpanded && (
              <div className="space-y-2">
                {/* Field-enabled tools */}
                {fieldTools.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                      Auto-enabled from fields
                    </p>
                    <div className="space-y-2">
                      {fieldTools.map((tool) => (
                        <EnabledToolItem key={tool.toolId} tool={tool} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Manually added tools */}
                {manualTools.length > 0 && (
                  <div className={fieldTools.length > 0 ? 'mt-4' : ''}>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                      Manually added
                    </p>
                    <div className="space-y-2">
                      {manualTools.map((tool) => (
                        <EnabledToolItem key={tool.toolId} tool={tool} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* No fields or tools */}
        {agent.runtimeFields.length === 0 && agent.enabledTools.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This agent has no runtime configuration. Ready to chat!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
