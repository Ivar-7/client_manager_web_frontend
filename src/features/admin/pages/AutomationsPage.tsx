import { useState } from 'react'

import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  enabled: boolean
  runs: number
  lastRun: string
}

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1',
    name: 'Auto-assign onboarding tasks',
    description:
      'When a client moves to "Onboarding", create the standard task checklist and assign it to the account owner.',
    trigger: 'Stage changes to Onboarding',
    action: 'Create tasks + assign owner',
    enabled: true,
    runs: 312,
    lastRun: '12 minutes ago',
  },
  {
    id: 'auto-2',
    name: 'Stale task reminder',
    description:
      'Notify the assignee and their manager if a task has been open for more than 5 business days.',
    trigger: 'Task open > 5 days',
    action: 'Send reminder notification',
    enabled: true,
    runs: 89,
    lastRun: '2 hours ago',
  },
  {
    id: 'auto-3',
    name: 'Go-live celebration',
    description:
      'Post an activity feed entry and notify the team channel when a client reaches Go-live.',
    trigger: 'Stage changes to Go-live',
    action: 'Post activity + notify team',
    enabled: true,
    runs: 41,
    lastRun: '1 day ago',
  },
  {
    id: 'auto-4',
    name: 'Inactive client flag',
    description: 'Flag clients as at-risk if there has been no activity logged in 14 days.',
    trigger: 'No activity for 14 days',
    action: 'Flag client as at-risk',
    enabled: false,
    runs: 17,
    lastRun: '6 days ago',
  },
  {
    id: 'auto-5',
    name: 'Weekly digest email',
    description:
      'Send a summary of pipeline movement, blocked stages, and completed tasks every Monday at 8am.',
    trigger: 'Every Monday 08:00',
    action: 'Send digest email',
    enabled: true,
    runs: 24,
    lastRun: '4 days ago',
  },
  {
    id: 'auto-6',
    name: 'Meeting follow-up task',
    description: 'Automatically create a follow-up task 1 day after a meeting is marked complete.',
    trigger: 'Meeting marked complete',
    action: 'Create follow-up task',
    enabled: false,
    runs: 53,
    lastRun: '3 days ago',
  },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS)

  function toggle(id: string) {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }

  const activeCount = automations.filter((a) => a.enabled).length
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Workflow engine</p>
          <h1 className="text-2xl font-bold tracking-tight text-text">Automations</h1>
        </div>
        <Button variant="primary" size="sm">
          + New automation
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Active rules</p>
          <p className="mt-1.5 text-2xl font-bold text-text">
            {activeCount} / {automations.length}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Total runs (30d)</p>
          <p className="mt-1.5 text-2xl font-bold text-text">{totalRuns.toLocaleString()}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Time saved (est.)</p>
          <p className="mt-1.5 text-2xl font-bold text-text">38.5 hrs</p>
        </Card>
      </div>

      <div className="grid gap-4">
        {automations.map((a) => (
          <Card key={a.id} className="!p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-text">{a.name}</h3>
                  <Badge tone={a.enabled ? 'positive' : 'neutral'}>
                    {a.enabled ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted">{a.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-surface-strong px-2 py-1 font-medium text-muted">
                    Trigger: <span className="text-text">{a.trigger}</span>
                  </span>
                  <span className="rounded-md bg-surface-strong px-2 py-1 font-medium text-muted">
                    Action: <span className="text-text">{a.action}</span>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => toggle(a.id)}
                  aria-pressed={a.enabled}
                  className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
                    a.enabled ? 'bg-accent' : 'bg-border-strong'
                  }`}
                >
                  <span
                    className={`size-5 rounded-full bg-white shadow transition-transform ${
                      a.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <p className="text-right text-[11px] text-muted">
                  {a.runs} runs · last {a.lastRun}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
