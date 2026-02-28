'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loadWorkspaceData } from '@/lib/workspaceContext'
import { DEFAULT_WORKSPACE_SLUG, getNormalizedWorkspace } from '@/lib/workspaces'

// Maps workspace slug to directory name
export function getWorkspaceDir(workspaceName?: string): string {
  return getNormalizedWorkspace(workspaceName)
}

// Hook to dynamically load workspace-specific JSON data
export function useWorkspaceData<T>(sectionPath: string) {
  const { workspaceName = DEFAULT_WORKSPACE_SLUG } = useParams<{ workspaceName?: string }>()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const normalizedWorkspaceName = getWorkspaceDir(workspaceName)
    let active = true

    setLoading(true)
    setError(null)

    loadWorkspaceData<T>(normalizedWorkspaceName, sectionPath)
      .then((jsonData) => {
        if (!active) {
          return
        }

        setData(jsonData)
        setLoading(false)
      })
      .catch((err) => {
        if (!active) {
          return
        }

        setError(err as Error)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [workspaceName, sectionPath])

  return { data, error, loading }
}
