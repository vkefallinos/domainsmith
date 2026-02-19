# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **Directory** — A folder that can contain other directories and/or prompt fragments, with optional metadata configuration (used in: Prompt Library)
- **PromptFragment** — A markdown file containing prompt content with optional frontmatter metadata (used in: Prompt Library)
- **Domain** — An available domain/expertise area that can be selected when building an agent (used in: Agent Builder)
- **SchemaField** — A single form field definition within a domain's schema (used in: Agent Builder)
- **AgentConfig** — A saved agent configuration containing selected domains and form values (used in: Agent Builder, Agent Runtime)
- **Agent** — A deployed agent instance with an assembled system prompt, ready for conversation (used in: Agent Runtime)
- **Message** — A single message in a conversation thread (used in: Agent Runtime)
- **Conversation** — A chat session containing messages exchanged between user and agent (used in: Agent Runtime)
- **WorkspaceUser** — A user within the workspace with profile information, role, and status (used in: Workspaces)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/prompt-library/types.ts`
- `sections/agent-builder/types.ts`
- `sections/agent-runtime/types.ts`
- `sections/workspaces/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.
