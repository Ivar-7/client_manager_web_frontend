import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'admin' | 'member'
export type ClientStatus = 'onboarding' | 'active' | 'inactive'
export type ClientPriority = 'low' | 'medium' | 'high'
export type StageStatus = 'pending' | 'inProgress' | 'blocked' | 'approved' | 'rejected'
export type AssetType = 'domain' | 'hosting' | 'dns'
export type AssetStatus = 'active' | 'pending' | 'expired' | 'suspended'
export type EntityType = 'client' | 'stage' | 'checklistItem' | 'asset' | 'meetingNote'

export const STAGE_NAMES = [
  'Intake & Discovery',
  'Account Setup',
  'Content Collection',
  'Review & Approval',
  'Go Live',
] as const

interface BaseEntity {
  id: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export interface UserRecord {
  id: string
  name: string
  email: string
  role: UserRole
  avatarInitials: string
}

export interface ClientRecord extends BaseEntity {
  name: string
  email: string
  phone: string
  website: string
  companyName: string
  industry: string
  notes: string
  status: ClientStatus
  priority: ClientPriority
  tags: string[]
  onboardingStage: number
  ownerId: string | null
}

export interface StageRecord extends BaseEntity {
  clientId: string
  name: string
  order: number
  status: StageStatus
  dueDate: Timestamp | null
  completedAt: Timestamp | null
  actionedById: string | null
  comment: string
}

export interface ChecklistTemplateRecord extends BaseEntity {
  label: string
  description: string
  order: number
  stageOrder: number
  required: boolean
  active: boolean
}

export interface ChecklistItemRecord extends BaseEntity {
  clientId: string
  stageId: string
  templateId: string | null
  label: string
  order: number
  required: boolean
  completed: boolean
  completedAt: Timestamp | null
  completedBy: string | null
  assignedTo: string | null
  dueDate: Timestamp | null
  priority: ClientPriority
  notes: string
}

export interface AssetRecord extends BaseEntity {
  clientId: string
  type: AssetType
  name: string
  value: string
  status: AssetStatus
  provider: string
  notes: string
  managedBy: string | null
  expiresAt: Timestamp | null
}

export interface ActionItem {
  id: string
  text: string
  assignedTo: string | null
  completed: boolean
}

export interface MeetingNoteRecord extends BaseEntity {
  clientId: string
  title: string
  date: Timestamp | null
  notes: string
  createdBy: string
  attendees: string[]
  linkedStageId: string | null
  actionItems: ActionItem[]
}

export interface ActivityLogRecord {
  id: string
  clientId: string
  actorId: string
  actorName: string
  action: string
  entityType: EntityType
  entityId: string
  timestamp: Timestamp | null
}

export type ClientInput = Omit<
  ClientRecord,
  'id' | 'createdAt' | 'updatedAt' | 'onboardingStage' | 'status'
>
export type StageInput = Omit<StageRecord, 'id' | 'createdAt' | 'updatedAt'>
export type ChecklistTemplateInput = Omit<ChecklistTemplateRecord, 'id' | 'createdAt' | 'updatedAt'>
export type ChecklistItemInput = Omit<ChecklistItemRecord, 'id' | 'createdAt' | 'updatedAt'>
export type AssetInput = Omit<AssetRecord, 'id' | 'createdAt' | 'updatedAt'>
export type MeetingNoteInput = Omit<MeetingNoteRecord, 'id' | 'createdAt' | 'updatedAt'>
