import data from '@/../product/sections/prompt-library/data.json'
import { PromptLibrary } from './components/PromptLibrary'
import type { Directory, PromptFragment, NewFileForm, NewFolderForm } from '@/../product/sections/prompt-library/types'

// This is a preview wrapper for Design OS only
// It imports sample data and feeds it to the props-based component

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
      availableTools={data.availableTools ?? []}
      toolSidebar={data.toolSidebar ?? { isOpen: false, searchQuery: '', filterCategory: null }}
      inheritedTools={data.selectedNode?.inheritedTools ?? []}
      configuredTools={data.selectedNode?.configuredTools ?? []}
      onSelectFile={handleSelectFile}
      onToggleFolder={handleToggleFolder}
      onEditContent={handleEditContent}
      onSave={handleSave}
      onCreateFile={handleCreateFile}
      onCreateFolder={handleCreateFolder}
      onRename={handleRename}
      onMove={handleMove}
      onDelete={handleDelete}
      onToggleToolSidebar={handleToggleToolSidebar}
      onToolSearchChange={handleToolSearchChange}
      onToggleTool={handleToggleTool}
      onUpdateToolParameters={handleUpdateToolParameters}
    />
  )
}
