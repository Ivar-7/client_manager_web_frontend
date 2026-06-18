import { Badge } from '../../../shared/components/Badge'
import { Card } from '../../../shared/components/Card'
import { formatDate, isExpiringSoon } from '../../../shared/utils/dates'
import type { AssetRecord } from '../../../shared/types/domain.types'

export function AssetGroup({ clientName, assets }: { clientName: string; assets: AssetRecord[] }) {
  return (
    <Card title={clientName}>
      <div className="grid gap-2">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong p-3"
          >
            <div className="min-w-0">
              <strong className="block text-sm text-text">{asset.name}</strong>
              <p className="mt-0.5 text-xs text-muted">
                {asset.type} &middot; {asset.value} &middot; {asset.provider}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5">
              <Badge tone="neutral">{asset.status}</Badge>
              {asset.expiresAt ? (
                <Badge tone={isExpiringSoon(asset.expiresAt) ? 'warning' : 'neutral'}>
                  Expires {formatDate(asset.expiresAt)}
                </Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
