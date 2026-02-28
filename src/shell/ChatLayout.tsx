import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from './components'

type ChatState = {
  sidebarCollapsed: boolean
}

const STORAGE_KEY = 'chat-layout-state'

const DEFAULT_STATE: ChatState = {
  sidebarCollapsed: false,
}

function loadState(): ChatState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE
}

function saveState(state: ChatState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

export default function ChatLayout() {
  const navigate = useNavigate()
  const { workspaceName } = useParams<{ workspaceName: string }>()
  const [state, setState] = useState<ChatState>(loadState)

  // Build workspace-aware path helper
  const studioPath = workspaceName ? `/workspace/${workspaceName}/studio` : '/studio'

  // Persist state changes
  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppShell
      defaultSidebarCollapsed={state.sidebarCollapsed}
      onSidebarCollapsedChange={(collapsed) =>
        setState((prev) => ({ ...prev, sidebarCollapsed: collapsed }))
      }
      onNewAgent={() => navigate(studioPath)}
      onOpenSettings={() => console.log('Open settings')}
      onEditAgent={(id) => console.log('Edit agent:', id)}
      onDeleteAgent={(id) => console.log('Delete agent:', id)}
      user={{ name: 'Alex Morgan' }}
      onLogout={() => console.log('Logout')}
    />
  )
}
