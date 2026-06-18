import { useEffect, useState } from 'react'

import { getClientsByIds } from '../../../shared/api/clients.api'
import { Badge } from '../../../shared/components/Badge'
import { Card } from '../../../shared/components/Card'
import { Pagination } from '../../../shared/components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import type { ClientRecord } from '../../../shared/types/domain.types'
import { useInfrastructure } from '../hooks/useInfrastructure'
import { AssetFilterBar } from '../widgets/AssetFilterBar'
import { AssetGroup } from '../widgets/AssetGroup'
import { DEFAULT_INFRASTRUCTURE_FILTER } from '../types/infrastructure.types'

export default function InfrastructurePage() {
  const [filters, setFilters] = useState(DEFAULT_INFRASTRUCTURE_FILTER)
  const { items, status, error, page, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useInfrastructure(filters)
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})

  useEffect(() => {
    getClientsByIds(Array.from(new Set(items.map((item) => item.clientId)))).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [items])

  const grouped = items.reduce<Record<string, typeof items>>((accumulator, item) => {
    accumulator[item.clientId] = accumulator[item.clientId]
      ? [...accumulator[item.clientId], item]
      : [item]
    return accumulator
  }, {})

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Infrastructure</h1>
        <p className="mt-1 text-sm text-muted">Domains, hosting, and DNS records across clients</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AssetFilterBar filters={filters} onChange={setFilters} />
          <Badge tone="neutral">Read only</Badge>
        </div>
      </Card>

      {status === 'loading' ? (
        <LoadingState title="Loading infrastructure" description="Fetching asset records." />
      ) : status === 'error' ? (
        <ErrorState
          title="Couldn't load infrastructure"
          description={error ?? 'Please try again.'}
        />
      ) : status === 'empty' ? (
        <EmptyState title="No assets" description="Nothing matches the current filters." />
      ) : (
        <>
          {Object.entries(grouped).map(([clientId, assets]) => (
            <AssetGroup
              key={clientId}
              clientName={clients[clientId]?.name ?? 'Loading client…'}
              assets={assets}
            />
          ))}
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
