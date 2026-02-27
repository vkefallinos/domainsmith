import { Check, ChevronDown, Building2 } from 'lucide-react'
import { useState } from 'react'
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

// Dummy workspaces
export const DUMMY_WORKSPACES: Workspace[] = [
  { id: 'workspace-1', name: 'Personal', color: '#10b981' },
  { id: 'workspace-2', name: 'Team Alpha', color: '#8b5cf6' },
  { id: 'workspace-3', name: 'Team Beta', color: '#f59e0b' },
  { id: 'workspace-4', name: 'Company', color: '#3b82f6' },
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

  const handleSelect = (workspace: Workspace) => {
    onWorkspaceChange?.(workspace)
    setIsOpen(false)
  }

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
