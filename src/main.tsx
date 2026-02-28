// GitHub Pages 404 workaround: check for redirect stored by 404.html
const redirect = sessionStorage.redirect
if (redirect) {
  sessionStorage.removeItem('redirect')
  const url = new URL(redirect)
  const path = url.pathname + url.search + url.hash
  // Get the path without the base (e.g., /domainsmith/shell/agent/123 -> /shell/agent/123)
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const relativePath = path.replace(new RegExp(`^${basePath}`), '') || '/'
  // Navigate by replacing location - router will handle it
  window.history.replaceState({}, '', relativePath)
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from '@/lib/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
