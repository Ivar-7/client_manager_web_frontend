import { useState } from 'react'

import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'

interface Invoice {
  id: string
  date: string
  description: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
}

const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0512',
    date: 'Jun 1, 2026',
    description: 'Workspace plan · Monthly',
    amount: 249,
    status: 'Paid',
  },
  {
    id: 'INV-2026-0431',
    date: 'May 1, 2026',
    description: 'Workspace plan · Monthly',
    amount: 249,
    status: 'Paid',
  },
  {
    id: 'INV-2026-0359',
    date: 'Apr 1, 2026',
    description: 'Workspace plan · Monthly',
    amount: 249,
    status: 'Paid',
  },
  {
    id: 'INV-2026-0288',
    date: 'Mar 1, 2026',
    description: 'Workspace plan · Monthly + 2 seats',
    amount: 329,
    status: 'Paid',
  },
  {
    id: 'INV-2026-0212',
    date: 'Feb 1, 2026',
    description: 'Workspace plan · Monthly',
    amount: 249,
    status: 'Paid',
  },
  {
    id: 'INV-2026-0140',
    date: 'Jan 1, 2026',
    description: 'Workspace plan · Monthly',
    amount: 249,
    status: 'Overdue',
  },
]

const STATUS_TONE: Record<Invoice['status'], 'positive' | 'warning' | 'danger'> = {
  Paid: 'positive',
  Pending: 'warning',
  Overdue: 'danger',
}

export default function BillingPage() {
  const [invoices] = useState(INVOICES)

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-muted">Account</p>
        <h1 className="text-2xl font-bold tracking-tight text-text">Billing & plan</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Current plan */}
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text">Scale plan</h2>
                <Badge tone="accent">Current</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Unlimited clients, automations, and team seats up to 25.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-text">
                $249<span className="text-sm font-medium text-muted">/mo</span>
              </p>
              <p className="text-xs text-muted">Renews Jul 1, 2026</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <UsageBar label="Team seats" used={14} total={25} />
            <UsageBar label="Active clients" used={74} total={150} />
            <UsageBar label="Automations" used={6} total={20} />
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" size="sm">
              Change plan
            </Button>
            <Button variant="ghost" size="sm">
              View usage details
            </Button>
          </div>
        </Card>

        {/* Payment method */}
        <Card title="Payment method">
          <div className="rounded-xl border border-border-strong bg-surface-strong p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-text px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-bg">
                Visa
              </span>
              <span className="text-xs text-muted">Expires 09/28</span>
            </div>
            <p className="mt-3 font-mono text-sm tracking-wider text-text">•••• •••• •••• 4242</p>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-center">
            Update payment method
          </Button>
        </Card>
      </div>

      {/* Invoice history */}
      <Card title="Invoice history" subtitle="Download past invoices for your records">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-4 font-mono text-xs text-muted">{inv.id}</td>
                  <td className="py-2.5 pr-4 text-muted">{inv.date}</td>
                  <td className="py-2.5 pr-4 text-text">{inv.description}</td>
                  <td className="py-2.5 pr-4 font-semibold text-text">${inv.amount}</td>
                  <td className="py-2.5 pr-4">
                    <Badge tone={STATUS_TONE[inv.status]}>{inv.status}</Badge>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Download
                    </button>
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

function UsageBar({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / total) * 100))
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-text">{label}</span>
        <span className="text-muted">
          {used}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
