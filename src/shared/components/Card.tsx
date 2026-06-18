import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, action, children, className }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-6 ${className ?? ''}`}
    >
      {title || subtitle || action ? (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            {title ? (
              <h2 className="text-base font-semibold tracking-tight text-text">{title}</h2>
            ) : null}
            {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
