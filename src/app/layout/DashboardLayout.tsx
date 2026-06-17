import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/useAuth'
import { useTheme } from '../providers/useTheme'
import { signOutUser } from '../../features/auth/api/auth.api'
import { AvatarInitials } from '../../shared/components/AvatarInitials'
import { Button } from '../../shared/components/Button'

const NAV_ITEMS = [
  { to: '/overview', label: 'Overview' },
  { to: '/clients', label: 'Clients' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/workflow', label: 'Workflow' },
  { to: '/infrastructure', label: 'Infrastructure' },
  { to: '/meetings', label: 'Meetings' },
  { to: '/activity', label: 'Activity' },
]

export default function DashboardLayout() {
  const { profile } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-6 sm:py-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-surface px-4 py-3 shadow-sm sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Client onboarding
          </p>
          <strong className="text-lg text-text">Workspace</strong>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </Button>
          {profile ? (
            <div className="flex items-center gap-2">
              <AvatarInitials initials={profile.avatarInitials} size="sm" />
              <span className="hidden text-sm text-text sm:inline">{profile.name}</span>
            </div>
          ) : null}
          <Button variant="secondary" type="button" onClick={() => signOutUser()}>
            Sign out
          </Button>
        </div>
      </header>

      <nav
        aria-label="Dashboard sections"
        className="mb-5 flex gap-1.5 overflow-x-auto rounded-full border border-border bg-surface-muted p-1.5"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="grid gap-5">
        <Outlet />
      </main>
    </div>
  )
}
