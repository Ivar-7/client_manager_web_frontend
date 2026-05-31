import { createContext, useContext } from 'react'

import type {
  AssetInput,
  AssetRecord,
  ChecklistItemInput,
  ChecklistItemRecord,
  ClientInput,
  ClientRecord,
  MeetingInput,
  MeetingNoteRecord,
  StageInput,
  StageRecord,
  UserRecord,
  WorkspaceState,
} from '../../../shared/types/domain'

export interface WorkspaceContextValue {
  mode: 'firebase' | 'demo'
  status: 'loading' | 'ready' | 'error'
  error: string | null
  currentUser: UserRecord | null
  workspace: WorkspaceState
  createClient: (input: ClientInput) => Promise<ClientRecord>
  updateClient: (clientId: string, patch: Partial<ClientInput>) => Promise<void>
  createStage: (input: StageInput) => Promise<StageRecord>
  updateStageStatus: (
    stageId: string,
    status: StageRecord['status'],
    comment?: string,
  ) => Promise<void>
  createChecklistItem: (input: ChecklistItemInput) => Promise<ChecklistItemRecord>
  toggleChecklistItem: (itemId: string, completed: boolean) => Promise<void>
  createAssetRecord: (input: AssetInput) => Promise<AssetRecord>
  createMeetingNote: (input: MeetingInput) => Promise<MeetingNoteRecord>
  seedSampleWorkspace: () => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useDashboardWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useDashboardWorkspace must be used within DashboardWorkspaceProvider')
  }

  return context
}
