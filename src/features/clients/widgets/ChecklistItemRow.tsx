import { useEffect, useState } from 'react'

import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../../shared/components/Field'
import { UserSelect } from '../../../shared/components/UserSelect'
import { formatDate, toLocalDateInputValue } from '../../../shared/utils/dates'
import { updateChecklistItem } from '../../../shared/api/checklistItems.api'
import { getUsersByIds } from '../../../shared/api/users.api'
import type { ChecklistItemRecord, ClientPriority, UserRecord } from '../../../shared/types/domain.types'

interface ChecklistItemRowProps {
  item: ChecklistItemRecord
  onToggle: (completed: boolean) => void
  readOnly: boolean
  isAdmin: boolean
  users: UserRecord[]
}

const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'danger' } as const

export function ChecklistItemRow({ item, onToggle, readOnly, isAdmin, users }: ChecklistItemRowProps) {
  const [assignee, setAssignee] = useState<UserRecord | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!item.assignedTo) {
      setAssignee(null)
      return
    }
    getUsersByIds([item.assignedTo]).then((found) => setAssignee(found[0] ?? null))
  }, [item.assignedTo])

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        item.completed ? 'border-border/50 bg-surface-muted/50' : 'border-border bg-surface-strong'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.completed}
          disabled={readOnly}
          onChange={(event) => onToggle(event.target.checked)}
          className="mt-0.5 size-4 accent-accent cursor-pointer disabled:cursor-default"
        />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${item.completed ? 'text-muted line-through' : 'text-text'}`}>
            {item.label}
            {item.required ? <span className="ml-1 text-danger">*</span> : null}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">
              {assignee ? assignee.name : <span className="opacity-50">Unassigned</span>}
            </span>
            <span className="text-xs text-muted/60">·</span>
            <span className="text-xs text-muted">Due {formatDate(item.dueDate)}</span>
            <Badge tone={PRIORITY_TONE[item.priority]}>{item.priority}</Badge>
          </div>
          {item.notes ? <p className="mt-1 text-xs text-muted/70">{item.notes}</p> : null}
        </div>
        {isAdmin ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing((value) => !value)}>
            {editing ? 'Close' : 'Edit'}
          </Button>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-3">
          <UserSelect
            users={users}
            value={item.assignedTo}
            onChange={(userId) => updateChecklistItem(item.id, { assignedTo: userId })}
          />
          <input
            type="date"
            value={toLocalDateInputValue(item.dueDate)}
            onChange={(event) =>
              updateChecklistItem(item.id, {
                dueDate: event.target.value ? new Date(event.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-border bg-surface-strong px-3 py-2 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <Select
            value={item.priority}
            onChange={(event) =>
              updateChecklistItem(item.id, { priority: event.target.value as ClientPriority })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      ) : null}
    </div>
  )
}
