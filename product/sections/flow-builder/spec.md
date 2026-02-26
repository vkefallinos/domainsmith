# Flow Builder Specification

## Overview
A visual flow editor within Agent Builder that allows users to create sequential task flows. Flows have exactly two task types: `updateFlowOutput` which partially updates flow output data and passes structured output to the next task, and `executeTask` which performs operations without passing structured output to the next task. Tasks can push to array fields, add keys to output objects, set data schemas, enable prompt fragments with field values, enable tools, and set task instructions. Flows can be created as standalone reusable flows or built in the context of a specific agent. When attached to an agent, flows are triggered by slash commands (e.g., `/summarize`, `/analyze`) that users type during conversation.

### Task Types

#### updateFlowOutput
Partially updates flow output data and passes structured output to the next task in sequence. Use when the next task needs to consume the output of this task.

**Capabilities:**
- **outputSchema** — Define JSON schema for the structured output passed to the next task
- **fieldUpdates** — Add or update specific keys in the flow output object
- **arrayPushes** — Push items to array fields in the flow output
- **promptFragmentFields** — Enable specific prompt fragments based on field values
- **enabledTools** — List of tool IDs that can be used during this task
- **taskInstructions** — Natural language instructions for task execution
- **model** — LLM model identifier to use
- **temperature** — Temperature setting for LLM generation (0-1)

#### executeTask
Same capabilities as updateFlowOutput, but structured output is NOT passed to the next task. Use for operations that should not influence downstream tasks, such as tool calls, side effects, or final output generation.

**Capabilities:**
- All the same configuration options as updateFlowOutput
- Structured output remains internal to the task and is not available to subsequent tasks

## User Flows
- **Browse flows** — View a list of all flows in the current workspace with summary info
- **Create a new flow** — Start with a blank canvas and add the first task
- **Create flow for agent** — When building an agent, create a flow specifically for that agent with a slash command trigger
- **Add tasks to a flow** — Insert tasks of type updateFlowOutput or executeTask
- **Configure task details** — Define output schemas, field updates, array pushes, enabled tools, prompt fragments, and task instructions
- **Reorder tasks** — Drag and drop tasks to change the execution sequence
- **Delete tasks** — Remove tasks from a flow with confirmation
- **Edit flow metadata** — Set flow name, description, and tags
- **Save a flow** — Persist the flow configuration
- **View data connections** — See how output from updateFlowOutput tasks feeds into the next task
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
  - Each task card shows: task type (updateFlowOutput/executeTask), brief description, status indicator
  - Visual connector lines between updateFlowOutput tasks indicating data flow direction
  - Task cards are expandable to reveal full configuration
  - Drag handles on task cards for reordering
  - Action buttons (edit, delete, duplicate) on each card
  - "Add task" button between tasks and at the end of the list
  - Task type selector when adding new tasks (updateFlowOutput vs executeTask)
  - Slash command configuration (when in agent context): command ID input, name, description
- **Task configuration panel** — Modal or slide-out panel for editing task details:
  - Task type selector (updateFlowOutput/executeTask)
  - Name and description fields
  - Output schema editor (JSON schema with validation)
  - Field updates editor (key-value pairs for adding/updating output fields)
  - Array push operations editor (target field, items to push)
  - Prompt fragment configuration (fragment ID, enabling field values)
  - Tool picker (multi-select from available tools)
  - Task instructions textarea
  - Model and temperature controls
  - Preview of structured output when applicable
- **Slash command card** — Compact display showing:
  - Command trigger with slash prefix (e.g., `/summarize`)
  - Command name and description
  - Associated flow name and task count
  - Enable/disable toggle
  - Edit and detach actions
- **Empty state** — Placeholder when no flows exist with CTA to create first flow
- **Validation feedback** — Show errors for invalid task configurations or schemas
- **Data flow indicators** — Visual distinction between updateFlowOutput (passes data) and executeTask (does not pass data) tasks

## Configuration
- shell: true
