import type { ReactNode } from 'react'

interface BadgeProps {
  tone?: 'neutral' | 'positive' | 'warning' | 'danger' | 'accent'
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'border-border text-muted bg-surface-muted',
  positive: 'border-success/30 text-success bg-success-soft',
  warning: 'border-warning/30 text-warning bg-warning-soft',
  danger: 'border-danger/30 text-danger bg-danger-soft',
  accent: 'border-accent/30 text-accent-strong bg-accent-soft',
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${TONE_CLASSES[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
