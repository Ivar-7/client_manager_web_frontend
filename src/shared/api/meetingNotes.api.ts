import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type QueryConstraint,
} from 'firebase/firestore'

import { db } from './firebaseClient'
import { logActivity } from './activityLog.api'
import { usePaginatedCollection } from './pagination'
import type { ActionItem, MeetingNoteInput, MeetingNoteRecord } from '../types/domain.types'

const COLLECTION = 'meetingNotes'

function mapDoc(document: { id: string; data: () => Record<string, unknown> }): MeetingNoteRecord {
  return { id: document.id, ...document.data() } as MeetingNoteRecord
}

export interface MeetingFilters {
  clientId?: string
  clientIds?: string[]
  stageId?: string
  startDate?: Date
  endDate?: Date
}

export function useMeetingNotes(pageSize: number, filters: MeetingFilters) {
  const resetKey = JSON.stringify(filters)

  return usePaginatedCollection<MeetingNoteRecord>(
    db,
    COLLECTION,
    () => {
      const constraints: QueryConstraint[] = []
      if (filters.clientId) constraints.push(where('clientId', '==', filters.clientId))
      if (filters.clientIds) {
        constraints.push(
          where(
            'clientId',
            'in',
            filters.clientIds.length > 0 ? filters.clientIds.slice(0, 30) : ['__none__'],
          ),
        )
      }
      if (filters.stageId) constraints.push(where('linkedStageId', '==', filters.stageId))
      if (filters.startDate)
        constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)))
      if (filters.endDate)
        constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)))
      return constraints
    },
    'date',
    'desc',
    pageSize,
    mapDoc,
    resetKey,
  )
}

export async function createMeetingNote(
  input: MeetingNoteInput,
  actorId: string,
  actorName: string,
) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  logActivity({
    clientId: input.clientId,
    actorId,
    actorName,
    action: `logged meeting note "${input.title}"`,
    entityType: 'meetingNote',
    entityId: docRef.id,
  })
}

export async function updateMeetingNote(
  meetingId: string,
  patch: Partial<MeetingNoteInput>,
  clientId: string,
  actorId: string,
  actorName: string,
) {
  await updateDoc(doc(db, COLLECTION, meetingId), { ...patch, updatedAt: serverTimestamp() })

  logActivity({
    clientId,
    actorId,
    actorName,
    action: `updated meeting note "${patch.title ?? ''}"`.trim(),
    entityType: 'meetingNote',
    entityId: meetingId,
  })
}

export async function toggleMeetingActionItem(
  meeting: MeetingNoteRecord,
  actionItemId: string,
  completed: boolean,
  actorId: string,
  actorName: string,
) {
  const nextActionItems: ActionItem[] = meeting.actionItems.map((item) =>
    item.id === actionItemId ? { ...item, completed } : item,
  )

  await updateDoc(doc(db, COLLECTION, meeting.id), {
    actionItems: nextActionItems,
    updatedAt: serverTimestamp(),
  })

  logActivity({
    clientId: meeting.clientId,
    actorId,
    actorName,
    action: `${completed ? 'completed' : 're-opened'} action item on "${meeting.title}"`,
    entityType: 'meetingNote',
    entityId: meeting.id,
  })
}
