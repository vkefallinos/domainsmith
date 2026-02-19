# Milestone 2: Prompt Library

> **Provide alongside:** `product-plan/product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

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

### Flow 4: Create a New Folder

1. User clicks the "New" button
2. User selects "Folder" from the dropdown
3. User enters folder name (e.g., "vpn")
4. User selects parent location
5. User clicks "Create"
6. **Outcome:** New folder appears in tree at specified location

### Flow 5: Delete a Fragment

1. User right-clicks on a file in the tree
2. User selects "Delete" from context menu
3. User confirms deletion in modal
4. **Outcome:** File is removed from tree, editor clears if that file was selected

## Empty States

The components include empty state designs. Make sure to handle:

- **No file selected:** Show helpful message in editor pane when no file is selected
- **Empty library:** Show CTA to create first fragment when library is empty
- **Empty folder:** Handle folders with no children (expandable but shows empty state)

## Testing

See `product-plan/sections/prompt-library/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- File tree navigation and editing
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/prompt-library/README.md` — Feature overview and design intent
- `product-plan/sections/prompt-library/tests.md` — UI behavior test specs
- `product-plan/sections/prompt-library/types.ts` — TypeScript interfaces
- `product-plan/sections/prompt-library/sample-data.json` — Test data

## Done When

- [ ] Components render with real file system data
- [ ] Empty states display properly when no file is selected
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] File tree expand/collapse works smoothly
- [ ] Unsaved changes indicator appears/disappears correctly
- [ ] Responsive on mobile
