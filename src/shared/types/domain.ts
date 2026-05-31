export type UserRole = 'admin' | 'manager' | 'member'
export type ClientStatus = 'onboarding' | 'active' | 'inactive'
export type StageStatus = 'pending' | 'inProgress' | 'blocked' | 'approved' | 'rejected'
export type AssetType = 'domain' | 'hosting' | 'dns'
export type AssetStatus = 'active' | 'pending' | 'expired' | 'suspended'

export interface UserRecord {
  id: string
  name: string
  email: string
  role: UserRole
}

interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface ClientRecord extends BaseEntity {
  name: string
  email: string
  phone: string
  website: string
  status: ClientStatus
  ownerId?: string | null
}

export interface StageRecord extends BaseEntity {
  clientId: string
  name: string
  order: number
  status: StageStatus
  dueDate?: string | null
  completedAt?: string | null
  actionedById?: string | null
  comment?: string
}

export interface ChecklistItemRecord extends BaseEntity {
  stageId: string
  meetingId?: string | null
  label: string
  order: number
  completed: boolean
  assignedTo?: string | null
  dueDate?: string | null
  completedAt?: string | null
}

export interface AssetRecord extends BaseEntity {
  clientId: string
  type: AssetType
  name: string
  value: string
  status: AssetStatus
  expiresAt?: string | null
}

export interface MeetingNoteRecord extends BaseEntity {
  clientId: string
  title: string
  date: string
  notes: string
  createdBy: string
  attendees: string[]
}

export interface WorkspaceState {
  users: UserRecord[]
  clients: ClientRecord[]
  stages: StageRecord[]
  checklistItems: ChecklistItemRecord[]
  assetRecords: AssetRecord[]
  meetingNotes: MeetingNoteRecord[]
}

export type WorkspaceCollection = keyof WorkspaceState

export type ClientInput = Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>
export type StageInput = Omit<StageRecord, 'id' | 'createdAt' | 'updatedAt'>
export type ChecklistItemInput = Omit<ChecklistItemRecord, 'id' | 'createdAt' | 'updatedAt'>
export type AssetInput = Omit<AssetRecord, 'id' | 'createdAt' | 'updatedAt'>
export type MeetingInput = Omit<MeetingNoteRecord, 'id' | 'createdAt' | 'updatedAt'>
