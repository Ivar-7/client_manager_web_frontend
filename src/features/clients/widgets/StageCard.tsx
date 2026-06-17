import { useState } from 'react'

import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Input, Select, Textarea } from '../../../shared/components/Field'
import { formatDate, toLocalDateInputValue } from '../../../shared/utils/dates'
import {
  canMoveToInProgress,
  getOutstandingRequiredItems,
  updateStageComment,
  updateStageDueDate,
  updateStageStatus,
} from '../../../shared/api/stages.api'
import { createChecklistItem, toggleChecklistItem } from '../../../shared/api/checklistItems.api'
import type {
  ChecklistItemRecord,
  StageRecord,
  StageStatus,
  UserRecord,
} from '../../../shared/types/domain.types'
import { ChecklistItemRow } from './ChecklistItemRow'

const STATUS_TONE: Record<StageStatus, 'neutral' | 'accent' | 'danger' | 'positive' | 'warning'> = {
  pending: 'neutral',
  inProgress: 'accent',
  blocked: 'danger',
  approved: 'positive',
  rejected: 'warning',
}

interface StageCardProps {
  stage: StageRecord
  allStages: StageRecord[]
  items: ChecklistItemRecord[]
  isAdmin: boolean
  currentUserId: string
  currentUserName: string
  users: UserRecord[]
}

export function StageCard({
  stage,
  allStages,
  items,
  isAdmin,
  currentUserId,
  currentUserName,
  users,
}: StageCardProps) {
  const [expanded, setExpanded] = useState(stage.status === 'inProgress')
  const [statusError, setStatusError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newRequired, setNewRequired] = useState(true)
  const [newAssignee, setNewAssignee] = useState('')

  const stageItems = items.filter((item) => item.stageId === stage.id)
  const outstanding = getOutstandingRequiredItems(items, stage.id)
  const canStart = canMoveToInProgress(allStages, stage)

  const handleStatusChange = async (nextStatus: StageStatus) => {
    setStatusError(null)
    if (nextStatus === 'inProgress' && !canStart) {
      setStatusError('The previous stage must be approved first.')
      return
    }
    const result = await updateStageStatus(stage, nextStatus, currentUserId, currentUserName, items)
    if (!result.ok) {
      setStatusError(result.reason)
    }
  }

  const handleAddItem = async () => {
    if (!newLabel.trim()) return
    await createChecklistItem({
      clientId: stage.clientId,
      stageId: stage.id,
      templateId: null,
      label: newLabel.trim(),
      order: stageItems.length + 1,
      required: newRequired,
      completed: false,
      completedAt: null,
      completedBy: null,
      assignedTo: newAssignee || null,
      dueDate: null,
      priority: 'medium',
      notes: '',
    })
    setNewLabel('')
    setNewRequired(true)
    setNewAssignee('')
    setAddOpen(false)
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-5">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <strong className="text-text">
            Stage {stage.order}: {stage.name}
          </strong>
          <Badge tone={STATUS_TONE[stage.status]}>{stage.status}</Badge>
        </div>
        <span className="text-sm text-muted">{expanded ? 'Hide' : 'Show'}</span>
      </button>

      {expanded ? (
        <div className="mt-4 grid gap-4">
          <div className="flex flex-wrap items-end gap-3">
            {isAdmin ? (
              <Select
                value={stage.status}
                onChange={(event) => handleStatusChange(event.target.value as StageStatus)}
                className="w-auto"
              >
                <option value="pending">Pending</option>
                <option value="inProgress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            ) : (
              <Badge tone={STATUS_TONE[stage.status]}>{stage.status}</Badge>
            )}

            {isAdmin ? (
              <Input
                type="date"
                value={toLocalDateInputValue(stage.dueDate)}
                onChange={(event) =>
                  updateStageDueDate(
                    stage,
                    event.target.value ? new Date(event.target.value) : null,
                  )
                }
                className="w-auto"
              />
            ) : (
              <span className="text-sm text-muted">Due {formatDate(stage.dueDate)}</span>
            )}
          </div>

          {statusError ? (
            <p className="text-sm text-danger">
              {statusError}
              {outstanding.length > 0 ? (
                <span className="block text-xs text-muted">
                  Outstanding: {outstanding.map((item) => item.label).join(', ')}
                </span>
              ) : null}
            </p>
          ) : null}

          {isAdmin ? (
            <Textarea
              defaultValue={stage.comment}
              onBlur={(event) => updateStageComment(stage, event.target.value)}
              placeholder="Add a comment for this stage…"
            />
          ) : stage.comment ? (
            <p className="text-sm text-muted">{stage.comment}</p>
          ) : null}

          <div className="grid gap-2">
            {stageItems.map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                readOnly={!isAdmin && item.assignedTo !== currentUserId}
                onToggle={(completed) =>
                  toggleChecklistItem(item, completed, currentUserId, currentUserName)
                }
              />
            ))}
          </div>

          {isAdmin ? (
            addOpen ? (
              <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface-muted p-3">
                <Input
                  placeholder="Item label"
                  value={newLabel}
                  onChange={(event) => setNewLabel(event.target.value)}
                  className="min-w-[180px] flex-1"
                />
                <Select
                  value={newAssignee}
                  onChange={(event) => setNewAssignee(event.target.value)}
                  className="w-auto"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                <label className="flex items-center gap-1.5 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={newRequired}
                    onChange={(event) => setNewRequired(event.target.checked)}
                  />
                  Required
                </label>
                <Button type="button" onClick={handleAddItem}>
                  Add
                </Button>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setAddOpen(true)}>
                Add checklist item
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
