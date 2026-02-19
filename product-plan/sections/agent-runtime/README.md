# Agent Runtime

## Overview

A split-pane explorer for browsing, inspecting, and testing deployed agent instances. Users can view agents generated from Agent Builder, inspect their assembled system prompts, and run test conversations to validate agent behavior before production use.

## User Flows

- **Browse agents** — Scan the left-pane list to see all available agents with their domain/source and timestamps
- **Inspect prompt** — Select an agent and expand the collapsible panel to view the full generated system prompt
- **Test conversation** — Select an agent, type a message in the conversation area, and receive agent responses in real-time
- **Switch contexts** — Click between agents in the list to load their detail pane and conversation history

## Design Decisions

- Split-pane layout provides context — users see the list while testing
- No inline actions in the list keeps the UI clean and focused
- Messages display in a single stream (like Claude/ChatGPT) rather than separate bubbles
- System prompt is collapsible to maximize conversation space
- Agents are read-only in this view — editing happens in Agent Builder

## Data Shapes

**Entities:**
- `Agent` — Deployed agent instance with assembled system prompt
- `AgentSource` — Reference to schema/workspace that generated the agent
- `Conversation` — Chat session with message history
- `Message` — Individual message with role (user/assistant) and content

**From global entities:** Workspace, User

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `AgentRuntime` — Main split-pane component with agent list and conversation interface

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectAgent` | User clicks an agent in the list |
| `onSendMessage` | User sends a new message |
| `onTogglePromptPanel` | User toggles system prompt panel visibility |
| `onClearConversation` | User clears the conversation history |
| `onRestartAgent` | User restarts the agent |
