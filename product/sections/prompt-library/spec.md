# Prompt Library Specification

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
- **Open tool configuration** — Select a file or directory, then open the tool configuration sidebar
- **Browse available tools** — In the sidebar, view all available tools from the Tool Library with search and filter
- **Enable/disable tool** — Toggle a tool on or off for the selected file or directory
- **Configure tool parameters** — Set values for a tool's parameters (e.g., API keys, endpoints, options)
- **View inherited tools** — See which tools are inherited from parent directories vs. explicitly configured
- **Save tool configuration** — Commit tool changes to frontmatter (for files) or config.json (for directories)

## UI Requirements
- **Split pane layout** — File tree sidebar on left (expandable/collapsible), editor pane on right
- **File tree** — Hierarchical, nested folder structure with expand/collapse, visual distinction between folders and files
- **WYSIWYG editor** — Rich text editing with markdown support, no raw markdown mode
- **New file modal** — Form requiring filename input and parent folder selection before creation
- **New folder modal** — Form requiring folder name and parent location
- **Context menus** — Right-click on files/folders for rename, move, delete actions
- **Empty state** — Helpful message when no file is selected in the tree
- **Unsaved indicator** — Visual indicator when editor has unsaved changes
- **Tool configuration sidebar** — Collapsible right panel for configuring available tools on selected files or directories
- **Tool list in sidebar** — Searchable/filterable list of available tools with toggle switches
- **Tool details** — Each tool shows its name, description, and configurable parameters
- **Parameter inputs** — Support for text, number, boolean, and enum parameter types
- **Inheritance indicators** — Visual distinction between tools inherited from parent directories and explicitly configured tools
- **File tree tool badges** — Visual indicators on files/folders that have tools configured

## Configuration
- shell: true
