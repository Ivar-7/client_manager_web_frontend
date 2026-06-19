import { useState } from 'react'

import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { AvatarInitials } from '../../../shared/components/AvatarInitials'

interface Member {
  id: string
  name: string
  initials: string
  role: string
  tasksCompleted: number
  tasksAssigned: number
  avgResponseHrs: number
  clientsManaged: number
  score: number
}

const TEAM: Member[] = [
  {
    id: 'm1',
    name: 'Priya Natarajan',
    initials: 'PN',
    role: 'Senior Account Manager',
    tasksCompleted: 142,
    tasksAssigned: 150,
    avgResponseHrs: 1.8,
    clientsManaged: 18,
    score: 96,
  },
  {
    id: 'm2',
    name: 'Marcus Webb',
    initials: 'MW',
    role: 'Onboarding Specialist',
    tasksCompleted: 118,
    tasksAssigned: 130,
    avgResponseHrs: 2.4,
    clientsManaged: 14,
    score: 91,
  },
  {
    id: 'm3',
    name: 'Sofia Alvarez',
    initials: 'SA',
    role: 'Account Manager',
    tasksCompleted: 105,
    tasksAssigned: 120,
    avgResponseHrs: 3.1,
    clientsManaged: 16,
    score: 87,
  },
  {
    id: 'm4',
    name: 'Daniel Osei',
    initials: 'DO',
    role: 'Account Manager',
    tasksCompleted: 97,
    tasksAssigned: 115,
    avgResponseHrs: 4.0,
    clientsManaged: 12,
    score: 81,
  },
  {
    id: 'm5',
    name: 'Hannah Kim',
    initials: 'HK',
    role: 'Onboarding Specialist',
    tasksCompleted: 88,
    tasksAssigned: 110,
    avgResponseHrs: 4.6,
    clientsManaged: 11,
    score: 76,
  },
  {
    id: 'm6',
    name: 'Tomás Ferreira',
    initials: 'TF',
    role: 'Account Manager',
    tasksCompleted: 76,
    tasksAssigned: 105,
    avgResponseHrs: 5.9,
    clientsManaged: 9,
    score: 68,
  },
]

function rankBadgeTone(rank: number): 'accent' | 'positive' | 'neutral' {
  if (rank === 0) return 'accent'
  if (rank <= 2) return 'positive'
  return 'neutral'
}

export default function TeamPerformancePage() {
  const [sortBy, setSortBy] = useState<'score' | 'tasksCompleted' | 'clientsManaged'>('score')

  const sorted = [...TEAM].sort((a, b) => b[sortBy] - a[sortBy])

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">People</p>
          <h1 className="text-2xl font-bold tracking-tight text-text">Team performance</h1>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {[
            { key: 'score' as const, label: 'Score' },
            { key: 'tasksCompleted' as const, label: 'Tasks' },
            { key: 'clientsManaged' as const, label: 'Clients' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortBy(opt.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                sortBy === opt.key ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Team avg. score</p>
          <p className="mt-1.5 text-2xl font-bold text-text">
            {Math.round(TEAM.reduce((s, m) => s + m.score, 0) / TEAM.length)}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Tasks completed (30d)</p>
          <p className="mt-1.5 text-2xl font-bold text-text">
            {TEAM.reduce((s, m) => s + m.tasksCompleted, 0)}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-muted">Avg. response time</p>
          <p className="mt-1.5 text-2xl font-bold text-text">
            {(TEAM.reduce((s, m) => s + m.avgResponseHrs, 0) / TEAM.length).toFixed(1)} hrs
          </p>
        </Card>
      </div>

      <Card title="Leaderboard" subtitle="Ranked by selected metric over the last 30 days">
        <div className="grid gap-3">
          {sorted.map((m, i) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface-muted/40 p-4"
            >
              <span className="w-6 text-center text-sm font-bold text-muted">#{i + 1}</span>
              <AvatarInitials initials={m.initials} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text">{m.name}</p>
                  {i === 0 && <Badge tone={rankBadgeTone(i)}>Top performer</Badge>}
                </div>
                <p className="text-xs text-muted">{m.role}</p>
              </div>

              <div className="grid grid-cols-3 gap-5 text-center sm:flex sm:gap-8">
                <Stat label="Tasks" value={`${m.tasksCompleted}/${m.tasksAssigned}`} />
                <Stat label="Clients" value={String(m.clientsManaged)} />
                <Stat label="Avg. response" value={`${m.avgResponseHrs}h`} />
              </div>

              <div className="flex w-full items-center gap-2 sm:w-32">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${m.score}%` }} />
                </div>
                <span className="w-8 text-right text-xs font-bold text-text">{m.score}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-text">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
    </div>
  )
}
