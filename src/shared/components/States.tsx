import type { ReactNode } from 'react'

interface StateProps {
  title: string
  description: string
  action?: ReactNode
}

export function LoadingState({ title, description }: StateProps) {
  return (
    <div className="mx-auto grid w-full max-w-sm gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
      <div className="mx-auto">
        <div className="size-10 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
      </div>
      <strong className="text-sm font-semibold text-text">{title}</strong>
      <p className="text-xs text-muted">{description}</p>
    </div>
  )
}

export function EmptyState({ title, description, action }: StateProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-dashed border-border bg-surface-muted/50 p-10 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-surface-strong">
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 text-muted">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </div>
      <strong className="text-sm font-semibold text-text">{title}</strong>
      <p className="text-xs text-muted">{description}</p>
      {action ? <div className="mx-auto mt-1">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ title, description, action }: StateProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-danger/20 bg-danger-soft p-10 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-danger/10">
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 text-danger">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <strong className="text-sm font-semibold text-danger">{title}</strong>
      <p className="text-xs text-muted">{description}</p>
      {action ? <div className="mx-auto mt-1">{action}</div> : null}
    </div>
  )
}
