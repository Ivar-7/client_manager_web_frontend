import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/useAuth'
import { LoadingState } from '../../shared/components/States'

export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[100svh] items-center justify-center p-6">
        <LoadingState title="" description="" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
