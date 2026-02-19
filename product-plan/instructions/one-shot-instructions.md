# DomainSmith — Complete Implementation Instructions

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

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

# Product Overview

DomainSmith is a multi-user, schema-driven platform that enables domain experts to collaboratively author, visually configure, and deploy highly specialized AI agents without writing code.

The platform provides a modular, file-based approach where experts author isolated prompt fragments (tone, constraints, knowledge) that are automatically assembled into optimized system prompts. Users configure specialized agents through dynamic, type-safe forms generated from directory structures. The system supports isolated workspaces for individual experts and shared environments for cross-functional collaboration, with version-controlled prompt fragments.

## Planned Sections

1. **Shell** — Set up design tokens and application shell with sidebar navigation
2. **Prompt Library** — Implement the filesystem-based workspace for prompt authoring with split-pane file tree and editor interface
3. **Agent Builder** — Build the form-centric control panel for domain selection and agent configuration with live prompt preview
4. **Agent Runtime** — Create the split-pane explorer for browsing, inspecting, and testing deployed agent instances
5. **Workspaces** — Implement the user and permission management interface with role-based access control

---

# Milestone 1: Shell

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar

**Wire Up Navigation:**

Connect navigation to your routing:

| Label | Route |
|-------|-------|
| Dashboard | `/` |
| Prompt Library | `/prompt-library` |
| Agent Builder | `/agent-builder` |
| Agent Runtime | `/agent-runtime` |
| Workspaces | `/workspaces` |

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional)
- Logout callback

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info
- [ ] Responsive on mobile (hamburger menu works)

---

# Milestone 2: Prompt Library

## Goal

Implement the Prompt Library feature — the core workspace where experts author, organize, and manage prompt fragments as a filesystem-based taxonomy of .md files.

## Overview

The Prompt Library provides a split-pane interface with a hierarchical file tree on the left and a WYSIWYG editor on the right. Domain experts create and modify prompt fragments as markdown files organized in folders, with support for frontmatter metadata. This is the foundational content management system for all domain knowledge that will be used to build specialized agents.

**Key Functionality:**
- Browse the hierarchical file tree to explore prompt fragments by domain or category
- View any file by clicking it in the tree to load its content in the editor pane
- Create new files with the "New" button, providing filename and parent folder location
- Edit file content in the WYSIWYG editor with markdown support
- Create folders for organizing related fragments
- Rename or move files and folders through context menus
- Delete files or folders from the library
- Expand and collapse folders in the tree view

## Components Provided

Copy the section components from `product-plan/sections/prompt-library/components/`:

