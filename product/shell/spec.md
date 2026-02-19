# Application Shell Specification

## Overview
DomainSmith uses a sidebar navigation layout to provide quick access to all sections of the platform. The shell is persistent across all views and provides a consistent navigation experience.

## Navigation Structure
- **Dashboard** → Home/overview view with quick stats and recent activity
- **Prompt Library** → Core workspace for prompt authoring and management
- **Agent Builder** → Configure and instantiate specialized agents
- **Agent Runtime** → Deploy, test, and monitor live agents
- **Workspaces** → Manage users, permissions, and collaboration

## User Menu
Located in the top-right corner of the header bar. Includes:
- User avatar with fallback initials
- User display name
- Dropdown menu with:
  - Profile settings
  - Logout

## Layout Pattern
**Sidebar Navigation** — Fixed sidebar (256px) on the left with all navigation items visible. Main content area takes remaining width. Header bar spans full width above both sidebar and content.

## Responsive Behavior
- **Desktop (1024px+):** Fixed sidebar on left, user menu top right
- **Tablet (768px-1023px):** Same as desktop
- **Mobile (<768px):** Sidebar collapses to hamburger menu; menu slides in from left when activated

## Design Notes
- Use **violet** for active navigation state and primary actions
- Use **amber** for hover states and subtle highlights
- Use **slate** for backgrounds, borders, and text
- **Space Grotesk** for navigation items and headings
- **Inter** for body text and UI labels
- Sidebar has a subtle border on the right edge
- Active nav item has a left accent bar (4px)
- Navigation items show icons for visual clarity
- Mobile overlay has backdrop blur for depth
