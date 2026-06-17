import type { ReactNode } from 'react'

import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from './ErrorBoundary'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
