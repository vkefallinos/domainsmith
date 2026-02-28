'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'

// Maps workspace slug to directory name
export const WORKSPACE_MAP: Record<string, string> = {
  'education': 'education',
  'web-development': 'web-development',
}

export type WorkspaceName = keyof typeof WORKSPACE_MAP

type JsonModule<T = unknown> = { default: T }

const workspaceDataModules = import.meta.glob('/mock_data/workspaces/*/sections/*/data.json')

function getWorkspaceDataModulePath(workspaceName: string, sectionPath: string) {
  const normalizedWorkspace = WORKSPACE_MAP[workspaceName] || 'education'
  return `/mock_data/workspaces/${normalizedWorkspace}/sections/${sectionPath}/data.json`
}

// Dynamic data loader for workspace-specific mock data
export async function loadWorkspaceData<T>(
  workspaceName: string,
  sectionPath: string
): Promise<T> {
  const modulePath = getWorkspaceDataModulePath(workspaceName, sectionPath)
  const loader = workspaceDataModules[modulePath]

  if (!loader) {
    throw new Error(`Workspace data not found: ${modulePath}`)
  }

  const module = (await loader()) as JsonModule<T>
  return module.default
}

// Synchronous import helper (for initial loads)
export function importWorkspaceData(sectionPath: string, workspaceName: string = 'education') {
  const modulePath = getWorkspaceDataModulePath(workspaceName, sectionPath)
  const loader = workspaceDataModules[modulePath]

  if (!loader) {
    return Promise.reject(new Error(`Workspace data not found: ${modulePath}`))
  }

  return loader()
}

interface WorkspaceContextValue {
  workspaceName: string
  normalizedWorkspace: string
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { workspaceName = 'education' } = useParams<{ workspaceName?: string }>()
  const normalizedWorkspace = WORKSPACE_MAP[workspaceName] || 'education'

  return (
    <WorkspaceContext.Provider value={{ workspaceName, normalizedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    // Fallback when used outside provider
    const { workspaceName = 'education' } = useParams<{ workspaceName?: string }>()
    return {
      workspaceName,
      normalizedWorkspace: WORKSPACE_MAP[workspaceName] || 'education',
    }
  }
  return context
}
