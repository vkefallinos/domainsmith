/**
 * Agent Builder Section Types
 *
 * Types for the agent builder interface where users configure
 * specialized agents by selecting domains, filling out forms,
 * enabling tools from the tool library, setting fields to be
 * configured at runtime, and attaching flows with slash commands.
 */

/**
 * A form field type within a domain's schema
 */
export type SchemaFieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'toggle';

/**
 * The source that enabled a tool - either from a field selection or manually added
 */
export type ToolSource = 'field' | 'manual';

/**
 * The configuration status of a tool
 */
export type ToolConfigStatus = 'installed' | 'needs-config' | 'ready';

/**
 * Tool categories for filtering and organization
 */
export type ToolCategory = 'Security' | 'Cloud' | 'Compliance' | 'Privacy' | 'DevOps' | 'Communication' | 'Reporting';

/**
 * A slash command attached to an agent that triggers a flow
 */
export interface AgentSlashCommand {
  /** Unique identifier for the slash command */
  id: string;
  /** The command trigger (e.g., "summarize" - user types /summarize) */
  commandId: string;
  /** Human-readable name for the command */
  name: string;
  /** Description of what the command does */
  description: string;
  /** ID of the flow this command triggers */
  flowId: string;
  /** Name of the flow (for display) */
  flowName: string;
  /** Whether the command is enabled */
  enabled: boolean;
}

/**
 * A flow attached to an agent with its slash command configuration
 */
export interface AttachedFlow {
  /** ID of the flow */
  flowId: string;
  /** Name of the flow */
  flowName: string;
  /** Description of what the flow does */
  flowDescription: string;
  /** Number of tasks in the flow */
  taskCount: number;
  /** Slash command that triggers this flow */
  slashCommand: AgentSlashCommand;
}

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
  /** IDs of tools that become available when this field has a value */
  enablesTools?: string[];
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
 * A tool available in the tool library
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of what the tool does */
  description: string;
  /** Category for grouping */
  category: ToolCategory;
  /** NPM package name */
  package: string;
  /** Package version */
  version: string;
  /** Whether the tool is installed in the workspace */
  installed: boolean;
  /** Whether the tool requires configuration */
  configRequired: boolean;
  /** Current configuration values */
  config: Record<string, unknown>;
}

/**
 * A tool that has been enabled for an agent
 */
export interface EnabledTool {
  /** ID of the enabled tool */
  toolId: string;
  /** How the tool was enabled - from field selection or manual */
  source: ToolSource;
  /** If source is 'field', the field ID that enabled this tool */
  sourceField?: string;
  /** Tool configuration if customized */
  config?: Record<string, unknown>;
}

/**
 * Mapping showing which tools are enabled and their source
 */
export interface EnabledToolMapping {
  /** The tool reference */
  tool: Tool;
  /** How the tool was enabled */
  source: ToolSource;
  /** If from a field, which field */
  sourceField?: string;
  /** Current configuration status */
  status: ToolConfigStatus;
}

/**
 * A saved agent configuration (template)
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
  /** Tools enabled for this agent (auto + manual) */
  enabledTools: EnabledTool[];
  /** Field IDs that will be configured at runtime (empty placeholders in builder) */
  emptyFieldsForRuntime: string[];
  /** Flows attached to this agent with slash commands */
  attachedFlows?: AttachedFlow[];
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
  /** All available tools in the tool library */
  toolLibrary: Tool[];
  /** Previously saved agent configurations (templates) */
  savedAgentConfigs: AgentConfig[];
  /** Currently selected domain IDs */
  selectedDomainIds?: string[];
  /** Current form values */
  formValues?: FormValues;
  /** Currently enabled tools */
  enabledTools?: EnabledTool[];
  /** Fields enabled for runtime configuration (shown as placeholders, not editable) */
  emptyFieldsForRuntime?: string[];
  /** Flows attached to this agent with slash commands */
  attachedFlows?: AttachedFlow[];
  /** Available flows that can be attached to the agent */
  availableFlows?: Array<{ id: string; name: string; description: string; taskCount: number }>;
  /** Currently loaded agent config (for editing) */
  loadedAgentId?: string | null;
  /** Live prompt preview */
  promptPreview?: PromptPreview;
  /** Loading state */
  isLoading?: boolean;
  /** Validation errors by field ID */
  validationErrors?: Record<string, string>;
  /** Whether tool library modal is open */
  toolLibraryOpen?: boolean;
  /** Whether flow builder/selector modal is open */
  flowBuilderOpen?: boolean;
}

/**
 * Callback props for Agent Builder actions
 */
export interface AgentBuilderCallbacks {
  /** Called when one or more domains are selected/deselected */
  onDomainsChange: (domainIds: string[]) => void;
  /** Called when a form field value changes */
  onFieldValueChange: (fieldId: string, value: FormFieldValue) => void;
  /** Called when a field's runtime mode is toggled on (field becomes placeholder) */
  onEnableFieldForRuntime: (fieldId: string) => void;
  /** Called when a field's runtime mode is toggled off (field becomes editable) */
  onDisableFieldForRuntime: (fieldId: string) => void;
  /** Called to open the tool library modal */
  onOpenToolLibrary: () => void;
  /** Called to close the tool library modal */
  onCloseToolLibrary: () => void;
  /** Called to add a tool from the library */
  onAddTool: (toolId: string, config?: Record<string, unknown>) => void;
  /** Called to remove an enabled tool */
  onRemoveTool: (toolId: string) => void;
  /** Called to update tool configuration */
  onConfigureTool: (toolId: string, config: Record<string, unknown>) => void;
  /** Called to regenerate the prompt preview */
  onGeneratePreview: () => void;
  /** Called to save the current agent configuration as a template */
  onSaveAsTemplate: (name: string, description: string) => void;
  /** Called to deploy the agent directly to runtime */
  onDeployToRuntime: () => void;
  /** Called to load an existing agent for editing */
  onLoadAgent: (agentId: string) => void;
  /** Called to delete a saved agent configuration */
  onDeleteAgent: (agentId: string) => void;
  /** Called to duplicate an agent template */
  onDuplicateAgent: (agentId: string) => void;
  /** Called to create a new agent (clear form) */
  onNewAgent: () => void;
  /** Called to open the flow builder modal */
  onOpenFlowBuilder: () => void;
  /** Called to close the flow builder modal */
  onCloseFlowBuilder: () => void;
  /** Called to attach a flow with a slash command */
  onAttachFlow: (flowId: string, commandId: string, name: string, description: string) => void;
  /** Called to detach a flow from the agent */
  onDetachFlow: (slashCommandId: string) => void;
  /** Called to toggle a slash command enabled/disabled */
  onToggleSlashCommand: (slashCommandId: string, enabled: boolean) => void;
  /** Called to edit an existing slash command */
  onEditSlashCommand: (slashCommandId: string, commandId: string, name: string, description: string) => void;
}

/**
 * Combined props interface including callbacks
 */
export type AgentBuilderScreenProps = AgentBuilderProps & AgentBuilderCallbacks;
