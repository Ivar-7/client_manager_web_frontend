import type { AssetStatus, AssetType } from '../../../shared/types/domain.types'

export interface InfrastructureFilterState {
  type: AssetType | ''
  status: AssetStatus | ''
  expiringWithin30Days: boolean
}

export const DEFAULT_INFRASTRUCTURE_FILTER: InfrastructureFilterState = {
  type: '',
  status: '',
  expiringWithin30Days: false,
}
