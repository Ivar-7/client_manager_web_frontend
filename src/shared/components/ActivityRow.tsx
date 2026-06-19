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
    <div className="flex items-start gap-3 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
      <AvatarInitials initials={initialsFromName(entry.actorName)} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text">
          <span className="font-semibold">{entry.actorName}</span>{' '}
          <span className="text-muted">{entry.action}</span>
          {clientName ? <span className="ml-1 text-xs text-muted/70">· {clientName}</span> : null}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted/60">{relativeTime(entry.timestamp)}</span>
          {showEntityBadge ? <Badge tone="neutral">{entry.entityType}</Badge> : null}
        </div>
      </div>
    </div>
  )
}
