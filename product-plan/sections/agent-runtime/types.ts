/**
 * Agent Runtime Types
 *
 * Types for the Agent Runtime section, including agents, conversations,
 * and messages for testing and inspecting deployed agent instances.
 */

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

/**
 * Props for the Agent Runtime component
 */
export interface AgentRuntimeProps {
  /** List of all available agents */
  agents: Agent[];
  /** Currently selected agent (null if none selected) */
  selectedAgentId: string | null;
  /** Active conversation for the selected agent (null if none) */
  conversation: Conversation | null;
  /** Whether the system prompt panel is expanded */
  isPromptPanelExpanded: boolean;
  /** Whether a new message is currently being sent */
  isLoading: boolean;
}

/**
 * Callback props for Agent Runtime actions
 */
export interface AgentRuntimeCallbacks {
  /** Called when an agent is selected from the list */
  onSelectAgent: (agentId: string) => void;
  /** Called when a new message is sent to the agent */
  onSendMessage: (content: string) => void;
  /** Called when the system prompt panel is toggled */
  onTogglePromptPanel: () => void;
  /** Called when a conversation is cleared */
  onClearConversation: () => void;
  /** Called when an agent is restarted */
  onRestartAgent: (agentId: string) => void;
}
