import { useEffect, useState } from 'react'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { ActivityRow } from '../../../shared/components/ActivityRow'
import { Card } from '../../../shared/components/Card'
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
    <Card title={title}>
      {entries.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Actions will show up here as they happen."
        />
      ) : (
        entries.map((entry) => (
          <ActivityRow key={entry.id} entry={entry} clientName={clients[entry.clientId]?.name} />
        ))
      )}
    </Card>
  )
}
