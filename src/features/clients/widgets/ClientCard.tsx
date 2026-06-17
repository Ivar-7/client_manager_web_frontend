import { Link } from 'react-router-dom'

import { AvatarInitials } from '../../../shared/components/AvatarInitials'
import { Badge } from '../../../shared/components/Badge'
import { STAGE_NAMES } from '../../../shared/types/domain.types'
import type { ClientRecord } from '../../../shared/types/domain.types'

const STATUS_TONE = { onboarding: 'accent', active: 'positive', inactive: 'neutral' } as const
const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'danger' } as const

interface ClientCardProps {
  client: ClientRecord
  ownerInitials?: string
}

export function ClientCard({ client, ownerInitials }: ClientCardProps) {
  const stageName = STAGE_NAMES[client.onboardingStage - 1] ?? 'Unknown stage'

  return (
    <Link
      to={`/clients/${client.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-strong p-4 transition hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="min-w-0">
        <strong className="block truncate text-text">{client.name}</strong>
        <p className="truncate text-sm text-muted">{client.companyName || 'No company'}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone={STATUS_TONE[client.status]}>{client.status}</Badge>
          <Badge tone="neutral">{stageName}</Badge>
          <Badge tone={PRIORITY_TONE[client.priority]}>{client.priority}</Badge>
        </div>
      </div>
      {ownerInitials ? <AvatarInitials initials={ownerInitials} size="sm" /> : null}
    </Link>
  )
}
