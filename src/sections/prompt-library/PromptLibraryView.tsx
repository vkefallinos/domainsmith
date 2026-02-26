import data from '@/../product/sections/prompt-library/data.json'
import { PromptLibrary } from './components/PromptLibrary'
import type { Directory, PromptFragment, NewFileForm, NewFolderForm, UnsavedChangesAction } from '@/../product/sections/prompt-library/types'

// This is a preview wrapper for Design OS only
// It imports sample data and feeds it to the props-based component

// Sample tools data for demonstration
const sampleTools = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for current information',
    category: 'search',
    parameters: [
      { name: 'maxResults', type: 'number' as const, label: 'Max Results', default: 5, description: 'Maximum number of results to return' },
      { name: 'safeSearch', type: 'boolean' as const, label: 'Safe Search', default: true },
    ],
  },
  {
    id: 'code-executor',
    name: 'Code Executor',
    description: 'Execute code snippets in a sandboxed environment',
    category: 'execution',
    parameters: [
      { name: 'timeout', type: 'number' as const, label: 'Timeout (s)', default: 30, description: 'Execution timeout in seconds' },
      { name: 'language', type: 'enum' as const, label: 'Language', default: 'python', options: ['python', 'javascript', 'bash'] },
    ],
  },
  {
    id: 'api-client',
    name: 'API Client',
    description: 'Make HTTP requests to external APIs',
    category: 'network',
    parameters: [
      { name: 'timeout', type: 'number' as const, label: 'Timeout (ms)', default: 5000 },
      { name: 'apiKey', type: 'string' as const, label: 'API Key', secret: true },
    ],
  },
]

export default function PromptLibraryPreview() {
  // Simulate state changes for demo purposes
  const handleToggleFolder = (path: string) => {
    console.log('Toggle folder:', path)
  }

  const handleSelectFile = (file: PromptFragment) => {
    console.log('Select file:', file.id)
  }

  const handleEditContent = (content: string) => {
    console.log('Edit content, length:', content.length)
  }

  const handleSave = () => {
    console.log('Save changes')
  }

  const handleExpandAll = () => {
    console.log('Expand all folders')
  }

  const handleCollapseAll = () => {
    console.log('Collapse all folders')
  }

  const handleCreateFile = ({ filename, parentPath }: NewFileForm) => {
    console.log('Create file:', filename, 'in', parentPath)
  }

  const handleCreateFolder = ({ folderName, parentPath }: NewFolderForm) => {
    console.log('Create folder:', folderName, 'in', parentPath)
  }

  const handleRename = (nodeId: string, newName: string) => {
    console.log('Rename node:', nodeId, 'to', newName)
  }

  const handleMove = (nodeId: string, newParentPath: string) => {
    console.log('Move node:', nodeId, 'to', newParentPath)
  }

  const handleDelete = (nodeId: string) => {
    console.log('Delete node:', nodeId)
  }

  const handleDuplicate = (nodeId: string) => {
    console.log('Duplicate node:', nodeId)
  }

  // Tool configuration handlers
  const handleToggleToolSidebar = () => {
    console.log('Toggle tool sidebar')
  }

  const handleToolSearchChange = (query: string) => {
    console.log('Tool search:', query)
  }

  const handleToggleTool = (toolId: string, enabled: boolean) => {
    console.log('Toggle tool:', toolId, 'enabled:', enabled)
  }

  const handleUpdateToolParameters = (
    toolId: string,
    parameters: Record<string, string | number | boolean | string[]>
  ) => {
    console.log('Update tool parameters:', toolId, parameters)
  }

  return (
    <PromptLibrary
      fileSystem={data.fileSystem as Directory}
      selectedFile={data.selectedFile as PromptFragment | null}
      expandedFolders={data.expandedFolders as string[]}
      unsavedChanges={data.unsavedChanges as boolean}
      availableTools={sampleTools}
      toolSidebar={{ isOpen: false, searchQuery: '', filterCategory: null }}
      inheritedTools={[]}
      configuredTools={[]}
      onSelectFile={handleSelectFile}
      onToggleFolder={handleToggleFolder}
      onExpandAll={handleExpandAll}
      onCollapseAll={handleCollapseAll}
      onEditContent={handleEditContent}
      onSave={handleSave}
      onCreateFile={handleCreateFile}
      onCreateFolder={handleCreateFolder}
      onRename={handleRename}
      onMove={handleMove}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onToggleToolSidebar={handleToggleToolSidebar}
      onToolSearchChange={handleToolSearchChange}
      onToggleTool={handleToggleTool}
      onUpdateToolParameters={handleUpdateToolParameters}
    />
  )
}
