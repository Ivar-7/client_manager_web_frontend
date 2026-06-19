import { useState } from 'react'

import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const REVENUE_SERIES = [42, 48, 51, 47, 58, 63, 61, 69, 74, 71, 80, 86]
const ONBOARDING_SERIES = [6, 8, 7, 9, 11, 10, 13, 12, 15, 14, 17, 19]

const TOP_CLIENTS = [
  { name: 'Brightline Logistics', value: 18400, change: '+12.4%', tone: 'positive' as const },
  { name: 'Solace Health Group', value: 15200, change: '+8.1%', tone: 'positive' as const },
  { name: 'Northwind Retail', value: 12950, change: '-2.3%', tone: 'danger' as const },
  { name: 'Cobalt Manufacturing', value: 11100, change: '+5.6%', tone: 'positive' as const },
  { name: 'Aurora Financial', value: 9800, change: '+1.2%', tone: 'positive' as const },
]

const FUNNEL = [
  { label: 'Leads', value: 240 },
  { label: 'Qualified', value: 168 },
  { label: 'Onboarding', value: 96 },
  { label: 'Active', value: 74 },
  { label: 'Go-live', value: 52 },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState<'6m' | '12m'>('12m')

  const months = range === '6m' ? MONTHS.slice(-6) : MONTHS
  const revenue = range === '6m' ? REVENUE_SERIES.slice(-6) : REVENUE_SERIES
  const onboarding = range === '6m' ? ONBOARDING_SERIES.slice(-6) : ONBOARDING_SERIES
  const maxRevenue = Math.max(...revenue)

  const totalRevenue = revenue.reduce((a, b) => a + b, 0)
  const avgGrowth = (((revenue[revenue.length - 1] - revenue[0]) / revenue[0]) * 100).toFixed(1)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Business intelligence</p>
          <h1 className="text-2xl font-bold tracking-tight text-text">Analytics</h1>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {(['6m', '12m'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === r ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`}
            >
              {r === '6m' ? 'Last 6 months' : 'Last 12 months'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={`$${(totalRevenue * 10).toLocaleString()}`}
          trend={`+${avgGrowth}%`}
          up
        />
        <KpiCard label="Active clients" value="74" trend="+9.2%" up />
        <KpiCard label="Avg. onboarding time" value="14.2 days" trend="-3.1%" up />
        <KpiCard label="Churn rate" value="2.4%" trend="+0.4%" up={false} />
      </div>

      {/* Revenue chart */}
      <Card title="Revenue trend" subtitle="Monthly recurring revenue across all active accounts">
        <div className="flex h-56 items-end gap-2 sm:gap-3">
          {revenue.map((v, i) => (
            <div key={months[i]} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div
                  className="w-full max-w-9 rounded-t-md bg-gradient-to-t from-accent/70 to-accent transition-all duration-500"
                  style={{ height: `${(v / maxRevenue) * 100}%` }}
                  title={`$${v}k`}
                />
              </div>
              <span className="text-[11px] font-medium text-muted">{months[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Onboarding line (sparkline-ish) */}
        <Card
          title="New onboardings"
          subtitle="Clients entering the pipeline"
          className="lg:col-span-2"
        >
          <svg viewBox="0 0 400 140" className="h-40 w-full overflow-visible">
            <polyline
              fill="none"
              stroke="var(--color-accent, #6366f1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={onboarding
                .map((v, i) => {
                  const x = (i / (onboarding.length - 1)) * 380 + 10
                  const y = 130 - (v / Math.max(...onboarding)) * 110
                  return `${x},${y}`
                })
                .join(' ')}
            />
            {onboarding.map((v, i) => {
              const x = (i / (onboarding.length - 1)) * 380 + 10
              const y = 130 - (v / Math.max(...onboarding)) * 110
              return <circle key={i} cx={x} cy={y} r="4" className="fill-accent" />
            })}
          </svg>
          <div className="mt-1 flex justify-between text-[11px] font-medium text-muted">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>

        {/* Funnel */}
        <Card title="Pipeline funnel" subtitle="Conversion by stage">
          <div className="grid gap-2.5">
            {FUNNEL.map((f, i) => (
              <div key={f.label} className="grid gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text">{f.label}</span>
                  <span className="font-semibold text-muted">{f.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${(f.value / FUNNEL[0].value) * 100}%`,
                      opacity: 1 - i * 0.12,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top clients table */}
      <Card title="Top clients by revenue" subtitle="Ranked by trailing 30-day contribution">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CLIENTS.map((c) => (
                <tr key={c.name} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-text">{c.name}</td>
                  <td className="py-2.5 pr-4 text-muted">${c.value.toLocaleString()}</td>
                  <td className="py-2.5">
                    <Badge tone={c.tone}>{c.change}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function KpiCard({
  label,
  value,
  trend,
  up,
}: {
  label: string
  value: string
  trend: string
  up: boolean
}) {
  return (
    <Card className="!p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-text">{value}</p>
      <span
        className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-success' : 'text-danger'}`}
      >
        {up ? '↑' : '↓'} {trend}
      </span>
    </Card>
  )
}
