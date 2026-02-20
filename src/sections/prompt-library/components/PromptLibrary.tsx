'use client'

import { useState, useRef, useCallback, useMemo, useEffect, type KeyboardEvent } from 'react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  MoreVertical,
  Save,
  X,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  Search,
  FolderPlus,
  FilePlus,
  Wrench,
} from 'lucide-react'
import type {
  PromptLibraryProps,
  FileSystemNode,
  PromptFragment,
  Directory,
  NewFileForm,
  NewFolderForm,
  ToolConfiguration,
  InheritedTool,
} from '@/../product/sections/prompt-library/types'
import { ToolSidebar } from './ToolSidebar'

// Sub-component: Context Menu
interface ContextMenuProps {
  node: FileSystemNode
  onClose: () => void
  onRename: () => void
  onMove: () => void
  onDelete: () => void
  position: { x: number; y: number }
}

function ContextMenu({ node, onClose, onRename, onMove, onDelete, position }: ContextMenuProps) {
  const isDirectory = node.type === 'directory'

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 min-w-[160px] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        style={{ left: position.x, top: position.y }}
      >
        <button
          onClick={() => {
            onRename()
            onClose()
          }}
          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
        >
          <span className="w-4 h-4" />
          Rename
        </button>
        {isDirectory && (
          <button
            onClick={() => {
              onMove()
              onClose()
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
          >
            <span className="w-4 h-4" />
            Move to...
          </button>
        )}
        <div className="h-px bg-slate-200 dark:bg-slate-700" />
        <button
          onClick={() => {
            onDelete()
            onClose()
          }}
          className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-3 transition-colors"
        >
          <span className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  )
}

// Sub-component: File Tree Node
interface TreeNodeProps {
  node: FileSystemNode
  level: number
  isExpanded: (path: string) => boolean
  isSelected: (id: string) => boolean
  onToggle: (path: string) => void
  onSelect: (file: PromptFragment) => void
  onContextMenu: (node: FileSystemNode, position: { x: number; y: number }) => void
}

function TreeNode({
  node,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  onContextMenu,
}: TreeNodeProps) {
  const isDir = node.type === 'directory'
  const selected = isSelected(node.id)
  const hasChildren = isDir && node.children && node.children.length > 0

  const handleClick = () => {
    if (isDir) {
      onToggle(node.path)
    } else {
      onSelect(node as PromptFragment)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(node, { x: e.clientX, y: e.clientY })
  }

  const getNodeColor = () => {
    if (isDir && (node as Directory).config?.color) {
      return (node as Directory).config?.color
    }
    return undefined
  }

  const nodeColor = getNodeColor()

  // Check if node has tools configured
  const hasTools = isDir
    ? (node as Directory).config?.tools && (node as Directory).config!.tools!.length > 0
    : (node as PromptFragment).frontmatter?.tools && (node as PromptFragment).frontmatter!.tools!.length > 0

  const toolCount = isDir
    ? (node as Directory).config?.tools?.filter(t => t.enabled).length || 0
    : (node as PromptFragment).frontmatter?.tools?.filter(t => t.enabled).length || 0

  return (
    <div>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`
          group flex items-center gap-2 py-2 px-2 mx-1 rounded-lg cursor-pointer
          transition-all duration-150
          ${selected
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-100'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isDir ? (
          <>
            {isExpanded(node.path) ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
            )}
            {isExpanded(node.path) ? (
              <FolderOpen className="w-4 h-4" style={{ color: nodeColor || '#8b5cf6' }} />
            ) : (
              <Folder className="w-4 h-4" style={{ color: nodeColor || '#8b5cf6' }} />
            )}
          </>
        ) : (
          <>
            <span className="w-4 h-4" />
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
          </>
        )}
        <span className="text-sm font-medium truncate flex-1">
          {node.name}
        </span>
        {/* Tool badge indicator */}
        {hasTools && toolCount > 0 && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium" title="Has configured tools">
            <Wrench className="w-3 h-3" />
            {toolCount}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            onContextMenu(node, { x: rect.left, y: rect.bottom + 4 })
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {isDir && isExpanded(node.path) && hasChildren && (
        <div className="relative">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              isSelected={isSelected}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Sub-component: New File Modal
interface NewFileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (form: NewFileForm) => void
  directories: Directory[]
  parentPath: string
}

function NewFileModal({ isOpen, onClose, onSubmit, directories, parentPath }: NewFileModalProps) {
  const [filename, setFilename] = useState('')
  const [selectedParent, setSelectedParent] = useState(parentPath)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filename.trim()) {
      onSubmit({
        filename: filename.trim().endsWith('.md') ? filename.trim() : `${filename.trim()}.md`,
        parentPath: selectedParent,
      })
      setFilename('')
    }
  }

  // Flatten directories for selection
  const flattenDirectories = (dir: Directory, prefix = ''): Array<{ path: string; label: string }> => {
    const items = [{ path: dir.path, label: prefix + dir.name }]
    if (dir.children) {
      dir.children.forEach((child) => {
        if (child.type === 'directory') {
          items.push(...flattenDirectories(child, prefix + child.name + ' / '))
        }
      })
    }
    return items
  }

  const dirOptions = flattenDirectories(directories[0])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">New Prompt Fragment</h3>
          <p className="text-violet-100 text-sm mt-0.5">Create a new markdown file</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-prompt-fragment"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1.5">.md extension will be added automatically</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Location
            </label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all"
            >
              {dirOptions.map((dir) => (
                <option key={dir.path} value={dir.path}>
                  {dir.label || '/ (root)'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
            >
              Create File
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Sub-component: New Folder Modal
interface NewFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (form: NewFolderForm) => void
  directories: Directory[]
  parentPath: string
}

function NewFolderModal({ isOpen, onClose, onSubmit, directories, parentPath }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [selectedParent, setSelectedParent] = useState(parentPath)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim()) {
      onSubmit({
        folderName: folderName.trim().toLowerCase().replace(/\s+/g, '-'),
        parentPath: selectedParent,
      })
      setFolderName('')
    }
  }

  const flattenDirectories = (dir: Directory, prefix = ''): Array<{ path: string; label: string }> => {
    const items = [{ path: dir.path, label: prefix + dir.name }]
    if (dir.children) {
      dir.children.forEach((child) => {
        if (child.type === 'directory') {
          items.push(...flattenDirectories(child, prefix + child.name + ' / '))
        }
      })
    }
    return items
  }

  const dirOptions = flattenDirectories(directories[0])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">New Folder</h3>
          <p className="text-amber-100 text-sm mt-0.5">Create a new directory</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="my-folder"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1.5">Use lowercase with hyphens</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Parent Location
            </label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all"
            >
              {dirOptions.map((dir) => (
                <option key={dir.path} value={dir.path}>
                  {dir.label || '/ (root)'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Sub-component: Rename Modal
interface RenameModalProps {
  isOpen: boolean
  nodeName: string
  onClose: () => void
  onSubmit: (newName: string) => void
}

function RenameModal({ isOpen, nodeName, onClose, onSubmit }: RenameModalProps) {
  const [newName, setNewName] = useState(nodeName)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim() && newName.trim() !== nodeName) {
      onSubmit(newName.trim())
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Rename</h3>
          <p className="text-slate-300 text-sm mt-0.5">Enter a new name</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:text-white transition-all"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Component
export function PromptLibrary({
  fileSystem,
  selectedFile,
  expandedFolders,
  unsavedChanges,
  isLoading = false,
  error = null,
  availableTools = [],
  toolSidebar = { isOpen: false, searchQuery: '', filterCategory: null },
  inheritedTools = [],
  configuredTools = [],
  onSelectFile,
  onToggleFolder,
  onEditContent,
  onSave,
  onCreateFile,
  onCreateFolder,
  onRename,
  onMove,
  onDelete,
  onToggleToolSidebar,
  onToolSearchChange,
  onToggleTool,
  onUpdateToolParameters,
}: PromptLibraryProps) {
  const [contextMenu, setContextMenu] = useState<{
    node: FileSystemNode | null
    position: { x: number; y: number }
  }>({ node: null, position: { x: 0, y: 0 } })
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [editorContent, setEditorContent] = useState(selectedFile?.content || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [newFileParentPath, setNewFileParentPath] = useState('/')

  // Tool sidebar state
  const [toolSidebarOpen, setToolSidebarOpen] = useState(false)
  const [toolSearchQuery, setToolSearchQuery] = useState('')
  // Local tool configuration state (for the currently selected file/directory)
  const [localConfiguredTools, setLocalConfiguredTools] = useState<ToolConfiguration[]>([])
  const [localInheritedTools, setLocalInheritedTools] = useState<InheritedTool[]>([])

  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Determine selected node type for tool sidebar
  const selectedNodeType = selectedFile ? 'file' as const : undefined
  const selectedNodePath = selectedFile?.path

  // Update editor content when selection changes
  const handleSelectFile = useCallback((file: PromptFragment) => {
    setEditorContent(file.content)
    setNewFileParentPath(file.path.substring(0, file.path.lastIndexOf('/')) || '/')
    onSelectFile(file)
  }, [onSelectFile])

  const handleEditContent = useCallback((content: string) => {
    setEditorContent(content)
    onEditContent(content)
  }, [onEditContent])

  const handleSave = useCallback(() => {
    onSave()
  }, [onSave])

  const handleContextMenu = useCallback((node: FileSystemNode, position: { x: number; y: number }) => {
    setContextMenu({ node, position })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu({ node: null, position: { x: 0, y: 0 } })
  }, [])

  const handleRename = useCallback(() => {
    if (contextMenu.node) {
      setShowRenameModal(true)
    }
  }, [contextMenu.node])

  const handleRenameSubmit = useCallback((newName: string) => {
    if (contextMenu.node) {
      onRename(contextMenu.node.id, newName)
    }
  }, [contextMenu.node, onRename])

  const handleMove = useCallback(() => {
    if (contextMenu.node) {
      setContextMenu({ node: null, position: { x: 0, y: 0 } })
    }
  }, [contextMenu.node])

  const handleDelete = useCallback(() => {
    if (contextMenu.node) {
      onDelete(contextMenu.node.id)
    }
  }, [contextMenu.node, onDelete])

  const handleCreateFile = useCallback((form: NewFileForm) => {
    setShowNewFileModal(false)
    onCreateFile(form)
  }, [onCreateFile])

  const handleCreateFolder = useCallback((form: NewFolderForm) => {
    setShowNewFolderModal(false)
    onCreateFolder(form)
  }, [onCreateFolder])

  // ===== Tool Configuration Handlers =====

  // Helper: Get all parent directories for a path
  const getParentPaths = useCallback((filePath: string): string[] => {
    const parts = filePath.split('/').filter(Boolean)
    const parents: string[] = []
    for (let i = 1; i < parts.length; i++) {
      parents.push('/' + parts.slice(0, i).join('/'))
    }
    return parents
  }, [])

  // Helper: Find a directory in the tree by path
  const findDirectoryByPath = useCallback((path: string, node: FileSystemNode = fileSystem): Directory | null => {
    if (node.path === path && node.type === 'directory') {
      return node as Directory
    }
    if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        const found = findDirectoryByPath(path, child)
        if (found) return found
      }
    }
    return null
  }, [fileSystem])

  // Compute inherited tools from parent directories
  const computeInheritedTools = useCallback((filePath: string): InheritedTool[] => {
    const parentPaths = getParentPaths(filePath)
    const inherited: InheritedTool[] = []

    for (const parentPath of parentPaths) {
      const dir = findDirectoryByPath(parentPath)
      if (dir?.config?.tools) {
        for (const tool of dir.config.tools) {
          if (tool.enabled) {
            inherited.push({
              toolId: tool.toolId,
              sourcePath: parentPath,
              parameters: tool.parameters,
            })
          }
        }
      }
    }

    return inherited
  }, [getParentPaths, findDirectoryByPath])

  // Update local tool state when file selection changes
  useEffect(() => {
    if (selectedFile) {
      // Get configured tools from file frontmatter
      const fileTools = selectedFile.frontmatter?.tools || []
      setLocalConfiguredTools(fileTools)

      // Get inherited tools from parent directories
      const inherited = computeInheritedTools(selectedFile.path)
      setLocalInheritedTools(inherited)
    } else {
      setLocalConfiguredTools([])
      setLocalInheritedTools([])
    }
  }, [selectedFile, computeInheritedTools])

  // Toggle tool sidebar open/closed
  const handleToggleToolSidebar = useCallback(() => {
    setToolSidebarOpen(prev => !prev)
    if (onToggleToolSidebar) {
      onToggleToolSidebar()
    }
  }, [onToggleToolSidebar])

  // Handle tool search
  const handleToolSearchChange = useCallback((query: string) => {
    setToolSearchQuery(query)
    if (onToolSearchChange) {
      onToolSearchChange(query)
    }
  }, [onToolSearchChange])

  // Toggle tool enabled/disabled
  const handleToggleTool = useCallback((toolId: string, enabled: boolean) => {
    setLocalConfiguredTools(prev => {
      const existing = prev.find(t => t.toolId === toolId)
      if (existing) {
        // Update existing
        if (enabled) {
          // Keep enabled, just update
          return prev.map(t => t.toolId === toolId ? { ...t, enabled } : t)
        } else {
          // Remove if disabling (or keep as enabled: false to explicitly disable)
          return prev.map(t => t.toolId === toolId ? { ...t, enabled } : t)
        }
      } else {
        // Add new tool configuration
        const newConfig: ToolConfiguration = {
          toolId,
          enabled,
          parameters: {},
        }
        return [...prev, newConfig]
      }
    })

    // Call parent callback
    if (onToggleTool) {
      onToggleTool(toolId, enabled)
    }

    // Trigger save to persist to frontmatter/config.json
    if (onSave) {
      onSave()
    }
  }, [onToggleTool, onSave])

  // Update tool parameters
  const handleUpdateToolParameters = useCallback((
    toolId: string,
    parameters: Record<string, string | number | boolean | string[]>
  ) => {
    setLocalConfiguredTools(prev => {
      const existing = prev.find(t => t.toolId === toolId)
      if (existing) {
        return prev.map(t =>
          t.toolId === toolId
            ? { ...t, parameters: { ...t.parameters, ...parameters } }
            : t
        )
      } else {
        // Create new tool config with parameters
        const newConfig: ToolConfiguration = {
          toolId,
          enabled: true,
          parameters,
        }
        return [...prev, newConfig]
      }
    })

    // Call parent callback
    if (onUpdateToolParameters) {
      onUpdateToolParameters(toolId, parameters)
    }

    // Trigger save to persist
    if (onSave) {
      onSave()
    }
  }, [onUpdateToolParameters, onSave])

  // Build tool sidebar state object
  const toolSidebarState = useMemo(() => ({
    isOpen: toolSidebarOpen,
    searchQuery: toolSearchQuery,
    filterCategory: null,
  }), [toolSidebarOpen, toolSearchQuery])

  // Filter tree nodes based on search
  const filterNodes = (nodes: FileSystemNode[], query: string): FileSystemNode[] => {
    if (!query) return nodes

    const filtered: FileSystemNode[] = []
    const lowerQuery = query.toLowerCase()

    nodes.forEach((node) => {
      const matchesSearch = node.name.toLowerCase().includes(lowerQuery)

      if (node.type === 'directory') {
        const filteredChildren = filterNodes(node.children || [], query)
        if (matchesSearch || filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren,
          })
        }
      } else if (matchesSearch) {
        filtered.push(node)
      }
    })

    return filtered
  }

  const filteredTree = {
    ...fileSystem,
    children: filterNodes(fileSystem.children || [], searchQuery),
  }

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Save on Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }, [handleSave])

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* File Tree Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Prompt Library</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNewFileModal(true)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                title="New File"
              >
                <FilePlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                title="New Folder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-violet-500 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredTree.children && filteredTree.children.length > 0 ? (
            filteredTree.children.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                isExpanded={(path) => expandedFolders.includes(path)}
                isSelected={(id) => selectedFile?.id === id}
                onToggle={onToggleFolder}
                onSelect={handleSelectFile}
                onContextMenu={handleContextMenu}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <File className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">No files found</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>{fileSystem.children?.length || 0} items</span>
            {unsavedChanges && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Unsaved
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Editor Panel */}
      <main className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Editor Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            {selectedFile ? (
              <>
                <FileText className="w-5 h-5 text-violet-500 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {selectedFile.frontmatter?.title || selectedFile.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {selectedFile.path}
                  </p>
                </div>
                {unsavedChanges && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Unsaved
                  </span>
                )}
              </>
            ) : (
              <div className="text-slate-400">No file selected</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Tool Sidebar Toggle */}
            <button
              onClick={handleToggleToolSidebar}
              className={`
                p-2 rounded-lg transition-all flex items-center gap-2
                ${toolSidebarOpen
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                }
              `}
              title="Configure tools"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Tools</span>
              {localConfiguredTools.filter(t => t.enabled).length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                  {localConfiguredTools.filter(t => t.enabled).length}
                </span>
              )}
            </button>

            {selectedFile && (
              <button
                onClick={handleSave}
                disabled={!unsavedChanges || isLoading}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${unsavedChanges
                    ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-sm hover:shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => setContextMenu({ node: null, position: { x: 0, y: 0 } })}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              {/* Metadata Bar */}
              {selectedFile.frontmatter && Object.keys(selectedFile.frontmatter).length > 0 && (
                <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex items-center gap-4 text-sm">
                  {selectedFile.frontmatter.category && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-medium">
                      {selectedFile.frontmatter.category}
                    </span>
                  )}
                  {selectedFile.frontmatter.tags && selectedFile.frontmatter.tags.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {selectedFile.frontmatter.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                          {tag}
                        </span>
                      ))}
                      {selectedFile.frontmatter.tags.length > 3 && (
                        <span className="text-slate-400 text-xs">+{selectedFile.frontmatter.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  {selectedFile.frontmatter.modified && (
                    <span className="ml-auto text-xs text-slate-400">
                      Modified {new Date(selectedFile.frontmatter.modified).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}

              {/* Text Editor */}
              <div className="flex-1 p-6 overflow-y-auto">
                <textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={(e) => handleEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`
                    w-full h-full resize-none outline-none
                    font-mono text-sm leading-relaxed
                    bg-transparent dark:text-slate-200
                    placeholder-slate-300 dark:placeholder-slate-600
                  `}
                  placeholder="Start writing your prompt fragment..."
                  spellCheck={false}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <FileText className="w-16 h-16 mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">No file selected</h3>
              <p className="text-sm max-w-md text-center">
                Select a file from the tree to view and edit its content, or create a new prompt fragment.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Context Menu */}
      {contextMenu.node && (
        <ContextMenu
          node={contextMenu.node}
          position={contextMenu.position}
          onClose={closeContextMenu}
          onRename={handleRename}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <NewFileModal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        onSubmit={handleCreateFile}
        directories={[fileSystem]}
        parentPath={newFileParentPath}
      />

      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onSubmit={handleCreateFolder}
        directories={[fileSystem]}
        parentPath={newFileParentPath}
      />

      <RenameModal
        isOpen={showRenameModal}
        nodeName={contextMenu.node?.name || ''}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRenameSubmit}
      />

      {/* Tool Configuration Sidebar */}
      <ToolSidebar
        isOpen={toolSidebarOpen}
        availableTools={availableTools}
        inheritedTools={localInheritedTools}
        configuredTools={localConfiguredTools}
        state={toolSidebarState}
        selectedNodePath={selectedNodePath}
        selectedNodeType={selectedNodeType}
        onClose={handleToggleToolSidebar}
        onSearchChange={handleToolSearchChange}
        onToggleTool={handleToggleTool}
        onUpdateToolParameters={handleUpdateToolParameters}
      />
    </div>
  )
}
