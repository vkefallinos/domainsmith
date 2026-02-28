const workspaceDataModules = import.meta.glob('/mock_data/workspaces/*/sections/*/data.json')

const WORKSPACE_MODULE_PATH_REGEX = /^\/mock_data\/workspaces\/([^/]+)\/sections\/[^/]+\/data\.json$/

const extractedWorkspaceDirectories = Object.keys(workspaceDataModules)
  .map((modulePath) => modulePath.match(WORKSPACE_MODULE_PATH_REGEX)?.[1])
  .filter((workspaceDirectory): workspaceDirectory is string => Boolean(workspaceDirectory))

export const AVAILABLE_WORKSPACE_DIRECTORIES = Array.from(new Set(extractedWorkspaceDirectories)).sort()

function toWorkspaceSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

export const AVAILABLE_WORKSPACE_SLUGS = AVAILABLE_WORKSPACE_DIRECTORIES.map(toWorkspaceSlug)
export const DEFAULT_WORKSPACE_SLUG = AVAILABLE_WORKSPACE_SLUGS[0] || 'education'

// Maps workspace slug to directory name
export const WORKSPACE_MAP: Record<string, string> = AVAILABLE_WORKSPACE_DIRECTORIES.reduce((acc, directory) => {
  acc[toWorkspaceSlug(directory)] = directory
  return acc
}, {} as Record<string, string>)

export type WorkspaceName = string

export function getNormalizedWorkspace(workspaceName?: string): string {
  if (!workspaceName) {
    return DEFAULT_WORKSPACE_SLUG
  }

  return WORKSPACE_MAP[workspaceName] || DEFAULT_WORKSPACE_SLUG
}
