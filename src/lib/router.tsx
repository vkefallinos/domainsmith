import { createBrowserRouter } from 'react-router-dom'
import { ProductPage } from '@/components/ProductPage'
import { DataShapePage } from '@/components/DataShapePage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import LandingLayout from '@/shell/LandingLayout'
import ShellLayout from '@/shell/ShellLayout'
import StudioLayout from '@/shell/StudioLayout'

export const router = createBrowserRouter([
  // Landing page
  {
    path: '/',
    element: <LandingLayout />,
  },
  // Shell app with nested routes
  {
    path: '/shell',
    element: <ShellLayout />,
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
  // Studio app with nested routes
  {
    path: '/studio',
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
  {
    path: '/data-shape',
    element: <DataShapePage />,
  },
  {
    path: '/design',
    element: <DesignPage />,
  },
  {
    path: '/sections',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName',
    element: <ScreenDesignPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
    element: <ScreenDesignFullscreen />,
  },
  {
    path: '/shell/design',
    element: <ShellDesignPage />,
  },
  {
    path: '/shell/design/fullscreen',
    element: <ShellDesignFullscreen />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
])
