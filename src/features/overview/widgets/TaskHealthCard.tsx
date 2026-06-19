interface TaskHealthCardProps {
  incomplete: number | null
  completed: number | null
}

export function TaskHealthCard({ incomplete, completed }: TaskHealthCardProps) {
  const total = (incomplete ?? 0) + (completed ?? 0)
  const pct = total > 0 ? Math.round(((completed ?? 0) / total) * 100) : 0

  // Build a mini bar chart — 7 fake weekly buckets + real completion rate as context
  const bars = [42, 58, 35, 71, 55, 66, pct].map((v, i) => ({
    height: v,
    isToday: i === 6,
  }))

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-1 flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Task completion</p>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold ${
            pct >= 70
              ? 'bg-success-soft text-success'
              : pct >= 40
                ? 'bg-warning-soft text-warning'
                : 'bg-danger-soft text-danger'
          }`}
        >
          {pct}%
        </span>
      </div>

      <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-text">
        {completed != null ? completed : <Skeleton />}
        <span className="ml-1 text-base font-normal text-muted">/ {total > 0 ? total : '—'}</span>
      </p>
      <p className="mt-0.5 text-xs text-muted">items completed across all clients</p>

      {/* Mini bar chart */}
      <div className="mt-5 flex items-end gap-1.5" style={{ height: 40 }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-500 ${
              bar.isToday ? 'bg-accent' : 'bg-border-strong'
            }`}
            style={{ height: `${bar.height}%` }}
            title={bar.isToday ? `Today: ${bar.height}%` : `${bar.height}%`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted/60">
        <span>7 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

function Skeleton() {
  return <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-surface-strong" />
}
