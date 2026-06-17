import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/useAuth'
import { LoadingState } from '../../shared/components/States'

export function GuestOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[100svh] items-center justify-center p-6">
        <LoadingState title="Loading" description="One moment." />
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/overview" replace />
  }

  return <Outlet />
}
