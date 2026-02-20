/**
 * Type of node in the file system
 */
export type NodeType = 'directory' | 'file';

/**
 * Type of a tool parameter value
 */
export type ToolParameterType = 'string' | 'number' | 'boolean' | 'enum';

/**
 * A configurable parameter for a tool
 */
export interface ToolParameter {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: ToolParameterType;
  /** Human-readable description */
  description: string;
  /** Whether this parameter is required */
  required?: boolean;
  /** Default value if optional */
  default?: string | number | boolean;
  /** Available options for enum types */
  options?: string[];
  /** Whether multiple values can be selected (for enums) */
  multiple?: boolean;
  /** Whether this is a secret/credential value */
  secret?: boolean;
}

/**
 * A tool available in the Tool Library
 */
export interface Tool {
  /** Unique tool identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of what the tool does */
  description: string;
  /** Configurable parameters for this tool */
  parameters: ToolParameter[];
}

/**
 * Configuration for a specific tool on a file or directory
 */
export interface ToolConfiguration {
  /** ID of the tool being configured */
  toolId: string;
  /** Whether the tool is enabled */
  enabled: boolean;
  /** Parameter values for this configuration */
  parameters: Record<string, string | number | boolean | string[]>;
}

/**
 * A tool inherited from a parent directory
 */
export interface InheritedTool {
  /** ID of the inherited tool */
  toolId: string;
  /** Path of the directory this tool is inherited from */
  sourcePath: string;
  /** Parameter values from the parent configuration */
  parameters: Record<string, string | number | boolean | string[]>;
}

/**
 * State of the tool configuration sidebar
 */
export interface ToolSidebarState {
  /** Whether the sidebar is open */
  isOpen: boolean;
  /** Current search query */
  searchQuery: string;
  /** Optional category filter */
  filterCategory: string | null;
}

/**
 * Metadata configuration stored in a directory's config.json file
 */
export interface DirectoryConfig {
  /** Human-readable label for the directory */
  label?: string;
  /** Description of the directory's purpose */
  description?: string;
  /** Icon identifier for UI rendering */
  icon?: string;
  /** Color for visual distinction in UI */
  color?: string;
  /** Tool configurations for this directory */
  tools?: ToolConfiguration[];
  /** Additional custom metadata properties */
  [key: string]: unknown;
}

/**
 * Frontmatter metadata from a prompt fragment's markdown file
 */
export interface PromptFrontmatter {
  /** Human-readable title */
  title?: string;
  /** Category for organization */
  category?: string;
  /** Tags for filtering and discovery */
  tags?: string[];
  /** Author identifier */
  author?: string;
  /** ISO date string of creation */
  created?: string;
  /** ISO date string of last modification */
  modified?: string;
  /** Severity or priority level */
  severity?: 'low' | 'medium' | 'high';
  /** Tool configurations for this fragment */
  tools?: ToolConfiguration[];
  /** Additional custom properties */
  [key: string]: unknown;
}

/**
 * A prompt fragment file in the library
 */
export interface PromptFragment {
  /** Unique identifier for the fragment */
  id: string;
  /** Filename including extension */
  name: string;
  /** Node type discriminator */
  type: 'file';
  /** Full path from root */
  path: string;
  /** Optional frontmatter metadata */
  frontmatter?: PromptFrontmatter;
  /** Markdown content of the prompt */
  content: string;
}

/**
 * A directory that can contain other nodes
 */
export interface Directory {
  /** Unique identifier for the directory */
  id: string;
  /** Directory name */
  name: string;
  /** Node type discriminator */
  type: 'directory';
  /** Full path from root */
  path: string;
  /** Optional directory metadata from config.json */
  config?: DirectoryConfig;
  /** Child nodes (directories and/or files) */
  children?: FileSystemNode[];
}

/**
 * Union type for any node in the file system tree
 */
export type FileSystemNode = Directory | PromptFragment;

/**
 * New file form data for creation modal
 */
export interface NewFileForm {
  /** Filename with .md extension */
  filename: string;
  /** Parent directory path where file will be created */
  parentPath: string;
}

/**
 * New folder form data for creation modal */
export interface NewFolderForm {
  /** Folder name (no spaces, URL-friendly) */
  folderName: string;
  /** Parent directory path where folder will be created */
  parentPath: string;
}

/**
 * Context menu action type
 */
export type ContextMenuAction = 'rename' | 'move' | 'delete' | 'duplicate';

/**
 * Props for the Prompt Library screen component
 */
export interface PromptLibraryProps {
  /** The complete file system tree structure */
  fileSystem: Directory;
  /** Currently selected file (if any) */
  selectedFile: PromptFragment | null;
  /** Array of folder paths that should be expanded in the tree */
  expandedFolders: string[];
  /** Whether the current editor has unsaved changes */
  unsavedChanges: boolean;
  /** Whether a file operation is in progress */
  isLoading?: boolean;
  /** Error message to display (if any) */
  error?: string | null;
  /** Available tools from the Tool Library */
  availableTools: Tool[];
  /** State of the tool configuration sidebar */
  toolSidebar: ToolSidebarState;
  /** Tools inherited by the currently selected node from parent directories */
  inheritedTools?: InheritedTool[];
  /** Tools explicitly configured on the currently selected node */
  configuredTools?: ToolConfiguration[];

  /** Callback when a file is selected in the tree */
  onSelectFile: (file: PromptFragment) => void;
  /** Callback when a folder is expanded/collapsed */
  onToggleFolder: (path: string) => void;
  /** Callback when file content is edited */
  onEditContent: (content: string) => void;
  /** Callback when changes are saved */
  onSave: () => void;
  /** Callback when a new file is created */
  onCreateFile: (form: NewFileForm) => void;
  /** Callback when a new folder is created */
  onCreateFolder: (form: NewFolderForm) => void;
  /** Callback when a node is renamed */
  onRename: (nodeId: string, newName: string) => void;
  /** Callback when a node is moved */
  onMove: (nodeId: string, newParentPath: string) => void;
  /** Callback when a node is deleted */
  onDelete: (nodeId: string) => void;
  /** Callback when tool sidebar is toggled open/closed */
  onToggleToolSidebar: () => void;
  /** Callback when tool search query changes */
  onToolSearchChange: (query: string) => void;
  /** Callback when a tool is enabled or disabled */
  onToggleTool: (toolId: string, enabled: boolean) => void;
  /** Callback when a tool's parameters are updated */
  onUpdateToolParameters: (toolId: string, parameters: Record<string, string | number | boolean | string[]>) => void;
}
