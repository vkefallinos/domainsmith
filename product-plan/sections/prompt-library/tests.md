# Test Specs: Prompt Library

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Prompt Library is a filesystem-based workspace where domain experts author, organize, and manage prompt fragments as a hierarchical taxonomy of markdown files. The split-pane interface has a file tree sidebar and a WYSIWYG editor.

---

## User Flow Tests

### Flow 1: Browse and View a Fragment

**Scenario:** User navigates the file tree and views a prompt fragment's content

#### Success Path

**Setup:**
- File system contains directories: `/networking/basics/` with file `dns-concepts.md`
- File tree is loaded and rendered
- No file is currently selected

**Steps:**
1. User navigates to the Prompt Library page
2. User sees the file tree on the left with "networking" folder
3. User clicks to expand the "networking" folder
4. User sees "basics" subfolder and expands it
5. User clicks on "dns-concepts.md" file
6. User sees the file content load in the editor pane on the right

**Expected Results:**
- [ ] File tree shows "networking" folder with expand/collapse icon
- [ ] Expanding "networking" reveals "basics" subfolder
- [ ] Clicking "dns-concepts.md" highlights the file as selected
- [ ] Editor pane displays the markdown content with proper formatting
- [ ] Editor title shows "dns-concepts.md"
- [ ] No unsaved changes indicator is visible

### Flow 2: Create a New Prompt Fragment

**Scenario:** User creates a new prompt fragment in an existing folder

#### Success Path

**Setup:**
- File system contains `/networking/basics/` directory
- No file is currently selected

**Steps:**
1. User clicks the "New" button in the toolbar
2. User selects "File" from the dropdown menu
3. User enters filename "firewall-rules.md" in the filename input
4. User selects "/networking/basics" as parent folder from dropdown
5. User clicks "Create" button
6. New file appears in tree under "basics" folder
7. Editor opens with blank content, cursor ready for typing

**Expected Results:**
- [ ] New file modal appears with "Create File" title
- [ ] Filename input is present and focused
- [ ] Parent folder dropdown shows available directories
- [ ] After clicking "Create", new file appears in tree at correct location
- [ ] "firewall-rules.md" is highlighted as selected
- [ ] Editor pane shows empty/blank state ready for content
- [ ] Unsaved changes indicator is not visible (no changes yet)

#### Failure Path: Filename Already Exists

**Steps:**
1. User clicks "New" → "File"
2. User enters filename "dns-concepts.md" (already exists)
3. User selects parent folder
4. User clicks "Create"

**Expected Results:**
- [ ] Error message appears: "A file with this name already exists"
- [ ] Modal remains open, user can change filename
- [ ] No new file is created in the tree

#### Failure Path: Empty Filename

**Steps:**
1. User clicks "New" → "File"
2. User leaves filename field empty
3. User clicks "Create"

**Expected Results:**
- [ ] Validation error shows: "Filename is required"
- [ ] Create button is disabled or shows error
- [ ] Modal remains open

### Flow 3: Edit and Save a Fragment

**Scenario:** User modifies an existing prompt fragment and saves changes

#### Success Path

**Setup:**
- File `/networking/basics/dns-concepts.md` is selected and loaded
- File contains existing content

**Steps:**
1. User makes changes to content in the editor
2. User sees unsaved changes indicator (dot or asterisk next to filename)
3. User clicks "Save" button (or presses Ctrl+S)
4. Save completes successfully
5. Unsaved changes indicator disappears

**Expected Results:**
- [ ] Editor allows typing and content modification
- [ ] Unsaved changes indicator appears after first edit
- [ ] Clicking "Save" triggers save callback with modified content
- [ ] After successful save, indicator disappears
- [ ] Toast/notification shows "File saved successfully"

#### Failure Path: Save Error

**Steps:**
1. User edits file content
2. Backend returns error (e.g., network failure, permission denied)
3. User clicks "Save"

**Expected Results:**
- [ ] Error message appears: "Failed to save. Please try again."
- [ ] Unsaved changes indicator remains visible
- [ ] Editor content is preserved (not cleared)

### Flow 4: Create a New Folder

**Scenario:** User creates a new folder for organizing fragments

#### Success Path

**Setup:**
- File system exists with `/networking/` directory

