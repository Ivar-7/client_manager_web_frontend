interface FunnelStage {
  name: string
  count: number | null
  color: string
  bgColor: string
}

interface PipelineFunnelCardProps {
  onboarding: number | null
  goLive: number | null
  active: number | null
}

export function PipelineFunnelCard({ onboarding, goLive, active }: PipelineFunnelCardProps) {
  const total = (onboarding ?? 0) + (active ?? 0)

  const stages: FunnelStage[] = [
    {
      name: 'Onboarding',
      count: onboarding,
      color: 'text-accent',
      bgColor: 'bg-accent',
    },
    {
      name: 'Go Live',
      count: goLive,
      color: 'text-warning',
      bgColor: 'bg-warning',
    },
    {
      name: 'Active',
      count: active,
      color: 'text-success',
      bgColor: 'bg-success',
    },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Client pipeline
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-text">
            {total > 0 ? total : <Skeleton />}
          </p>
        </div>
        <span className="rounded-lg bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
          Total clients
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          const pct = total > 0 && stage.count != null ? (stage.count / total) * 100 : 0
          return (
            <div key={stage.name}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted">{stage.name}</span>
                <span className={`font-mono text-sm font-bold ${stage.color}`}>
                  {stage.count ?? '—'}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${stage.bgColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Skeleton() {
  return <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-surface-strong" />
}
