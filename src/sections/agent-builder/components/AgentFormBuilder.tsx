import type { AgentBuilderScreenProps, Domain, SchemaField, Tool, EnabledToolMapping, AttachedFlow } from '@/../product/sections/agent-builder/types'
import type { SchemaFieldType, ToolSource, ToolConfigStatus } from '@/../product/sections/agent-builder/types'
import { SlashCommandsPanel } from './SlashCommandCard'
import { FlowBuilderModal } from './FlowBuilderModal'
import { useState } from 'react'

interface AgentFormBuilderProps extends AgentBuilderScreenProps {
  view: 'builder' | 'templates'
}

// Helper component for individual form fields
interface FormFieldProps {
  field: SchemaField
  value: unknown
  domainName: string
  error?: string
  isRuntimeEnabled: boolean // When true, field is configured at runtime (empty here)
  onChange: (value: unknown) => void
  onToggleRuntime: () => void // Toggle runtime configuration mode
}

function FormField({ field, value, error, isRuntimeEnabled, onChange, onToggleRuntime }: FormFieldProps) {
  const hasValue = value !== '' && value !== null && value !== undefined && (!Array.isArray(value) || value.length > 0)

  const baseInputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
  const errorClass = error ? "border-red-400 dark:border-red-500" : ""
  // Runtime-enabled state (dashed amber border, placeholder text, not editable)
  const runtimeClass = isRuntimeEnabled ? "border-2 border-dashed border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20" : ""

  const renderField = () => {
    if (isRuntimeEnabled) {
      // When runtime-enabled, show a placeholder/indicator instead of the actual input
      return (
        <div className={`p-3 rounded-lg ${runtimeClass} text-center`}>
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Configured at Runtime</span>
          </div>
          <p className="text-xs text-amber-500/70 dark:text-amber-400/70 mt-1">This field will be filled during agent execution</p>
        </div>
      )
    }

    // Normal editable field
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClass} ${errorClass}`}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${baseInputClass} ${errorClass} resize-y`}
          />
        )

      case 'select':
        return (
          <select
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(opt)}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : []
                    onChange(e.target.checked
                      ? [...current, opt]
                      : current.filter((v: string) => v !== opt)
                    )
                  }}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        )

      case 'toggle':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={value as boolean || false}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-violet-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        )
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${isRuntimeEnabled ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {field.label}
            {field.required && !isRuntimeEnabled && <span className="text-red-500 ml-1">*</span>}
            {isRuntimeEnabled && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Runtime
              </span>
            )}
          </label>
        </div>

        {/* Runtime toggle button - available for ALL fields */}
        <button
          onClick={onToggleRuntime}
          className={`text-xs px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            isRuntimeEnabled
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isRuntimeEnabled ? 'Configure this field now instead of at runtime' : 'Enable this field to be configured at runtime'}
        >
          {isRuntimeEnabled ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              At Runtime
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Runtime
            </>
          )}
        </button>
      </div>
      {renderField()}
      {field.enablesTools && field.enablesTools.length > 0 && !isRuntimeEnabled && hasValue && (
        <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Enables {field.enablesTools.length} tool{field.enablesTools.length > 1 ? 's' : ''}</span>
        </div>
      )}
      {error && !isRuntimeEnabled && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Helper component for enabled tool display
interface EnabledToolCardProps {
  mapping: EnabledToolMapping
  onRemove?: () => void
  onConfigure?: () => void
}

function EnabledToolCard({ mapping, onRemove, onConfigure }: EnabledToolCardProps) {
  const statusColors: Record<ToolConfigStatus, string> = {
    'installed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'needs-config': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'ready': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  }

  const sourceColors = {
    'field': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'manual': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
  }

  return (
    <div className="group p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{mapping.tool.name}</h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[mapping.status]}`}>
              {mapping.status === 'installed' ? 'Installed' : mapping.status === 'needs-config' ? 'Needs Config' : 'Ready'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">{mapping.tool.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sourceColors[mapping.source]}`}>
              {mapping.source === 'field' ? 'Auto-enabled' : 'Manually added'}
            </span>
            {mapping.sourceField && (
              <span className="text-[10px] text-slate-400">from {mapping.sourceField}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {mapping.tool.configRequired && mapping.status !== 'ready' && (
            <button
              onClick={onConfigure}
              className="p-1.5 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
              title="Configure tool"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
          {mapping.source === 'manual' && (
            <button
              onClick={onRemove}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Remove tool"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Form Builder Component
export function AgentFormBuilder(props: AgentBuilderScreenProps) {
  const {
    domains,
    toolLibrary,
    selectedDomainIds = [],
    formValues = {},
    enabledTools = [],
    enabledFields = [],
    emptyFieldsForRuntime = [],
    attachedFlows = [],
    availableFlows = [],
    promptPreview,
    validationErrors = {},
    toolLibraryOpen = false,
    flowBuilderOpen = false,
    onDomainsChange,
    onFieldValueChange,
    onEnableField,
    onDisableField,
    onEnableFieldForRuntime,
    onDisableFieldForRuntime,
    onOpenToolLibrary,
    onRemoveTool,
    onConfigureTool,
    onGeneratePreview,
    onSaveAsTemplate,
    onDeployToRuntime,
    onNewAgent,
    onOpenFlowBuilder,
    onCloseFlowBuilder,
    onAttachFlow,
    onDetachFlow,
    onToggleSlashCommand,
    onEditSlashCommand,
    loadedAgentId
  } = props

  // Tab state for the right panel
  const [activeTab, setActiveTab] = useState<'tools' | 'commands' | 'preview'>('tools')

  // Helper to check if a field is runtime-enabled (will be configured at runtime)
  const isRuntimeEnabled = (fieldId: string) => {
    return emptyFieldsForRuntime.includes(fieldId)
  }

  // Handler to toggle runtime mode for a field
  const handleToggleRuntime = (fieldId: string) => {
    if (isRuntimeEnabled(fieldId)) {
      // Disable runtime mode - field becomes editable again
      onDisableFieldForRuntime?.(fieldId)
      onDisableField?.(fieldId)
    } else {
      // Enable runtime mode - field becomes empty placeholder
      onEnableFieldForRuntime?.(fieldId)
      onEnableField?.(fieldId)
      // Clear any existing value when enabling runtime mode
      onFieldValueChange(fieldId, '')
    }
  }

  // Get selected domain objects
  const selectedDomains = domains.filter(d => selectedDomainIds.includes(d.id))

  // Build enabled tool mappings
  const enabledToolMappings: EnabledToolMapping[] = enabledTools.map(et => {
    const tool = toolLibrary.find(t => t.id === et.toolId)
    if (!tool) return null as unknown as EnabledToolMapping

    let status: ToolConfigStatus = 'installed'
    if (!tool.installed) {
      status = 'needs-config'
    } else if (tool.configRequired && !et.config) {
      status = 'needs-config'
    } else if (tool.installed) {
      status = 'ready'
    }

    return {
      tool,
      source: et.source,
      sourceField: et.sourceField,
      status
    }
  }).filter(Boolean) as EnabledToolMapping[]

  // Get all fields from selected domains
  const allFields: Array<{ field: SchemaField; domain: Domain }> = []
  selectedDomains.forEach(domain => {
    domain.schema.fields.forEach(field => {
      allFields.push({ field, domain })
    })
  })

  const groupedDomains = selectedDomains.reduce((acc, domain) => {
    if (!acc[domain.category]) acc[domain.category] = []
    acc[domain.category].push(domain)
    return acc
  }, {} as Record<string, Domain[]>)

  return (
    <div className="h-full flex">
      {/* Left Panel - Domain Selection */}
      <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 font-['Space_Grotesk']">Domains</h2>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Select expertise areas for your agent</p>
        </div>

        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {domains.map(domain => {
            const isSelected = selectedDomainIds.includes(domain.id)
            const categoryColors: Record<string, string> = {
              'Security': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              'Infrastructure': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
              'Compliance': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              'Development': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }

            return (
              <button
                key={domain.id}
                onClick={() => {
                  const newSelection = isSelected
                    ? selectedDomainIds.filter(id => id !== domain.id)
                    : [...selectedDomainIds, domain.id]
                  onDomainsChange(newSelection)
                }}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/20'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColors[domain.category] || 'bg-slate-100 text-slate-600'}`}>
                        {domain.category}
                      </span>
                    </div>
                    <h3 className={`text-sm font-semibold mt-1 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {domain.name}
                    </h3>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${isSelected ? 'text-violet-100' : 'text-slate-500 dark:text-slate-500'}`}>
                      {domain.description}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-white bg-white/20'
                      : 'border-slate-300 dark:border-slate-600 group-hover:border-violet-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Center Panel - Form Builder */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk']">Configure Agent</h1>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {selectedDomains.length > 0
                  ? `Building agent with ${selectedDomains.length} domain${selectedDomains.length > 1 ? 's' : ''}`
                  : 'Select domains to begin building your agent'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onNewAgent}
                className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                New Agent
              </button>
              <button
                onClick={() => onSaveAsTemplate('My Agent', 'Agent description')}
                className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-lg shadow-violet-200 dark:shadow-violet-900/20 font-medium"
              >
                Save as Template
              </button>
              <button
                onClick={onDeployToRuntime}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Deploy
              </button>
            </div>
          </div>

          {selectedDomains.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No domains selected</h3>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Choose expertise areas from the sidebar to get started</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Form Sections by Domain */}
              {Object.entries(groupedDomains).map(([category, domains]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    <h3 className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">{category}</h3>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                  </div>
                  {domains.map(domain => (
                    <div key={domain.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 flex items-center justify-center">
                          <span className="text-lg">{domain.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">{domain.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{domain.description}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {domain.schema.fields.map(field => {
                          const runtimeEnabled = isRuntimeEnabled(field.id)
                          return (
                            <FormField
                              key={field.id}
                              field={field}
                              value={formValues[field.id]}
                              error={validationErrors[field.id]}
                              isRuntimeEnabled={runtimeEnabled}
                              domainName={domain.name}
                              onChange={(val) => onFieldValueChange(field.id, val)}
                              onToggleRuntime={() => handleToggleRuntime(field.id)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Right Panel - Tools, Commands & Preview */}
      <aside className="w-80 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'tools'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Tools ({enabledToolMappings.length})
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'commands'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Commands ({attachedFlows?.filter(f => f.slashCommand.enabled).length || 0})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Tools Panel */}
        {activeTab === 'tools' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enabled Tools</h3>
              <button
                onClick={onOpenToolLibrary}
                className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Tools
              </button>
            </div>

            {enabledToolMappings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-500">No tools enabled yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Tools will auto-enable based on form selections</p>
              </div>
            ) : (
              <div className="space-y-2">
                {enabledToolMappings.map(mapping => (
                  <EnabledToolCard
                    key={mapping.tool.id}
                    mapping={mapping}
                    onRemove={mapping.source === 'manual' ? () => onRemoveTool(mapping.tool.id) : undefined}
                    onConfigure={() => onConfigureTool(mapping.tool.id, {})}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Commands Panel */}
        {activeTab === 'commands' && (
          <div className="flex-1 overflow-y-auto p-4">
            <SlashCommandsPanel
              attachedFlows={attachedFlows || []}
              onToggleEnabled={onToggleSlashCommand || (() => {})}
              onEditCommand={(id) => {
                // Would open edit modal for the command
                console.log('Edit command:', id)
              }}
              onDetachFlow={onDetachFlow || (() => {})}
              onAttachNewFlow={onOpenFlowBuilder || (() => {})}
            />
          </div>
        )}

        {/* Preview Panel */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">System Prompt</h3>
              <span className="text-xs text-slate-400">{promptPreview?.tokenCount || 0} tokens</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <pre className="text-xs text-slate-300 font-['JetBrains_Mono'] whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                {promptPreview?.generatedPrompt || 'Select domains and fill forms to generate prompt...'}
              </pre>
            </div>
          </div>
        )}
      </aside>

      {/* Flow Builder Modal */}
      <FlowBuilderModal
        isOpen={flowBuilderOpen || false}
        onClose={onCloseFlowBuilder || (() => {})}
        agentId={loadedAgentId || 'temp'}
        availableFlows={availableFlows || []}
        onAttachFlow={onAttachFlow || (() => {})}
        onCreateNewFlow={() => {
          // Would open the flow builder in a new context
          console.log('Create new flow')
        }}
      />
    </div>
  )
}
