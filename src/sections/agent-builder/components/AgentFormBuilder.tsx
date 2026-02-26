import type {
  AgentBuilderScreenProps,
  Domain,
  SchemaField,
  FormFieldValue,
  Tool,
  EnabledToolMapping,
  AttachedFlow,
  PromptPreview,
} from '@/../product/sections/agent-builder/types'
import type { SchemaFieldType, ToolConfigStatus } from '@/../product/sections/agent-builder/types'
import { useState, useCallback, useMemo } from 'react'
import { DomainSelector } from './DomainSelector'
import { FormField } from './FormField'
import { ToolsPanel } from './ToolsPanel'
import { CommandsPanel } from './CommandsPanel'
import { PromptPreviewPanel } from './PromptPreviewPanel'
import { SaveTemplateModal } from './SaveTemplateModal'

/**
 * AgentFormBuilder - A multi-view control panel for configuring specialized agents
 *
 * Features:
 * - Domain selection sidebar with expertise areas
 * - Auto-generated form fields grouped by domain
 * - Runtime field configuration mode
 * - Tool management with configuration status
 * - Slash command attachment for flows
 * - Live system prompt preview
 *
 * @props AgentBuilderScreenProps - All data and callbacks passed as props
 */
export function AgentFormBuilder(props: AgentBuilderScreenProps) {
  const {
    domains,
    toolLibrary,
    selectedDomainIds = [],
    formValues = {},
    enabledTools = [],
    emptyFieldsForRuntime = [],
    attachedFlows = [],
    availableFlows = [],
    promptPreview,
    validationErrors = {},
    toolLibraryOpen = false,
    flowBuilderOpen = false,
    loadedAgentId,
    onDomainsChange,
    onFieldValueChange,
    onEnableFieldForRuntime,
    onDisableFieldForRuntime,
    onOpenToolLibrary,
    onCloseToolLibrary,
    onAddTool,
    onRemoveTool,
    onConfigureTool,
    onGeneratePreview,
    onSaveAsTemplate,
    onNewAgent,
    onOpenFlowBuilder,
    onCloseFlowBuilder,
    onAttachFlow,
    onDetachFlow,
    onToggleSlashCommand,
    onEditSlashCommand,
  } = props

  // UI State
  const [activeTab, setActiveTab] = useState<'tools' | 'commands' | 'preview'>('tools')
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(selectedDomainIds))

  // Expand newly selected domains
  useState(() => {
    selectedDomainIds.forEach(id => {
      setExpandedDomains(prev => new Set([...prev, id]))
    })
  })

  // Toggle domain expansion
  const toggleDomainExpanded = useCallback((domainId: string) => {
    setExpandedDomains(prev => {
      const next = new Set(prev)
      if (next.has(domainId)) {
        next.delete(domainId)
      } else {
        next.add(domainId)
      }
      return next
    })
  }, [])

  // Get selected domain objects
  const selectedDomains = useMemo(
    () => domains.filter(d => selectedDomainIds.includes(d.id)),
    [domains, selectedDomainIds]
  )

  // Group domains by category
  const groupedDomains = useMemo(() => {
    return selectedDomains.reduce((acc, domain) => {
      if (!acc[domain.category]) acc[domain.category] = []
      acc[domain.category].push(domain)
      return acc
    }, {} as Record<string, Domain[]>)
  }, [selectedDomains])

  // Build enabled tool mappings with status
  const enabledToolMappings = useMemo(() => {
    return enabledTools
      .map(et => {
        const tool = toolLibrary.find(t => t.id === et.toolId)
        if (!tool) return null

        let status: ToolConfigStatus = 'installed'
        if (!tool.installed) {
          status = 'needs-config'
        } else if (tool.configRequired && !et.config) {
          status = 'needs-config'
        } else if (tool.installed) {
          status = 'ready'
        }

        return { tool, source: et.source, status }
      })
      .filter(Boolean) as EnabledToolMapping[]
  }, [enabledTools, toolLibrary])

  // Check if field is runtime-enabled
  const isRuntimeEnabled = useCallback(
    (fieldId: string) => emptyFieldsForRuntime.includes(fieldId),
    [emptyFieldsForRuntime]
  )

  // Handle field value change
  const handleFieldValueChange = useCallback(
    (fieldId: string, value: FormFieldValue) => {
      onFieldValueChange(fieldId, value)
      // Trigger preview regeneration with debounce (handled by parent)
    },
    [onFieldValueChange]
  )

  // Handle runtime toggle
  const handleToggleRuntime = useCallback(
    (fieldId: string) => {
      if (isRuntimeEnabled(fieldId)) {
        onDisableFieldForRuntime?.(fieldId)
      } else {
        onEnableFieldForRuntime?.(fieldId)
        onFieldValueChange(fieldId, '')
      }
    },
    [isRuntimeEnabled, onEnableFieldForRuntime, onDisableFieldForRuntime, onFieldValueChange]
  )

  // Enable all fields in a domain for runtime
  const handleEnableAllForRuntime = useCallback(
    (domain: Domain) => {
      domain.schema.fields.forEach(field => {
        if (!isRuntimeEnabled(field.id) && field.runtimeOptional !== false) {
          onEnableFieldForRuntime?.(field.id)
          onFieldValueChange(field.id, '')
        }
      })
    },
    [isRuntimeEnabled, onEnableFieldForRuntime, onFieldValueChange]
  )

  // Handle save template
  const handleSaveTemplate = useCallback(
    (name: string, description: string) => {
      onSaveAsTemplate(name, description)
      setSaveModalOpen(false)
    },
    [onSaveAsTemplate]
  )

  const hasSelection = selectedDomains.length > 0
  const totalFields = selectedDomains.reduce((sum, d) => sum + d.schema.fields.length, 0)
  const filledFields = Object.keys(formValues).filter(
    key => formValues[key] !== '' && formValues[key] !== null && formValues[key] !== undefined
  ).length
  const completionProgress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0

  return (
    <div className="h-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left Panel - Domain Selection */}
      <DomainSelector
        domains={domains}
        selectedDomainIds={selectedDomainIds}
        onDomainsChange={onDomainsChange}
      />

      {/* Center Panel - Form Builder */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Configure Agent
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {hasSelection
                    ? `Building with ${selectedDomains.length} domain${selectedDomains.length > 1 ? 's' : ''} · ${totalFields} field${totalFields > 1 ? 's' : ''}`
                    : 'Select domains to begin building your agent'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onNewAgent}
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  New Agent
                </button>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  disabled={!hasSelection}
                  className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-lg transition-all shadow-lg shadow-violet-200/50 dark:shadow-violet-900/20 disabled:shadow-none flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Template
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {hasSelection && (
              <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Empty State */}
          {!hasSelection && (
            <div className="text-center py-20">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 animate-pulse" />
                <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-800/50 dark:to-violet-900/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                No domains selected
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Choose expertise areas from the sidebar to configure your agent's capabilities
              </p>
            </div>
          )}

          {/* Form Sections by Domain Category */}
          {hasSelection &&
            Object.entries(groupedDomains).map(([category, domains], categoryIdx) => (
              <div key={category} className="mb-10" style={{ animationDelay: `${categoryIdx * 50}ms` }}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-1" />
                  <h3 className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                    {category}
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-1" />
                </div>

                {/* Domain Cards */}
                <div className="space-y-4">
                  {domains.map(domain => (
                    <div
                      key={domain.id}
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-100/20 dark:hover:shadow-violet-900/10"
                    >
                      {/* Domain Header */}
                      <button
                        onClick={() => toggleDomainExpanded(domain.id)}
                        className="w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 flex items-center justify-center text-xl flex-shrink-0">
                          {domain.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                            {domain.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {domain.description}
                          </p>
                        </div>
                        {expandedDomains.has(domain.id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEnableAllForRuntime(domain)
                            }}
                            className="mr-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1.5"
                            title="Enable all fields in this domain for runtime configuration"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            All Runtime
                          </button>
                        )}
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                            expandedDomains.has(domain.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Domain Fields */}
                      {expandedDomains.has(domain.id) && (
                        <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800">
                          <div className="pt-5 space-y-5">
                            {domain.schema.fields.map(field => (
                              <FormField
                                key={field.id}
                                field={field}
                                value={formValues[field.id]}
                                error={validationErrors[field.id]}
                                isRuntimeEnabled={isRuntimeEnabled(field.id)}
                                domainName={domain.name}
                                onChange={(val) => handleFieldValueChange(field.id, val)}
                                onToggleRuntime={() => handleToggleRuntime(field.id)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Right Panel - Tools, Commands & Preview */}
      <aside className="w-80 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'tools' as const, label: 'Tools', count: enabledToolMappings.length },
            { id: 'commands' as const, label: 'Commands', count: attachedFlows?.filter(f => f.slashCommand.enabled).length || 0 },
            { id: 'preview' as const, label: 'Preview', count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all relative ${
                activeTab === tab.id
                  ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                  : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'tools' && (
            <ToolsPanel
              toolLibrary={toolLibrary}
              enabledTools={enabledToolMappings}
              isOpen={toolLibraryOpen}
              onOpen={() => onOpenToolLibrary?.()}
              onClose={() => onCloseToolLibrary?.()}
              onAddTool={onAddTool}
              onRemoveTool={onRemoveTool}
              onConfigureTool={onConfigureTool}
            />
          )}

          {activeTab === 'commands' && (
            <CommandsPanel
              attachedFlows={attachedFlows || []}
              availableFlows={availableFlows || []}
              onToggleEnabled={onToggleSlashCommand || (() => {})}
              onEditCommand={(id) => onEditSlashCommand?.(id, '', '', '')}
              onDetachFlow={onDetachFlow || (() => {})}
              onAttachFlow={onAttachFlow || (() => {})}
              onOpenFlowBuilder={onOpenFlowBuilder || (() => {})}
            />
          )}

          {activeTab === 'preview' && (
            <PromptPreviewPanel promptPreview={promptPreview} onGenerate={onGeneratePreview || (() => {})} />
          )}
        </div>
      </aside>

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  )
}
