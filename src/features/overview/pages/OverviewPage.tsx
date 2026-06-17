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
    <div className="grid gap-5">
      <StatCards
        cards={[
          { label: 'Clients onboarding', value: onboardingCount.count },
          { label: 'Incomplete checklist items', value: incompleteCount.count },
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
    <div className="grid gap-5">
      <StatCards
        cards={[
          { label: 'Assigned incomplete tasks', value: incompleteCount.count },
          { label: 'Due today', value: dueTodayCount.count },
          { label: 'Overdue', value: overdueCount.count },
        ]}
      />
      <RecentActivityPanel title="My recent activity" entries={myActivity.items} />
    </div>
  )
}
