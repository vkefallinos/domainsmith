# Milestone 3: Agent Builder

> **Provide alongside:** `product-plan/product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete, Milestone 2 (Prompt Library) complete

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

Implement the Agent Builder feature — the form-centric control panel where users configure specialized agents by selecting domains and filling out auto-generated forms.

## Overview

The Agent Builder provides a split-view interface with a domain catalog sidebar on the left and a dynamic configuration form on the right. Users select one or more domains (expertise areas), and the system generates a form based on the combined schema. A live preview panel shows the assembled system prompt as users fill out the form. Users can save agent configurations for later use.

**Key Functionality:**
- Browse available domains in the sidebar catalog with descriptions, tags, and category groupings
- Select multiple domains to combine expertise areas
- Fill out dynamically-generated form fields based on selected domain schemas
- View live preview of the generated system prompt with estimated token count
- Save agent configurations with name and description
- Load and edit previously saved agent configurations
- Delete saved agent configurations
- Form validation prevents saving incomplete configurations

## Components Provided

Copy the section components from `product-plan/sections/agent-builder/components/`:

- `AgentBuilder.tsx` — Main component with domain catalog and configuration form
- `DomainCatalog.tsx` — Sidebar listing available domains
- `ConfigurationForm.tsx` — Dynamic form generated from domain schemas
- `PromptPreview.tsx` — Live preview of assembled system prompt
- `SavedAgentsList.tsx` — List of previously saved configurations
- `AgentHeader.tsx` — Header with new/save/load actions

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `domains: Domain[]` — Available domains to select from
- `savedAgentConfigs: AgentConfig[]` — Previously saved agent configurations
- `selectedDomainIds?: string[]` — Currently selected domain IDs
- `formValues?: FormValues` — Current form field values
- `loadedAgentId?: string | null` — Currently loaded agent for editing
- `promptPreview?: PromptPreview` — Live-generated preview
- `isLoading?: boolean` — Loading state
- `validationErrors?: Record<string, string>` — Validation errors by field ID

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onDomainsChange` | User selects/deselects domains |
| `onFieldValueChange` | User changes a form field value |
| `onGeneratePreview` | User requests preview update |
| `onSaveAgent` | User saves the agent configuration |
| `onLoadAgent` | User loads an existing agent |
| `onDeleteAgent` | User deletes a saved agent |
| `onNewAgent` | User clicks to create new agent |

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Create a New Agent

1. User opens Agent Builder
2. User browses domains in the catalog sidebar
3. User clicks on one or more domains (they highlight as selected)
4. Configuration form appears on the right with fields from selected domains
5. User fills in form fields (required fields marked)
6. User sees live prompt preview update as they type
7. User clicks "Save Agent" button
8. User enters agent name and description in modal
9. **Outcome:** Agent configuration is saved and appears in saved agents list

### Flow 2: Edit an Existing Agent

1. User opens Agent Builder
2. User clicks on a saved agent in the list
3. Form populates with previously saved values
4. User modifies domain selections or form values
5. User clicks "Save" to update
6. **Outcome:** Updated agent configuration is saved

### Flow 3: Browse Domains Without Saving

1. User opens Agent Builder
2. User explores different domain categories
3. User selects domains to see what form fields are generated
4. User fills in sample values to preview the prompt
5. User clicks "New Agent" to clear and start over
6. **Outcome:** Form is reset to empty state, no save occurs

## Empty States

The components include empty state designs. Make sure to handle:

- **No domains selected:** Show helpful message inviting user to select domains from catalog
- **No saved agents:** Show empty state in saved agents list when no configurations exist
- **Form validation:** Show inline errors when required fields are empty on save attempt

## Testing

See `product-plan/sections/agent-builder/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Domain selection and form generation
- Prompt preview updates
- Save/load/delete operations
- Validation error handling

## Files to Reference

- `product-plan/sections/agent-builder/README.md` — Feature overview and design intent
- `product-plan/sections/agent-builder/tests.md` — UI behavior test specs
- `product-plan/sections/agent-builder/types.ts` — TypeScript interfaces
- `product-plan/sections/agent-builder/sample-data.json` — Test data with domains and saved agents

## Done When

- [ ] Components render with real domain data
- [ ] Domain multi-selection works with visual feedback
- [ ] Form fields generate correctly based on selected domains
- [ ] Live prompt preview updates as user types
- [ ] Save/load/delete operations work correctly
- [ ] Validation prevents saving incomplete configurations
- [ ] Empty states display appropriately
- [ ] Responsive on mobile
