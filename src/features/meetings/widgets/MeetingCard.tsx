import { Link } from 'react-router-dom'

import { TagChip } from '../../../shared/components/TagChip'
import { formatDate } from '../../../shared/utils/dates'
import type { MeetingNoteRecord } from '../../../shared/types/domain.types'

export function MeetingCard({
  meeting,
  clientName,
}: {
  meeting: MeetingNoteRecord
  clientName: string
}) {
  return (
    <Link to={`/clients/${meeting.clientId}?tab=meetings`} className="block">
      <div className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-surface-strong">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
            {meeting.title}
          </h3>
          <span className="shrink-0 text-xs text-muted">{formatDate(meeting.date)}</span>
        </div>
        <p className="mb-3 text-xs font-medium text-muted">{clientName}</p>
        {(meeting.attendees ?? []).length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(meeting.attendees ?? []).map((attendee) => (
              <TagChip key={attendee} label={attendee} />
            ))}
          </div>
        ) : null}
        <p className="line-clamp-3 text-xs text-muted/80">{meeting.notes}</p>
      </div>
    </Link>
  )
}
