import {
  addDoc,
  collection,
  deleteDoc,
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
import type { AssetInput, AssetRecord, AssetStatus, AssetType } from '../types/domain.types'

const COLLECTION = 'assetRecords'

function mapDoc(document: { id: string; data: () => Record<string, unknown> }): AssetRecord {
  return { id: document.id, ...document.data() } as AssetRecord
}

export interface AssetFilters {
  clientId?: string
  clientIds?: string[]
  type?: AssetType
  status?: AssetStatus
  expiringWithinDays?: number
}

export function useAssets(pageSize: number, filters: AssetFilters) {
  const resetKey = JSON.stringify(filters)

  return usePaginatedCollection<AssetRecord>(
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
      if (filters.type) constraints.push(where('type', '==', filters.type))
      if (filters.status) constraints.push(where('status', '==', filters.status))
      if (filters.expiringWithinDays !== undefined) {
        const cutoff = new Date(Date.now() + filters.expiringWithinDays * 86400000)
        constraints.push(where('expiresAt', '<=', Timestamp.fromDate(cutoff)))
        constraints.push(where('expiresAt', '>=', Timestamp.fromDate(new Date())))
      }
      return constraints
    },
    filters.expiringWithinDays !== undefined ? 'expiresAt' : 'updatedAt',
    filters.expiringWithinDays !== undefined ? 'asc' : 'desc',
    pageSize,
    mapDoc,
    resetKey,
  )
}

export async function createAsset(input: AssetInput, actorId: string, actorName: string) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  logActivity({
    clientId: input.clientId,
    actorId,
    actorName,
    action: `added asset "${input.name}"`,
    entityType: 'asset',
    entityId: docRef.id,
  })
}

export async function updateAsset(
  assetId: string,
  patch: Partial<AssetInput>,
  clientId: string,
  actorId: string,
  actorName: string,
) {
  await updateDoc(doc(db, COLLECTION, assetId), { ...patch, updatedAt: serverTimestamp() })

  logActivity({
    clientId,
    actorId,
    actorName,
    action: `updated asset "${patch.name ?? ''}"`.trim(),
    entityType: 'asset',
    entityId: assetId,
  })
}

export async function deleteAsset(assetId: string) {
  await deleteDoc(doc(db, COLLECTION, assetId))
}
