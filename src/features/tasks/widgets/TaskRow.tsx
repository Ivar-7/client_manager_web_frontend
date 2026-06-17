import { Badge } from '../../../shared/components/Badge'
import { formatDate, isOverdue } from '../../../shared/utils/dates'
import type { ChecklistItemRecord } from '../../../shared/types/domain.types'

const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'danger' } as const

interface TaskRowProps {
  item: ChecklistItemRecord
  stageName: string
  onToggle: (completed: boolean) => void
}

export function TaskRow({ item, stageName, onToggle }: TaskRowProps) {
  const overdue = isOverdue(item.dueDate, item.completed)

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-strong p-3">
      <input
        type="checkbox"
        checked={item.completed}
        onChange={(event) => onToggle(event.target.checked)}
        className="mt-1 size-4 accent-accent"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium text-text ${item.completed ? 'line-through opacity-60' : ''}`}
        >
          {item.label}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{stageName}</span>
          <span className={overdue ? 'font-semibold text-danger' : ''}>
            Due {formatDate(item.dueDate)}
          </span>
          <Badge tone={PRIORITY_TONE[item.priority]}>{item.priority}</Badge>
          {overdue ? <Badge tone="danger">Overdue</Badge> : null}
        </div>
      </div>
    </div>
  )
}
