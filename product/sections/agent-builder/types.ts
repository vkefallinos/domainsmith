/**
 * Agent Builder Section Types
 *
 * Types for the agent builder interface where users configure
 * specialized agents by selecting domains and filling out forms.
 */

/**
 * A form field type within a domain's schema
 */
export type SchemaFieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'toggle';

/**
 * An available domain/expertise area that can be selected when building an agent
 */
export interface Domain {
  /** Unique identifier for the domain */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of what the domain covers */
  description: string;
  /** Category grouping (e.g., Security, Infrastructure) */
  category: string;
  /** Tags for searchability */
  tags: string[];
  /** Icon identifier for UI display */
  icon: string;
  /** Schema defining form fields for this domain */
  schema: DomainSchema;
  /** Template string for generating the system prompt */
  template: string;
}

/**
 * Schema that defines the form fields for a domain
 */
export interface DomainSchema {
  /** Array of field definitions */
  fields: SchemaField[];
}

/**
 * A single form field definition within a domain's schema
 */
export interface SchemaField {
  /** Unique identifier for the field */
  id: string;
  /** Type of form control */
  type: SchemaFieldType;
  /** Human-readable label */
  label: string;
  /** Placeholder text (for text inputs) */
  placeholder?: string;
  /** Whether the field is required */
  required: boolean;
  /** Default value */
  default: string | string[] | boolean;
  /** Options for select/multiselect fields */
  options?: string[];
}

/**
 * Category type derived from domain data
 */
export type DomainCategory = 'Security' | 'Infrastructure' | 'Compliance' | 'Development';

/**
 * Field values collected from the form - keyed by field ID
 */
export type FormFieldValue = string | string[] | boolean;

/**
 * Map of field IDs to their values
 */
export interface FormValues {
  [fieldId: string]: FormFieldValue;
}

/**
 * A saved agent configuration
 */
export interface AgentConfig {
  /** Unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of the agent's purpose */
  description: string;
  /** IDs of selected domains */
  selectedDomains: string[];
  /** Form field values for all selected domains */
  formValues: FormValues;
  /** When the config was created */
  createdAt: string;
  /** When the config was last updated */
  updatedAt: string;
}

/**
 * Live-generated preview of the system prompt
 */
export interface PromptPreview {
  /** ID of the agent config */
  agentId: string;
  /** Names of domains included */
  domains: string[];
  /** The generated prompt text */
  generatedPrompt: string;
  /** Estimated token count */
  tokenCount: number;
  /** When the preview was last generated */
  lastGenerated: string;
}

/**
 * Props for the Agent Builder screen
 */
export interface AgentBuilderProps {
  /** Available domains to select from */
  domains: Domain[];
  /** Previously saved agent configurations */
  savedAgentConfigs: AgentConfig[];
  /** Currently selected domain IDs */
  selectedDomainIds?: string[];
  /** Current form values */
  formValues?: FormValues;
  /** Currently loaded agent config (for editing) */
  loadedAgentId?: string | null;
  /** Live prompt preview */
  promptPreview?: PromptPreview;
  /** Loading state */
  isLoading?: boolean;
  /** Validation errors by field ID */
  validationErrors?: Record<string, string>;
}

/**
 * Callback props for Agent Builder actions
 */
export interface AgentBuilderCallbacks {
  /** Called when one or more domains are selected/deselected */
  onDomainsChange: (domainIds: string[]) => void;
  /** Called when a form field value changes */
  onFieldValueChange: (fieldId: string, value: FormFieldValue) => void;
  /** Called to generate a new prompt preview */
  onGeneratePreview: () => void;
  /** Called to save the current agent configuration */
  onSaveAgent: (name: string, description: string) => void;
  /** Called to load an existing agent for editing */
  onLoadAgent: (agentId: string) => void;
  /** Called to delete a saved agent configuration */
  onDeleteAgent: (agentId: string) => void;
  /** Called to create a new agent (clear form) */
  onNewAgent: () => void;
}
