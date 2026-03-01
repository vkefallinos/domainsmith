import JSZip from 'jszip'
import type {
  Agent,
  ExtractedDataStructure,
  FlowTask,
  KnowledgeNode,
  WorkspaceData,
} from '@/types/workspace-data'

export interface FileTreeFileNode {
  type: 'file'
  name: string
  content: string
}

export interface FileTreeDirectoryNode {
  type: 'directory'
  name: string
  children: FileTreeNode[]
}

export type FileTreeNode = FileTreeFileNode | FileTreeDirectoryNode

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function frontmatterValueToString(value: unknown): string {
  if (value === undefined) return ''
  if (value === null) return 'null'

  if (typeof value === 'string') {
    return JSON.stringify(value)
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    Array.isArray(value) ||
    isPlainObject(value)
  ) {
    return JSON.stringify(value)
  }

  return JSON.stringify(String(value))
}

function formatMarkdownWithFrontmatter(
  frontmatter: Record<string, unknown> | undefined,
  body: string
): string {
  const fm = frontmatter || {}
  const keys = Object.keys(fm).filter((key) => fm[key] !== undefined)

  if (keys.length === 0) {
    return body.trim()
  }

  const frontmatterText = keys
    .map((key) => `${key}: ${frontmatterValueToString(fm[key])}`)
    .join('\n')

  return `---\n${frontmatterText}\n---\n${body.trim()}`
}

function escapeXmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function toSlashActionBlock(agent: Agent): string {
  if (!agent.slashActions || agent.slashActions.length === 0) {
    return ''
  }

  return agent.slashActions
    .map((action) => {
      const name = escapeXmlAttribute(action.name || '')
      const description = escapeXmlAttribute(action.description || '')
      const flowId = escapeXmlAttribute(action.flowId || '')
      const actionId = (action.actionId || '').trim().replace(/^\/+/, '')

      return `<slash_action name="${name}" description="${description}" flowId="${flowId}">\n/${actionId}\n</slash_action>`
    })
    .join('\n\n')
}

function toAgentInstructMarkdown(agent: Agent): string {
  const body = [agent.mainInstruction?.trim() || '', toSlashActionBlock(agent)]
    .filter((part) => part.length > 0)
    .join('\n\n')

  return formatMarkdownWithFrontmatter(agent.frontmatter, body)
}

function toOutputBlock(task: FlowTask): string {
  if (!task.outputSchema) {
    return ''
  }

  const attr = task.targetFieldName ? ` target="${escapeXmlAttribute(task.targetFieldName)}"` : ''
  const schema = JSON.stringify(task.outputSchema, null, 2)
  return `<output${attr}>\n${schema}\n</output>`
}

function toTaskMarkdown(task: FlowTask): string {
  const outputBlock = toOutputBlock(task)
  const body = [task.instructions?.trim() || '', outputBlock]
    .filter((part) => part.length > 0)
    .join('\n\n')

  return formatMarkdownWithFrontmatter(task.frontmatter, body)
}

function getOrCreateDirectory(parent: FileTreeDirectoryNode, name: string): FileTreeDirectoryNode {
  const existing = parent.children.find(
    (child): child is FileTreeDirectoryNode => child.type === 'directory' && child.name === name
  )

  if (existing) {
    return existing
  }

  const next: FileTreeDirectoryNode = {
    type: 'directory',
    name,
    children: [],
  }

  parent.children.push(next)
  return next
}

function upsertFile(parent: FileTreeDirectoryNode, fileName: string, content: string) {
  const existingIndex = parent.children.findIndex(
    (child) => child.type === 'file' && child.name === fileName
  )

  const nextFile: FileTreeFileNode = {
    type: 'file',
    name: fileName,
    content,
  }

  if (existingIndex >= 0) {
    parent.children[existingIndex] = nextFile
    return
  }

  parent.children.push(nextFile)
}

function addFileAtPath(root: FileTreeDirectoryNode, relativePath: string, content: string) {
  const segments = relativePath.split('/').filter(Boolean)
  if (segments.length === 0) return

  const fileName = segments[segments.length - 1]
  let cursor = root

  for (const segment of segments.slice(0, -1)) {
    cursor = getOrCreateDirectory(cursor, segment)
  }

  upsertFile(cursor, fileName, content)
}

