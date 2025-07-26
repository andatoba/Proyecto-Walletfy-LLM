import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Provider } from 'react-redux'
import { store } from '../store'
import Header from '../components/Header'
import TanstackQueryLayout from '../integrations/tanstack-query/layout'
import { useAppSelector } from '../store/hooks'
import { useEffect } from 'react'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

function AppContent() {
  const { theme } = useAppSelector((state) => state.app)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Provider store={store}>
      <AppContent />
    </Provider>
  ),
})
