import data from '@/../product/sections/prompt-library/data.json'
import { PromptLibrary } from './components/PromptLibrary'
import type { PromptLibraryProps } from '@/../product/sections/prompt-library/types'

// This is a preview wrapper for Design OS only
// It imports sample data and feeds it to the props-based component

export default function PromptLibraryPreview() {
  // Simulate state changes for demo purposes
  const handleToggleFolder = (path: string) => {
    console.log('Toggle folder:', path)
  }

  const handleSelectFile = (file: { id: string }) => {
    console.log('Select file:', file.id)
  }

  const handleEditContent = (content: string) => {
    console.log('Edit content, length:', content.length)
  }

  const handleSave = () => {
    console.log('Save changes')
  }

  const handleCreateFile = ({ filename, parentPath }: { filename: string; parentPath: string }) => {
    console.log('Create file:', filename, 'in', parentPath)
  }

  const handleCreateFolder = ({ folderName, parentPath }: { folderName: string; parentPath: string }) => {
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

  return (
    <PromptLibrary
      fileSystem={data.fileSystem}
      selectedFile={data.selectedFile}
      expandedFolders={data.expandedFolders}
      unsavedChanges={data.unsavedChanges}
      onSelectFile={handleSelectFile}
      onToggleFolder={handleToggleFolder}
      onEditContent={handleEditContent}
      onSave={handleSave}
      onCreateFile={handleCreateFile}
      onCreateFolder={handleCreateFolder}
      onRename={handleRename}
      onMove={handleMove}
      onDelete={handleDelete}
    />
  )
}
