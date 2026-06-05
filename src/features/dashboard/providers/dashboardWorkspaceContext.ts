import { createContext, useContext } from 'react'

import type {
  AssetInput,
  AssetRecord,
  ChecklistTemplateInput,
  ChecklistTemplateRecord,
  ChecklistItemInput,
  ChecklistItemRecord,
  ClientInput,
  ClientRecord,
  MeetingInput,
  MeetingNoteRecord,
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
  createChecklistTemplate: (input: ChecklistTemplateInput) => Promise<ChecklistTemplateRecord>
  updateChecklistTemplate: (
    templateId: string,
    patch: Partial<ChecklistTemplateInput>,
  ) => Promise<void>
  deleteChecklistTemplate: (templateId: string) => Promise<void>
  initializeClientChecklist: (
    clientId: string,
    includeTemplate?: ChecklistTemplateRecord,
  ) => Promise<void>
  createChecklistItem: (input: ChecklistItemInput) => Promise<ChecklistItemRecord>
  toggleChecklistItem: (itemId: string, completed: boolean) => Promise<void>
  deleteChecklistItem: (itemId: string) => Promise<void>
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
