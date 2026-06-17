import { useEffect, useState } from 'react'

import { getClientsForFilterDropdown } from '../../../shared/api/clients.api'
import { getAssignableUsers } from '../../../shared/api/users.api'
import { Input, Select } from '../../../shared/components/Field'
import type { ClientRecord, UserRecord } from '../../../shared/types/domain.types'
import type { ActivityFilterState } from '../types/activity.types'

interface ActivityFilterBarProps {
  filters: ActivityFilterState
  onChange: (filters: ActivityFilterState) => void
}

export function ActivityFilterBar({ filters, onChange }: ActivityFilterBarProps) {
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])

  useEffect(() => {
    getClientsForFilterDropdown().then(setClients)
    getAssignableUsers().then(setUsers)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.clientId}
        onChange={(event) => onChange({ ...filters, clientId: event.target.value })}
        className="w-auto"
      >
        <option value="">All clients</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>
      <Select
        value={filters.actorId}
        onChange={(event) => onChange({ ...filters, actorId: event.target.value })}
        className="w-auto"
      >
        <option value="">All actors</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>
      <Select
        value={filters.entityType}
        onChange={(event) =>
          onChange({
            ...filters,
            entityType: event.target.value as ActivityFilterState['entityType'],
          })
        }
        className="w-auto"
      >
        <option value="">All entity types</option>
        <option value="client">Client</option>
        <option value="stage">Stage</option>
        <option value="checklistItem">Checklist item</option>
        <option value="asset">Asset</option>
        <option value="meetingNote">Meeting note</option>
      </Select>
      <Input
        type="date"
        value={filters.startDate}
        onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
        className="w-auto"
      />
      <Input
        type="date"
        value={filters.endDate}
        onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
        className="w-auto"
      />
    </div>
  )
}
