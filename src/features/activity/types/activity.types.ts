import type { EntityType } from '../../../shared/types/domain.types'

export interface ActivityFilterState {
  clientId: string
  entityType: EntityType | ''
  actorId: string
  startDate: string
  endDate: string
}

export const DEFAULT_ACTIVITY_FILTER: ActivityFilterState = {
  clientId: '',
  entityType: '',
  actorId: '',
  startDate: '',
  endDate: '',
}
