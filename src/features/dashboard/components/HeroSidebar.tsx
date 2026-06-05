import { Badge } from '../../../shared/components/UI'

interface HeroSidebarProps {
  mode: 'firebase' | 'demo'
  error: string | null
}

export function HeroSidebar({
//   mode,
  error,
}: HeroSidebarProps) {
  return (
    <aside className="hero-panel">
      <div className="hero-panel__eyebrow">Workspace</div>
      <h1>Client onboarding operations</h1>
      <p>Manage real client records, stages, infrastructure, and meeting notes from Firebase.</p>
      <div className="hero-panel__status-row">
        {/* <Badge tone={mode === 'firebase' ? 'positive' : 'warning'}>
          {mode === 'firebase' ? 'Firebase' : 'Demo mode'}
        </Badge> */}
        <Badge tone={error ? 'danger' : 'neutral'}>{error ?? 'Realtime workspace ready'}</Badge>
      </div>
    </aside>
  )
}
