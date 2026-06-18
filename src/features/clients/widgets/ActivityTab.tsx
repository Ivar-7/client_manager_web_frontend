import { useActivityLog } from '../../../shared/api/activityLog.api'
import { ActivityRow } from '../../../shared/components/ActivityRow'
import { Card } from '../../../shared/components/Card'
import { LoadMore } from '../../../shared/components/Pagination'
import { EmptyState, LoadingState } from '../../../shared/components/States'

export function ActivityTab({ clientId }: { clientId: string }) {
  const { items, status, hasNextPage, nextPage } = useActivityLog(25, { clientId })

  if (status === 'loading') {
    return (
      <LoadingState title="Loading activity" description="Fetching this client's activity log." />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState title="No activity yet" description="Actions on this client will show up here." />
    )
  }

  return (
    <Card>
      {items.map((entry) => (
        <ActivityRow key={entry.id} entry={entry} showEntityBadge />
      ))}
      <LoadMore hasNextPage={hasNextPage} onLoadMore={nextPage} />
    </Card>
  )
}
