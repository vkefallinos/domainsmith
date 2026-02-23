import data from '@/../product/sections/flow-builder/data.json'
import { FlowList } from './components'

export default function FlowListPreview() {
  const handleSelectFlow = (flowId: string) => {
    console.log('Select flow:', flowId)
  }

  const handleCreateFlow = () => {
    console.log('Create new flow')
  }

  const handleDeleteFlow = (flowId: string) => {
    console.log('Delete flow:', flowId)
  }

  const handleTagFilterChange = (tag: string | null) => {
    console.log('Filter by tag:', tag)
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
