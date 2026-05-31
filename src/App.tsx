import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router'
import { LoadingState } from './shared/components/UI'

export default function App() {
  return (
    <Suspense fallback={<LoadingState title="Booting dashboard" description="Preparing route bundles and workspace providers." />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
