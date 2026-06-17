import { Component, type ReactNode } from 'react'

import { ErrorState } from '../../shared/components/States'
import { Button } from '../../shared/components/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled UI error', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100svh] items-center justify-center p-6">
          <ErrorState
            title="Something went wrong"
            description="This view ran into an unexpected error. Try reloading the page."
            action={
              <Button type="button" onClick={() => window.location.reload()}>
                Reload
              </Button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}
