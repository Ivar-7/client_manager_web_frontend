import { useEffect, useState } from 'react'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { ActivityRow } from '../../../shared/components/ActivityRow'
import { Card } from '../../../shared/components/Card'
import { LoadMore } from '../../../shared/components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import type { ClientRecord } from '../../../shared/types/domain.types'
import { useActivity } from '../hooks/useActivity'
import { ActivityFilterBar } from '../widgets/ActivityFilterBar'
import { DEFAULT_ACTIVITY_FILTER } from '../types/activity.types'

export default function ActivityPage() {
  const [filters, setFilters] = useState(DEFAULT_ACTIVITY_FILTER)
  const { items, status, error, hasNextPage, nextPage } = useActivity(filters)
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    getClientsByIds(Array.from(new Set(items.map((item) => item.clientId)))).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [items])

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Activity</h1>
        <p className="mt-1 text-sm text-muted">Full audit log of workspace actions</p>
      </div>

      <Card>
        <ActivityFilterBar filters={filters} onChange={setFilters} />
      </Card>

      {status === 'loading' ? (
        <LoadingState title="" description="" />
      ) : status === 'error' ? (
        <ErrorState title="Couldn't load activity" description={error ?? 'Please try again.'} />
      ) : items.length === 0 ? (
        <EmptyState title="No activity" description="Nothing matches the current filters." />
      ) : (
        <Card>
          {items.map((entry) => (
            <ActivityRow
              key={entry.id}
              entry={entry}
              clientName={clients[entry.clientId]?.name}
              showEntityBadge
            />
          ))}
          <LoadMore hasNextPage={hasNextPage} onLoadMore={nextPage} />
        </Card>
      )}
    </div>
  )
}
