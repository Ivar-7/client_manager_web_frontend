import type { ReactNode } from 'react'

interface QuickStatProps {
  label: string
  value: number | null
  icon: ReactNode
  tone?: 'default' | 'danger' | 'warning' | 'success' | 'accent'
  suffix?: string
}

const TONE_STYLES = {
  default: { icon: 'bg-surface-strong text-muted', value: 'text-text' },
  accent: { icon: 'bg-accent/10 text-accent', value: 'text-text' },
  danger: { icon: 'bg-danger-soft text-danger', value: 'text-danger' },
  warning: { icon: 'bg-warning-soft text-warning', value: 'text-warning' },
  success: { icon: 'bg-success-soft text-success', value: 'text-success' },
}

export function QuickStatRow({ stats }: { stats: QuickStatProps[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
        At a glance
      </p>
      <div className="grid gap-4">
        {stats.map((stat) => {
          const styles = TONE_STYLES[stat.tone ?? 'default']
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
                {stat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted">{stat.label}</p>
              </div>
              <span className={`font-mono text-sm font-bold ${styles.value}`}>
                {stat.value != null ? (
                  <>
                    {stat.value}
                    {stat.suffix ? (
                      <span className="ml-0.5 text-xs font-normal text-muted">{stat.suffix}</span>
                    ) : null}
                  </>
                ) : (
                  <span className="inline-block h-4 w-6 animate-pulse rounded bg-surface-strong" />
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
