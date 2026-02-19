# Test Specs: Agent Runtime

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Agent Runtime is a split-pane explorer for browsing, inspecting, and testing deployed agent instances. Users can view agents, inspect their system prompts, and run test conversations.

---

## User Flow Tests

### Flow 1: Test an Agent Conversation

**Scenario:** User sends messages to an agent and receives responses

#### Success Path

**Setup:**
- Agent Runtime is loaded with available agents
- "GDPR Compliance Advisor" agent exists and is deployed
- Agent has no existing conversation (fresh state)

**Steps:**
1. User navigates to Agent Runtime
2. User sees list of agents on the left with names and sources
3. User clicks on "GDPR Compliance Advisor"
4. User sees conversation interface on the right
5. User sees "View System Prompt" button at top of detail pane
6. User types in message input: "I'm planning to collect email addresses for a newsletter. What do I need to consider for GDPR compliance?"
7. User clicks Send button (or presses Enter)
8. User message appears in conversation stream
9. After short delay, agent response appears below user message
10. **Outcome:** Conversation continues with both messages visible

**Expected Results:**
- [ ] Agent list shows agent name, source domain, and last-used timestamp
- [ ] Clicking agent highlights it as selected (violet background)
- [ ] Detail pane shows agent name and description
- [ ] Message input is at bottom, enabled and focused
- [ ] User message appears immediately after sending
- [ ] User message shows right-aligned or distinct styling
- [ ] Agent response appears with loading indicator then content
- [ ] Agent response shows left-aligned or distinct styling
- [ ] Input clears after sending, ready for next message
- [ ] Scroll position updates to show newest message

#### Failure Path: Message Send Error

**Steps:**
1. User selects an agent
2. User types and sends a message
3. Backend returns error (e.g., agent unavailable, network failure)

**Expected Results:**
- [ ] Error message appears: "Failed to send message. Please try again."
- [ ] User message remains in conversation (not lost)
- [ ] Input field retains the message text for retry
- [ ] Retry is possible

### Flow 2: View Agent's System Prompt

**Scenario:** User inspects the system prompt that defines an agent's behavior

#### Success Path

**Setup:**
- "GDPR Compliance Advisor" agent is selected
- System prompt panel is initially collapsed

**Steps:**
1. User clicks "View System Prompt" button
2. Panel expands showing the full system prompt
3. User reads the prompt content
4. User clicks "Hide System Prompt" or toggle
5. Panel collapses

**Expected Results:**
- [ ] "View System Prompt" button is visible in header
- [ ] Clicking expands a panel below header (overlay or section)
- [ ] Panel shows the full assembled system prompt text
- [ ] Prompt displays with proper formatting (line breaks, sections)
- [ ] Toggle button text changes to "Hide System Prompt"
- [ ] Collapsing hides the panel, restoring conversation view
- [ ] Conversation scroll position is preserved

### Flow 3: Switch Between Agents

**Scenario:** User switches from testing one agent to another

#### Success Path

**Setup:**
- User has active conversation with "GDPR Compliance Advisor"
- "Network Security Analyst" agent also exists

**Steps:**
1. User clicks "Network Security Analyst" in the left list
2. Detail pane updates to show the new agent
3. User sees the new agent's conversation history (if any)
4. Previous agent's conversation is no longer visible

**Expected Results:**
- [ ] Clicking different agent updates selection immediately
- [ ] New agent's name and description appear in header
- [ ] New agent's conversation history loads
- [ ] System prompt panel reflects new agent
- [ ] Message input is ready for new conversation
- [ ] Previous agent's state is preserved (not lost)

### Flow 4: Clear Conversation

**Scenario:** User wants to start a fresh conversation with an agent

#### Success Path

**Setup:**
- User has existing conversation with multiple messages

**Steps:**
1. User clicks "Clear Conversation" button
2. Confirmation dialog appears: "Clear all messages in this conversation?"
3. User clicks "Clear"
4. Conversation messages are removed
5. **Outcome:** Fresh conversation state, ready for new messages

**Expected Results:**
- [ ] "Clear Conversation" button is visible (in header or near input)
- [ ] Confirmation dialog shows warning about losing history
- [ ] After confirmation, all messages disappear
- [ ] Empty state message appears: "Start a conversation to test this agent"
- [ ] Agent selection remains the same
- [ ] System prompt is preserved

---

## Empty State Tests

### No Agent Selected Empty State

**Scenario:** No agent is currently selected

**Setup:**
- Agent Runtime is loaded
- No agent has been clicked yet

**Expected Results:**
- [ ] Detail pane shows "No agent selected" message
- [ ] Helpful text: "Select an agent from the list to test it"
- [ ] Conversation area is empty/hidden
- [ ] Message input is disabled or hidden

### No Conversation Empty State

**Scenario:** Agent is selected but has no message history

**Setup:**
- An agent is selected
- Conversation has no messages yet

**Expected Results:**
- [ ] Conversation area shows "Start a conversation" message
- [ ] Helpful text: "Type a message below to test this agent"
- [ ] Message input is enabled and focused
- [ ] System prompt can still be viewed

### Empty Agent List Empty State

**Scenario:** No agents have been deployed yet

**Setup:**
- Agent list is empty

**Expected Results:**
- [ ] Left panel shows "No agents available" message
- [ ] Helpful text: "Create agents in the Agent Builder to test them here"
- [ ] Link/button to navigate to Agent Builder

---

## Component Interaction Tests

### Agent List

**Renders correctly:**
- [ ] Shows agent name as primary label
- [ ] Shows source/domain as secondary text
- [ ] Shows "Last used" timestamp
- [ ] Selected agent has violet background
- [ ] Status indicator shows agent state (ready, starting, error)

**User interactions:**
- [ ] Clicking agent selects it
- [ ] Hover shows visual feedback
- [ ] Keyboard navigation with arrow keys
- [ ] Scrollable when many agents exist

### Conversation Panel

**Renders correctly:**
- [ ] Agent name and description in header
- [ ] Messages show in chronological order
- [ ] User messages styled differently from agent messages
- [ ] Timestamps show on messages
- [ ] Input at bottom with Send button

**User interactions:**
- [ ] Typing enables Send button
- [ ] Enter sends message, Shift+Enter adds newline
- [ ] Clicking Send sends message
- [ ] Conversation scrolls to bottom on new message
- [ ] Scroll position can be manually adjusted

### System Prompt Panel

**Renders correctly:**
- [ ] Shows assembled prompt text
- [ ] Text is formatted (line breaks, sections)
- [ ] Panel has toggle button

**User interactions:**
- [ ] Toggle expands/collapses panel
- [ ] Panel can be scrolled if content is long
- [ ] Copy button copies prompt to clipboard

---

## Edge Cases

- [ ] Handles very long agent messages (1000+ tokens)
- [ ] Handles rapid message sending (debouncing)
- [ ] Handles agent that takes long to respond (loading indicator)
- [ ] Handles agent that returns an error response
- [ ] Preserves conversation when navigating away and back
- [ ] Handles many messages in conversation (scroll performance)
- [ ] Handles very long system prompts (scroll within panel)

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Messages have proper ARIA attributes for role
- [ ] Focus management when switching agents
- [ ] Error messages are announced to screen readers
- [ ] Input has proper label and instructions
