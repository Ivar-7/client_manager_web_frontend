import {
  collection,
  doc,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from './firebaseClient'
import { mapFirestoreError } from './errors'
import { logActivity } from './activityLog.api'
import type { FetchStatus } from './pagination'
import type { ChecklistItemRecord, StageRecord, StageStatus } from '../types/domain.types'

const COLLECTION = 'stages'

function mapDoc(document: { id: string; data: () => Record<string, unknown> }): StageRecord {
  return { id: document.id, ...document.data() } as StageRecord
}

export function useClientStages(clientId: string | null) {
  const [stages, setStages] = useState<StageRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) {
      setStages([])
      setStatus('empty')
      return
    }

    setStatus('loading')
    const builtQuery = query(
      collection(db, COLLECTION),
      where('clientId', '==', clientId),
      orderBy('order'),
    )
    const unsubscribe = onSnapshot(
      builtQuery,
      (snapshot) => {
        const items = snapshot.docs.map(mapDoc)
        setStages(items)
        setStatus(items.length === 0 ? 'empty' : 'success')
        setError(null)
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )
    return unsubscribe
  }, [clientId])

  return { stages, status, error }
}

export async function getStagesByIds(stageIds: string[]): Promise<StageRecord[]> {
  const uniqueIds = Array.from(new Set(stageIds.filter(Boolean)))
  if (uniqueIds.length === 0) return []

  const chunks: string[][] = []
  for (let i = 0; i < uniqueIds.length; i += 30) chunks.push(uniqueIds.slice(i, i + 30))

  const results = await Promise.all(
    chunks.map((chunk) =>
      getDocs(query(collection(db, COLLECTION), where(documentId(), 'in', chunk))),
    ),
  )
  return results.flatMap((snapshot) => snapshot.docs.map(mapDoc))
}

/** Clients with at least one blocked stage, oldest first — feeds the Overview Blocked Pipeline panel. */
export function useBlockedStages() {
  const [stages, setStages] = useState<StageRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')

  useEffect(() => {
    const builtQuery = query(
      collection(db, COLLECTION),
      where('status', '==', 'blocked'),
      orderBy('updatedAt', 'asc'),
      limit(20),
    )
    const unsubscribe = onSnapshot(
      builtQuery,
      (snapshot) => {
        const items = snapshot.docs.map(mapDoc)
        setStages(items)
        setStatus(items.length === 0 ? 'empty' : 'success')
      },
      (snapshotError) => {
        mapFirestoreError(snapshotError)
        setStatus('error')
      },
    )
    return unsubscribe
  }, [])

  return { stages, status }
}

export function canMoveToInProgress(stages: StageRecord[], stage: StageRecord): boolean {
  if (stage.order === 1) return true
  const previousStage = stages.find((candidate) => candidate.order === stage.order - 1)
  return previousStage?.status === 'approved'
}

export function getOutstandingRequiredItems(
  checklistItems: ChecklistItemRecord[],
  stageId: string,
): ChecklistItemRecord[] {
  return checklistItems.filter(
    (item) => item.stageId === stageId && item.required && !item.completed,
  )
}

export async function updateStageStatus(
  stage: StageRecord,
  nextStatus: StageStatus,
  actorId: string,
  actorName: string,
  checklistItems: ChecklistItemRecord[],
): Promise<{ ok: true } | { ok: false; reason: string; outstanding: ChecklistItemRecord[] }> {
  if (nextStatus === 'approved') {
    const outstanding = getOutstandingRequiredItems(checklistItems, stage.id)
    if (outstanding.length > 0) {
      return {
        ok: false,
        reason: `${outstanding.length} required checklist item(s) are still incomplete.`,
        outstanding,
      }
    }
  }

  const batch = writeBatch(db)
  batch.update(doc(db, COLLECTION, stage.id), {
    status: nextStatus,
    actionedById: actorId,
    completedAt: nextStatus === 'approved' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })

  if (nextStatus === 'inProgress') {
    batch.update(doc(db, 'clients', stage.clientId), {
      onboardingStage: stage.order,
      updatedAt: serverTimestamp(),
    })
  }

  if (nextStatus === 'approved' && stage.order === 5) {
    batch.update(doc(db, 'clients', stage.clientId), {
      status: 'active',
      updatedAt: serverTimestamp(),
    })
  }

  await batch.commit()

  logActivity({
    clientId: stage.clientId,
    actorId,
    actorName,
    action: `changed stage "${stage.name}" to ${nextStatus}`,
    entityType: 'stage',
    entityId: stage.id,
  })

  if (nextStatus === 'approved' && stage.order === 5) {
    logActivity({
      clientId: stage.clientId,
      actorId,
      actorName,
      action: 'reached Go Live — client is now active',
      entityType: 'client',
      entityId: stage.clientId,
    })
  }

  return { ok: true }
}

/**
 * Called after a checklist item toggle. Auto-approves a stage once every required
 * item is complete, and auto-starts the next stage — so members never need an
 * admin-only status change to progress an onboarding they're fully checked off.
 * Also reverts an auto-approved stage back to inProgress if an item is re-opened.
 */
export async function maybeAutoAdvanceStage(
  stage: StageRecord,
  allStages: StageRecord[],
  items: ChecklistItemRecord[],
  actorId: string,
  actorName: string,
) {
  const outstanding = getOutstandingRequiredItems(items, stage.id)

  if (outstanding.length === 0 && (stage.status === 'pending' || stage.status === 'inProgress')) {
    await updateStageStatus(stage, 'approved', actorId, actorName, items)

    const nextStage = allStages.find((candidate) => candidate.order === stage.order + 1)
    if (nextStage && nextStage.status === 'pending') {
      await updateStageStatus(nextStage, 'inProgress', actorId, actorName, items)
    }
    return
  }

  if (outstanding.length > 0 && stage.status === 'approved') {
    await updateStageStatus(stage, 'inProgress', actorId, actorName, items)
  }
}

export async function updateStageDueDate(stage: StageRecord, dueDate: Date | null) {
  await updateDoc(doc(db, COLLECTION, stage.id), {
    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
    updatedAt: serverTimestamp(),
  })
}

export async function updateStageComment(stage: StageRecord, comment: string) {
  await updateDoc(doc(db, COLLECTION, stage.id), {
    comment,
    updatedAt: serverTimestamp(),
  })
}
