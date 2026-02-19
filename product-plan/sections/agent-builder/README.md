# Agent Builder

## Overview

A form-centric control panel where users configure specialized agents by selecting multiple domains and filling out auto-generated forms. The split-view interface displays a domain catalog sidebar alongside a dynamic configuration form, with live preview of the generated system prompt and ability to save agent configurations.

## User Flows

- **Create new agent** — Open the builder, select one or more domains from the catalog, configure form fields based on the combined schema, preview the generated prompt, and save the agent configuration
- **Load and edit existing agent** — Select a previously saved agent from the list, modify domain selections or form values, preview updated prompt, and save changes
- **Browse domains** — Explore available domains in the sidebar catalog with descriptions, tags, and form field previews before selecting

## Design Decisions

- Multi-domain selection allows combining expertise areas (e.g., cybersecurity + data privacy)
- Live preview provides immediate feedback on how form values affect the final prompt
- Form generation from schemas enables extensibility — new domains can be added without code changes
- Saved agents list supports quick iteration and version management
- Validation prevents incomplete configurations from being saved

## Data Shapes

**Entities:**
- `Domain` — Expertise areas with schema defining form fields and prompt template
- `DomainSchema` — Defines form fields (type, label, required, options, default)
- `SchemaField` — Individual form field definition
- `FormValues` — Map of field IDs to their values
- `AgentConfig` — Saved agent configuration with domains, values, and timestamps
- `PromptPreview` — Live-generated preview with assembled prompt and token count

**From global entities:** Workspace, User

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `AgentBuilder` — Main component orchestrating the builder interface
- `DomainCatalog` — Sidebar listing available domains by category
- `ConfigurationForm` — Dynamic form generated from domain schemas
- `PromptPreview` — Panel showing assembled system prompt
- `SavedAgentsList` — List of previously saved agent configurations
- `AgentHeader` — Header with new/save/load actions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onDomainsChange` | User selects/deselects domains from catalog |
| `onFieldValueChange` | User changes a form field value |
| `onGeneratePreview` | User requests prompt preview update |
| `onSaveAgent` | User saves the agent configuration |
| `onLoadAgent` | User loads an existing agent |
| `onDeleteAgent` | User deletes a saved agent configuration |
| `onNewAgent` | User clicks to create new agent (clear form) |
