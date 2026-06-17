import { Input, Select } from '../../../shared/components/Field'
import { Button } from '../../../shared/components/Button'
import type { ClientsFilterState } from '../types/clients.types'

interface ClientsToolbarProps {
  filters: ClientsFilterState
  onChange: (filters: ClientsFilterState) => void
  showAddButton: boolean
  onAddClick: () => void
  addOpen: boolean
}

export function ClientsToolbar({
  filters,
  onChange,
  showAddButton,
  onAddClick,
  addOpen,
}: ClientsToolbarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Input
        placeholder="Search name, email, company, tags…"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        className="min-w-[220px] flex-1"
      />
      <Select
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as ClientsFilterState['status'] })
        }
        className="w-auto"
      >
        <option value="">All statuses</option>
        <option value="onboarding">Onboarding</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
      <Select
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value as ClientsFilterState['priority'] })
        }
        className="w-auto"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
      <Select
        value={filters.sort}
        onChange={(event) =>
          onChange({ ...filters, sort: event.target.value as ClientsFilterState['sort'] })
        }
        className="w-auto"
      >
        <option value="updatedAt">Recently updated</option>
        <option value="name">Name</option>
        <option value="priority">Priority</option>
      </Select>
      {showAddButton ? (
        <Button type="button" onClick={onAddClick}>
          {addOpen ? 'Close' : 'Add client'}
        </Button>
      ) : null}
    </div>
  )
}
