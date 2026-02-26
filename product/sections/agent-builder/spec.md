# Agent Builder Specification

## Overview
A multi-view control panel where users configure specialized agents by selecting domains, filling out auto-generated forms, manually managing tools, and attaching flows with slash commands. Flows can be attached to agents with custom slash command triggers (e.g., `/summarize`, `/analyze`) that users can type during conversations to invoke multi-step task sequences. Agents are saved as templates for reuse in the Agent Runtime.

## User Flows
- **Create new agent** — Select domains → auto-generated form appears → fill values → add tools from library → attach flows with slash commands → save as template
- **Add tools from library** — Open tool library modal → search/browse tools → select tool → configure tool parameters → tool is added to enabled tools list
- **Attach flow to agent** — Open flow selector modal → select existing flow → configure slash command (command ID, name, description) → attach to agent
- **Configure slash command** — Set the command trigger word (e.g., "summarize" → users type `/summarize`), display name, and description shown to users in conversation
- **Manage attached flows** — View all flows attached to the agent with their slash commands → enable/disable commands → edit command configuration → detach flows
- **Save agent template** — Configure agent → enter template name and description → save → appears in saved templates list for future reuse
- **Enable fields for runtime configuration** — Click "Runtime" toggle on any field → field becomes non-editable placeholder showing "Configured at Runtime" → field will be filled later in Agent Runtime
- **Pre-fill fields with values** — Fill in form fields normally → values are saved with the agent configuration

## UI Requirements
- **Form Builder View**: Domain selector sidebar, auto-generated form fields based on selected domains (fields grouped by domain in UI, each domain section shows domain name and its fields), enabled tools list, tool configuration status indicators, slash commands section, live system prompt preview
- **Multi-Domain Templates**: When multiple domains are selected, their templates are concatenated with newlines between them. Field IDs are scoped per domain (each domain has its own namespace, no conflicts)
- **Slash Commands Section**: Panel showing all attached flows with their slash commands — each card displays `/command`, flow name, task count, enable/disable toggle, and actions (edit, detach)
- **Add Slash Command Button**: Opens flow selector modal to select existing flow, then configure command trigger
- **Slash Command Validation**: Command IDs must be lowercase letters, numbers, and hyphens only (regex: `^[a-z0-9-]+$`), must be unique within an agent, duplicates show validation error. No reserved commands. System matches against agent's attached commands at runtime (no global registry)
- **Field Runtime Toggle**: Every field has a "Runtime" toggle button that switches the field between "pre-fill now" mode and "configure at runtime" mode
- **Runtime Field Display**: When runtime mode is active, field shows as amber-dashed placeholder with "Configured at Runtime" message, not editable in the builder
- **Normal Field Display**: When runtime mode is off, field is editable and can be pre-filled with values
- **Field Type Controls**: `select` = dropdown menu (single selection), `multiselect` = dropdown with checkbox multi-select or tag-based input with autocomplete, `textarea` = 4 rows minimum resizable by user, `toggle` = switch component (not checkbox), `text` = single-line text input
- **Tool Library Modal**: Searchable list of available tools with categories, tool selection, configuration panel for tool parameters (when tool requires configuration), add/remove toggle
- **Tool Configuration Schema**: Each tool defines its own config schema (JSON Schema), modal reads schema and generates appropriate form fields, validates config before adding, errors shown inline
- **Enabled Tools Display**: Shows all manually added tools with configuration status (installed/needs config/ready)
- **Flow Selector Modal**: List of existing flows with search/filter from Flow Builder section (prop: `availableFlows`), select a flow → configure slash command (command ID, name, description) → attach. Flow editing done in Flow Builder section, not this modal
- **Saved Templates List**: Grid/list of saved agent configurations with name, description, last modified, quick actions (edit, duplicate, delete)
- **Save Behavior**: Templates stored in backend and retrieved via props. No deploy action; deployment happens when user selects template in Agent Runtime section
- **Agent Deletion**: Show confirmation dialog before deletion. No recovery (permanently removed). If template deleted, existing runtime instances continue working but template unavailable for new instances
- **Prompt Preview**: Live-generated preview using Handlebars syntax — variables `{{fieldName}}`, conditionals `{{#if fieldName}}...{{/if}}`. Multi-select values joined with ", ". Empty fields render as empty string. Runtime fields show "(configured at runtime)" placeholder in preview
- **Prompt Preview Update Timing**: Regenerated on domain change, field value change, or slash command attachment. 500ms debounce after field changes. Show skeleton/spinner while regenerating
- **Shell Integration**: View renders inside the app shell with navigation header

## Configuration
- shell: true
