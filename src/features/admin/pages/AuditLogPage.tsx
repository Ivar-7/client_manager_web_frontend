import { useMemo, useState } from 'react'

import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'

interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  category: 'Auth' | 'Data' | 'Permissions' | 'Settings'
  severity: 'info' | 'warning' | 'critical'
  ip: string
  time: string
}

const ENTRIES: AuditEntry[] = [
  {
    id: 'a1',
    actor: 'priya.n@workspace.io',
    action: 'Signed in',
    target: 'Session',
    category: 'Auth',
    severity: 'info',
    ip: '102.45.211.8',
    time: '2 minutes ago',
  },
  {
    id: 'a2',
    actor: 'system',
    action: 'Automation rule triggered',
    target: 'Auto-assign onboarding tasks',
    category: 'Data',
    severity: 'info',
    ip: '—',
    time: '12 minutes ago',
  },
  {
    id: 'a3',
    actor: 'marcus.w@workspace.io',
    action: 'Changed client stage',
    target: 'Northwind Retail → Go-live',
    category: 'Data',
    severity: 'info',
    ip: '88.12.4.190',
    time: '38 minutes ago',
  },
  {
    id: 'a4',
    actor: 'daniel.o@workspace.io',
    action: 'Failed sign-in attempt',
    target: 'Session',
    category: 'Auth',
    severity: 'warning',
    ip: '203.0.113.44',
    time: '1 hour ago',
  },
  {
    id: 'a5',
    actor: 'sofia.a@workspace.io',
    action: 'Updated role permissions',
    target: 'Hannah Kim → Account Manager',
    category: 'Permissions',
    severity: 'warning',
    ip: '14.6.77.21',
    time: '3 hours ago',
  },
  {
    id: 'a6',
    actor: 'unknown',
    action: 'Repeated failed sign-in (5x)',
    target: 'Session',
    category: 'Auth',
    severity: 'critical',
    ip: '198.51.100.23',
    time: '5 hours ago',
  },
  {
    id: 'a7',
    actor: 'priya.n@workspace.io',
    action: 'Exported client list',
    target: '74 records',
    category: 'Data',
    severity: 'warning',
    ip: '102.45.211.8',
    time: '6 hours ago',
  },
  {
    id: 'a8',
    actor: 'admin@workspace.io',
    action: 'Updated workspace settings',
    target: 'Billing contact email',
    category: 'Settings',
    severity: 'info',
    ip: '102.45.211.8',
    time: '1 day ago',
  },
  {
    id: 'a9',
    actor: 'tomas.f@workspace.io',
    action: 'Deleted task',
    target: 'Cobalt Manufacturing checklist item',
    category: 'Data',
    severity: 'warning',
    ip: '77.4.221.9',
    time: '1 day ago',
  },
  {
    id: 'a10',
    actor: 'hannah.k@workspace.io',
    action: 'Signed in',
    target: 'Session',
    category: 'Auth',
    severity: 'info',
    ip: '91.203.44.7',
    time: '2 days ago',
  },
]

const SEVERITY_TONE: Record<AuditEntry['severity'], 'neutral' | 'warning' | 'danger'> = {
  info: 'neutral',
  warning: 'warning',
  critical: 'danger',
}

const CATEGORIES = ['All', 'Auth', 'Data', 'Permissions', 'Settings'] as const

export default function AuditLogPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return ENTRIES.filter((e) => {
      const matchesCategory = category === 'All' || e.category === category
      const matchesQuery =
        query.trim() === '' ||
        e.actor.toLowerCase().includes(query.toLowerCase()) ||
        e.action.toLowerCase().includes(query.toLowerCase()) ||
        e.target.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const criticalCount = ENTRIES.filter((e) => e.severity === 'critical').length
  const warningCount = ENTRIES.filter((e) => e.severity === 'warning').length

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-muted">Security</p>
        <h1 className="text-2xl font-bold tracking-tight text-text">Audit log</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Events (7d)</p>
          <p className="mt-1.5 text-2xl font-bold text-text">{ENTRIES.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Warnings</p>
          <p className="mt-1.5 text-2xl font-bold text-warning">{warningCount}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Critical alerts</p>
          <p className="mt-1.5 text-2xl font-bold text-danger">{criticalCount}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-muted/40 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  category === c ? 'bg-accent text-white' : 'text-muted hover:text-text'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action, target…"
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none sm:w-64"
          />
        </div>

        <div className="grid gap-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No matching events.</p>
          ) : (
            filtered.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-surface-muted/30 px-4 py-3"
              >
                <Badge tone={SEVERITY_TONE[e.severity]} className="shrink-0">
                  {e.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text">
                    <span className="font-semibold">{e.actor}</span> — {e.action}
                    {e.target !== 'Session' && <span className="text-muted"> · {e.target}</span>}
                  </p>
                  <p className="text-[11px] text-muted">
                    {e.category} · IP {e.ip} · {e.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
