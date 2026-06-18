import {
  addDoc,
  collection,
  Timestamp,
  type QueryConstraint,
  serverTimestamp,
  where,
} from 'firebase/firestore'

import { db } from './firebaseClient'
import { useInfiniteCollection } from './pagination'
import type { ActivityLogRecord, EntityType } from '../types/domain.types'

const COLLECTION = 'activityLog'

export interface LogActivityInput {
  clientId: string
  actorId: string
  actorName: string
  action: string
  entityType: EntityType
  entityId: string
}

/** Fire-and-forget. Never throws, never blocks the caller's main write. */
export function logActivity(input: LogActivityInput) {
  addDoc(collection(db, COLLECTION), {
    ...input,
    actorName: input.actorName || 'Unknown user',
    timestamp: serverTimestamp(),
  }).catch((error) => {
    console.error('Failed to write activity log entry', error)
  })
}

function mapDoc(doc: { id: string; data: () => Record<string, unknown> }): ActivityLogRecord {
  return { id: doc.id, ...doc.data() } as ActivityLogRecord
}

export interface ActivityFilters {
  clientId?: string
  clientIds?: string[]
  entityType?: EntityType
  actorId?: string
  startDate?: Date
  endDate?: Date
}

export function useActivityLog(pageSize: number, filters: ActivityFilters) {
  const resetKey = JSON.stringify(filters)
  const validClientIds = filters.clientIds?.filter(Boolean)
  const enabled = !filters.clientIds || validClientIds!.length > 0

  return useInfiniteCollection<ActivityLogRecord>(
    db,
    COLLECTION,
    () => {
      const constraints: QueryConstraint[] = []
      if (filters.clientId) constraints.push(where('clientId', '==', filters.clientId))
      if (validClientIds && validClientIds.length > 0) {
        constraints.push(where('clientId', 'in', validClientIds.slice(0, 30)))
      }
      if (filters.entityType) constraints.push(where('entityType', '==', filters.entityType))
      if (filters.actorId) constraints.push(where('actorId', '==', filters.actorId))
      if (filters.startDate)
        constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)))
      if (filters.endDate)
        constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)))
      return constraints
    },
    'timestamp',
    'desc',
    pageSize,
    mapDoc,
    resetKey,
    enabled,
  )
}
