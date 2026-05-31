import type { ReactNode } from 'react'

import { DashboardWorkspaceProvider } from '../../features/dashboard/providers/DashboardWorkspaceProvider'

export default function AppProviders({ children }: { children: ReactNode }) {
  return <DashboardWorkspaceProvider>{children}</DashboardWorkspaceProvider>
}
