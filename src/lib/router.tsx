import { createBrowserRouter } from 'react-router-dom'
import LandingLayout from '@/shell/LandingLayout'
import ChatLayout from '@/shell/ChatLayout'
import StudioLayout from '@/shell/StudioLayout'

export const router = createBrowserRouter([
  // Landing page
  {
    path: '/',
    element: <LandingLayout />,
  },
  // Workspace-based Chat app with nested routes
  {
    path: '/workspace/:workspaceName/chat',
    element: <ChatLayout />,
    children: [
      // Default dashboard view
      { index: true },
      // New chat with specific agent
      { path: 'agent/:agentId' },
      // Chat with specific conversation (and optionally agent)
      { path: 'chat/:chatId' },
      // Agent + conversation combined
      { path: 'agent/:agentId/chat/:chatId' },
    ],
  },
  // Workspace-based Studio app with nested routes
  {
    path: '/workspace/:workspaceName/studio',
    element: <StudioLayout />,
    children: [
      // Default list view
      { index: true },
      // Domain detail view
      { path: 'domain/:domainId' },
      // Agent detail view
      { path: 'agent/:agentId' },
      // Agent flow editing view (shows modal)
      { path: 'agent/:agentId/commands/:commandId' },
    ],
  },
],
  { basename: import.meta.env.BASE_URL }
)
