# Agent Builder Specification

## Overview
A form-centric control panel where users configure specialized agents by selecting multiple domains and filling out auto-generated forms. The split-view interface displays a domain catalog sidebar alongside a dynamic configuration form, with live preview of the generated system prompt and ability to save agent configurations.

## User Flows
- **Create new agent** — Open the builder, select one or more domains from the catalog, configure form fields based on the combined schema, preview the generated prompt, and save the agent configuration
- **Load and edit existing agent** — Select a previously saved agent from the list, modify domain selections or form values, preview updated prompt, and save changes
- **Browse domains** — Explore available domains in the sidebar catalog with descriptions, tags, and form field previews before selecting

## UI Requirements
- Split-view layout: sidebar (domain catalog) on the left, main content (configuration form) on the right
- Domain catalog must support multi-selection with visual indication of selected domains
- Configuration form fields are dynamically generated based on the schema from selected directories/domains
- Live prompt preview panel shows the assembled system prompt as the user fills out the form
- Saved agents list allows loading, editing, and deleting previously created configurations
- Form validation prevents saving incomplete configurations
- Clear visual distinction between required and optional form fields

## Configuration
- shell: true
