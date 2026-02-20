/**
 * Agent Builder Screen - Preview Wrapper
 *
 * This is the Design OS preview wrapper that imports sample data
 * and feeds it to the props-based AgentBuilder component.
 *
 * NOT for export - only for Design OS preview.
 */

import { useState } from 'react'
import data from '@/../product/sections/agent-builder/data.json'
import { AgentBuilder } from './components/AgentBuilder'
import type { Domain, AgentConfig, FormValues, PromptPreview } from '@/../product/sections/agent-builder/types'

// Simulated prompt generation
function generatePrompt(
  selectedDomains: Domain[],
  formValues: FormValues
): string {
  const domainTemplates = selectedDomains.map(domain => {
    let template = domain.template

    // Simple template replacement
    domain.schema.fields.forEach(field => {
      const value = formValues[field.id]
      if (value !== undefined && value !== '') {
        const placeholder = `{{${field.id}}}`
        template = template.replace(new RegExp(placeholder, 'g'), String(value))

        // Handle conditionals
        const ifPattern = `{{#if ${field.id}}}(.+?){{/if}}`
        const ifMatch = template.match(new RegExp(ifPattern, 's'))
        if (ifMatch) {
          if (value === true || (Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value)) {
            template = template.replace(ifMatch[0], ifMatch[1])
          } else {
            template = template.replace(ifMatch[0], '')
          }
        }
      }
    })

    return template
  })

  return domainTemplates.join('\n\nWhen responding, integrate perspectives from all domains. Consider how recommendations from one area apply to others.')
}

export default function AgentBuilderScreen() {
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>(['domain-cybersecurity'])
  const [formValues, setFormValues] = useState<FormValues>({
    scope: 'Customer-facing web application and underlying database infrastructure',
    complianceStandards: ['SOC 2', 'GDPR'],
    severityThreshold: 'High',
    reportFormat: 'Both'
  })
  const [loadedAgentId, setLoadedAgentId] = useState<string | null>(null)
  const [promptPreview, setPromptPreview] = useState(data.promptPreview)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleDomainsChange = (domainIds: string[]) => {
    setSelectedDomainIds(domainIds)
    // Reset form values for domains that are no longer selected
    setPromptPreview(undefined)
  }

  const handleFieldValueChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
    // Clear preview when form changes
    setPromptPreview(undefined)
  }

  const handleGeneratePreview = () => {
    setIsLoading(true)
    setValidationErrors({})

    // Simulate API call
    setTimeout(() => {
      const selectedDomains = (data.domains as Domain[]).filter(d => selectedDomainIds.includes(d.id))
      const generatedPrompt = generatePrompt(selectedDomains, formValues)

      setPromptPreview({
        agentId: 'preview',
        domains: selectedDomains.map(d => d.name),
        generatedPrompt,
        tokenCount: Math.ceil(generatedPrompt.length / 4),
        lastGenerated: new Date().toISOString()
      })
      setIsLoading(false)
    }, 800)
  }

  const handleSaveAgent = (name: string, description: string) => {
    console.log('Saving agent:', { name, description, selectedDomainIds, formValues })
    // In real app: save to backend
    setLoadedAgentId('agent-new')
  }

  const handleLoadAgent = (agentId: string) => {
    const agent = (data.savedAgentConfigs as unknown as AgentConfig[]).find(a => a.id === agentId)
    if (agent) {
      setSelectedDomainIds(agent.selectedDomains)
      setFormValues(agent.formValues)
      setLoadedAgentId(agentId)
      setValidationErrors({})
    }
  }

  const handleDeleteAgent = (agentId: string) => {
    console.log('Deleting agent:', agentId)
    // In real app: delete from backend
  }

  const handleNewAgent = () => {
    setSelectedDomainIds([])
    setFormValues({})
    setLoadedAgentId(null)
    setPromptPreview(undefined)
    setValidationErrors({})
  }

  return (
    <AgentBuilder
      domains={data.domains as unknown as Domain[]}
      savedAgentConfigs={data.savedAgentConfigs as unknown as AgentConfig[]}
      selectedDomainIds={selectedDomainIds}
      formValues={formValues}
      loadedAgentId={loadedAgentId}
      promptPreview={promptPreview}
      isLoading={isLoading}
      validationErrors={validationErrors}
      onDomainsChange={handleDomainsChange}
      onFieldValueChange={handleFieldValueChange}
      onGeneratePreview={handleGeneratePreview}
      onSaveAgent={handleSaveAgent}
      onLoadAgent={handleLoadAgent}
      onDeleteAgent={handleDeleteAgent}
      onNewAgent={handleNewAgent}
    />
  )
}
