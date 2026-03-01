export const DEFAULT_WORKSPACE_SLUG = 'domainsmith-agents'

export function toWorkspaceSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

export type WorkspaceName = string

export function getNormalizedWorkspace(workspaceName?: string): string {
  if (!workspaceName) {
    return DEFAULT_WORKSPACE_SLUG
  }
  return workspaceName // The slug is the repo name
}
