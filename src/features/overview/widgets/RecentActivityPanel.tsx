import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { ActivityRow } from '../../../shared/components/ActivityRow'
import { EmptyState } from '../../../shared/components/States'
import type { ActivityLogRecord, ClientRecord } from '../../../shared/types/domain.types'

interface RecentActivityPanelProps {
  title: string
  entries: ActivityLogRecord[]
}

export function RecentActivityPanel({ title, entries }: RecentActivityPanelProps) {
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    const clientIds = Array.from(new Set(entries.map((entry) => entry.clientId).filter(Boolean)))
    getClientsByIds(clientIds).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [entries])

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
        <Link
          to="/activity"
          className="text-xs font-semibold text-accent transition-opacity hover:opacity-70"
        >
          View all →
        </Link>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Actions will show up here as they happen."
        />
      ) : (
        <div>
          {entries.map((entry) => (
            <ActivityRow key={entry.id} entry={entry} clientName={clients[entry.clientId]?.name} />
          ))}
        </div>
      )}
    </div>
  )
}
