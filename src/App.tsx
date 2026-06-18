import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router'
import { LoadingState } from './shared/components/States'

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center p-6">
          <LoadingState title="" description="Uno momento" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}
