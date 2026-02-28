import { useCallback } from 'react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { FlowList } from './components'

type FlowListData = {
  flows: unknown[]
}

export default function FlowListPreview() {
  const { data, loading, error } = useWorkspaceData<FlowListData>('flow-builder')

  const handleSelectFlow = useCallback((flowId: string) => {
    console.log('Select flow:', flowId)
  }, [])

  const handleCreateFlow = useCallback(() => {
    console.log('Create new flow')
  }, [])

  const handleDeleteFlow = useCallback((flowId: string) => {
    console.log('Delete flow:', flowId)
  }, [])

  const handleTagFilterChange = useCallback((tag: string | null) => {
    console.log('Filter by tag:', tag)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  if (error || !data) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading data</div>
  }

  return (
    <FlowList
      flows={data.flows}
      selectedFlowId={null}
      onSelectFlow={handleSelectFlow}
      onCreateFlow={handleCreateFlow}
      onDeleteFlow={handleDeleteFlow}
      activeTagFilter={null}
      onTagFilterChange={handleTagFilterChange}
    />
  )
}