- `PromptLibrary.tsx` — Main split-pane component with file tree and editor

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `fileSystem: Directory` — The complete file system tree structure
- `selectedFile: PromptFragment | null` — Currently selected file (if any)
- `expandedFolders: string[]` — Array of folder paths that should be expanded
- `unsavedChanges: boolean` — Whether the current editor has unsaved changes
- `isLoading?: boolean` — Whether a file operation is in progress
- `error?: string | null` — Error message to display

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSelectFile` | User clicks a file in the tree |
| `onToggleFolder` | User clicks to expand/collapse a folder |
| `onEditContent` | User types in the editor |
| `onSave` | User clicks save or presses Ctrl+S |
| `onCreateFile` | User submits the new file form |
| `onCreateFolder` | User submits the new folder form |
| `onRename` | User renames a node |
| `onMove` | User moves a node to a new parent |
| `onDelete` | User deletes a node |

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Browse and View a Fragment

1. User navigates to Prompt Library
2. User sees the hierarchical file tree on the left with folders expanded
3. User clicks on a file (e.g., "dns-concepts.md")
4. **Outcome:** File content loads in the editor pane on the right

### Flow 2: Create a New Prompt Fragment

1. User clicks the "New" button in the toolbar
2. User selects "File" from the dropdown
3. User enters filename (e.g., "firewall-rules.md")
4. User selects parent folder from dropdown
5. User clicks "Create"
6. **Outcome:** New file appears in tree, editor opens with blank content, focus is in editor

### Flow 3: Edit and Save a Fragment

1. User opens a file from the tree
2. User makes changes in the WYSIWYG editor
3. User sees unsaved changes indicator (dot or asterisk)
4. User clicks "Save" button or presses Ctrl+S
5. **Outcome:** Changes are saved, unsaved indicator disappears

## Empty States

The components include empty state designs. Make sure to handle:

- **No file selected:** Show helpful message in editor pane when no file is selected
- **Empty library:** Show CTA to create first fragment when library is empty
- **Empty folder:** Handle folders with no children (expandable but shows empty state)

## Testing

See `product-plan/sections/prompt-library/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/prompt-library/README.md` — Feature overview
- `product-plan/sections/prompt-library/tests.md` — UI behavior test specs
- `product-plan/sections/prompt-library/types.ts` — TypeScript interfaces
- `product-plan/sections/prompt-library/sample-data.json` — Test data

---

# Milestone 3: Agent Builder

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

## Empty States

- **No domains selected:** Show helpful message inviting user to select domains from catalog
- **No saved agents:** Show empty state in saved agents list when no configurations exist
- **Form validation:** Show inline errors when required fields are empty on save attempt

## Testing

See `product-plan/sections/agent-builder/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/agent-builder/README.md` — Feature overview
- `product-plan/sections/agent-builder/tests.md` — UI behavior test specs
- `product-plan/sections/agent-builder/types.ts` — TypeScript interfaces
- `product-plan/sections/agent-builder/sample-data.json` — Test data

---

# Milestone 4: Agent Runtime

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

## Empty States

- **No agent selected:** Show helpful message in detail pane when no agent is selected
- **No conversation yet:** Show empty state in conversation area when starting fresh
- **Empty agent list:** Show message when no agents have been deployed yet

## Testing

See `product-plan/sections/agent-runtime/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/agent-runtime/README.md` — Feature overview
- `product-plan/sections/agent-runtime/tests.md` — UI behavior test specs
- `product-plan/sections/agent-runtime/types.ts` — TypeScript interfaces
- `product-plan/sections/agent-runtime/sample-data.json` — Test data

---

# Milestone 5: Workspaces

## Goal

Implement the Workspaces feature — a user and permission management interface for administrators to manage workspace members with role-based access control.

## Overview

The Workspaces section provides a two-panel layout with a user list sidebar on the left and a detail panel on the right. Administrators can view all workspace users, see their status and role, and modify permissions. The interface supports three roles (Admin, Editor, Viewer) and three statuses (active, invited, pending). This is where collaboration and access control are managed for the platform.

**Key Functionality:**
- View all users in the workspace via the sidebar list with avatars and status indicators
- Click a user to view their profile, status, and role in the main detail panel
- Edit a user's role (Admin, Editor, or Viewer) from the detail panel
- Add a new user by entering their email and assigning an initial role
- Remove a user from the workspace with confirmation
- Filter or search for users by name or email
- See visual status badges for user state (active, invited, pending)

## Components Provided

Copy the section components from `product-plan/sections/workspaces/components/`:

- `Workspaces.tsx` — Main component with user list sidebar and detail panel
- `WorkspaceList.tsx` — Sidebar listing all workspace users
- `UserDetailPanel.tsx` — Detail panel showing selected user's profile and role editor

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `users: WorkspaceUser[]` — All users in the current workspace
- `roles: RoleDefinition[]` — Available role definitions (Admin, Editor, Viewer)
- `selectedUserId?: string | null` — Currently selected user for detail view
- `searchQuery?: string` — Current search/filter query

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSelectUser` | User clicks a user in the sidebar |
| `onSearchChange` | User types in search input |
| `onUpdateRole` | User changes a user's role |
| `onInviteUser` | User invites a new user |
| `onRemoveUser` | User removes a user from workspace |
| `onCancel` | User cancels edits |

## Expected User Flows

### Flow 1: View and Edit User Role

1. User navigates to Workspaces
2. User sees list of all workspace members in the sidebar
3. User clicks on a user (e.g., "Sarah Chen")
4. User sees the user's profile in the detail panel with current role (Editor)
5. User clicks the role dropdown and selects "Admin"
6. User clicks "Save" button
7. **Outcome:** User's role is updated to Admin, detail panel shows new role

### Flow 2: Invite a New User

1. User clicks "Invite User" button
2. User enters email address (e.g., "newuser@example.com")
3. User selects initial role (e.g., "Viewer")
4. User clicks "Send Invitation"
5. **Outcome:** New user appears in sidebar with "invited" status badge

## Role Definitions

| Role | Permissions |
|------|-------------|
| Admin | Full access to all workspace features, including user management |
| Editor | Can create and modify agents and prompt fragments, but cannot manage users |
| Viewer | Read-only access to workspace content |

## Empty States

- **No user selected:** Show helpful message in detail panel when no user is selected
- **Empty workspace:** Show CTA to invite first user when workspace has no members
- **No search results:** Show message when search returns no matches

## Testing

See `product-plan/sections/workspaces/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/workspaces/README.md` — Feature overview
- `product-plan/sections/workspaces/tests.md` — UI behavior test specs
- `product-plan/sections/workspaces/types.ts` — TypeScript interfaces
- `product-plan/sections/workspaces/sample-data.json` — Test data
