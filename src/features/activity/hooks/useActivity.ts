import { useAuth } from '../../../app/providers/useAuth'
import { useActivityLog } from '../../../shared/api/activityLog.api'
import { useMemberClientIds } from '../../../shared/api/clients.api'
import type { ActivityFilterState } from '../types/activity.types'

const PAGE_SIZE = 50

export function useActivity(filters: ActivityFilterState) {
  const { isAdmin, firebaseUser } = useAuth()
  const memberClientIds = useMemberClientIds(isAdmin, firebaseUser?.uid)

  return useActivityLog(PAGE_SIZE, {
    clientId: filters.clientId || undefined,
    entityType: filters.entityType || undefined,
    actorId: filters.actorId || undefined,
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    clientIds: isAdmin ? undefined : memberClientIds,
  })
}
