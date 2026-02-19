# Agent Runtime Specification

## Overview
A split-pane explorer for browsing, inspecting, and testing deployed agent instances. Users can view agents generated from Agent Builder, inspect their assembled system prompts, and run test conversations to validate agent behavior before production use.

## User Flows
- **Browse agents** — Scan the left-pane list to see all available agents with their domain/source and timestamps
- **Inspect prompt** — Select an agent and expand the collapsible panel to view the full generated system prompt
- **Test conversation** — Select an agent, type a message in the conversation area, and receive agent responses in real-time
- **Switch contexts** — Click between agents in the list to load their detail pane and conversation history

## UI Requirements
- Split-pane layout with agent list on the left (30-40% width) and detail pane on the right
- Left pane displays agent name, domain/schema source, and creation/last-used timestamps
- Right pane contains a chat-style conversation interface with message input
- A collapsible panel in the detail pane reveals the full generated system prompt
- Messages display in a conversation view similar to Claude/ChatGPT (user and assistant messages in a single stream)
- No inline actions in the list — management happens through the detail pane
- No editing of agent configuration — that's handled in Agent Builder

## Configuration
- shell: true
