import data from '@/../product/sections/agent-builder/data.json'
import { useState, useCallback } from 'react'
import { AgentFormBuilder } from './components/AgentFormBuilder'
import { SavedTemplatesList } from './components/SavedTemplatesList'
import { ToolLibraryModal } from './components/ToolLibraryModal'
import { FlowBuilderModal } from './components/FlowBuilderModal'
import type { FormFieldValue, AttachedFlow } from '@/../product/sections/agent-builder/types'

/**
 * Preview wrapper for Agent Builder Form Builder view
 *
 * This is a DESIGN ONLY component for visualization in Design OS.
 * It imports sample data and feeds it to the props-based component.
 *
 * For production use, import AgentFormBuilder directly from components/
 * and pass your own data via props.
 */
export default function AgentBuilderPreview() {
  const [view, setView] = useState<'builder' | 'templates'>('builder')

  // Initial state with sample data
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([
    'domain-cybersecurity',
    'domain-data-privacy',
  ])
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>({
    scope: 'Customer-facing web application and underlying database infrastructure',
    complianceStandards: ['SOC 2', 'GDPR', 'ISO 27001'],
    severityThreshold: 'Medium',
    reportFormat: 'Both',
    jurisdictions: ['EU (GDPR)', 'California (CCPA/CPRA)'],
    dataCategories: 'User names, email addresses, payment information, and usage analytics',
    includeDPIA: true,
    dataSubjectRights: ['Right to Erasure', 'Right to Access'],
  })
  const [enabledTools, setEnabledTools] = useState(data.savedAgentConfigs[0].enabledTools || [])
  const [emptyFieldsForRuntime, setEmptyFieldsForRuntime] = useState<string[]>([])
  const [toolLibraryOpen, setToolLibraryOpen] = useState(false)
  const [flowBuilderOpen, setFlowBuilderOpen] = useState(false)

  // Sample attached flows for demo
  const [attachedFlows, setAttachedFlows] = useState<AttachedFlow[]>([
    {
      flowId: 'flow_001',
      flowName: 'Customer Onboarding Analysis',
      flowDescription: 'Analyzes new customer data and generates summary',
      taskCount: 4,
      slashCommand: {
        id: 'sc_001',
        commandId: 'analyze',
        name: 'Analyze Customer',
        description: 'Run customer onboarding analysis',
        flowId: 'flow_001',
        flowName: 'Customer Onboarding Analysis',
        enabled: true,
      },
    },
  ])

  // Available flows for attaching
  const availableFlows = [
    {
      id: 'flow_002',
      name: 'Document Processing Pipeline',
      description: 'Extracts and classifies document text',
      taskCount: 3,
    },
    {
      id: 'flow_003',
      name: 'Support Ticket Triage',
      description: 'Categorizes and prioritizes support tickets',
      taskCount: 5,
    },
    {
      id: 'flow_007',
      name: 'Meeting Notes Summary',
      description: 'Summarizes meeting transcripts',
      taskCount: 4,
    },
  ]

  // Domain handlers
  const handleDomainsChange = useCallback((domainIds: string[]) => {
    setSelectedDomainIds(domainIds)
    setEmptyFieldsForRuntime([])
  }, [])

  // Field handlers
  const handleFieldValueChange = useCallback((fieldId: string, value: FormFieldValue) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const handleEnableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => [...prev, fieldId])
  }, [])

  const handleDisableFieldForRuntime = useCallback((fieldId: string) => {
    setEmptyFieldsForRuntime(prev => prev.filter(id => id !== fieldId))
  }, [])

  // Tool handlers
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

  // Agent actions
  const handleGeneratePreview = useCallback(() => {
    console.log('Generate preview')
  }, [])

  const handleSaveAsTemplate = useCallback((name: string, description: string) => {
    console.log('Save as template:', name, description)
  }, [])

  const handleNewAgent = useCallback(() => {
    setSelectedDomainIds([])
    setFormValues({})
    setEnabledTools([])
    setEmptyFieldsForRuntime([])
    setView('builder')
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

  const handleDeleteAgent = useCallback((agentId: string) => {
    console.log('Delete agent:', agentId)
  }, [])

  const handleDuplicateAgent = useCallback((agentId: string) => {
    console.log('Duplicate agent:', agentId)
  }, [])

  // Flow handlers
  const handleOpenFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(true)
  }, [])

  const handleCloseFlowBuilder = useCallback(() => {
    setFlowBuilderOpen(false)
  }, [])

  const handleAttachFlow = useCallback(
    (flowId: string, commandId: string, name: string, description: string) => {
      const flow = availableFlows.find(f => f.id === flowId)
      if (!flow) return

      const newAttachedFlow: AttachedFlow = {
        flowId,
        flowName: flow.name,
        flowDescription: flow.description,
        taskCount: flow.taskCount,
        slashCommand: {
          id: `sc_${Date.now()}`,
          commandId,
          name,
          description,
          flowId,
          flowName: flow.name,
          enabled: true,
        },
      }

      setAttachedFlows(prev => [...prev, newAttachedFlow])
      console.log('Attach flow:', flowId, 'as command:', commandId)
    },
    [availableFlows]
  )

  const handleDetachFlow = useCallback((slashCommandId: string) => {
    setAttachedFlows(prev => prev.filter(af => af.slashCommand.id !== slashCommandId))
    console.log('Detach flow with command:', slashCommandId)
  }, [])

  const handleToggleSlashCommand = useCallback((slashCommandId: string, enabled: boolean) => {
    setAttachedFlows(prev =>
      prev.map(af => {
        if (af.slashCommand.id === slashCommandId) {
          return { ...af, slashCommand: { ...af.slashCommand, enabled } }
        }
        return af
      })
    )
    console.log('Toggle command:', slashCommandId, 'enabled:', enabled)
  }, [])

  const handleEditSlashCommand = useCallback(
    (slashCommandId: string, commandId: string, name: string, description: string) => {
      console.log('Edit command:', slashCommandId, commandId, name, description)
    },
    []
  )

  const promptPreview = data.promptPreview

  const builderProps = {
    domains: data.domains,
    toolLibrary: data.toolLibrary,
    savedAgentConfigs: data.savedAgentConfigs,
    selectedDomainIds,
    formValues,
    enabledTools,
    emptyFieldsForRuntime,
    attachedFlows,
    availableFlows,
    promptPreview,
    validationErrors: {},
    toolLibraryOpen,
    flowBuilderOpen,
    loadedAgentId: 'preview-agent',
    onDomainsChange: handleDomainsChange,
    onFieldValueChange: handleFieldValueChange,
    onEnableFieldForRuntime: handleEnableFieldForRuntime,
    onDisableFieldForRuntime: handleDisableFieldForRuntime,
    onOpenToolLibrary: handleOpenToolLibrary,
    onCloseToolLibrary: handleCloseToolLibrary,
    onAddTool: handleAddTool,
    onRemoveTool: handleRemoveTool,
    onConfigureTool: handleConfigureTool,
    onGeneratePreview: handleGeneratePreview,
    onSaveAsTemplate: handleSaveAsTemplate,
    onNewAgent: handleNewAgent,
    onOpenFlowBuilder: handleOpenFlowBuilder,
    onCloseFlowBuilder: handleCloseFlowBuilder,
    onAttachFlow: handleAttachFlow,
    onDetachFlow: handleDetachFlow,
    onToggleSlashCommand: handleToggleSlashCommand,
    onEditSlashCommand: handleEditSlashCommand,
  }

  const templatesProps = {
    domains: data.domains,
    toolLibrary: data.toolLibrary,
    savedAgentConfigs: data.savedAgentConfigs,
    onLoadAgent: handleLoadAgent,
    onDuplicateAgent: handleDuplicateAgent,
    onDeleteAgent: handleDeleteAgent,
    onNewAgent: handleNewAgent,
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* View Toggle */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-1 px-4">
          <button
            onClick={() => setView('builder')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === 'builder'
                ? 'text-violet-600 dark:text-violet-400 border-violet-600'
                : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-400'
            }`}
          >
            Form Builder
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
          <SavedTemplatesList {...templatesProps} />
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

      {/* Flow Builder Modal */}
      <FlowBuilderModal
        isOpen={flowBuilderOpen}
        onClose={handleCloseFlowBuilder}
        agentId="preview-agent"
        availableFlows={availableFlows}
        onAttachFlow={handleAttachFlow}
        onCreateNewFlow={() => console.log('Create new flow')}
      />
    </div>
  )
}
