import type { ReactNode } from 'react'

interface BadgeProps {
  tone?: 'neutral' | 'positive' | 'warning' | 'danger' | 'accent'
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'border-border-strong/80 text-muted bg-surface-strong',
  positive: 'border-success/20 text-success bg-success-soft',
  warning: 'border-warning/20 text-warning bg-warning-soft',
  danger: 'border-danger/20 text-danger bg-danger-soft',
  accent: 'border-accent/20 text-accent bg-accent-soft',
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${TONE_CLASSES[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
