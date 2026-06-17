import type { ReactNode } from 'react'

interface StateProps {
  title: string
  description: string
  action?: ReactNode
}

export function LoadingState({ title, description }: StateProps) {
  return (
    <div className="mx-auto grid w-full max-w-md gap-2 rounded-3xl border border-border bg-surface-strong p-6 text-center">
      <div className="mx-auto size-10 animate-pulse rounded-2xl bg-accent" />
      <strong className="text-text">{title}</strong>
      <p className="text-sm text-muted">{description}</p>
    </div>
  )
}

export function EmptyState({ title, description, action }: StateProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-dashed border-border bg-surface-muted p-8 text-center">
      <strong className="text-text">{title}</strong>
      <p className="text-sm text-muted">{description}</p>
      {action ? <div className="mx-auto">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ title, description, action }: StateProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-danger/30 bg-danger-soft p-8 text-center">
      <strong className="text-danger">{title}</strong>
      <p className="text-sm text-muted">{description}</p>
      {action ? <div className="mx-auto">{action}</div> : null}
    </div>
  )
}
