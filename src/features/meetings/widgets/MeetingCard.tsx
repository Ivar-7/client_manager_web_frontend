import { Link } from 'react-router-dom'

import { Card } from '../../../shared/components/Card'
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
      <Card title={meeting.title} subtitle={`${clientName} · ${formatDate(meeting.date)}`}>
        <div className="flex flex-wrap gap-1.5">
          {meeting.attendees.map((attendee) => (
            <TagChip key={attendee} label={attendee} />
          ))}
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-text">{meeting.notes}</p>
      </Card>
    </Link>
  )
}
