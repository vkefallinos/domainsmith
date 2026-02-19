// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/prompt-library
// -----------------------------------------------------------------------------

/**
 * Type of node in the file system
 */
export type NodeType = 'directory' | 'file';

/**
 * Metadata configuration stored in a directory's config.json file
 */
export interface DirectoryConfig {
  /** Human-readable label for the directory */
  label?: string;
  /** Description of the directory's purpose */
  description?: string;
  /** Icon identifier for UI rendering */
  icon?: string;
  /** Color for visual distinction in UI */
  color?: string;
  /** Additional custom metadata properties */
  [key: string]: unknown;
}

/**
 * Frontmatter metadata from a prompt fragment's markdown file
 */
export interface PromptFrontmatter {
  /** Human-readable title */
  title?: string;
  /** Category for organization */
  category?: string;
  /** Tags for filtering and discovery */
  tags?: string[];
  /** Author identifier */
  author?: string;
  /** ISO date string of creation */
  created?: string;
  /** ISO date string of last modification */
  modified?: string;
  /** Severity or priority level */
  severity?: 'low' | 'medium' | 'high';
  /** Additional custom properties */
  [key: string]: unknown;
}

/**
 * A prompt fragment file in the library
 */
export interface PromptFragment {
  /** Unique identifier for the fragment */
  id: string;
  /** Filename including extension */
  name: string;
  /** Node type discriminator */
  type: 'file';
  /** Full path from root */
  path: string;
  /** Optional frontmatter metadata */
  frontmatter?: PromptFrontmatter;
  /** Markdown content of the prompt */
  content: string;
}

/**
 * A directory that can contain other nodes
 */
export interface Directory {
  /** Unique identifier for the directory */
  id: string;
  /** Directory name */
  name: string;
  /** Node type discriminator */
  type: 'directory';
  /** Full path from root */
  path: string;
  /** Optional directory metadata from config.json */
  config?: DirectoryConfig;
  /** Child nodes (directories and/or files) */
  children?: FileSystemNode[];
}

/**
 * Union type for any node in the file system tree
 */
export type FileSystemNode = Directory | PromptFragment;

// -----------------------------------------------------------------------------
// From: sections/agent-builder
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// From: sections/agent-runtime
// -----------------------------------------------------------------------------

/**
 * Status of an agent instance
 */
export type AgentStatus = "ready" | "starting" | "stopping" | "error";

/**
 * Role of a message sender
 */
export type MessageRole = "user" | "assistant";

/**
 * Reference to the schema and configuration that generated an agent
 */
export interface AgentSource {
  /** ID of the schema used to generate this agent */
  schemaId: string;
  /** Human-readable name of the domain schema */
  schemaName: string;
  /** Workspace where the schema resides */
  workspaceName: string;
}

/**
 * A deployed agent instance with an assembled system prompt
 */
export interface Agent {
  /** Unique identifier for this agent instance */
  id: string;
  /** Display name for the agent */
  name: string;
  /** Brief description of the agent's purpose */
  description: string;
  /** Reference to the domain/schema that generated this agent */
  source: AgentSource;
  /** The full assembled system prompt used by this agent */
  systemPrompt: string;
  /** ISO timestamp when this agent was created */
  createdAt: string;
  /** ISO timestamp when this agent was last used for a conversation */
  lastUsedAt: string | null;
  /** Current status of the agent */
  status: AgentStatus;
}

/**
 * A single message in a conversation thread
 */
export interface Message {
  /** Unique identifier for this message */
  id: string;
  /** Whether the message was sent by the user or the assistant */
  role: MessageRole;
  /** The message content */
  content: string;
  /** ISO timestamp when the message was sent */
  timestamp: string;
}

/**
 * A chat session containing messages exchanged between user and agent
 */
export interface Conversation {
  /** Unique identifier for this conversation */
  id: string;
  /** ID of the agent this conversation is with */
  agentId: string;
  /** Name of the agent (for display) */
  agentName: string;
  /** Messages in this conversation, in chronological order */
  messages: Message[];
  /** ISO timestamp when the conversation was created */
  createdAt: string;
  /** ISO timestamp when the conversation was last updated */
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// From: sections/workspaces
// -----------------------------------------------------------------------------

/**
 * User roles within a workspace with escalating permissions
 */
export type WorkspaceUserRole = 'admin' | 'editor' | 'viewer';

/**
 * Current status of a user in the workspace
 */
export type WorkspaceUserStatus = 'active' | 'invited' | 'pending';

/**
 * A user who is a member of the workspace
 */
export interface WorkspaceUser {
  /** Unique identifier for the user */
  id: string;
  /** Full display name */
  name: string;
  /** Email address for login and notifications */
  email: string;
  /** URL to user's profile avatar image */
  avatarUrl?: string;
  /** Assigned role determining permissions */
  role: WorkspaceUserRole;
  /** Current status in the workspace */
  status: WorkspaceUserStatus;
  /** ISO timestamp when user joined (null if not yet joined) */
  joinedAt: string | null;
  /** ISO timestamp of last activity (null if never active) */
  lastActive: string | null;
}
