'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

// Maps workspace slug to directory name
export const WORKSPACE_MAP: Record<string, string> = {
  'education': 'education',
  'web-development': 'web-development',
}

export type WorkspaceName = keyof typeof WORKSPACE_MAP

// Dynamic data loader for workspace-specific mock data
export async function loadWorkspaceData<T>(
  workspaceName: string,
  sectionPath: string
): Promise<T> {
  const normalizedWorkspace = WORKSPACE_MAP[workspaceName] || 'education'
  const dataPath = `/mock_data/workspaces/${normalizedWorkspace}/sections/${sectionPath}/data.json`
  const response = await fetch(dataPath)
  if (!response.ok) {
    throw new Error(`Failed to load workspace data: ${dataPath}`)
  }
  return response.json() as Promise<T>
}

// Synchronous import helper (for initial loads)
export function importWorkspaceData(sectionPath: string, workspaceName: string = 'education') {
  const normalizedWorkspace = WORKSPACE_MAP[workspaceName] || 'education'
  return import(`@/../mock_data/workspaces/${normalizedWorkspace}/sections/${sectionPath}/data.json`)
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
