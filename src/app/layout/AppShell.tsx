import { Outlet } from 'react-router-dom'

import { Badge } from '../../shared/components/UI'
import { useDashboardWorkspace } from '../../features/dashboard/providers/dashboardWorkspaceContext'

export default function AppShell() {
  const { status, error, currentUser } = useDashboardWorkspace()

  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <div>
          <div className="app-shell__eyebrow">Client onboarding workspace</div>
          <strong>Firebase-backed dashboard</strong>
        </div>
        <div className="app-shell__topbar-actions">
          {/* <Badge tone={mode === 'firebase' ? 'positive' : 'warning'}>{mode}</Badge> */}
          <Badge tone={status === 'error' ? 'danger' : 'neutral'}>{status}</Badge>
          <span className="app-shell__user">{currentUser?.name ?? 'Workspace user'}</span>
        </div>
      </header>
      {error ? <div className="app-shell__banner">{error}</div> : null}
      <Outlet />
    </div>
  )
}
