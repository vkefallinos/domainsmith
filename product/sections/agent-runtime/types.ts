/**
 * Agent Runtime Types
 *
 * Types for the Agent Runtime section where users configure runtime fields,
 * view enabled tools, and run conversations with deployed agents.
 */

/**
 * Role of a message sender
 */
export type MessageRole = "user" | "assistant";

/**
 * Type of a runtime field (form control)
 */
export type RuntimeFieldType = "text" | "textarea" | "select" | "multiselect" | "toggle";

/**
 * Source that enabled a tool - either from a field selection or manually added
 */
export type ToolSource = "field" | "manual";

/**
 * A field that was marked "configure at runtime" in Agent Builder
 * These fields appear in the runtime view for users to fill before/during conversation
 */
export interface RuntimeField {
  /** Unique identifier for the field */
  id: string;
  /** Human-readable label */
  label: string;
  /** Type of form control */
  type: RuntimeFieldType;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Options for select/multiselect fields */
  options?: string[];
  /** Current value (user fills this at runtime) */
  value: string | string[] | boolean;
  /** Domain this field belongs to */
  domain: string;
}

/**
 * A tool enabled for the agent, either from field selections or manually added
 */
export interface EnabledTool {
  /** Unique identifier for the tool */
  toolId: string;
  /** Human-readable name */
  name: string;
  /** NPM package name */
  package: string;
  /** Package version */
  version: string;
  /** Whether the tool is installed */
  installed: boolean;
  /** How the tool was enabled */
  source: ToolSource;
  /** If source is 'field', the field ID that enabled this tool */
  sourceField?: string;
  /** Icon emoji for display */
  icon: string;
}

/**
 * A deployed agent instance configured from Agent Builder
 */
export interface Agent {
  /** Unique identifier for this agent instance */
  id: string;
  /** Display name for the agent */
  name: string;
  /** Brief description of the agent's purpose */
  description: string;
  /** Domains included in this agent */
  domains: string[];
  /** Pre-filled form values from Agent Builder */
  formValues: Record<string, string | string[] | boolean>;
  /** Fields that must be configured at runtime */
  runtimeFields: RuntimeField[];
  /** Tools enabled for this agent (from field selections + manual) */
  enabledTools: EnabledTool[];
  /** The full assembled system prompt used by this agent (runtime field values enable prompt fragments) */
  systemPrompt: string;
  /** ISO timestamp when this agent was created */
  createdAt: string;
  /** ISO timestamp when this agent was last used for a conversation */
  lastUsedAt: string | null;
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

/**
 * Props for the Agent Runtime Agent List view
 */
export interface AgentListProps {
  /** List of all available agents */
  agents: Agent[];
  /** Currently selected agent ID (null if none) */
  selectedAgentId?: string | null;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Props for the Agent Runtime view (left panel + chat)
 */
export interface AgentRuntimeProps {
  /** Currently selected agent */
  agent: Agent | null;
  /** All conversations for the selected agent */
  conversations: Conversation[];
  /** Currently active conversation ID */
  activeConversationId: string | null;
  /** Whether a new message is currently being sent */
  isLoading?: boolean;
}

/**
 * Props for the left panel (runtime fields + tools)
 */
export interface RuntimePanelProps {
  /** The agent being configured/run */
  agent: Agent;
  /** Current values of runtime fields */
  runtimeFieldValues?: Record<string, string | string[] | boolean>;
  /** Whether the tools section is expanded */
  isToolsExpanded?: boolean;
  /** Called when a runtime field value changes */
  onRuntimeFieldChange?: (fieldId: string, value: string | string[] | boolean) => void;
}

/**
 * Props for the chat panel
 */
export interface ChatPanelProps {
  /** The agent being chatted with */
  agent: Agent;
  /** All conversations for this agent */
  conversations: Conversation[];
  /** Currently active conversation */
  activeConversation: Conversation | null;
  /** Whether a message is being sent */
  isLoading?: boolean;
  /** Whether streaming a response */
  isStreaming?: boolean;
  /** Called when a new message is sent to the agent */
  onSendMessage?: (content: string) => void;
  /** Called when switching to a different conversation */
  onSelectConversation?: (conversationId: string) => void;
  /** Called when creating a new conversation */
  onCreateConversation?: () => void;
  /** Called when deleting a conversation */
  onDeleteConversation?: (conversationId: string) => void;
}

/**
 * Combined props interface including callbacks for Agent List
 */
export interface AgentListScreenProps extends AgentListProps {
  /** Called when an agent is selected */
  onSelectAgent: (agentId: string) => void;
}

/**
 * Combined props interface including callbacks for Runtime View
 */
export interface AgentRuntimeScreenProps extends AgentRuntimeProps {
  /** Called when a runtime field value changes */
  onRuntimeFieldChange: (fieldId: string, value: string | string[] | boolean) => void;
  /** Called when a new message is sent to the agent */
  onSendMessage: (content: string) => void;
  /** Called when returning to agent list */
  onBackToList: () => void;
  /** Called when the tools section is toggled */
  onToggleTools: () => void;
  /** Called when switching to a different conversation */
  onSelectConversation: (conversationId: string) => void;
  /** Called when creating a new conversation */
  onCreateConversation: () => void;
  /** Called when deleting a conversation */
  onDeleteConversation: (conversationId: string) => void;
}
