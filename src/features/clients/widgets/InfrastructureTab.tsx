import { Timestamp } from 'firebase/firestore'
import { useState, type FormEvent } from 'react'

import { useAuth } from '../../../app/providers/useAuth'
import { createAsset, deleteAsset, updateAsset, useAssets } from '../../../shared/api/assets.api'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Card } from '../../../shared/components/Card'
import { Field, Input, Select } from '../../../shared/components/Field'
import { InlineConfirm } from '../../../shared/components/InlineConfirm'
import { EmptyState, LoadingState } from '../../../shared/components/States'
import { formatDate, isExpiringSoon } from '../../../shared/utils/dates'
import type { AssetInput, AssetRecord, AssetType } from '../../../shared/types/domain.types'

const ASSET_TYPES: AssetType[] = ['domain', 'hosting', 'dns']

interface InfrastructureTabProps {
  clientId: string
}

export function InfrastructureTab({ clientId }: InfrastructureTabProps) {
  const { isAdmin, firebaseUser, profile } = useAuth()
  const { items, status } = useAssets(100, { clientId })
  const [addOpen, setAddOpen] = useState(false)

  const grouped = ASSET_TYPES.map((type) => ({
    type,
    assets: items.filter((asset) => asset.type === type),
  }))

  const handleCreate = async (input: AssetInput) => {
    if (!firebaseUser || !profile) return
    await createAsset(input, firebaseUser.uid, profile.name)
    setAddOpen(false)
  }

  return (
    <div className="grid gap-5">
      {isAdmin ? (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setAddOpen((open) => !open)}>
            {addOpen ? 'Close' : 'Add asset'}
          </Button>
        </div>
      ) : (
        <Badge tone="neutral">View only</Badge>
      )}

      {addOpen ? (
        <AssetForm clientId={clientId} onSubmit={handleCreate} onCancel={() => setAddOpen(false)} />
      ) : null}

      {status === 'loading' ? (
        <LoadingState title="Loading infrastructure" description="Fetching this client's assets." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No assets yet"
          description="No infrastructure has been recorded for this client."
        />
      ) : (
        grouped.map(({ type, assets }) =>
          assets.length === 0 ? null : (
            <Card key={type} title={type.toUpperCase()}>
              <div className="grid gap-2">
                {assets.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    isAdmin={isAdmin}
                    onSave={(patch) =>
                      firebaseUser && profile
                        ? updateAsset(asset.id, patch, clientId, firebaseUser.uid, profile.name)
                        : Promise.resolve()
                    }
                  />
                ))}
              </div>
            </Card>
          ),
        )
      )}
    </div>
  )
}

function AssetRow({
  asset,
  isAdmin,
  onSave,
}: {
  asset: AssetRecord
  isAdmin: boolean
  onSave: (patch: Partial<AssetInput>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const expiring = isExpiringSoon(asset.expiresAt)

  if (editing) {
    return (
      <AssetForm
        clientId={asset.clientId}
        initial={asset}
        onSubmit={async (input) => {
          await onSave(input)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-strong p-3">
      <div className="min-w-0">
        <strong className="block text-text">{asset.name}</strong>
        <p className="text-sm text-muted">
          {asset.value} · {asset.provider}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{asset.status}</Badge>
          {asset.expiresAt ? (
            <Badge tone={expiring ? 'warning' : 'neutral'}>
              Expires {formatDate(asset.expiresAt)}
            </Badge>
          ) : null}
        </div>
      </div>
      {isAdmin ? (
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <InlineConfirm label="Delete" onConfirm={() => deleteAsset(asset.id)} />
        </div>
      ) : null}
    </div>
  )
}

function AssetForm({
  clientId,
  initial,
  onSubmit,
  onCancel,
}: {
  clientId: string
  initial?: AssetRecord
  onSubmit: (input: AssetInput) => Promise<void>
  onCancel: () => void
}) {
  const [type, setType] = useState<AssetType>(initial?.type ?? 'domain')
  const [name, setName] = useState(initial?.name ?? '')
  const [value, setValue] = useState(initial?.value ?? '')
  const [provider, setProvider] = useState(initial?.provider ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'active')
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        clientId,
        type,
        name,
        value,
        status,
        provider,
        notes: initial?.notes ?? '',
        managedBy: initial?.managedBy ?? null,
        expiresAt: expiresAt
          ? Timestamp.fromDate(new Date(expiresAt))
          : (initial?.expiresAt ?? null),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-border bg-surface-muted p-4 sm:grid-cols-2"
    >
      <Field label="Type">
        <Select value={type} onChange={(event) => setType(event.target.value as AssetType)}>
          {ASSET_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Name">
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </Field>
      <Field label="Value">
        <Input value={value} onChange={(event) => setValue(event.target.value)} required />
      </Field>
      <Field label="Provider">
        <Input value={provider} onChange={(event) => setProvider(event.target.value)} />
      </Field>
      <Field label="Status">
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as AssetRecord['status'])}
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
        </Select>
      </Field>
      <Field label="Expires">
        <Input
          type="date"
          value={expiresAt}
          onChange={(event) => setExpiresAt(event.target.value)}
        />
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </div>
    </form>
  )
}
