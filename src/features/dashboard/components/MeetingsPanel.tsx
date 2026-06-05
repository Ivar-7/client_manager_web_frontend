import { Badge, Button, EmptyState, Field, Panel } from '../../../shared/components/UI'
import { formatDateTime, toLocalDateInputValue } from '../../../shared/utils/dates'
import type { MeetingInput, MeetingNoteRecord } from '../../../shared/types/domain'

interface MeetingsPanelProps {
  meetingForm: MeetingInput
  onMeetingFormChange: (updater: (previous: MeetingInput) => MeetingInput) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  selectedMeetings: MeetingNoteRecord[]
}

export function MeetingsPanel({
  meetingForm,
  onMeetingFormChange,
  onSubmit,
  selectedMeetings,
}: MeetingsPanelProps) {
  return (
    <Panel title="Meeting notes" subtitle="Capture client decisions and attendees.">
      <form className="stack stack--tight" onSubmit={onSubmit}>
        <div className="grid-form grid-form--compact">
          <Field label="Title">
            <input
              value={meetingForm.title}
              onChange={(event) => onMeetingFormChange((previous) => ({ ...previous, title: event.target.value }))}
              placeholder="Weekly sync"
            />
          </Field>
          <Field label="Date">
            <input
              type="datetime-local"
              value={toLocalDateInputValue(meetingForm.date)}
              onChange={(event) =>
                onMeetingFormChange((previous) => ({
                  ...previous,
                  date: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : new Date().toISOString(),
                }))
              }
            />
          </Field>
        </div>
        <Field label="Attendees">
          <input
            value={meetingForm.attendees.join(', ')}
            onChange={(event) =>
              onMeetingFormChange((previous) => ({
                ...previous,
                attendees: event.target.value
                  .split(',')
                  .map((value) => value.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Anna Rivera, Mina Hart"
          />
        </Field>
        <Field label="Notes">
          <textarea
            rows={3}
            value={meetingForm.notes}
            onChange={(event) => onMeetingFormChange((previous) => ({ ...previous, notes: event.target.value }))}
            placeholder="Record decisions, blockers, and follow-up items."
          />
        </Field>
        <div className="form-actions">
          <Button type="submit">Save note</Button>
        </div>
      </form>

      <div className="stack">
        {selectedMeetings.length === 0 ? (
          <EmptyState
            title="No meeting notes yet"
            description="Log the last conversation so the onboarding team stays aligned."
          />
        ) : (
          selectedMeetings.map((meeting) => (
            <article key={meeting.id} className="list-card">
              <div className="list-card__top">
                <div>
                  <strong>{meeting.title}</strong>
                  <p>
                    {formatDateTime(meeting.date)} · Created by {meeting.createdBy}
                  </p>
                </div>
                <Badge tone="accent">{meeting.attendees.length} attendees</Badge>
              </div>
              <p>{meeting.notes}</p>
              <p className="muted">{meeting.attendees.join(' • ')}</p>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
