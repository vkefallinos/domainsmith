# Application Shell

The DomainSmith application shell provides the persistent chrome that wraps all sections of the platform.

## Overview

The shell uses a sidebar navigation layout with:
- Fixed header bar (64px height) with logo and user menu
- Fixed sidebar (256px width) on desktop with navigation items
- Collapsible sidebar on mobile with hamburger menu
- Main content area taking remaining space

## Navigation Structure

The navigation includes the following items:

| Label | Route | Icon |
|-------|-------|------|
| Dashboard | `/` | Layout |
| Prompt Library | `/prompt-library` | FileText |
| Agent Builder | `/agent-builder` | Wrench |
| Agent Runtime | `/agent-runtime` | Play |
| Workspaces | `/workspaces` | Users |

## Components

- **AppShell** — Main layout wrapper that orchestrates header, sidebar, and content
- **MainNav** — Navigation component with items, active states, and mobile handling
- **UserMenu** — User dropdown menu with avatar, profile, settings, and logout

## Props Reference

### AppShell

```typescript
interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}
```

### MainNav

```typescript
interface MainNavProps {
  items: NavigationItem[]
  isCollapsed?: boolean
  onNavigate?: (href: string) => void
  onCloseMobile?: () => void
}
```

### UserMenu

```typescript
interface UserMenuProps {
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
}
```

## Design Tokens

- **Active nav:** violet background with left accent border (4px)
- **Hover:** slate-100/slate-800 backgrounds
- **Header:** white with slate-200 border
- **Sidebar:** white with slate-200 border on right
- **Logo:** violet-500 to violet-600 gradient

## Responsive Behavior

- **Desktop (1024px+):** Fixed sidebar visible, user menu top right
- **Tablet (768px-1023px):** Same as desktop
- **Mobile (<768px):** Sidebar hidden, hamburger menu in header, overlay backdrop when open
