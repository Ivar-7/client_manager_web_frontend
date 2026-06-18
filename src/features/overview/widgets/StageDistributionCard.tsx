const STAGES = [
  'Intake & Discovery',
  'Account Setup',
  'Content Collection',
  'Review & Approval',
  'Go Live',
]

// Static illustrative distribution — shown alongside real go-live count
const FAKE_DIST = [3, 5, 4, 2, 1]

interface StageDistributionCardProps {
  goLiveCount: number | null
}

export function StageDistributionCard({ goLiveCount }: StageDistributionCardProps) {
  // Inject the real go-live count into the last bucket
  const dist = [...FAKE_DIST]
  if (goLiveCount != null) dist[4] = goLiveCount

  const max = Math.max(...dist, 1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
        Stage distribution
      </p>

      <div className="space-y-2.5">
        {STAGES.map((stage, i) => {
          const count = dist[i]
          const pct = Math.round((count / max) * 100)
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-4 shrink-0 font-mono text-[10px] text-muted/60">{i + 1}</span>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted">{stage}</span>
                  <span className="font-mono text-xs font-bold text-text">{count}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className="h-full rounded-full bg-accent/60 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] text-muted/50">
        * Stage 1–4 counts are illustrative. Go Live reflects live data.
      </p>
    </div>
  )
}
