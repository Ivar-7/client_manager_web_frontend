import { useAuth } from '../../../app/providers/useAuth'
import { useAssets } from '../../../shared/api/assets.api'
import { useMemberClientIds } from '../../../shared/api/clients.api'
import type { InfrastructureFilterState } from '../types/infrastructure.types'

const PAGE_SIZE = 25

export function useInfrastructure(filters: InfrastructureFilterState) {
  const { isAdmin, firebaseUser } = useAuth()
  const memberClientIds = useMemberClientIds(isAdmin, firebaseUser?.uid)

  return useAssets(PAGE_SIZE, {
    type: filters.type || undefined,
    status: filters.status || undefined,
    expiringWithinDays: filters.expiringWithin30Days ? 30 : undefined,
    clientIds: isAdmin ? undefined : memberClientIds,
  })
}
