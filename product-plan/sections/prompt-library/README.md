# Prompt Library

## Overview

The Prompt Library is a filesystem-based workspace where experts author, organize, and manage prompt fragments as a hierarchical taxonomy of markdown files. Users navigate a split-pane interface with an expandable file tree on the left and a WYSIWYG editor on the right for creating and editing prompt content.

## User Flows

- **Browse library** — Navigate the hierarchical file tree to explore prompt fragments by domain or category
- **View fragment** — Click a file in the tree to load its content in the editor pane for reading
- **Create fragment** — Click "New", provide a filename and location, then open in editor
- **Edit fragment** — Make changes to content in the WYSIWYG editor and save
- **Create folder** — Add new directories to the taxonomy for organization
- **Rename/move** — Rename files or folders, or move them to different locations in the tree
- **Delete** — Remove files or folders from the library

## Design Decisions

- Split-pane layout provides constant context — users can see the file tree while editing
- WYSIWYG editor (not raw markdown) lowers barrier for non-technical domain experts
- Frontmatter metadata supports categorization and discovery without rigid schemas
- File system metaphor is familiar to most users and maps well to mental models of knowledge organization
- Unsaved changes indicator prevents accidental data loss

## Data Shapes

**Entities:**
- `Directory` — Folders containing child nodes with optional config metadata
- `PromptFragment` — Markdown files with content and optional frontmatter
- `FileSystemNode` — Union type for either directories or files
- `DirectoryConfig` — Metadata from config.json (label, description, icon, color)
- `PromptFrontmatter` — YAML frontmatter from markdown files (title, tags, author, etc.)

**From global entities:** Workspace, User

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `PromptLibrary` — Main split-pane component with file tree sidebar and editor panel

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectFile` | User clicks a file in the tree |
| `onToggleFolder` | User clicks to expand/collapse a folder |
| `onEditContent` | User types in the editor |
| `onSave` | User clicks save or presses Ctrl+S |
| `onCreateFile` | User submits the new file form |
| `onCreateFolder` | User submits the new folder form |
| `onRename` | User renames a node |
| `onMove` | User moves a node to a new parent |
| `onDelete` | User deletes a node |
