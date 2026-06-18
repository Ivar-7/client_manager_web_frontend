import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../../app/providers/useAuth'
import { createClientWithOnboarding } from '../../../shared/api/clients.api'
import { getAssignableUsers } from '../../../shared/api/users.api'
import { Card } from '../../../shared/components/Card'
import { Pagination } from '../../../shared/components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import type { UserRecord } from '../../../shared/types/domain.types'
import { useClients } from '../hooks/useClientsList'
import { AddClientForm } from '../widgets/AddClientForm'
import { ClientCard } from '../widgets/ClientCard'
import { ClientsToolbar } from '../widgets/ClientsToolbar'
import { DEFAULT_CLIENTS_FILTER, type ClientFormState } from '../types/clients.types'

export default function ClientsPage() {
  const { isAdmin, firebaseUser, profile } = useAuth()
  const navigate = useNavigate()
  const [filters, setFilters] = useState(DEFAULT_CLIENTS_FILTER)
  const [addOpen, setAddOpen] = useState(false)
  const [users, setUsers] = useState<UserRecord[]>([])

  const { items, status, error, page, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useClients(filters)

  useEffect(() => {
    getAssignableUsers().then(setUsers)
  }, [])

  const ownerInitialsById = new Map(users.map((user) => [user.id, user.avatarInitials]))

  const handleCreate = async (form: ClientFormState) => {
    if (!firebaseUser || !profile) return
    const clientId = await createClientWithOnboarding(
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        companyName: form.companyName,
        industry: form.industry,
        notes: form.notes,
        priority: form.priority,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        ownerId: form.ownerId || null,
      },
      firebaseUser.uid,
      profile.name,
    )
    setAddOpen(false)
    navigate(`/clients/${clientId}`)
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Clients</h1>
          <p className="mt-1 text-sm text-muted">Manage and track client onboarding</p>
        </div>
      </div>

      <Card>
        <ClientsToolbar
          filters={filters}
          onChange={setFilters}
          showAddButton={isAdmin}
          addOpen={addOpen}
          onAddClick={() => setAddOpen((open) => !open)}
        />
      </Card>

      {addOpen && isAdmin ? (
        <AddClientForm onSubmit={handleCreate} onCancel={() => setAddOpen(false)} />
      ) : null}

      {status === 'loading' ? (
        <LoadingState title="" description="" />
      ) : status === 'error' ? (
        <ErrorState title="Couldn't load clients" description={error ?? 'Please try again.'} />
      ) : status === 'empty' ? (
        <EmptyState
          title="No clients yet"
          description={
            isAdmin
              ? 'Add your first client to start onboarding.'
              : "You don't have any assigned clients yet."
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                ownerInitials={client.ownerId ? ownerInitialsById.get(client.ownerId) : undefined}
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