**Steps:**
1. User clicks "New" button
2. User selects "Folder" from dropdown
3. User enters folder name "vpn" in the input
4. User selects "/networking" as parent location
5. User clicks "Create"
6. New folder appears in tree

**Expected Results:**
- [ ] New folder modal appears with "Create Folder" title
- [ ] Folder name input is present and focused
- [ ] Parent location dropdown shows available directories
- [ ] After clicking "Create", "vpn" folder appears under "networking"
- [ ] Folder shows folder icon, not file icon
- [ ] Folder can be expanded (even though empty)

### Flow 5: Delete a Fragment

**Scenario:** User deletes a prompt fragment with confirmation

#### Success Path

**Setup:**
- File `/networking/basics/dns-concepts.md` exists
- File is currently selected

**Steps:**
1. User right-clicks on "dns-concepts.md" in the tree
2. Context menu appears with options: Rename, Move, Delete
3. User clicks "Delete"
4. Confirmation modal appears: "Are you sure you want to delete dns-concepts.md?"
5. User clicks "Delete" to confirm
6. File is removed from tree
7. Editor pane shows empty state (no file selected)

**Expected Results:**
- [ ] Right-click shows context menu at cursor position
- [ ] Delete option is clearly labeled
- [ ] Confirmation modal shows filename and warning
- [ ] After confirmation, file disappears from tree
- [ ] If deleted file was selected, editor clears
- [ ] Tree updates to reflect new structure

---

## Empty State Tests

### No File Selected Empty State

**Scenario:** No file is currently selected in the tree

**Setup:**
- File system is loaded with content
- No file has been clicked/selected yet

**Expected Results:**
- [ ] Editor pane shows "No file selected" message
- [ ] Helpful text: "Select a file from the tree to view or edit its content"
- [ ] Placeholder illustration or icon is visible
- [ ] Save button is disabled or hidden

### Empty Library Empty State

**Scenario:** The library is completely empty (no files or folders)

**Setup:**
- File system has no nodes (root is empty)

**Expected Results:**
- [ ] Tree area shows "Your library is empty" message
- [ ] Helpful text: "Create your first prompt fragment to get started"
- [ ] Primary CTA button: "Create Fragment" opens new file modal
- [ ] No expand/collapse controls are visible

### Empty Folder State

**Scenario:** A folder exists but contains no children

**Setup:**
- Folder `/templates/` exists with empty children array

**Expected Results:**
- [ ] Folder appears in tree and can be expanded
- [ ] When expanded, shows "Empty folder" message or no children
- [ ] Context menu allows creating new files within this folder

---

## Component Interaction Tests

### File Tree

**Renders correctly:**
- [ ] Shows folders with folder icons
- [ ] Shows files with file icons
- [ ] Folders have expand/collapse chevron icons
- [ ] Selected file has highlight/violet background
- [ ] Directory config metadata shows custom labels/colors if present

**User interactions:**
- [ ] Clicking expand/collapse toggles folder visibility
- [ ] Clicking a file selects it and loads content
- [ ] Right-click shows context menu (Rename, Move, Delete)
- [ ] Tree supports keyboard navigation (arrow keys, Enter)

### Editor Pane

**Renders correctly:**
- [ ] Shows filename in header when file is selected
- [ ] Displays markdown content with proper formatting
- [ ] Frontmatter metadata is displayed or accessible
- [ ] Toolbar shows Save button (enabled/disabled based on changes)

**User interactions:**
- [ ] Typing in editor updates content and shows unsaved indicator
- [ ] Clicking Save triggers save callback
- [ ] Ctrl+S keyboard shortcut triggers save
- [ ] Editor supports markdown rendering (headings, lists, code blocks)

---

## Edge Cases

- [ ] Handles very long filenames with text truncation
- [ ] Handles very deep folder nesting (10+ levels)
- [ ] Handles filenames with special characters
- [ ] Preserves expanded/collapsed state when switching between files
- [ ] Handles concurrent editing conflicts (if applicable)
- [ ] Handles large files (1000+ lines) without performance issues
- [ ] Transition from empty to populated after creating first file
- [ ] Transition from populated to empty after deleting last file

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Tree has proper ARIA roles and attributes
- [ ] Focus management works when opening/closing modals
- [ ] Error messages are announced to screen readers
- [ ] Editor has proper label and instructions
