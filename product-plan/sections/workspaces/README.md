# Workspaces

## Overview

A user and permission management interface for administrators to manage workspace members. Provides role-based access control (Admin, Editor, Viewer) with a sidebar navigation listing all users and a main detail panel for viewing and editing individual user profiles and permissions.

## User Flows

- View all users in the workspace via the sidebar list
- Click a user in the sidebar to view their profile, status, and role in the main panel
- Edit a user's role (Admin, Editor, or Viewer) from the detail panel
- Add a new user by entering their email and assigning an initial role
- Remove a user from the workspace
- Filter or search for users by name or email

## Design Decisions

- Two-panel layout allows quick scanning and detailed viewing
- Visual status badges (active, invited, pending) provide immediate context
- Role selector uses radio buttons or dropdown for clarity
- Confirmation dialog prevents accidental user removal
- Search box at top of sidebar for quick filtering

## Data Shapes

**Entities:**
- `WorkspaceUser` — User with profile, role, status, timestamps
- `WorkspaceUserRole` — Role type: admin, editor, viewer
- `WorkspaceUserStatus` — Status type: active, invited, pending
- `RoleDefinition` — Display info for roles (label, description)

**From global entities:** Workspace, User

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `Workspaces` — Main component with user list sidebar and detail panel
- `WorkspaceList` — Sidebar listing all workspace users with search
- `UserDetailPanel` — Detail panel showing selected user's profile and role editor

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectUser` | User clicks a user in the sidebar |
| `onSearchChange` | User types in search input |
| `onUpdateRole` | User changes a user's role and saves |
| `onInviteUser` | User submits new user invitation |
| `onRemoveUser` | User confirms user removal |
| `onCancel` | User cancels pending edits |
