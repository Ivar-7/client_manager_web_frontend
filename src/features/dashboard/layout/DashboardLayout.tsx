import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/overview', label: 'Overview' },
  { to: '/clients', label: 'Clients' },
  { to: '/workflow', label: 'Workflow' },
  { to: '/infrastructure', label: 'Infrastructure' },
  { to: '/meetings', label: 'Meetings' },
]

export default function DashboardLayout() {
  return (
    <div className="workspace-layout">
      <nav className="workspace-nav" aria-label="Dashboard sections">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `workspace-nav__link ${isActive ? 'workspace-nav__link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <section className="workspace-content">
        <Outlet />
      </section>
    </div>
  )
}
