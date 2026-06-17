import { Select } from '../../../shared/components/Field'
import type { InfrastructureFilterState } from '../types/infrastructure.types'

interface AssetFilterBarProps {
  filters: InfrastructureFilterState
  onChange: (filters: InfrastructureFilterState) => void
}

export function AssetFilterBar({ filters, onChange }: AssetFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.type}
        onChange={(event) =>
          onChange({ ...filters, type: event.target.value as InfrastructureFilterState['type'] })
        }
        className="w-auto"
      >
        <option value="">All types</option>
        <option value="domain">Domain</option>
        <option value="hosting">Hosting</option>
        <option value="dns">DNS</option>
      </Select>
      <Select
        value={filters.status}
        onChange={(event) =>
          onChange({
            ...filters,
            status: event.target.value as InfrastructureFilterState['status'],
          })
        }
        className="w-auto"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="expired">Expired</option>
        <option value="suspended">Suspended</option>
      </Select>
      <label className="flex items-center gap-1.5 text-sm text-muted">
        <input
          type="checkbox"
          checked={filters.expiringWithin30Days}
          onChange={(event) => onChange({ ...filters, expiringWithin30Days: event.target.checked })}
        />
        Expiring within 30 days
      </label>
    </div>
  )
}
