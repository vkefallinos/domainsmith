# Agent Runtime Specification

## Overview
A two-panel interface where users configure and run agent conversations. The left panel displays runtime fields (marked for configuration at runtime) and enabled tools with their source mappings. The right panel contains the chat interface for testing the agent. Users access this from an agent selection view.

## User Flows
- **Select agent** — From agent list view, click an agent to enter runtime view
- **Configure runtime fields** — Fill in fields that were marked "configure at runtime" in Agent Builder (shown in left panel)
- **View tools** — See all enabled tools with their metadata and which field enabled them
- **Run conversation** — Send messages and receive responses in the chat panel
- **Back to list** — Return to agent list to select a different agent

## UI Requirements
- **Agent List View**: Grid/list of available agents with name, description, domain count, and last modified timestamp
- **Runtime View Layout**: Two-panel design with runtime fields + tools (left, 35-40%) and chat interface (right, 60-65%)
- **Left Panel**:
  - Runtime fields section: form fields marked for runtime configuration, editable
  - Tools section: list of enabled tools showing name, icon, package, version, and source field mapping
- **Right Panel**: Chat-style conversation interface with message input and response display
- **Shell Integration**: View renders inside the app shell with navigation header

## Configuration
- shell: true
