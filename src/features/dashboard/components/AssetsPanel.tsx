import { Badge, Button, EmptyState, Field, Panel } from '../../../shared/components/UI'
import { formatDate, toLocalDateInputValue } from '../../../shared/utils/dates'
import { assetStatusOptions, assetTone, assetTypeLabels, assetTypeOptions } from '../constants/dashboardOptions'
import type { AssetInput, AssetRecord, AssetType } from '../../../shared/types/domain'

interface AssetsPanelProps {
  assetForm: AssetInput
  onAssetFormChange: (updater: (previous: AssetInput) => AssetInput) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  selectedAssets: AssetRecord[]
}

export function AssetsPanel({ assetForm, onAssetFormChange, onSubmit, selectedAssets }: AssetsPanelProps) {
  return (
    <Panel title="Infrastructure" subtitle="Keep domain, hosting, and DNS records in sync.">
      <form className="stack stack--tight" onSubmit={onSubmit}>
        <div className="grid-form grid-form--compact">
          <Field label="Type">
            <select
              value={assetForm.type}
              onChange={(event) =>
                onAssetFormChange((previous) => ({ ...previous, type: event.target.value as AssetType }))
              }
            >
              {assetTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {assetTypeLabels[type]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Name">
            <input
              value={assetForm.name}
              onChange={(event) => onAssetFormChange((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="Primary domain"
            />
          </Field>
          <Field label="Value">
            <input
              value={assetForm.value}
              onChange={(event) => onAssetFormChange((previous) => ({ ...previous, value: event.target.value }))}
              placeholder="example.com"
            />
          </Field>
          <Field label="Status">
            <select
              value={assetForm.status}
              onChange={(event) =>
                onAssetFormChange((previous) => ({
                  ...previous,
                  status: event.target.value as AssetInput['status'],
                }))
              }
            >
              {assetStatusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Expires">
          <input
            type="date"
            value={toLocalDateInputValue(assetForm.expiresAt)}
            onChange={(event) =>
              onAssetFormChange((previous) => ({
                ...previous,
                expiresAt: event.target.value ? new Date(event.target.value).toISOString() : null,
              }))
            }
          />
        </Field>
        <div className="form-actions">
          <Button type="submit">Add record</Button>
        </div>
      </form>

      <div className="stack">
        {selectedAssets.length === 0 ? (
          <EmptyState
            title="No records yet"
            description="Create a domain, hosting, or DNS record to keep the launch team aligned."
          />
        ) : (
          selectedAssets.map((asset) => (
            <article key={asset.id} className="list-card">
              <div className="list-card__top">
                <div>
                  <strong>{asset.name}</strong>
                  <p>{asset.value}</p>
                </div>
                <Badge tone={assetTone[asset.status]}>
                  {assetTypeLabels[asset.type]} · {asset.status}
                </Badge>
              </div>
              <p>Expires {formatDate(asset.expiresAt)}</p>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
