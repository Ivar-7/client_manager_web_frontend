import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { Badge } from '../../../shared/components/Badge'
import { Card } from '../../../shared/components/Card'
import { EmptyState } from '../../../shared/components/States'
import type { ClientRecord, StageRecord } from '../../../shared/types/domain.types'

export function BlockedPipelinePanel({ stages }: { stages: StageRecord[] }) {
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    getClientsByIds(stages.map((stage) => stage.clientId)).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [stages])

  return (
    <Card title="Blocked pipeline">
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
                  <span className="flex size-1.5 rounded-full bg-danger" />
                  <span className="text-sm font-medium text-text">{client?.name ?? 'Loading…'}</span>
                </div>
                <Badge tone="danger">{stage.name}</Badge>
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}
