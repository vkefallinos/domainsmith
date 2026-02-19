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

## Relationships

- Workspace has many Directories
- Workspace has many AgentConfig
- Directory has many PromptFragments
- Directory has many subdirectories
- Directory generates one Schema
- AgentConfig belongs to one User
- AgentConfig generates one Agent
- Agent belongs to one Workspace
- Agent has many Conversations
- Conversation belongs to one Agent
- User belongs to many Workspaces
