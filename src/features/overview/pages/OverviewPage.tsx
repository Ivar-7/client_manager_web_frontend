import { useAuth } from '../../../app/providers/useAuth'
import { LoadingState } from '../../../shared/components/States'
import { useAdminOverview, useMemberOverview } from '../hooks/useOverview'
import { StatCards } from '../widgets/StatCards'
import { RecentActivityPanel } from '../widgets/RecentActivityPanel'
import { BlockedPipelinePanel } from '../widgets/BlockedPipelinePanel'

export default function OverviewPage() {
  const { isAdmin } = useAuth()
  return isAdmin ? <AdminOverview /> : <MemberOverview />
}

function AdminOverview() {
  const { onboardingCount, incompleteCount, goLiveCount, recentActivity, blockedStages } =
    useAdminOverview()

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Overview</h1>
        <p className="mt-1 text-sm text-muted">Your onboarding pipeline at a glance</p>
      </div>
      <StatCards
        cards={[
          { label: 'Clients onboarding', value: onboardingCount.count },
          { label: 'Incomplete items', value: incompleteCount.count },
          { label: 'Clients at Go Live', value: goLiveCount.count },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentActivityPanel title="Recent activity" entries={recentActivity.items} />
        {blockedStages.status === 'loading' ? (
          <LoadingState title="Loading pipeline" description="Checking for blocked stages." />
        ) : (
          <BlockedPipelinePanel stages={blockedStages.stages} />
        )}
      </div>
    </div>
  )
}

function MemberOverview() {
  const { incompleteCount, dueTodayCount, overdueCount, myActivity } = useMemberOverview()

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Overview</h1>
        <p className="mt-1 text-sm text-muted">Your tasks and recent activity</p>
      </div>
      <StatCards
        cards={[
          { label: 'Assigned tasks', value: incompleteCount.count },
          { label: 'Due today', value: dueTodayCount.count },
          { label: 'Overdue', value: overdueCount.count },
        ]}
      />
      <RecentActivityPanel title="My recent activity" entries={myActivity.items} />
    </div>
  )
}
