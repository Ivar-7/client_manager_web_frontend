import type { AssetInput, AssetType, ClientInput, ClientRecord, OnboardingStage } from '../../../shared/types/domain'

export const clientStatusTone: Record<ClientRecord['status'], 'positive' | 'warning' | 'neutral'> = {
  onboarding: 'warning',
  active: 'positive',
  inactive: 'neutral',
}

export const stageTone: Record<OnboardingStage, 'neutral' | 'positive' | 'warning' | 'danger' | 'accent'> = {
  intake: 'neutral',
  accountSetup: 'accent',
  contentCollection: 'warning',
  review: 'danger',
  goLive: 'positive',
}

export const assetTone: Record<AssetInput['status'], 'positive' | 'warning' | 'danger' | 'neutral'> = {
  active: 'positive',
  pending: 'warning',
  expired: 'danger',
  suspended: 'neutral',
}

export const assetTypeLabels: Record<AssetType, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  dns: 'DNS',
}

export const onboardingStageOptions: Array<{ label: string; value: OnboardingStage }> = [
  { label: 'Intake', value: 'intake' },
  { label: 'Account setup', value: 'accountSetup' },
  { label: 'Content collection', value: 'contentCollection' },
  { label: 'Review', value: 'review' },
  { label: 'Go live', value: 'goLive' },
]

export const clientStatusOptions: ClientInput['status'][] = ['onboarding', 'active', 'inactive']
export const assetTypeOptions: AssetType[] = ['domain', 'hosting', 'dns']
export const assetStatusOptions: AssetInput['status'][] = ['active', 'pending', 'expired', 'suspended']
