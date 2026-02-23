# Data Shape

## Entities

### PromptFragment

An isolated .md file containing a specific piece of agent behavior, knowledge, or constraint (e.g., tone rules, domain knowledge, output restrictions).

### Directory

A folder in the taxonomy that organizes related prompt fragments, with an optional config.json that defines metadata and structure rules.

### Schema

A JSON Schema automatically generated from a directory tree, mapping the hierarchical structure to a type-safe form definition.

### AgentConfig

A JSON payload generated from user form input, representing the exact configuration choices for an agent instance.

### Agent

A deployed or runnable agent instance with its assembled system prompt, ready for conversation.

### Workspace

A shared or isolated environment containing prompt libraries and agents, with access controls for collaboration.

### User

A domain expert or end user who can author prompt fragments, configure agents, or interact with deployed agents.

### Conversation

A chat session with an agent, containing messages exchanged between the user and the agent over time.

### Tool

A function-calling capability that agents can invoke — either a built-in DomainSmith tool or an installed npm package.

### ToolPackage

An npm package that can be installed to add tools to the Tool Library, with metadata about available functions and dependencies.

### EnvironmentVariable

A workspace-level configuration value (API keys, endpoints, secrets) that tools can reference for secure credential management.

### Flow

A sequential task flow that can be attached to an agent, consisting of multiple tasks that execute in order. Each task can output structured data, call tools, transform data, or generate LLM responses.

### Task

A single step within a flow that performs a specific operation (schema output, tool call, data transformation, or LLM prompt).

### SlashCommand

A custom command trigger (e.g., `/summarize`, `/analyze`) that users can type in conversation to invoke an attached flow on an agent.

## Relationships

- Workspace has many Directories
- Workspace has many AgentConfig
- Workspace has many EnvironmentVariables
- Workspace has many installed ToolPackages
- Workspace has many Flows
- Directory has many PromptFragments
- Directory has many subdirectories
- Directory generates one Schema
- Directory has many Tools (via config.json)
- PromptFragment has many Tools (via frontmatter)
- AgentConfig belongs to one User
- AgentConfig generates one Agent
- Agent belongs to one Workspace
- Agent has many Conversations
- Agent has many Tools (inherited from selected prompt fragments)
- Agent has many Flows (attached via slash commands)
- Agent has many SlashCommands (triggers for attached flows)
- Flow belongs to one Workspace
- Flow can be attached to many Agents (reusable)
- Flow has many Tasks in sequence
- Task has one OutputSchema (for schema-output type tasks)
- Task has one ToolReference (for tool-calling type tasks)
- Task has one DataTransformation (for data-transformation type tasks)
- Task receives input from the previous Task in the Flow
- SlashCommand belongs to one Agent
- SlashCommand triggers one Flow
- Conversation belongs to one Agent
- User belongs to many Workspaces
- Tool belongs to one ToolPackage
