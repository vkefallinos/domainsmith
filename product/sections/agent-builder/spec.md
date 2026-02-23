# Agent Builder Specification

## Overview
A multi-view control panel where users configure specialized agents by selecting domains, filling out auto-generated forms, managing tools, and attaching flows with slash commands. The builder automatically enables tools based on field selections, shows tool-to-field mappings, and allows additional tools from the library to be added and configured. Flows can be attached to agents with custom slash command triggers (e.g., `/summarize`, `/analyze`) that users can type during conversations to invoke multi-step task sequences. Agents can be saved as templates or deployed directly to runtime.

## User Flows
- **Create new agent** — Select domains → auto-generated form appears → fill values → tools auto-enable based on selections → add optional tools from library → attach flows with slash commands → save as template or deploy
- **Add tools from library** — Open tool library modal → search/browse tools → select tool → configure tool parameters → tool is added to enabled tools list
- **Attach flow to agent** — Open flow builder modal → create new flow or select existing → configure slash command (command ID, name, description) → attach to agent
- **Configure slash command** — Set the command trigger word (e.g., "summarize" → users type `/summarize`), display name, and description shown to users in conversation
- **Manage attached flows** — View all flows attached to the agent with their slash commands → enable/disable commands → edit command configuration → detach flows
- **Save agent template** — Configure agent → enter template name and description → save → appears in saved templates list for future reuse
- **Deploy to runtime** — Configure agent → click deploy → agent is instantiated with current configuration → redirects to Agent Runtime
- **Enable fields for runtime configuration** — Click "Runtime" toggle on any field → field becomes non-editable placeholder showing "Configured at Runtime" → field will be filled later in Agent Runtime
- **Pre-fill fields with values** — Fill in form fields normally → values are saved with the agent configuration

## UI Requirements
- **Form Builder View**: Domain selector sidebar, auto-generated form fields based on selected domains, enabled tools list with tool-to-field mapping, tool configuration status indicators, slash commands section, live system prompt preview
- **Slash Commands Section**: Panel showing all attached flows with their slash commands — each card displays `/command`, flow name, task count, enable/disable toggle, and actions (edit, detach)
- **Add Slash Command Button**: Opens flow builder modal to create new flow or select existing one, then configure command trigger
- **Field Runtime Toggle**: Every field has a "Runtime" toggle button that switches the field between "pre-fill now" mode and "configure at runtime" mode
- **Runtime Field Display**: When runtime mode is active, field shows as amber-dashed placeholder with "Configured at Runtime" message, not editable in the builder
- **Normal Field Display**: When runtime mode is off, field is editable and can be pre-filled with values
- **Tool Library Modal**: Searchable list of available tools with categories, tool selection, configuration panel for tool parameters (when tool requires configuration), add/remove toggle
- **Flow Builder Modal**: Full flow editor interface with task cards, slash command configuration panel (command ID, name, description), and flow selection for reuse
- **Saved Templates List**: Grid/list of saved agent configurations with name, description, last modified, quick actions (edit, duplicate, delete)
- **Enabled Tools Display**: Shows all tools enabled (auto + manual), indicates which tools came from which field selections, shows configuration status (installed/needs config/ready)
- **Shell Integration**: View renders inside the app shell with navigation header

## Configuration
- shell: true
