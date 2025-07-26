import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Notifications } from '@mantine/notifications'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanstackQuery from './integrations/tanstack-query/root-provider.tsx'

import * as Mantine from './integrations/mantine/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts'

import './styles.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanstackQuery.Provider>
        <Mantine.Provider>
          <Notifications position="top-right" />
          <RouterProvider router={router} />
        </Mantine.Provider>
      </TanstackQuery.Provider>
    </StrictMode>,
  )
}
