# DomainSmith — Product Overview

## Summary

DomainSmith is a multi-user, schema-driven platform that enables domain experts to collaboratively author, visually configure, and deploy highly specialized AI agents without writing code.

The platform provides a modular, file-based approach where experts author isolated prompt fragments (tone, constraints, knowledge) that are automatically assembled into optimized system prompts. Users configure specialized agents through dynamic, type-safe forms generated from directory structures. The system supports isolated workspaces for individual experts and shared environments for cross-functional collaboration, with version-controlled prompt fragments.

## Planned Sections

1. **Prompt Library** — The core workspace where experts author, organize, and manage prompt fragments as a filesystem-based taxonomy of .md files
2. **Agent Builder** — The control panel where users select domains and fill out auto-generated forms to configure and instantiate specialized agents
3. **Agent Runtime** — Deploy, test, and monitor live agents — view generated system prompts, run conversations, and track agent performance
4. **Workspaces** — Manage users, permissions, and shared environments for collaborative agent development across teams and domains

## Product Entities

- **PromptFragment** — An isolated .md file containing a specific piece of agent behavior, knowledge, or constraint
- **Directory** — A folder in the taxonomy that organizes related prompt fragments, with an optional config.json for metadata
- **Schema** — A JSON Schema automatically generated from a directory tree, mapping the hierarchical structure to a type-safe form definition
- **AgentConfig** — A JSON payload generated from user form input, representing the exact configuration choices for an agent instance
- **Agent** — A deployed or runnable agent instance with its assembled system prompt, ready for conversation
- **Workspace** — A shared or isolated environment containing prompt libraries and agents, with access controls for collaboration
- **User** — A domain expert or end user who can author prompt fragments, configure agents, or interact with deployed agents
- **Conversation** — A chat session with an agent, containing messages exchanged between the user and the agent over time

## Design System

**Colors:**
- Primary: violet — Used for buttons, links, key accents, and active navigation states
- Secondary: amber — Used for hover states, subtle highlights, and destructive actions
- Neutral: slate — Used for backgrounds, borders, and text

**Typography:**
- Heading: Space Grotesk — Used for navigation items and headings
- Body: Inter — Used for body text and UI labels
- Mono: JetBrains Mono — Used for code and technical content

## Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell with sidebar navigation
2. **Prompt Library** — Implement the filesystem-based workspace for prompt authoring with split-pane file tree and editor interface
3. **Agent Builder** — Build the form-centric control panel for domain selection and agent configuration with live prompt preview
4. **Agent Runtime** — Create the split-pane explorer for browsing, inspecting, and testing deployed agent instances
5. **Workspaces** — Implement the user and permission management interface with role-based access control

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
