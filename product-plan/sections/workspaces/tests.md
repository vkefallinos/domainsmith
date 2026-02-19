# Test Specs: Workspaces

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Workspaces section provides user and permission management with a two-panel layout. Administrators can view all workspace users, see their status and role, and modify permissions with role-based access control.

---

## User Flow Tests

### Flow 1: View and Edit User Role

**Scenario:** User views a workspace member and changes their role

#### Success Path

**Setup:**
- Workspaces is loaded with workspace users
- User "Sarah Chen" exists with role "editor"
- No user is currently selected

**Steps:**
1. User navigates to Workspaces
2. User sees list of all workspace members in the sidebar
3. User clicks on "Sarah Chen" in the list
4. User detail panel shows on the right with:
   - Avatar and name "Sarah Chen"
   - Email "sarah.chen@geant.org"
   - Status badge "Active" (green)
   - Current role "Editor"
5. User clicks the role dropdown/selector
6. User selects "Admin" from the options (Admin, Editor, Viewer)
7. User clicks "Save" button
8. **Outcome:** User's role is updated to Admin, detail panel shows new role

**Expected Results:**
- [ ] Clicking user highlights them as selected (violet background)
- [ ] Detail panel shows all user info (avatar, name, email, status, join date)
- [ ] Role selector shows current value highlighted
- [ ] Clicking "Save" triggers the update callback
- [ ] After save, "Role updated successfully" toast appears
- [ ] Sidebar list may reflect new role (if displayed)
- [ ] Detail panel shows "Admin" as current role
- [ ] Save button is disabled after save (no unsaved changes)

#### Failure Path: Save Error

**Steps:**
1. User selects a user
2. User changes role selection
3. User clicks "Save"
4. Backend returns error (e.g., permission denied, network failure)

**Expected Results:**
- [ ] Error message appears: "Failed to update role. Please try again."
- [ ] Role selection remains as user set it (not reverted)
- [ ] Save button remains enabled for retry

### Flow 2: Invite a New User

**Scenario:** User sends an invitation to a new workspace member

#### Success Path

**Setup:**
- Workspaces is loaded
- "newuser@example.com" is not yet in the workspace

**Steps:**
1. User clicks "Invite User" button (top right or in sidebar header)
2. Invite modal appears with email input and role selector
3. User enters email: "newuser@example.com"
4. User selects role: "Viewer"
5. User clicks "Send Invitation"
6. **Outcome:** New user appears in sidebar with "invited" status badge

**Expected Results:**
- [ ] "Invite User" button is visible and clickable
- [ ] Modal shows "Email" input (required)
- [ ] Modal shows role selector with options
- [ ] Email validation prevents invalid formats
- [ ] After clicking send, loading state shows briefly
- [ ] New user appears in sidebar at top or bottom of list
- [ ] New user shows "Invited" status badge (yellow/amber)
- [ ] New user shows avatar with initials
- [ ] Success message: "Invitation sent to newuser@example.com"

#### Failure Path: Email Already Exists

**Steps:**
1. User clicks "Invite User"
2. User enters email of existing user
3. User selects role and clicks "Send Invitation"

**Expected Results:**
- [ ] Error message: "This user is already a member of the workspace"
- [ ] Modal remains open for correction
- [ ] No new user is added to list

#### Failure Path: Invalid Email

**Steps:**
1. User clicks "Invite User"
2. User enters invalid email: "not-an-email"
3. User clicks "Send Invitation"

**Expected Results:**
- [ ] Validation error: "Please enter a valid email address"
- [ ] Send button is disabled or shows error
- [ ] Modal remains open

### Flow 3: Remove a User

**Scenario:** User removes a member from the workspace

#### Success Path

**Setup:**
- User "James Okonkwo" exists in workspace with role "viewer"

**Steps:**
1. User clicks on "James Okonkwo" in the sidebar
2. Detail panel shows user info
3. User clicks "Remove User" button
4. Confirmation modal appears: "Remove James Okonkwo from the workspace?"
5. User clicks "Remove"
6. **Outcome:** User is removed from the sidebar list

