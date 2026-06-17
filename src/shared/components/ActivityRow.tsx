import { AvatarInitials } from './AvatarInitials'
import { Badge } from './Badge'
import { relativeTime } from '../utils/dates'
import { initialsFromName } from '../api/users.api'
import type { ActivityLogRecord } from '../types/domain.types'

interface ActivityRowProps {
  entry: ActivityLogRecord
  clientName?: string
  showEntityBadge?: boolean
}

export function ActivityRow({ entry, clientName, showEntityBadge }: ActivityRowProps) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
      <AvatarInitials initials={initialsFromName(entry.actorName)} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text">
          <span className="font-semibold">{entry.actorName}</span> {entry.action}
          {clientName ? <span className="text-muted"> · {clientName}</span> : null}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted">{relativeTime(entry.timestamp)}</span>
          {showEntityBadge ? <Badge tone="neutral">{entry.entityType}</Badge> : null}
        </div>
      </div>
    </div>
  )
}
