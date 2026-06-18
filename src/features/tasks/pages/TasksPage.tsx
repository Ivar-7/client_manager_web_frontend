import { useEffect, useState } from 'react'

import { useAuth } from '../../../app/providers/useAuth'
import { getClientsByIds } from '../../../shared/api/clients.api'
import { getStagesByIds } from '../../../shared/api/stages.api'
import { toggleChecklistItem } from '../../../shared/api/checklistItems.api'
import { Card } from '../../../shared/components/Card'
import { Pagination } from '../../../shared/components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import type { ClientRecord, StageRecord } from '../../../shared/types/domain.types'
import { useTasks } from '../hooks/useTasks'
import { TaskRow } from '../widgets/TaskRow'
import { TasksFilterBar } from '../widgets/TasksFilterBar'
import { DEFAULT_TASKS_FILTER } from '../types/tasks.types'

export default function TasksPage() {
  const { firebaseUser, profile } = useAuth()
  const [filters, setFilters] = useState(DEFAULT_TASKS_FILTER)
  const { items, status, error, page, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useTasks(filters)
  const [clients, setClients] = useState<Record<string, ClientRecord>>({})
  const [stages, setStages] = useState<Record<string, StageRecord>>({})

  useEffect(() => {
    const clientIds = Array.from(new Set(items.map((item) => item.clientId)))
    const stageIds = Array.from(new Set(items.map((item) => item.stageId)))

    getClientsByIds(clientIds).then((records) => {
      setClients(Object.fromEntries(records.map((record) => [record.id, record])))
    })
    getStagesByIds(stageIds).then((records) => {
      setStages(Object.fromEntries(records.map((record) => [record.id, record])))
    })
  }, [items])

  const grouped = items.reduce<Record<string, typeof items>>((accumulator, item) => {
    const key = item.clientId
    accumulator[key] = accumulator[key] ? [...accumulator[key], item] : [item]
    return accumulator
  }, {})

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Tasks</h1>
        <p className="mt-1 text-sm text-muted">Your assigned checklist items across all clients</p>
      </div>

      <Card>
        <TasksFilterBar filters={filters} onChange={setFilters} />
      </Card>

      {status === 'loading' ? (
        <LoadingState title="" description="" />
      ) : status === 'error' ? (
        <ErrorState title="Couldn't load tasks" description={error ?? 'Please try again.'} />
      ) : status === 'empty' ? (
        <EmptyState title="No tasks" description="Nothing matches the current filters." />
      ) : (
        <>
          {Object.entries(grouped).map(([clientId, clientItems]) => (
            <Card key={clientId} title={clients[clientId]?.name ?? 'Loading client…'}>
              <div className="grid gap-2">
                {clientItems.map((item) => (
                  <TaskRow
                    key={item.id}
                    item={item}
                    stageName={stages[item.stageId]?.name ?? '—'}
                    onToggle={(completed) =>
                      firebaseUser && profile
                        ? toggleChecklistItem(item, completed, firebaseUser.uid, profile.name)
                        : undefined
                    }
                  />
                ))}
              </div>
            </Card>
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