**Expected Results:**
- [ ] "Remove User" button is visible in detail panel
- [ ] Confirmation modal shows user's name and warning
- [ ] Modal has "Cancel" and "Remove" buttons
- [ ] After confirmation, user disappears from sidebar
- [ ] Detail panel shows empty state (no user selected)
- [ ] Success message: "User removed from workspace"

#### Failure Path: Cannot Remove Last Admin

**Steps:**
1. User attempts to remove the last admin user
2. User clicks "Remove User" and confirms

**Expected Results:**
- [ ] Error message: "Cannot remove the last admin. Assign admin role to another user first."
- [ ] User remains in the workspace
- [ ] Modal closes

### Flow 4: Search for Users

**Scenario:** User filters the workspace list by search query

#### Success Path

**Setup:**
- Workspace has 10+ users

**Steps:**
1. User types "Sarah" in the search box at top of sidebar
2. **Outcome:** User list filters to show only matching names/emails

**Expected Results:**
- [ ] Search box is visible at top of sidebar
- [ ] Typing updates the list in real-time
- [ ] Matches are found in both names and emails
- [ ] "Sarah Chen" appears in filtered results
- [ ] Non-matching users are hidden
- [ ] Clear button appears when search has text

---

## Empty State Tests

### No User Selected Empty State

**Scenario:** No user is currently selected in the list

**Setup:**
- Workspaces is loaded
- No user has been clicked

**Expected Results:**
- [ ] Detail panel shows "No user selected" message
- [ ] Helpful text: "Select a user from the list to view and edit their profile"
- [ ] Illustration or icon is visible
- [ ] "Invite User" CTA is available

### Empty Workspace Empty State

**Scenario:** The workspace has no members yet

**Setup:**
- Workspace users list is empty

**Expected Results:**
- [ ] Sidebar shows "No users in workspace" message
- [ ] Helpful text: "Invite users to collaborate on agents and prompts"
- [ ] Primary CTA: "Invite User" opens invite modal

### No Search Results Empty State

**Scenario:** Search query returns no matches

**Setup:**
- Workspace has users
- User types search that matches no one

**Expected Results:**
- [ ] Sidebar shows "No users found" message
- [ ] Helpful text: "Try a different search term"
- [ ] Clear search button is available

---

## Component Interaction Tests

### Workspace List (Sidebar)

**Renders correctly:**
- [ ] Shows user avatar (image or initials)
- [ ] Shows user name
- [ ] Shows user email (if space allows)
- [ ] Shows status badge (Active, Invited, Pending)
- [ ] Selected user has violet background
- [ ] Status badges have appropriate colors (green, yellow, gray)

**User interactions:**
- [ ] Clicking user selects them and loads detail panel
- [ ] Typing in search filters the list
- [ ] Clear search button resets the filter
- [ ] Keyboard navigation with arrow keys

### User Detail Panel

**Renders correctly:**
- [ ] Shows user avatar (larger version)
- [ ] Shows full name and email
- [ ] Shows status badge with label
- [ ] Shows join date (if active)
- [ ] Shows current role with description
- [ ] Shows role selector for editing

**User interactions:**
- [ ] Changing role selection enables Save button
- [ ] Clicking Save triggers update callback
- [ ] Clicking Cancel reverts unsaved changes
- [ ] Clicking Remove User shows confirmation modal

### Role Selector

**Renders correctly:**
- [ ] Shows all three roles: Admin, Editor, Viewer
- [ ] Shows description for each role
- [ ] Current role is highlighted/selected

**User interactions:**
- [ ] Clicking role updates selection
- [ ] Role descriptions help users understand permissions

---

## Edge Cases

- [ ] Handles very long user names (truncation)
- [ ] Handles very long email addresses
- [ ] Handles many users (50+) with scrolling
- [ ] Handles users with same name
- [ ] Handles rapid role changes (debouncing)
- [ ] Preserves search state when selecting users
- [ ] Handles removing currently selected user
- [ ] Handles inviting user who already has pending invite

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Status badges have proper ARIA labels
- [ ] Role selector has proper labeling
- [ ] Focus management when opening/closing modals
- [ ] Error messages are announced to screen readers
