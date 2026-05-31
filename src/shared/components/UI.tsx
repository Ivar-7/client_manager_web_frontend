import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PanelProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

interface BadgeProps {
  tone?: 'neutral' | 'positive' | 'warning' | 'danger' | 'accent'
  children: ReactNode
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

interface FieldProps {
  label: string
  children: ReactNode
  hint?: string
}

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

interface LoadingStateProps {
  title: string
  description: string
}

export function Panel({ title, subtitle, action, children, className }: PanelProps) {
  return (
    <section className={`panel ${className ?? ''}`.trim()}>
      {title || subtitle || action ? (
        <header className="panel__header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="panel__action">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className ?? ''}`.trim()} {...props} />
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-state__pulse" />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
