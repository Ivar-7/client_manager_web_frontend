import {
  useClientsList as useClientsListQuery,
  useMemberClientIds,
} from '../../../shared/api/clients.api'
import { useAuth } from '../../../app/providers/useAuth'
import type { ClientsFilterState } from '../types/clients.types'

const PAGE_SIZE = 20

export function useClients(filters: ClientsFilterState) {
  const { isAdmin, firebaseUser } = useAuth()
  const memberClientIds = useMemberClientIds(isAdmin, firebaseUser?.uid)

  return useClientsListQuery(PAGE_SIZE, {
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    search: filters.search || undefined,
    sort: filters.sort,
    clientIds: isAdmin ? undefined : memberClientIds,
  })
}
