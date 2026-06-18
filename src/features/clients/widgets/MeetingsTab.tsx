import { useState, type FormEvent } from 'react'
import { Timestamp } from 'firebase/firestore'

import { useAuth } from '../../../app/providers/useAuth'
import {
  createMeetingNote,
  toggleMeetingActionItem,
  useMeetingNotes,
} from '../../../shared/api/meetingNotes.api'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Card } from '../../../shared/components/Card'
import { Field, Input, Textarea } from '../../../shared/components/Field'
import { EmptyState, LoadingState } from '../../../shared/components/States'
import { TagChip } from '../../../shared/components/TagChip'
import { formatDate } from '../../../shared/utils/dates'
import type { ActionItem, MeetingNoteRecord, StageRecord } from '../../../shared/types/domain.types'

interface MeetingsTabProps {
  clientId: string
  stages: StageRecord[]
}

export function MeetingsTab({ clientId, stages }: MeetingsTabProps) {
  const { isAdmin, firebaseUser, profile } = useAuth()
  const { items, status } = useMeetingNotes(50, { clientId })
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="grid gap-5">
      {isAdmin ? (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setAddOpen((open) => !open)}>
            {addOpen ? 'Close' : 'Add meeting note'}
          </Button>
        </div>
      ) : (
        <Badge tone="neutral">View only</Badge>
      )}

      {addOpen && firebaseUser && profile ? (
        <MeetingForm
          clientId={clientId}
          stages={stages}
          onSubmit={async (input) => {
            await createMeetingNote(input, firebaseUser.uid, profile.name)
            setAddOpen(false)
          }}
          onCancel={() => setAddOpen(false)}
        />
      ) : null}

      {status === 'loading' ? (
        <LoadingState
          title=""
          description=""
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No meeting notes"
          description="No meetings have been logged for this client yet."
        />
      ) : (
        items.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            stages={stages}
            isAdmin={isAdmin}
            onToggleAction={(actionId, completed) =>
              firebaseUser && profile
                ? toggleMeetingActionItem(
                    meeting,
                    actionId,
                    completed,
                    firebaseUser.uid,
                    profile.name,
                  )
                : Promise.resolve()
            }
          />
        ))
      )}
    </div>
  )
}

function MeetingCard({
  meeting,
  stages,
  isAdmin,
  onToggleAction,
}: {
  meeting: MeetingNoteRecord
  stages: StageRecord[]
  isAdmin: boolean
  onToggleAction: (actionItemId: string, completed: boolean) => Promise<void>
}) {
  const linkedStage = stages.find((stage) => stage.id === meeting.linkedStageId)

  return (
    <Card title={meeting.title} subtitle={formatDate(meeting.date)}>
      <div className="flex flex-wrap gap-1.5">
        {(meeting.attendees ?? []).map((attendee) => (
          <TagChip key={attendee} label={attendee} />
        ))}
        {linkedStage ? <Badge tone="accent">{linkedStage.name}</Badge> : null}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-text/80">{meeting.notes}</p>
      {(meeting.actionItems ?? []).length > 0 ? (
        <div className="mt-4 grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Action items</p>
          {(meeting.actionItems ?? []).map((action: ActionItem) => (
            <label key={action.id} className="flex cursor-pointer items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={action.completed}
                disabled={!isAdmin}
                onChange={(event) => onToggleAction(action.id, event.target.checked)}
                className="size-4 accent-accent"
              />
              <span className={action.completed ? 'line-through text-muted' : ''}>
                {action.text}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </Card>
  )
}

function MeetingForm({
  clientId,
  stages,
  onSubmit,
  onCancel,
}: {
  clientId: string
  stages: StageRecord[]
  onSubmit: (input: Parameters<typeof createMeetingNote>[0]) => Promise<void>
  onCancel: () => void
}) {
  const { firebaseUser, profile } = useAuth()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [attendees, setAttendees] = useState('')
  const [linkedStageId, setLinkedStageId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!firebaseUser || !profile) return
    setLoading(true)
    try {
      await onSubmit({
        clientId,
        title,
        date: date ? Timestamp.fromDate(new Date(date)) : null,
        notes,
        createdBy: profile.name,
        attendees: attendees
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        linkedStageId: linkedStageId || null,
        actionItems: [],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-border bg-surface-muted p-4"
    >
      <Field label="Title">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </Field>
      <Field label="Date">
        <Input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </Field>
      <Field label="Attendees" hint="Comma separated">
        <Input value={attendees} onChange={(event) => setAttendees(event.target.value)} />
      </Field>
      <Field label="Linked stage">
        <select
          value={linkedStageId}
          onChange={(event) => setLinkedStageId(event.target.value)}
    className="w-full rounded-lg border border-border bg-surface-strong px-3 py-2 text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="">None</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes">
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} required />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </div>
    </form>
  )
}
