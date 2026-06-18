import { Outlet } from 'react-router-dom'

import { Suspense } from 'react'
import { LoadingState } from '../../shared/components/States'

export default function AppShell() {
  return (
    <div className="min-h-[100svh] bg-bg">
      <Suspense
        fallback={
          <div className="flex min-h-[100svh] items-center justify-center p-6">
            <LoadingState title="" description="" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  )
}
