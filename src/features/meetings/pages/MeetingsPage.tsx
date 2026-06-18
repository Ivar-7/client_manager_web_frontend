import { useEffect, useState } from 'react'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { Badge } from '../../../shared/components/Badge'
import { Card } from '../../../shared/components/Card'
import { Pagination } from '../../../shared/components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import type { ClientRecord } from '../../../shared/types/domain.types'
import { useMeetings } from '../hooks/useMeetings'
import { MeetingCard } from '../widgets/MeetingCard'
import { MeetingsFilterBar } from '../widgets/MeetingsFilterBar'
import { DEFAULT_MEETINGS_FILTER } from '../types/meetings.types'

export default function MeetingsPage() {
  const [filters, setFilters] = useState(DEFAULT_MEETINGS_FILTER)
  const { items, status, error, page, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useMeetings(filters)
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    getClientsByIds(Array.from(new Set(items.map((item) => item.clientId)))).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [items])

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Meetings</h1>
        <p className="mt-1 text-sm text-muted">Browse logged meeting notes across clients</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MeetingsFilterBar filters={filters} onChange={setFilters} />
          <Badge tone="neutral">Read only</Badge>
        </div>
      </Card>

      {status === 'loading' ? (
        <LoadingState title="Loading meetings" description="Fetching meeting notes." />
      ) : status === 'error' ? (
        <ErrorState title="Couldn't load meetings" description={error ?? 'Please try again.'} />
      ) : status === 'empty' ? (
        <EmptyState title="No meetings" description="Nothing matches the current filters." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                clientName={clients[meeting.clientId]?.name ?? 'Loading…'}
              />
            ))}
          </div>
          <Pagination
            page={page}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      )}
    </div>
  )
}
