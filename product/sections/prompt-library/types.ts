/**
 * Type of node in the file system
 */
export type NodeType = 'directory' | 'file';

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
  /** Whether this file has unsaved changes */
  hasUnsavedChanges?: boolean;
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
  /** Filename (extension auto-added if not provided) */
  filename: string;
  /** Parent directory path where file will be created */
  parentPath: string;
}

/**
 * New folder form data for creation modal
 */
export interface NewFolderForm {
  /** Folder name */
  folderName: string;
  /** Parent directory path where folder will be created */
  parentPath: string;
}

/**
 * Context menu action type
 */
export type ContextMenuAction = 'rename' | 'move' | 'delete' | 'duplicate';

/**
 * Unsaved changes dialog action
 */
export type UnsavedChangesAction = 'save' | 'discard' | 'cancel';

/**
 * Validation error type
 */
export interface ValidationError {
  /** Field that has the error */
  field: string;
  /** Error message */
  message: string;
}

/**
 * Error display type
 */
export type ErrorType = 'toast' | 'modal' | 'inline';

/**
 * Error notification
 */
export interface ErrorNotification {
  /** Type of error display */
  type: ErrorType;
  /** Error message */
  message: string;
  /** Whether error requires user action to dismiss (for modal types) */
  blocking?: boolean;
  /** Auto-dismiss timeout in milliseconds (for toast types, default 5000) */
  timeout?: number;
}

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
  /** Error notification to display (if any) */
  error?: ErrorNotification | null;
  /** Validation errors for forms */
  validationErrors?: ValidationError[];
  /** Empty state type */
  emptyState?: 'no-selection' | 'empty-library';

  /** Callback when a file is selected in the tree */
  onSelectFile: (file: PromptFragment) => void;
  /** Callback when a folder is expanded/collapsed */
  onToggleFolder: (path: string) => void;
  /** Callback when all folders are expanded */
  onExpandAll: () => void;
  /** Callback when all folders are collapsed */
  onCollapseAll: () => void;
  /** Callback when file content is edited */
  onEditContent: (content: string) => void;
  /** Callback when changes are saved */
  onSave: () => void;
  /** Callback when unsaved changes dialog action is chosen */
  onUnsavedChangesAction: (action: UnsavedChangesAction) => void;
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
  /** Callback when a node is duplicated */
  onDuplicate: (nodeId: string) => void;
  /** Callback when error is dismissed */
  onDismissError: () => void;
}

/**
 * Supported markdown formatting types for the WYSIWYG editor
 */
export type MarkdownFormat =
  | 'bold'
  | 'italic'
  | 'heading'
  | 'bulletList'
  | 'numberedList'
  | 'codeBlock'
  | 'inlineCode'
  | 'link'
  | 'blockquote'
  | 'horizontalRule';

/**
 * WYSIWYG editor configuration
 */
export interface EditorConfig {
  /** Available formatting options */
  formats: MarkdownFormat[];
  /** Whether syntax highlighting is enabled for code blocks */
  syntaxHighlighting: boolean;
}

// ============================================================================
// Tool Configuration Types
// ============================================================================

/**
 * A tool parameter definition
 */
export interface ToolParameter {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: 'string' | 'number' | 'boolean' | 'enum';
  /** Display label */
  label?: string;
  /** Description of what the parameter does */
  description?: string;
  /** Whether this parameter is required */
  required?: boolean;
  /** Default value */
  default?: string | number | boolean | string[];
  /** Whether this is a secret parameter (password, API key, etc.) */
  secret?: boolean;
  /** Whether multiple values can be selected (for enum type) */
  multiple?: boolean;
  /** Available options (for enum type) */
  options?: string[];
}

/**
 * A tool that can be configured and used by prompt fragments
 */
export interface Tool {
  /** Unique tool identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what the tool does */
  description: string;
  /** Tool category for filtering */
  category?: string;
  /** Configurable parameters */
  parameters: ToolParameter[];
}

/**
 * Tool configuration attached to a file or directory
 */
export interface ToolConfiguration {
  /** Tool identifier */
  toolId: string;
  /** Whether the tool is enabled */
  enabled: boolean;
  /** Parameter values */
  parameters?: Record<string, string | number | boolean | string[]>;
}

/**
 * Tool inherited from a parent directory
 */
export interface InheritedTool {
  /** Tool identifier */
  toolId: string;
  /** Source directory path */
  sourcePath: string;
  /** Parameter values from parent */
  parameters?: Record<string, string | number | boolean | string[]>;
}

/**
 * Tool sidebar UI state
 */
export interface ToolSidebarState {
  /** Whether sidebar is open */
  isOpen: boolean;
  /** Current search query */
  searchQuery: string;
  /** Category filter (null = all) */
  filterCategory: string | null;
}

// Extend PromptLibraryProps with tool-related props
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
  /** Error notification to display (if any) */
  error?: ErrorNotification | null;
  /** Validation errors for forms */
  validationErrors?: ValidationError[];
  /** Empty state type */
  emptyState?: 'no-selection' | 'empty-library';

  /** Available tools that can be configured */
  availableTools?: Tool[];
  /** Tool sidebar state */
  toolSidebar?: ToolSidebarState;
  /** Tools inherited from parent directories */
  inheritedTools?: InheritedTool[];
  /** Tools explicitly configured for current node */
  configuredTools?: ToolConfiguration[];

  /** Callback when a file is selected in the tree */
  onSelectFile: (file: PromptFragment) => void;
  /** Callback when a folder is expanded/collapsed */
  onToggleFolder: (path: string) => void;
  /** Callback when all folders are expanded */
  onExpandAll: () => void;
  /** Callback when all folders are collapsed */
  onCollapseAll: () => void;
  /** Callback when file content is edited */
  onEditContent: (content: string) => void;
  /** Callback when changes are saved */
  onSave: () => void;
  /** Callback when unsaved changes dialog action is chosen */
  onUnsavedChangesAction?: (action: UnsavedChangesAction) => void;
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
  /** Callback when a node is duplicated */
  onDuplicate?: (nodeId: string) => void;
  /** Callback when error is dismissed */
  onDismissError?: () => void;

  /** Tool sidebar callbacks */
  /** Callback when tool sidebar toggle is clicked */
  onToggleToolSidebar?: () => void;
  /** Callback when tool search query changes */
  onToolSearchChange?: (query: string) => void;
  /** Callback when a tool is toggled on/off */
  onToggleTool?: (toolId: string, enabled: boolean) => void;
  /** Callback when tool parameters are updated */
  onUpdateToolParameters?: (toolId: string, parameters: Record<string, string | number | boolean | string[]>) => void;
}
