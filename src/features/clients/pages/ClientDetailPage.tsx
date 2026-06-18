import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'

import { useAuth } from '../../../app/providers/useAuth'
import { Tabs } from '../../../shared/components/Tabs'
import { Badge } from '../../../shared/components/Badge'
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States'
import { useClientDetail } from '../hooks/useClientDetail'
import { ClientOverviewTab } from '../widgets/ClientOverviewTab'
import { StagesChecklistTab } from '../widgets/StagesChecklistTab'
import { InfrastructureTab } from '../widgets/InfrastructureTab'
import { MeetingsTab } from '../widgets/MeetingsTab'
import { ActivityTab } from '../widgets/ActivityTab'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'stages', label: 'Stages & Checklist' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'activity', label: 'Activity' },
]

const STATUS_TONE = { onboarding: 'accent', active: 'positive', inactive: 'neutral' } as const

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const [searchParams] = useSearchParams()
  const { isAdmin, firebaseUser, profile } = useAuth()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'overview')
  const { client, stages, checklistItems, hasAccess, status, error } = useClientDetail(
    clientId ?? '',
  )

  if (status === 'loading') {
    return <LoadingState title="" description="" />
  }

  if (status === 'error') {
    return <ErrorState title="Couldn't load client" description={error ?? 'Please try again.'} />
  }

  if (!hasAccess) {
    return (
      <EmptyState
        title="No access"
        description="You don't have any checklist items assigned on this client."
      />
    )
  }

  if (!client) {
    return <EmptyState title="Client not found" description="This client may have been removed." />
  }

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div>
        <Link
          to="/clients"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-text"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path
              fillRule="evenodd"
              d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          All clients
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">{client.name}</h1>
            <p className="mt-0.5 text-sm text-muted">{client.companyName}</p>
          </div>
          <Badge tone={STATUS_TONE[client.status]}>{client.status}</Badge>
        </div>
      </div>

      <Tabs items={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <ClientOverviewTab client={client} stages={stages} checklistItems={checklistItems} />
      ) : null}
      {activeTab === 'stages' ? (
        <StagesChecklistTab
          stages={stages}
          checklistItems={checklistItems}
          isAdmin={isAdmin}
          currentUserId={firebaseUser?.uid ?? ''}
          currentUserName={profile?.name ?? ''}
        />
      ) : null}
      {activeTab === 'infrastructure' ? <InfrastructureTab clientId={client.id} /> : null}
      {activeTab === 'meetings' ? <MeetingsTab clientId={client.id} stages={stages} /> : null}
      {activeTab === 'activity' ? <ActivityTab clientId={client.id} /> : null}
    </div>
  )
}
