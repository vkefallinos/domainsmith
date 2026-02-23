# Flow Builder Specification

## Overview
A visual flow editor within Agent Builder that allows users to create sequential task flows. Each task can output structured data via JSON schemas, call tools, transform data from previous tasks, or generate LLM responses. Tasks pass data linearly to the next task in the sequence. Flows can be created as standalone reusable flows or built in the context of a specific agent. When attached to an agent, flows are triggered by slash commands (e.g., `/summarize`, `/analyze`) that users type during conversation.

## User Flows
- **Browse flows** — View a list of all flows in the current workspace with summary info
- **Create a new flow** — Start with a blank canvas and add the first task
- **Create flow for agent** — When building an agent, create a flow specifically for that agent with a slash command trigger
- **Add tasks to a flow** — Insert tasks of any supported type (schema output, tool call, data transformation, LLM prompt)
- **Configure task details** — Define task-specific settings like output schemas, tool selection, transformation logic, or prompt content
- **Reorder tasks** — Drag and drop tasks to change the execution sequence
- **Delete tasks** — Remove tasks from a flow with confirmation
- **Edit flow metadata** — Set flow name, description, and tags
- **Save a flow** — Persist the flow configuration
- **View data connections** — See how output from one task feeds into the next
- **Attach flow to agent** — Select a flow and define a slash command (command ID, name, description) to trigger it
- **Configure slash command** — Set the command trigger (e.g., "summarize" → `/summarize`), display name, and description shown to users
- **Toggle slash commands** — Enable/disable individual slash commands on an agent
- **Detach flow from agent** — Remove a flow and its slash command from an agent

## UI Requirements
- **Flow list view** — Table or card grid showing all flows with name, description, task count, last modified date, status, and scope (standalone/agent-specific)
- **Flow detail view** — Main editor with:
  - Flow metadata header (name, description, status badge, scope indicator)
  - Agent context badge when building for a specific agent
  - Linear vertical list of task cards showing execution order
  - Each task card shows: task type icon/name, brief description, status indicator
  - Visual connector lines between cards indicating data flow direction
  - Task cards are expandable to reveal full configuration
  - Drag handles on task cards for reordering
  - Action buttons (edit, delete, duplicate) on each card
  - "Add task" button between tasks and at the end of the list
  - Slash command configuration (when in agent context): command ID input, name, description
- **Task configuration panel** — Modal or slide-out panel for editing task details:
  - Task type selector
  - Name and description fields
  - Type-specific configuration (schema editor, tool picker, transformation editor, prompt textarea)
  - Output schema preview when applicable
- **Slash command card** — Compact display showing:
  - Command trigger with slash prefix (e.g., `/summarize`)
  - Command name and description
  - Associated flow name and task count
  - Enable/disable toggle
  - Edit and detach actions
- **Empty state** — Placeholder when no flows exist with CTA to create first flow
- **Validation feedback** — Show errors for invalid task configurations or disconnected outputs

## Configuration
- shell: true
