# Milestone 5: Workspaces

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

When fully implemented, users should be able to complete these flows:

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

### Flow 3: Remove a User

1. User selects a user from the sidebar
2. User clicks "Remove User" button in detail panel
3. User confirms removal in confirmation modal
4. **Outcome:** User is removed from the sidebar list

### Flow 4: Search for Users

1. User types in the search box at top of sidebar
2. **Outcome:** User list filters to show only matching names or emails

## Empty States

The components include empty state designs. Make sure to handle:

- **No user selected:** Show helpful message in detail panel when no user is selected
- **Empty workspace:** Show CTA to invite first user when workspace has no members
- **No search results:** Show message when search returns no matches

## Role Definitions

| Role | Permissions |
|------|-------------|
| Admin | Full access to all workspace features, including user management |
| Editor | Can create and modify agents and prompt fragments, but cannot manage users |
| Viewer | Read-only access to workspace content |

## Testing

See `product-plan/sections/workspaces/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Role changes
- User invitation and removal
- Search and filtering
- Empty state rendering

## Files to Reference

- `product-plan/sections/workspaces/README.md` — Feature overview and design intent
- `product-plan/sections/workspaces/tests.md` — UI behavior test specs
- `product-plan/sections/workspaces/types.ts` — TypeScript interfaces
- `product-plan/sections/workspaces/sample-data.json` — Test data with workspace users

## Done When

- [ ] Components render with real user data
- [ ] User list displays with avatars, names, emails, and status badges
- [ ] Clicking a user loads their detail panel
- [ ] Role changes save correctly
- [ ] User invitation works
- [ ] User removal works with confirmation
- [ ] Search filters the user list
- [ ] Empty states display appropriately
- [ ] Responsive on mobile
