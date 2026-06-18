import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/useAuth'
import { useTheme } from '../providers/useTheme'
import { signOutUser } from '../../features/auth/api/auth.api'
import { AvatarInitials } from '../../shared/components/AvatarInitials'

const NAV_ITEMS = [
  {
    to: '/overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path d="M2 10a8 8 0 1 1 16 0A8 8 0 0 1 2 10Zm8-3a1 1 0 0 0-1 1v2a1 1 0 0 0 .293.707l1.5 1.5a1 1 0 0 0 1.414-1.414L11 9.586V8a1 1 0 0 0-1-1Z" />
      </svg>
    ),
  },
  {
    to: '/clients',
    label: 'Clients',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path d="M7 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 10 17a9.953 9.953 0 0 1-8.385-.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'Tasks',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    to: '/workflow',
    label: 'Workflow',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1Zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586l-1.293 1.293Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    to: '/infrastructure',
    label: 'Infrastructure',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path
          fillRule="evenodd"
          d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1H2V5ZM2 8h16v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8Zm9 3a1 1 0 1 0-2 0v2H7a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    to: '/meetings',
    label: 'Meetings',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    to: '/activity',
    label: 'Activity',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
        <path
          fillRule="evenodd"
          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 9 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L3.659 6.22A2.25 2.25 0 0 1 3 4.629V2.34a.75.75 0 0 1 .628-.74Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function DashboardLayout() {
  const { profile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-[100svh] bg-bg">
      {/* Sidebar — desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent glow-accent-sm">
            <svg viewBox="0 0 20 20" fill="white" className="size-4">
              <path
                fillRule="evenodd"
                d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM6.05 6a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 6.05 6Zm.75 2.75a.75.75 0 0 0-1.5 0v4.01a.75.75 0 0 0 1.5 0V8.75ZM10 6a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 10 6Zm3.75.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Client</p>
            <p className="-mt-0.5 text-sm font-bold text-text">Workspace</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Dashboard sections">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-muted hover:bg-surface-strong hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-accent' : 'text-muted'}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            {profile ? (
              <>
                <AvatarInitials initials={profile.avatarInitials} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text">{profile.name}</p>
                  <p className="text-[10px] text-muted">Member</p>
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-1 flex gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-strong hover:text-text"
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5"><path d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-.464 4.95.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414Zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1Zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707Zm1.414 8.486-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414ZM4 11a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2h1Z" /></svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5"><path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" /></svg>
              )}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Zm13.03 4.97a.75.75 0 0 1 0 1.06l-1.5 1.5a.75.75 0 1 1-1.06-1.06l.22-.22H8.5a.75.75 0 0 1 0-1.5h5.19l-.22-.22a.75.75 0 1 1 1.06-1.06l1.5 1.5Z" clipRule="evenodd" /></svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent">
            <svg viewBox="0 0 20 20" fill="white" className="size-3.5">
              <path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM6.05 6a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 6.05 6Zm.75 2.75a.75.75 0 0 0-1.5 0v4.01a.75.75 0 0 0 1.5 0V8.75ZM10 6a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 10 6Zm3.75.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z" clipRule="evenodd" /></svg>
          </div>
          <span className="text-sm font-bold text-text">Workspace</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-muted hover:bg-surface-strong hover:text-text"
        >
          {mobileNavOpen ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5A.75.75 0 0 1 2.75 14h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 14.75Z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface pt-14 lg:hidden">
            <nav className="space-y-0.5 overflow-y-auto p-3" aria-label="Dashboard sections">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-muted hover:bg-surface-strong hover:text-text'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-accent' : 'text-muted'}>{item.icon}</span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border p-3">
              <div className="flex gap-1">
                <button type="button" onClick={toggleTheme} className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted hover:bg-surface-strong hover:text-text">
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button type="button" onClick={() => signOutUser()} className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted hover:bg-danger-soft hover:text-danger">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 pt-18 lg:p-6 lg:pt-6">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
