'use client'

import { useState } from 'react'
import { Wrench, Search, X, ChevronDown, ChevronUp, Eye, Lock, Settings } from 'lucide-react'
import type {
  Tool,
  ToolConfiguration,
  InheritedTool,
  ToolParameter,
  ToolSidebarState,
} from '@/../product/sections/prompt-library/types'

interface ToolSidebarProps {
  isOpen: boolean
  availableTools: Tool[]
  inheritedTools?: InheritedTool[]
  configuredTools?: ToolConfiguration[]
  state: ToolSidebarState
  selectedNodePath?: string
  selectedNodeType?: 'file' | 'directory'
  onClose: () => void
  onSearchChange: (query: string) => void
  onToggleTool: (toolId: string, enabled: boolean) => void
  onUpdateToolParameters: (toolId: string, parameters: Record<string, string | number | boolean | string[]>) => void
}

function getToolConfig(
  toolId: string,
  configuredTools: ToolConfiguration[] | undefined,
  inheritedTools: InheritedTool[] | undefined
): { enabled: boolean; configured: boolean; inherited: boolean; parameters?: Record<string, string | number | boolean | string[]> } {
  const explicitConfig = configuredTools?.find(t => t.toolId === toolId)
  const inheritedConfig = inheritedTools?.find(t => t.toolId === toolId)

  return {
    enabled: explicitConfig?.enabled ?? false,
    configured: explicitConfig !== undefined,
    inherited: inheritedConfig !== undefined,
    parameters: explicitConfig?.parameters || inheritedConfig?.parameters,
  }
}

// Parameter Input Component
interface ParameterInputProps {
  parameter: ToolParameter
  value: string | number | boolean | string[] | undefined
  onChange: (value: string | number | boolean | string[]) => void
  inheritedValue?: string | number | boolean | string[]
}

function ParameterInput({ parameter, value, onChange, inheritedValue }: ParameterInputProps) {
  const [showSecret, setShowSecret] = useState(!parameter.secret)

  const renderInput = () => {
    switch (parameter.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={value as boolean ?? parameter.default as boolean ?? false}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-all cursor-pointer" />
              <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {value as boolean ?? parameter.default as boolean ?? false ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value as number ?? parameter.default ?? ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white"
            placeholder={parameter.default?.toString()}
          />
        )

      case 'enum':
        if (parameter.multiple) {
          const selectedValues = (value as string[]) || parameter.default || []
          const options = parameter.options || []

          return (
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option]
                          : selectedValues.filter((v) => v !== option)
                        onChange(newValues)
                      }}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-all cursor-pointer" />
                    <svg className="absolute top-0 left-0 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )
        }

        return (
          <select
            value={(value as string) || parameter.default || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white"
          >
            {parameter.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      default: // string
        return (
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={(value as string) || parameter.default || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`
                w-full px-3 py-2 pr-10 text-sm
                bg-slate-50 dark:bg-slate-900
                border ${inheritedValue ? 'border-amber-300 dark:border-amber-600' : 'border-slate-300 dark:border-slate-600'}
                rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white
              `}
              placeholder={parameter.default?.toString()}
            />
            {parameter.secret && (
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showSecret ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {parameter.name}
          {parameter.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {parameter.secret && (
          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Secret
          </span>
        )}
      </div>
      {parameter.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{parameter.description}</p>
      )}
      {renderInput()}
      {inheritedValue !== undefined && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Inherited from parent directory
        </p>
      )}
    </div>
  )
}

// Tool Card Component
interface ToolCardProps {
  tool: Tool
  config: ReturnType<typeof getToolConfig>
  onToggle: (enabled: boolean) => void
  onUpdateParameters: (parameters: Record<string, string | number | boolean | string[]>) => void
}

function ToolCard({ tool, config, onToggle, onUpdateParameters }: ToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(config.enabled)

  const handleToggle = () => {
    if (!config.inherited) {
      onToggle(!config.enabled)
      if (!config.enabled) {
        setIsExpanded(true)
      }
    }
  }

  const handleParameterChange = (paramName: string, value: string | number | boolean | string[]) => {
    const currentParams = config.parameters || {}
    onUpdateParameters({ ...currentParams, [paramName]: value })
  }

  return (
    <div className={`
      rounded-xl border transition-all duration-200 overflow-hidden
      ${config.enabled
        ? 'border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20'
        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
      }
      ${config.inherited ? 'border-amber-200 dark:border-amber-800' : ''}
    `}>
      {/* Tool Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Toggle Switch */}
          {!config.inherited ? (
            <button
              onClick={handleToggle}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 mt-0.5
                ${config.enabled ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'}
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${config.enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          ) : (
            <div className="relative w-11 h-6 rounded-full bg-amber-200 dark:bg-amber-900 flex-shrink-0 mt-0.5 flex items-center justify-center">
              <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
          )}

          {/* Tool Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{tool.name}</h4>
              {config.inherited && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Inherited
                </span>
              )}
              {config.configured && (
                <span className="px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-medium">
                  Configured
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tool.description}</p>
          </div>

          {/* Expand Button */}
          {config.enabled && tool.parameters.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Parameters */}
      {config.enabled && isExpanded && tool.parameters.length > 0 && (
        <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="space-y-4">
            {tool.parameters.map((param) => {
              const inheritedValue = config.inherited
                ? config.parameters?.[param.name]
                : undefined

              return (
                <ParameterInput
                  key={param.name}
                  parameter={param}
                  value={config.parameters?.[param.name]}
                  inheritedValue={inheritedValue}
                  onChange={(value) => handleParameterChange(param.name, value)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function ToolSidebar({
  isOpen,
  availableTools,
  inheritedTools = [],
  configuredTools = [],
  state,
  selectedNodePath,
  selectedNodeType,
  onClose,
  onSearchChange,
  onToggleTool,
  onUpdateToolParameters,
}: ToolSidebarProps) {
  const [localSearch, setLocalSearch] = useState(state.searchQuery)

  const handleSearchChange = (query: string) => {
    setLocalSearch(query)
    onSearchChange(query)
  }

  const filteredTools = availableTools.filter((tool) => {
    if (!localSearch) return true
    const search = localSearch.toLowerCase()
    return (
      tool.name.toLowerCase().includes(search) ||
      tool.description.toLowerCase().includes(search)
    )
  })

  // Count tools
  const enabledCount = configuredTools?.filter(t => t.enabled).length || 0
  const inheritedCount = inheritedTools.length || 0

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative right-0 top-0 h-full w-80
          bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800
          flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Tools</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {enabledCount} enabled, {inheritedCount} inherited
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Selected Node Info */}
          {selectedNodePath && (
            <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {selectedNodeType === 'directory' ? '📁 ' : '📄 '}
                {selectedNodePath}
              </span>
            </div>
          )}

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const config = getToolConfig(tool.id, configuredTools, inheritedTools)
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  config={config}
                  onToggle={(enabled) => onToggleTool(tool.id, enabled)}
                  onUpdateParameters={(params) => onUpdateToolParameters(tool.id, params)}
                />
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Wrench className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">No tools found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{availableTools.length} tools available</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Eye className="w-3 h-3" />
              Inherited tools locked
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
