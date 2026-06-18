import { Link } from 'react-router-dom'

import { Badge } from '../../../shared/components/Badge'
import type { ClientRecord } from '../../../shared/types/domain.types'

const STAGE_SHORT = ['Intake', 'Setup', 'Content', 'Review', 'Go Live']
const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'danger' } as const

interface RecentClientsCardProps {
  clients: ClientRecord[]
  loading: boolean
}

export function RecentClientsCard({ clients, loading }: RecentClientsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Recently updated
        </p>
        <Link
          to="/clients"
          className="text-xs font-semibold text-accent transition-opacity hover:opacity-70"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-7 animate-pulse rounded-lg bg-surface-strong" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 animate-pulse rounded bg-surface-strong" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-surface-strong" />
              </div>
            </div>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted">No clients yet.</p>
      ) : (
        <div className="space-y-1">
          {clients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-strong"
            >
              {/* Initials dot */}
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-bold text-accent">
                {client.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-text group-hover:text-accent transition-colors">
                  {client.name}
                </p>
                <p className="truncate text-[10px] text-muted">
                  {client.companyName || 'No company'} ·{' '}
                  {STAGE_SHORT[client.onboardingStage - 1] ?? 'Stage ' + client.onboardingStage}
                </p>
              </div>

              <Badge tone={PRIORITY_TONE[client.priority]}>{client.priority}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
