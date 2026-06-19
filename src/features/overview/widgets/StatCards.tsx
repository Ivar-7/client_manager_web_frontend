import type { ReactNode } from 'react'

interface StatCard {
  label: string
  value: number | null
  icon: ReactNode
  trend?: { value: string; up: boolean; label: string }
  tone?: 'default' | 'accent' | 'danger' | 'warning' | 'success'
}

interface StatCardsProps {
  cards: StatCard[]
}

const TONE_ACCENT = {
  default: 'text-text',
  accent: 'text-accent',
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
}

const TONE_ICON_BG = {
  default: 'bg-surface-strong text-muted',
  accent: 'bg-accent/10 text-accent',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  success: 'bg-success-soft text-success',
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const tone = card.tone ?? 'default'
        return (
          <div
            key={card.label}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONE_ICON_BG[tone]}`}
              >
                {card.icon}
              </div>
              {card.trend ? (
                <span
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${
                    card.trend.up ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
                  }`}
                >
                  {card.trend.up ? '↑' : '↓'} {card.trend.value}
                </span>
              ) : null}
            </div>

            <div>
              <p className={`font-mono text-3xl font-bold tracking-tight ${TONE_ACCENT[tone]}`}>
                {card.value != null ? (
                  card.value
                ) : (
                  <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-surface-strong" />
                )}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted">{card.label}</p>
              {card.trend ? (
                <p className="mt-0.5 text-[10px] text-muted/60">{card.trend.label}</p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
