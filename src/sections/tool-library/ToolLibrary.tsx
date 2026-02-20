import { useState } from 'react'
import data from '@/../product/sections/tool-library/data.json'
import { ToolLibrary } from './components/ToolLibrary'
import type { ToolLibraryView } from '@/../product/sections/tool-library/types'

export default function ToolLibraryPreview() {
  const [currentView, setCurrentView] = useState<ToolLibraryView>('tools')

  return (
    <ToolLibrary
      tools={data.tools}
      packages={data.packages}
      environmentVariables={data.environmentVariables}
      currentView={currentView}
      onInstallPackage={(packageName) => console.log('Install package:', packageName)}
      onUninstallPackage={(packageName) => console.log('Uninstall package:', packageName)}
      onUpdatePackage={(packageName) => console.log('Update package:', packageName)}
      onSearchPackages={(query) => console.log('Search packages:', query)}
      onAddEnvVariable={(variable) => console.log('Add env variable:', variable)}
      onUpdateEnvVariable={(key, value) => console.log('Update env variable:', key, value)}
      onDeleteEnvVariable={(key) => console.log('Delete env variable:', key)}
      onToggleTool={(toolId) => console.log('Toggle tool:', toolId)}
      onChangeView={(view) => {
        console.log('Change view:', view)
        setCurrentView(view)
      }}
      onSearchTools={(query) => console.log('Search tools:', query)}
    />
  )
}
