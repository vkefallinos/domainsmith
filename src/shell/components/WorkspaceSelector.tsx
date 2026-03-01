import { Check, ChevronDown, Building2, Loader2 } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { Input } from '@/components/ui/input'
import { useGithub } from '@/lib/github/GithubContext'
import { useQueryClient } from '@tanstack/react-query'

export type Workspace = {
  id: string
  name: string
  color: string
}

// Helper to convert workspace name to URL-friendly slug
export function workspaceToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

const WORKSPACE_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ef4444', '#84cc16']

const FALLBACK_WORKSPACE: Workspace = {
  id: 'workspace-default',
  name: 'No Workspaces',
  color: WORKSPACE_COLORS[0],
}

export interface WorkspaceSelectorProps {
  currentWorkspace?: Workspace
  onWorkspaceChange?: (workspace: Workspace) => void
  isCollapsed?: boolean
}

export function WorkspaceSelector({
  currentWorkspace,
  onWorkspaceChange,
  isCollapsed = false,
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { octokit } = useGithub()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { data: githubWorkspaces, isLoading } = useWorkspaces()

  const mappedWorkspaces = useMemo<Workspace[]>(() => {
    if (!githubWorkspaces) return []
    return githubWorkspaces.map((repo, idx) => ({
      id: repo.id.toString(),
      name: repo.name, // The slug
      color: WORKSPACE_COLORS[idx % WORKSPACE_COLORS.length],
    }))
  }, [githubWorkspaces])

  const activeWorkspace = currentWorkspace || mappedWorkspaces[0] || FALLBACK_WORKSPACE

  const filteredWorkspaces = useMemo(() => {
    if (!searchQuery) return mappedWorkspaces.slice(0, 5)
    const query = searchQuery.toLowerCase()
    return mappedWorkspaces.filter(w => w.name.toLowerCase().includes(query))
  }, [mappedWorkspaces, searchQuery])

  const handleCreateWorkspace = async () => {
    if (!octokit || !searchQuery) return
    setIsCreating(true)
    try {
      await octokit.rest.repos.createForAuthenticatedUser({
        name: searchQuery,
        private: true,
        auto_init: true
      })
      await queryClient.invalidateQueries({ queryKey: ['github-workspaces'] })
      handleSelect({ id: 'new', name: searchQuery, color: WORKSPACE_COLORS[0] })
    } catch (e) {
      console.error(e)
      alert("Failed to create repository. It might already exist or you don't have permissions.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelect = useCallback((workspace: Workspace) => {
    setSearchQuery('')
    onWorkspaceChange?.(workspace)
    setIsOpen(false)

    // Navigate to the new workspace URL
    const pathParts = location.pathname.split('/')

    // We try to find where the old workspace was in the URL to swap it out
    // The structure is usually /workspace/[workspaceName]/...
    const workspaceIdx = pathParts.indexOf('workspace')

    if (workspaceIdx !== -1 && pathParts.length > workspaceIdx + 1) {
      // Replace the workspace slug in the current path
      pathParts[workspaceIdx + 1] = workspace.name // The mapping uses repo.name directly
      navigate(pathParts.join('/'))
    } else {
      // If we're not in a workspace route, navigate to the default chat view
      navigate(`/workspace/${workspace.name}/chat`)
    }
  }, [navigate, location.pathname, onWorkspaceChange])

  if (isCollapsed) {
    if (isLoading) {
      return (
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-100">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        </div>
      )
    }

    // Collapsed state - show just an icon
    return (
      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: activeWorkspace.color + '20' }}>
        <Building2 className="w-4 h-4" style={{ color: activeWorkspace.color }} />
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1.5 w-full rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          aria-label="Select workspace"
          disabled={isLoading}
        >
          {/* Workspace indicator */}
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: activeWorkspace.color + '20' }}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: activeWorkspace.color }} />
            ) : (
              <Building2 className="w-3.5 h-3.5" style={{ color: activeWorkspace.color }} />
            )}
          </div>

          {/* Workspace name */}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate text-left flex-1" title={activeWorkspace.name}>
            {isLoading ? 'Loading repos...' : activeWorkspace.name}
          </span>

          {/* Dropdown arrow */}
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 overflow-hidden flex flex-col max-h-[400px]" side="bottom">
        <DropdownMenuLabel>Repositories (Workspaces)</DropdownMenuLabel>

        <div className="px-2 pb-2">
          <Input
            placeholder="Search or create repo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="h-8"
          />
        </div>

        <DropdownMenuSeparator />

        <div className="overflow-y-auto flex-1 p-1">
          {filteredWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleSelect(workspace)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: workspace.color + '20' }}
              >
                <Building2 className="w-3 h-3" style={{ color: workspace.color }} />
              </div>

              <span className="flex-1 truncate" title={workspace.name}>{workspace.name}</span>

              {workspace.id === activeWorkspace.id && (
                <Check className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </DropdownMenuItem>
          ))}

          {filteredWorkspaces.length === 0 && !isLoading && !searchQuery && (
            <div className="px-2 py-3 text-sm text-slate-500 text-center">
              No repositories found
            </div>
          )}

          {filteredWorkspaces.length === 0 && searchQuery && (
            <div className="px-2 py-3 text-sm text-slate-500 text-center">
              No repositories match "{searchQuery}"
            </div>
          )}
        </div>

        {!searchQuery && mappedWorkspaces.length > 5 && (
          <p className="px-2 py-1.5 text-xs text-center text-slate-400">
            Showing 5 of {mappedWorkspaces.length} repos. Type to search.
          </p>
        )}

        {searchQuery && !filteredWorkspaces.find(w => w.name.toLowerCase() === searchQuery.toLowerCase()) && (
          <div className="p-2 border-t">
            <button
              onClick={handleCreateWorkspace}
              disabled={isCreating}
              className="w-full px-2 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:bg-primary/50"
            >
              {isCreating ? 'Creating...' : `Create "${searchQuery}"`}
            </button>
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer text-slate-500">
          <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold">+</span>
          </div>
          <span>Refresh Repositories</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

