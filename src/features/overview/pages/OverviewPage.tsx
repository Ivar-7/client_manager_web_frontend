import { useAuth } from '../../../app/providers/useAuth'
import { useAdminOverview, useMemberOverview } from '../hooks/useOverview'
import { StatCards } from '../widgets/StatCards'
import { RecentActivityPanel } from '../widgets/RecentActivityPanel'
import { BlockedPipelinePanel } from '../widgets/BlockedPipelinePanel'
import { PipelineFunnelCard } from '../widgets/PipelineFunnelCard'
import { TaskHealthCard } from '../widgets/TaskHealthCard'
import { QuickStatRow } from '../widgets/QuickStatRow'
import { RecentClientsCard } from '../widgets/RecentClientsCard'
import { StageDistributionCard } from '../widgets/StageDistributionCard'

export default function OverviewPage() {
  const { isAdmin } = useAuth()
  return isAdmin ? <AdminOverview /> : <MemberOverview />
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconUsers = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path d="M7 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 10 17a9.953 9.953 0 0 1-8.385-.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
  </svg>
)
const IconCheck = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
      clipRule="evenodd"
    />
  </svg>
)
const IconWarning = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
  </svg>
)
const IconRocket = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M9.638 2.015a.75.75 0 0 1 .724 0l5 2.75A.75.75 0 0 1 15.75 5.5v9a.75.75 0 0 1-.388.656l-5 2.75a.75.75 0 0 1-.724 0l-5-2.75A.75.75 0 0 1 4.25 14.5v-9a.75.75 0 0 1 .388-.657l5-2.75ZM10 4.187 6.232 6.25 10 8.313l3.768-2.063L10 4.187ZM5.75 7.37v5.384l3.5 1.925V9.295l-3.5-1.925Zm5 7.309 3.5-1.925V7.37l-3.5 1.925v5.384Z"
      clipRule="evenodd"
    />
  </svg>
)
const IconClock = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
      clipRule="evenodd"
    />
  </svg>
)
const IconFire = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
  </svg>
)

// ─── Admin view ──────────────────────────────────────────────────────────────
function AdminOverview() {
  const {
    onboardingCount,
    activeCount,
    incompleteCount,
    completedCount,
    goLiveCount,
    highPriorityCount,
    recentActivity,
    blockedStages,
    recentClients,
  } = useAdminOverview()

  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="grid gap-6">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight text-text">Overview</h1>
        </div>
        <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
          {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Hero stat cards */}
      <StatCards
        cards={[
          {
            label: 'Clients onboarding',
            value: onboardingCount.count,
            icon: IconUsers,
            tone: 'accent',
            trend: { value: '+2', up: true, label: 'vs last month' },
          },
          {
            label: 'Incomplete tasks',
            value: incompleteCount.count,
            icon: IconWarning,
            tone: 'warning',
            trend: { value: '12%', up: false, label: 'completion rate drop' },
          },
          {
            label: 'At go-live stage',
            value: goLiveCount.count,
            icon: IconRocket,
            tone: 'success',
            trend: { value: '+1', up: true, label: 'this week' },
          },
          {
            label: 'High priority',
            value: highPriorityCount.count,
            icon: IconFire,
            tone: 'danger',
          },
        ]}
      />

      {/* Middle row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <PipelineFunnelCard
          onboarding={onboardingCount.count}
          goLive={goLiveCount.count}
          active={activeCount.count}
        />
        <TaskHealthCard incomplete={incompleteCount.count} completed={completedCount.count} />
        <QuickStatRow
          stats={[
            {
              label: 'Active clients',
              value: activeCount.count,
              icon: IconCheck,
              tone: 'success',
            },
            {
              label: 'Blocked stages',
              value: blockedStages.status === 'loading' ? null : blockedStages.stages.length,
              icon: IconWarning,
              tone:
                blockedStages.status !== 'loading' && blockedStages.stages.length > 0
                  ? 'danger'
                  : 'default',
            },
            {
              label: 'Completed tasks',
              value: completedCount.count,
              icon: IconCheck,
              tone: 'accent',
            },
            {
              label: 'High priority clients',
              value: highPriorityCount.count,
              icon: IconFire,
              tone: (highPriorityCount.count ?? 0 > 0) ? 'danger' : 'default',
            },
          ]}
        />
      </div>

      {/* Bottom row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Activity — spans 2 cols */}
        <div className="lg:col-span-2">
          <RecentActivityPanel title="Recent activity" entries={recentActivity.items} />
        </div>

        {/* Right column */}
        <div className="grid gap-5">
          <RecentClientsCard
            clients={recentClients.items}
            loading={recentClients.status === 'loading'}
          />
        </div>
      </div>

      {/* Full-width bottom row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <StageDistributionCard goLiveCount={goLiveCount.count} />
        <BlockedPipelinePanel
          stages={blockedStages.status === 'loading' ? [] : blockedStages.stages}
        />
      </div>
    </div>
  )
}

// ─── Member view ─────────────────────────────────────────────────────────────
function MemberOverview() {
  const { incompleteCount, dueTodayCount, overdueCount, myActivity } = useMemberOverview()

  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight text-text">Overview</h1>
        </div>
        <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
          {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <StatCards
        cards={[
          {
            label: 'Assigned tasks',
            value: incompleteCount.count,
            icon: IconCheck,
            tone: 'accent',
          },
          {
            label: 'Due today',
            value: dueTodayCount.count,
            icon: IconClock,
            tone: (dueTodayCount.count ?? 0) > 0 ? 'warning' : 'default',
          },
          {
            label: 'Overdue',
            value: overdueCount.count,
            icon: IconWarning,
            tone: (overdueCount.count ?? 0) > 0 ? 'danger' : 'default',
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityPanel title="My recent activity" entries={myActivity.items} />
        </div>
        <QuickStatRow
          stats={[
            {
              label: 'Assigned tasks',
              value: incompleteCount.count,
              icon: IconCheck,
              tone: 'accent',
            },
            {
              label: 'Due today',
              value: dueTodayCount.count,
              icon: IconClock,
              tone: (dueTodayCount.count ?? 0) > 0 ? 'warning' : 'default',
            },
            {
              label: 'Overdue',
              value: overdueCount.count,
              icon: IconWarning,
              tone: (overdueCount.count ?? 0) > 0 ? 'danger' : 'default',
            },
          ]}
        />
      </div>
    </div>
  )
}
