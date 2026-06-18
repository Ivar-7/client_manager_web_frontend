import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { Badge } from '../../../shared/components/Badge'
import { EmptyState } from '../../../shared/components/States'
import type { ClientRecord, StageRecord } from '../../../shared/types/domain.types'

export function BlockedPipelinePanel({ stages }: { stages: StageRecord[] }) {
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    if (stages.length === 0) return
    getClientsByIds(stages.map((stage) => stage.clientId)).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [stages])

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Blocked pipeline</p>
        {stages.length > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {stages.length}
          </span>
        )}
      </div>

      {stages.length === 0 ? (
        <EmptyState title="Nothing blocked" description="No stages are currently blocked." />
      ) : (
        <div className="grid gap-2">
          {stages.map((stage) => {
            const client = clients[stage.clientId]
            return (
              <Link
                key={stage.id}
                to={`/clients/${stage.clientId}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong p-3 transition-colors hover:border-danger/30"
              >
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-danger" />
                  <span className="text-sm font-medium text-text group-hover:text-danger transition-colors">
                    {client?.name ?? 'Loading…'}
                  </span>
                </div>
                <Badge tone="danger">{stage.name}</Badge>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
