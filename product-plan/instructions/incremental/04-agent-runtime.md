# Milestone 4: Agent Runtime

> **Provide alongside:** `product-plan/product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete, Milestone 3 (Agent Builder) complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the Agent Runtime feature — a split-pane explorer for browsing, inspecting, and testing deployed agent instances.

## Overview

The Agent Runtime provides a split-pane interface with an agent list on the left and a detail pane on the right. Users can view agents that were generated from the Agent Builder, inspect their assembled system prompts, and run test conversations to validate agent behavior before production use. This is the testing and validation environment for all deployed agents.

**Key Functionality:**
- Browse all available agents in the left-pane list with name, domain/source, and timestamps
- Select an agent to view its details and conversation history
- Expand the collapsible panel to view the full generated system prompt
- Run test conversations by typing messages and receiving agent responses in real-time
- Switch between agents by clicking different items in the list
- Clear conversation history to start a new test session

## Components Provided

Copy the section components from `product-plan/sections/agent-runtime/components/`:

- `AgentRuntime.tsx` — Main split-pane component with agent list and detail view

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `agents: Agent[]` — List of all available agents
- `selectedAgentId: string | null` — Currently selected agent (null if none)
- `conversation: Conversation | null` — Active conversation for selected agent
- `isPromptPanelExpanded: boolean` — Whether system prompt panel is expanded
- `isLoading: boolean` — Whether a new message is being sent

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSelectAgent` | User clicks an agent in the list |
| `onSendMessage` | User sends a new message |
| `onTogglePromptPanel` | User toggles system prompt panel visibility |
| `onClearConversation` | User clears the conversation |
| `onRestartAgent` | User restarts the agent |

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Test an Agent Conversation

1. User navigates to Agent Runtime
2. User sees list of agents on the left with their names and sources
3. User clicks on an agent (e.g., "GDPR Compliance Advisor")
4. User sees the conversation interface on the right
5. User types a message in the input field at the bottom
6. User presses Enter or clicks Send
7. **Outcome:** Message appears in conversation stream, agent response appears below it after a short delay

### Flow 2: View Agent's System Prompt

1. User selects an agent from the list
2. User clicks "View System Prompt" button or header
3. Panel expands showing the full assembled system prompt
4. **Outcome:** User can read the complete prompt that defines the agent's behavior

### Flow 3: Switch Between Agents

1. User has an active conversation with one agent
2. User clicks a different agent in the left list
3. **Outcome:** Detail pane updates to show the new agent's info and conversation history

### Flow 4: Clear and Restart Conversation

1. User has an existing conversation with messages
2. User clicks "Clear Conversation" button
3. **Outcome:** Conversation messages are cleared, ready for new test session

## Empty States

The components include empty state designs. Make sure to handle:

- **No agent selected:** Show helpful message in detail pane when no agent is selected
- **No conversation yet:** Show empty state in conversation area when starting fresh
- **Empty agent list:** Show message when no agents have been deployed yet

## Testing

See `product-plan/sections/agent-runtime/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Message sending and receiving
- System prompt inspection
- Agent switching
- Empty state rendering

## Files to Reference

- `product-plan/sections/agent-runtime/README.md` — Feature overview and design intent
- `product-plan/sections/agent-runtime/tests.md` — UI behavior test specs
- `product-plan/sections/agent-runtime/types.ts` — TypeScript interfaces
- `product-plan/sections/agent-runtime/sample-data.json` — Test data with agents and conversations

## Done When

- [ ] Components render with real agent data
- [ ] Agent list displays with name, source, and timestamps
- [ ] Clicking an agent loads its conversation history
- [ ] Sending messages works and responses appear
- [ ] System prompt panel expands/collapses
- [ ] Switching between agents works correctly
- [ ] Empty states display appropriately
- [ ] Responsive on mobile
