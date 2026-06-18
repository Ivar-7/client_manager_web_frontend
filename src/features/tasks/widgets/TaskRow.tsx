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
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
        item.completed ? 'border-border/50 bg-surface-muted/50' : 'border-border bg-surface-strong'
      }`}
    >
      <input
        type="checkbox"
        checked={item.completed}
        onChange={(event) => onToggle(event.target.checked)}
        className="mt-0.5 size-4 cursor-pointer accent-accent"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            item.completed ? 'text-muted line-through' : 'text-text'
          }`}
        >
          {item.label}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{stageName}</span>
          <span className="text-xs text-muted/60">·</span>
          <span className={`text-xs ${overdue ? 'font-semibold text-danger' : 'text-muted'}`}>
            Due {formatDate(item.dueDate)}
          </span>
          <Badge tone={PRIORITY_TONE[item.priority]}>{item.priority}</Badge>
          {overdue ? <Badge tone="danger">Overdue</Badge> : null}
        </div>
      </div>
    </div>
  )
}
