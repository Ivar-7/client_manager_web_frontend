import { Select } from '../../../shared/components/Field'
import type { TasksFilterState } from '../types/tasks.types'

interface TasksFilterBarProps {
  filters: TasksFilterState
  onChange: (filters: TasksFilterState) => void
}

export function TasksFilterBar({ filters, onChange }: TasksFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.completion}
        onChange={(event) =>
          onChange({ ...filters, completion: event.target.value as TasksFilterState['completion'] })
        }
        className="w-auto"
      >
        <option value="incomplete">Incomplete</option>
        <option value="completed">Completed</option>
      </Select>
      <Select
        value={filters.sort}
        onChange={(event) =>
          onChange({ ...filters, sort: event.target.value as TasksFilterState['sort'] })
        }
        className="w-auto"
      >
        <option value="dueDate">Sort by due date</option>
        <option value="priority">Sort by priority</option>
      </Select>
    </div>
  )
}
