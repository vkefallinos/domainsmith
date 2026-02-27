import { useEffect, useState } from 'react'
import { AppShell } from './components'

type ShellState = {
  sidebarCollapsed: boolean
}

const STORAGE_KEY = 'shell-layout-state'

const DEFAULT_STATE: ShellState = {
  sidebarCollapsed: false,
}

function loadState(): ShellState {
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

function saveState(state: ShellState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

export default function ShellLayout() {
  const [state, setState] = useState<ShellState>(loadState)

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
      onOpenSettings={() => console.log('Open settings')}
      onEditAgent={(id) => console.log('Edit agent:', id)}
      onDeleteAgent={(id) => console.log('Delete agent:', id)}
      user={{ name: 'Alex Morgan' }}
      onLogout={() => console.log('Logout')}
    />
  )
}
