import { Badge, EmptyState, LoadingState, Panel } from '../../../shared/components/UI'
import { formatDateTime } from '../../../shared/utils/dates'
import { clientStatusTone, stageTone } from '../constants/dashboardOptions'
import { HeroSidebar } from '../components/HeroSidebar'
import { useDashboardPageModel } from '../hooks/useDashboardPageModel'

export default function OverviewPage() {
  const vm = useDashboardPageModel()

  if (vm.status === 'loading') {
    return (
      <LoadingState
        title="Connecting workspace"
        description="Loading your Firebase collections and session state."
      />
    )
  }

  const recentClients = [...vm.workspace.clients]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)

  const clientStageBacklog = [...vm.workspace.clients]
    .filter((client) => client.onboardingStage !== 'goLive')
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    .slice(0, 5)

  return (
    <div className="dashboard-shell dashboard-shell--single">
      <HeroSidebar mode={vm.mode} error={vm.error} />

      <main className="dashboard-grid dashboard-grid--overview">
        <Panel title="Recent client activity" subtitle="Latest updated records in your workspace.">
          <div className="stack">
            {recentClients.length === 0 ? (
              <EmptyState title="No clients yet" description="Create your first client in the Clients section." />
            ) : (
              recentClients.map((client) => (
                <article key={client.id} className="list-card">
                  <div className="list-card__top">
                    <div>
                      <strong>{client.name}</strong>
                      <p>{client.email}</p>
                    </div>
                    <Badge tone={clientStatusTone[client.status]}>{client.status}</Badge>
                  </div>
                  <p>Updated {formatDateTime(client.updatedAt)}</p>
                </article>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Workflow backlog" subtitle="Clients not yet at go-live stage.">
          <div className="stack">
            {clientStageBacklog.length === 0 ? (
              <EmptyState title="No backlog" description="All clients are in go-live stage." />
            ) : (
              clientStageBacklog.map((client) => (
                <article key={client.id} className="list-card">
                  <div className="list-card__top">
                    <div>
                      <strong>{client.name}</strong>
                      <p>{client.email}</p>
                    </div>
                    <Badge tone={stageTone[client.onboardingStage]}>{client.onboardingStage}</Badge>
                  </div>
                </article>
              ))
            )}
          </div>
        </Panel>
      </main>
    </div>
  )
}