function sortTree(node: FileTreeDirectoryNode) {
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  for (const child of node.children) {
    if (child.type === 'directory') {
      sortTree(child)
    }
  }
}

function addKnowledgeNodeToFileTree(root: FileTreeDirectoryNode, node: KnowledgeNode) {
  if (node.type === 'directory') {
    if (node.config && Object.keys(node.config).length > 0) {
      addFileAtPath(
        root,
        `knowledge/${node.path}/config.json`,
        JSON.stringify(node.config, null, 2)
      )
    }

    for (const child of node.children || []) {
      addKnowledgeNodeToFileTree(root, child)
    }
    return
  }

  const markdown = formatMarkdownWithFrontmatter(
    node.frontmatter as Record<string, unknown> | undefined,
    node.content || ''
  )

  addFileAtPath(root, `knowledge/${node.path}`, markdown)
}

export function workspaceToFileTreeJson(workspace: WorkspaceData): FileTreeDirectoryNode {
  const root: FileTreeDirectoryNode = {
    type: 'directory',
    name: workspace.id,
    children: [],
  }

  if (workspace.packageJson) {
    addFileAtPath(root, 'package.json', JSON.stringify(workspace.packageJson, null, 2))
  }

  const sortedAgents = Object.values(workspace.agents || {}).sort((a, b) => a.id.localeCompare(b.id))
  for (const agent of sortedAgents) {
    const agentBase = `agents/${agent.id}`
    addFileAtPath(root, `${agentBase}/instruct.md`, toAgentInstructMarkdown(agent))
    addFileAtPath(root, `${agentBase}/config.json`, JSON.stringify(agent.config || {}, null, 2))
    addFileAtPath(root, `${agentBase}/values.json`, JSON.stringify(agent.formValues || {}, null, 2))

    for (const conversation of agent.conversations || []) {
      const conversationId = (conversation.id || `conversation-${Date.now()}`).replace(/\//g, '-')
      addFileAtPath(
        root,
        `${agentBase}/conversations/${conversationId}.json`,
        JSON.stringify(conversation, null, 2)
      )
    }
  }

  const sortedFlows = Object.values(workspace.flows || {}).sort((a, b) => a.id.localeCompare(b.id))
  for (const flow of sortedFlows) {
    const flowBase = `flows/${flow.id}`
    addFileAtPath(
      root,
      `${flowBase}/index.md`,
      formatMarkdownWithFrontmatter(flow.frontmatter, flow.description || '')
    )

    const sortedTasks = [...(flow.tasks || [])].sort((a, b) => a.order - b.order)
    for (const task of sortedTasks) {
      const taskName = (task.name || 'task').replace(/\//g, '-')
      addFileAtPath(root, `${flowBase}/${task.order}.${taskName}.md`, toTaskMarkdown(task))
    }
  }

  for (const node of workspace.knowledge || []) {
    addKnowledgeNodeToFileTree(root, node)
  }

  sortTree(root)
  return root
}

function addFileTreeNodeToZip(zip: JSZip, node: FileTreeNode, basePath = '') {
  const nodePath = basePath ? `${basePath}/${node.name}` : node.name

  if (node.type === 'file') {
    zip.file(nodePath, node.content)
    return
  }

  for (const child of node.children) {
    addFileTreeNodeToZip(zip, child, nodePath)
  }
}

export async function fileTreeJsonToZipBlob(fileTree: FileTreeDirectoryNode): Promise<Blob> {
  const zip = new JSZip()
  addFileTreeNodeToZip(zip, fileTree)
  return zip.generateAsync({ type: 'blob' })
}

export async function downloadWorkspaceZip(workspace: WorkspaceData): Promise<void> {
  const fileTree = workspaceToFileTreeJson(workspace)
  const blob = await fileTreeJsonToZipBlob(fileTree)

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = `${workspace.id}-file-tree.zip`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function downloadAllWorkspacesZip(data: ExtractedDataStructure): Promise<void> {
  const root: FileTreeDirectoryNode = {
    type: 'directory',
    name: 'workspaces',
    children: Object.values(data.workspaces || {}).map(workspaceToFileTreeJson),
  }

  const blob = await fileTreeJsonToZipBlob(root)
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = 'workspaces-file-tree.zip'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}