import { useEffect, useState } from 'react'

import { Badge } from '../../../shared/components/Badge'
import { formatDate } from '../../../shared/utils/dates'
import { getUsersByIds } from '../../../shared/api/users.api'
import type { ChecklistItemRecord, UserRecord } from '../../../shared/types/domain.types'

interface ChecklistItemRowProps {
  item: ChecklistItemRecord
  onToggle: (completed: boolean) => void
  readOnly: boolean
}

const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'danger' } as const

export function ChecklistItemRow({ item, onToggle, readOnly }: ChecklistItemRowProps) {
  const [assignee, setAssignee] = useState<UserRecord | null>(null)

  useEffect(() => {
    if (!item.assignedTo) {
      setAssignee(null)
      return
    }
    getUsersByIds([item.assignedTo]).then((users) => setAssignee(users[0] ?? null))
  }, [item.assignedTo])

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-strong p-3">
      <input
        type="checkbox"
        checked={item.completed}
        disabled={readOnly}
        onChange={(event) => onToggle(event.target.checked)}
        className="mt-1 size-4 accent-accent"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium text-text ${item.completed ? 'line-through opacity-60' : ''}`}
        >
          {item.label}
          {item.required ? <span className="ml-1 text-danger">*</span> : null}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          {assignee ? <span>{assignee.name}</span> : <span>Unassigned</span>}
          <span>Due {formatDate(item.dueDate)}</span>
          <Badge tone={PRIORITY_TONE[item.priority]}>{item.priority}</Badge>
        </div>
        {item.notes ? <p className="mt-1 text-xs text-muted">{item.notes}</p> : null}
      </div>
    </div>
  )
}
