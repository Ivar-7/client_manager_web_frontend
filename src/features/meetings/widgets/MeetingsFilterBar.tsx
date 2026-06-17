import { useEffect, useState } from 'react'

import { getClientsForFilterDropdown } from '../../../shared/api/clients.api'
import { Input, Select } from '../../../shared/components/Field'
import type { ClientRecord } from '../../../shared/types/domain.types'
import type { MeetingsFilterState } from '../types/meetings.types'

interface MeetingsFilterBarProps {
  filters: MeetingsFilterState
  onChange: (filters: MeetingsFilterState) => void
}

export function MeetingsFilterBar({ filters, onChange }: MeetingsFilterBarProps) {
  const [clients, setClients] = useState<ClientRecord[]>([])

  useEffect(() => {
    getClientsForFilterDropdown().then(setClients)
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
