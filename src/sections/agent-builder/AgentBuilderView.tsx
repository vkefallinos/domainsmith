import data from '@/../product/sections/agent-builder/data.json'
import { useState, useCallback } from 'react'
import { AgentFormBuilder } from './components/AgentFormBuilder'
import { SavedTemplatesList } from './components/SavedTemplatesList'
import { ToolLibraryModal } from './components/ToolLibraryModal'
import type { FormFieldValue } from '@/../product/sections/agent-builder/types'

export default function AgentBuilderPreview() {
  const [view, setView] = useState<'builder' | 'templates'>('builder')
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>(['domain-cybersecurity', 'domain-data-privacy'])
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>({
    scope: 'Customer-facing web application and underlying database infrastructure',
    complianceStandards: ['SOC 2', 'GDPR', 'ISO 27001'],
    severityThreshold: 'Medium',
    reportFormat: 'Both',
    jurisdictions: ['EU (GDPR)', 'California (CCPA/CPRA)'],
    dataCategories: 'User names, email addresses, payment information, and usage analytics',
    includeDPIA: true,
    dataSubjectRights: ['Right to Erasure', 'Right to Access']
  })
  const [enabledTools, setEnabledTools] = useState(data.savedAgentConfigs[0].enabledTools || [])
  const [emptyFieldsForRuntime, setEmptyFieldsForRuntime] = useState<string[]>(['scalingRequirements']) // Example: one field set to runtime
  const [toolLibraryOpen, setToolLibraryOpen] = useState(false)

  // Callback handlers
  const handleDomainsChange = useCallback((domainIds: string[]) => {
    setSelectedDomainIds(domainIds)
    // Reset runtime fields when domains change
    setEmptyFieldsForRuntime([])
  }, [])

  const handleFieldValueChange = useCallback((fieldId: string, value: FormFieldValue) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const handleEnableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => [...prev, fieldId])
  }, [])

  const handleDisableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => prev.filter(id => id !== fieldId))
  }, [])

  const handleEnableField = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => [...prev, fieldId])
  }, [])

  const handleDisableField = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => prev.filter(id => id !== fieldId))
  }, [])

  const handleOpenToolLibrary = useCallback(() => {
    setToolLibraryOpen(true)
  }, [])

  const handleCloseToolLibrary = useCallback(() => {
    setToolLibraryOpen(false)
  }, [])

  const handleAddTool = useCallback((toolId: string, config?: Record<string, unknown>) => {
    setEnabledTools(prev => {
      if (prev.some(t => t.toolId === toolId)) return prev
      return [...prev, { toolId, source: 'manual', config }]
    })
  }, [])

  const handleRemoveTool = useCallback((toolId: string) => {
    setEnabledTools(prev => prev.filter(t => t.toolId !== toolId))
  }, [])

  const handleConfigureTool = useCallback((toolId: string, config: Record<string, unknown>) => {
    console.log('Configure tool:', toolId, config)
  }, [])

  const handleGeneratePreview = useCallback(() => {
    console.log('Generate preview')
  }, [])

  const handleSaveAsTemplate = useCallback((name: string, description: string) => {
    console.log('Save as template:', name, description)
  }, [])

  const handleDeployToRuntime = useCallback(() => {
    console.log('Deploy to runtime')
  }, [])

  const handleLoadAgent = useCallback((agentId: string) => {
    console.log('Load agent:', agentId)
    const agent = data.savedAgentConfigs.find(a => a.id === agentId)
    if (agent) {
      setSelectedDomainIds(agent.selectedDomains)
      setFormValues(agent.formValues)
      setEnabledTools(agent.enabledTools)
      setEmptyFieldsForRuntime(agent.emptyFieldsForRuntime)
      setView('builder')
    }
  }, [])

  const handleDuplicateAgent = useCallback((agentId: string) => {
    console.log('Duplicate agent:', agentId)
  }, [])

  const handleDeleteAgent = useCallback((agentId: string) => {
    console.log('Delete agent:', agentId)
  }, [])

  const handleNewAgent = useCallback(() => {
    setSelectedDomainIds([])
    setFormValues({})
    setEnabledTools([])
    setEmptyFieldsForRuntime([])
    setView('builder')
  }, [])

  // Generate prompt preview
  const promptPreview = data.promptPreview

  const builderProps = {
    domains: data.domains,
    toolLibrary: data.toolLibrary,
    savedAgentConfigs: data.savedAgentConfigs,
    selectedDomainIds,
    formValues,
    enabledTools,
    enabledFields: emptyFieldsForRuntime, // Same as runtime fields for now
    emptyFieldsForRuntime,
    promptPreview,
    validationErrors: {},
    toolLibraryOpen,
    onDomainsChange: handleDomainsChange,
    onFieldValueChange: handleFieldValueChange,
    onEnableField: handleEnableField,
    onDisableField: handleDisableField,
    onEnableFieldForRuntime: handleEnableFieldForRuntime,
    onDisableFieldForRuntime: handleDisableFieldForRuntime,
    onOpenToolLibrary: handleOpenToolLibrary,
    onCloseToolLibrary: handleCloseToolLibrary,
    onAddTool: handleAddTool,
    onRemoveTool: handleRemoveTool,
    onConfigureTool: handleConfigureTool,
    onGeneratePreview: handleGeneratePreview,
    onSaveAsTemplate: handleSaveAsTemplate,
    onDeployToRuntime: handleDeployToRuntime,
    onLoadAgent: handleLoadAgent,
    onDeleteAgent: handleDeleteAgent,
    onDuplicateAgent: handleDuplicateAgent,
    onNewAgent: handleNewAgent
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* View Toggle */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('builder')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === 'builder'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Agent Builder
          </button>
          <button
            onClick={() => setView('templates')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === 'templates'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Saved Templates ({data.savedAgentConfigs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'builder' ? (
          <AgentFormBuilder {...builderProps} />
        ) : (
          <SavedTemplatesList
            domains={data.domains}
            toolLibrary={data.toolLibrary}
            savedAgentConfigs={data.savedAgentConfigs}
            onLoadAgent={handleLoadAgent}
            onDuplicateAgent={handleDuplicateAgent}
            onDeleteAgent={handleDeleteAgent}
            onNewAgent={handleNewAgent}
          />
        )}
      </div>

      {/* Tool Library Modal */}
      <ToolLibraryModal
        toolLibrary={data.toolLibrary}
        enabledTools={enabledTools}
        isOpen={toolLibraryOpen}
        onClose={handleCloseToolLibrary}
        onAddTool={handleAddTool}
        onRemoveTool={handleRemoveTool}
        onConfigureTool={handleConfigureTool}
      />
    </div>
  )
}
