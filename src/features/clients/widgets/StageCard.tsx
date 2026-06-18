import { useState } from 'react'

import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Input, Select, Textarea } from '../../../shared/components/Field'
import { UserSelect } from '../../../shared/components/UserSelect'
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

const STATUS_TONE: Record<StageStatus, 'neutral' | 'accent' | 'danger' | 'positive' | 'warning'> =
  {
    pending: 'neutral',
    inProgress: 'accent',
    blocked: 'danger',
    approved: 'positive',
    rejected: 'warning',
  }

const STATUS_DOT: Record<StageStatus, string> = {
  pending: 'bg-muted/40',
  inProgress: 'bg-accent',
  blocked: 'bg-danger',
  approved: 'bg-success',
  rejected: 'bg-warning',
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
  const [newAssignee, setNewAssignee] = useState<string | null>(null)

  const stageItems = items.filter((item) => item.stageId === stage.id)
  const outstanding = getOutstandingRequiredItems(items, stage.id)
  const canStart = canMoveToInProgress(allStages, stage)
  const completedCount = stageItems.filter((i) => i.completed).length

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
      assignedTo: newAssignee,
      dueDate: null,
      priority: 'medium',
      notes: '',
    })
    setNewLabel('')
    setNewRequired(true)
    setNewAssignee(null)
    setAddOpen(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-strong transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`size-2 rounded-full shrink-0 ${STATUS_DOT[stage.status]}`} />
          <strong className="text-sm font-semibold text-text">
            Stage {stage.order}: {stage.name}
          </strong>
          <Badge tone={STATUS_TONE[stage.status]}>{stage.status}</Badge>
        </div>
        <div className="flex items-center gap-3">
          {stageItems.length > 0 ? (
            <span className="text-xs text-muted">
              {completedCount}/{stageItems.length}
            </span>
          ) : null}
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`size-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="grid gap-4">
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
                <span className="text-xs text-muted">Due {formatDate(stage.dueDate)}</span>
              )}
            </div>

            {statusError ? (
              <p className="rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-xs text-danger">
                {statusError}
                {outstanding.length > 0 ? (
                  <span className="mt-1 block text-muted">
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
              <p className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-muted">
                {stage.comment}
              </p>
            ) : null}

            <div className="grid gap-2">
              {stageItems.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  readOnly={!isAdmin && item.assignedTo !== currentUserId}
                  isAdmin={isAdmin}
                  users={users}
                  onToggle={(completed) =>
                    toggleChecklistItem(item, completed, currentUserId, currentUserName)
                  }
                />
              ))}
            </div>

            {isAdmin ? (
              addOpen ? (
                <div className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-surface-muted p-3">
                  <Input
                    placeholder="Item label"
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.target.value)}
                    className="min-w-[180px] flex-1"
                  />
                  <div className="w-auto min-w-[180px]">
                    <UserSelect users={users} value={newAssignee} onChange={setNewAssignee} />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <input
                      type="checkbox"
                      checked={newRequired}
                      onChange={(event) => setNewRequired(event.target.checked)}
                      className="accent-accent"
                    />
                    Required
                  </label>
                  <Button type="button" size="sm" onClick={handleAddItem}>
                    Add
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="secondary" size="sm" onClick={() => setAddOpen(true)}>
                  + Add checklist item
                </Button>
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
