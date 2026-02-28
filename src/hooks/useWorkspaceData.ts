'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { WORKSPACE_MAP, type WorkspaceName } from '@/lib/workspaceContext'

// Maps workspace slug to directory name
export function getWorkspaceDir(workspaceName?: string): string {
  if (!workspaceName) return 'education'
  return WORKSPACE_MAP[workspaceName] || 'education'
}

// Hook to dynamically load workspace-specific JSON data
export function useWorkspaceData<T>(sectionPath: string) {
  const { workspaceName } = useParams<{ workspaceName?: string }>()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const workspaceDir = getWorkspaceDir(workspaceName)
    const dataPath = `/mock_data/workspaces/${workspaceDir}/sections/${sectionPath}/data.json`

    fetch(dataPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load: ${dataPath}`)
        }
        return res.json()
      })
      .then((jsonData) => {
        setData(jsonData as T)
        setLoading(false)
      })
      .catch((err) => {
        setError(err as Error)
        setLoading(false)
      })
  }, [workspaceName, sectionPath])

  return { data, error, loading }
}
