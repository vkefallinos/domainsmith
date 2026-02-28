import { Check, ChevronDown, Building2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type Workspace = {
  id: string
  name: string
  color: string
}

// Helper to convert workspace name to URL-friendly slug
export function workspaceToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

// Dummy workspaces
export const DUMMY_WORKSPACES: Workspace[] = [
  { id: 'workspace-education', name: 'Education', color: '#10b981' },
  { id: 'workspace-web-development', name: 'Web development', color: '#8b5cf6' },
]

export interface WorkspaceSelectorProps {
  currentWorkspace?: Workspace
  onWorkspaceChange?: (workspace: Workspace) => void
  isCollapsed?: boolean
}

export function WorkspaceSelector({
  currentWorkspace = DUMMY_WORKSPACES[0],
  onWorkspaceChange,
  isCollapsed = false,
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSelect = useCallback((workspace: Workspace) => {
    onWorkspaceChange?.(workspace)
    setIsOpen(false)

    // Navigate to the new workspace URL
    // Extract the current app path (chat or studio) and any nested routes
    const pathParts = location.pathname.split('/')
    const workspaceIndex = pathParts.findIndex(part =>
      DUMMY_WORKSPACES.some(w => workspaceToSlug(w.name) === part)
    )
    console.log('Current path parts:', pathParts, 'Workspace index:', workspaceIndex)
    if (workspaceIndex !== -1) {
      // Replace the workspace slug in the current path
      pathParts[workspaceIndex] = workspaceToSlug(workspace.name)
      navigate(pathParts.join('/'))
    } else {
      // If we're not in a workspace route, navigate to the default chat view
      navigate(`/workspace/${workspaceToSlug(workspace.name)}/chat`)
    }
  }, [navigate, location.pathname, onWorkspaceChange])
  console.log('Rendering WorkspaceSelector with currentWorkspace:', currentWorkspace, 'isCollapsed:', isCollapsed)
  if (isCollapsed) {
    // Collapsed state - show just an icon
    return (
      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: currentWorkspace.color + '20' }}>
        <Building2 className="w-4 h-4" style={{ color: currentWorkspace.color }} />
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          aria-label="Select workspace"
        >
          {/* Workspace indicator */}
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: currentWorkspace.color + '20' }}
          >
            <Building2 className="w-3.5 h-3.5" style={{ color: currentWorkspace.color }} />
          </div>

          {/* Workspace name */}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentWorkspace.name}
          </span>

          {/* Dropdown arrow */}
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {DUMMY_WORKSPACES.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleSelect(workspace)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* Workspace indicator */}
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: workspace.color + '20' }}
            >
              <Building2 className="w-3 h-3" style={{ color: workspace.color }} />
            </div>

            {/* Workspace name */}
            <span className="flex-1">{workspace.name}</span>

            {/* Checkmark for selected */}
            {workspace.id === currentWorkspace.id && (
              <Check className="w-4 h-4 text-slate-500" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer text-slate-500">
          <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">+</span>
          </div>
          <span>Create workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
