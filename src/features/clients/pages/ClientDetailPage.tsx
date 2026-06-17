import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useAuth } from '../../../app/providers/useAuth'
import { Tabs } from '../../../shared/components/Tabs'
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

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const [searchParams] = useSearchParams()
  const { isAdmin, firebaseUser, profile } = useAuth()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'overview')
  const { client, stages, checklistItems, hasAccess, status, error } = useClientDetail(
    clientId ?? '',
  )

  if (status === 'loading') {
    return <LoadingState title="Loading client" description="Fetching client details." />
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">{client.name}</h1>
        <p className="text-sm text-muted">{client.companyName}</p>
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
