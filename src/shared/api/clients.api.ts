import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type OrderByDirection,
  type QueryConstraint,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from './firebaseClient'
import { mapFirestoreError } from './errors'
import { logActivity } from './activityLog.api'
import { stampChecklistFromTemplates } from './checklistItems.api'
import { getActiveChecklistTemplates } from './checklistTemplates.api'
import { usePaginatedCollection, type FetchStatus } from './pagination'
import { STAGE_NAMES } from '../types/domain.types'
import type { ClientInput, ClientPriority, ClientRecord, ClientStatus } from '../types/domain.types'

const COLLECTION = 'clients'

const PRIORITY_RANK: Record<ClientPriority, number> = { low: 0, medium: 1, high: 2 }

function mapDoc(document: { id: string; data: () => Record<string, unknown> }): ClientRecord {
  return { id: document.id, ...document.data() } as ClientRecord
}

function buildSearchTokens(input: {
  name: string
  email: string
  companyName: string
  tags: string[]
}): string[] {
  const words = `${input.name} ${input.email} ${input.companyName}`
    .toLowerCase()
    .split(/[\s@.]+/)
    .filter(Boolean)
  const tagTokens = input.tags.map((tag) => tag.toLowerCase())
  return Array.from(new Set([...words, ...tagTokens]))
}

export type ClientSort = 'name' | 'updatedAt' | 'priority'

export interface ClientFilters {
  status?: ClientStatus
  priority?: ClientPriority
  search?: string
  sort: ClientSort
  clientIds?: string[]
}

const SORT_FIELD: Record<ClientSort, string> = {
  name: 'name',
  updatedAt: 'updatedAt',
  priority: 'priorityRank',
}

const SORT_DIRECTION: Record<ClientSort, OrderByDirection> = {
  name: 'asc',
  updatedAt: 'desc',
  priority: 'desc',
}

/** Admin: all clients, paginated. Member: pass `clientIds` to scope to assigned clients. */
export function useClientsList(pageSize: number, filters: ClientFilters) {
  const resetKey = JSON.stringify(filters)
  const validClientIds = filters.clientIds?.filter(Boolean)
  const enabled = !filters.clientIds || validClientIds!.length > 0

  return usePaginatedCollection<ClientRecord>(
    db,
    COLLECTION,
    () => {
      const constraints: QueryConstraint[] = []
      if (filters.status) constraints.push(where('status', '==', filters.status))
      if (filters.priority) constraints.push(where('priority', '==', filters.priority))
      if (filters.search)
        constraints.push(
          where('searchTokens', 'array-contains', filters.search.toLowerCase().trim()),
        )
      if (validClientIds && validClientIds.length > 0) {
        constraints.push(where(documentId(), 'in', validClientIds.slice(0, 30)))
      }
      return constraints
    },
    SORT_FIELD[filters.sort],
    SORT_DIRECTION[filters.sort],
    pageSize,
    mapDoc,
    resetKey,
    enabled,
  )
}

export function useClientDoc(clientId: string | null) {
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) {
      setClient(null)
      setStatus('empty')
      return
    }

    setStatus('loading')
    const unsubscribe = onSnapshot(
      doc(db, COLLECTION, clientId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setClient(null)
          setStatus('empty')
          return
        }
        setClient({ id: snapshot.id, ...snapshot.data() } as ClientRecord)
        setStatus('success')
        setError(null)
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )
    return unsubscribe
  }, [clientId])

  return { client, status, error }
}

/** Used to populate client filter dropdowns — capped, not the full collection. */
export async function getClientsForFilterDropdown(): Promise<ClientRecord[]> {
  const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy('name'), limit(200)))
  return snapshot.docs.map(mapDoc)
}

export async function getClientsByIds(clientIds: string[]): Promise<ClientRecord[]> {
  const uniqueIds = Array.from(new Set(clientIds.filter(Boolean)))
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

export async function updateClient(
  clientId: string,
  patch: Partial<ClientInput>,
  actorId: string,
  actorName: string,
) {
  const payload: Record<string, unknown> = { ...patch, updatedAt: serverTimestamp() }
  if (patch.name || patch.email || patch.companyName || patch.tags) {
    payload.searchTokens = buildSearchTokens({
      name: patch.name ?? '',
      email: patch.email ?? '',
      companyName: patch.companyName ?? '',
      tags: patch.tags ?? [],
    })
  }
  if (patch.priority) {
    payload.priorityRank = PRIORITY_RANK[patch.priority]
  }

  await updateDoc(doc(db, COLLECTION, clientId), payload)

  logActivity({
    clientId,
    actorId,
    actorName,
    action: 'updated client details',
    entityType: 'client',
    entityId: clientId,
  })
}

/** Creates the client, its 5 stages, and stamps the active checklist templates onto them. */
export async function createClientWithOnboarding(
  input: ClientInput,
  actorId: string,
  actorName: string,
): Promise<string> {
  const templates = await getActiveChecklistTemplates()

  const clientRef = doc(collection(db, COLLECTION))
  const batch = writeBatch(db)

  batch.set(clientRef, {
    ...input,
    status: 'onboarding' satisfies ClientStatus,
    onboardingStage: 1,
    priorityRank: PRIORITY_RANK[input.priority],
    searchTokens: buildSearchTokens(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const stageIdsByOrder: Record<number, string> = {}
  STAGE_NAMES.forEach((name, index) => {
    const order = index + 1
    const stageRef = doc(collection(db, 'stages'))
    stageIdsByOrder[order] = stageRef.id
    batch.set(stageRef, {
      clientId: clientRef.id,
      name,
      order,
      status: order === 1 ? 'inProgress' : 'pending',
      dueDate: null,
      completedAt: null,
      actionedById: null,
      comment: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()

  if (templates.length > 0) {
    await stampChecklistFromTemplates(clientRef.id, stageIdsByOrder, templates)
  }

  logActivity({
    clientId: clientRef.id,
    actorId,
    actorName,
    action: `created client "${input.name}"`,
    entityType: 'client',
    entityId: clientRef.id,
  })

  return clientRef.id
}

const CHILD_COLLECTIONS = ['stages', 'checklistItems', 'assetRecords', 'meetingNotes']

/**
 * Deletes the client and every stage/checklist item/asset/meeting note tied
 * to it. The activity log is append-only and is intentionally left intact.
 */
export async function deleteClient(
  clientId: string,
  actorId: string,
  actorName: string,
  clientName: string,
) {
  for (const collectionName of CHILD_COLLECTIONS) {
    const snapshot = await getDocs(
      query(collection(db, collectionName), where('clientId', '==', clientId)),
    )
    const docs = snapshot.docs
    for (let i = 0; i < docs.length; i += 450) {
      const batch = writeBatch(db)
      docs.slice(i, i + 450).forEach((document) => batch.delete(document.ref))
      await batch.commit()
    }
  }

  await deleteDoc(doc(db, COLLECTION, clientId))

  logActivity({
    clientId,
    actorId,
    actorName,
    action: `deleted client "${clientName}"`,
    entityType: 'client',
    entityId: clientId,
  })
}

/**
 * One-click "assign this client to a member": sets them as owner and bulk-assigns
 * any currently-unassigned checklist items to them, across every stage. Items
 * already assigned to someone else are left alone.
 */
export async function assignClientToMember(
  clientId: string,
  clientName: string,
  userId: string,
  actorId: string,
  actorName: string,
) {
  const unassignedSnapshot = await getDocs(
    query(
      collection(db, 'checklistItems'),
      where('clientId', '==', clientId),
      where('assignedTo', '==', null),
    ),
  )

  const batch = writeBatch(db)
  batch.update(doc(db, COLLECTION, clientId), { ownerId: userId, updatedAt: serverTimestamp() })
  unassignedSnapshot.docs.forEach((document) => {
    batch.update(document.ref, { assignedTo: userId, updatedAt: serverTimestamp() })
  })
  await batch.commit()

  logActivity({
    clientId,
    actorId,
    actorName,
    action: `assigned client "${clientName}" to a team member`,
    entityType: 'client',
    entityId: clientId,
  })
}

export async function getClientMemberClientIds(uid: string): Promise<string[]> {
  const [checklistSnapshot, ownedSnapshot] = await Promise.all([
    getDocs(query(collection(db, 'checklistItems'), where('assignedTo', '==', uid))),
    getDocs(query(collection(db, COLLECTION), where('ownerId', '==', uid))),
  ])
  const checklistClientIds = checklistSnapshot.docs.map(
    (document) => document.data().clientId as string | undefined,
  )
  const ownedClientIds = ownedSnapshot.docs.map((document) => document.id)
  return Array.from(
    new Set([...checklistClientIds, ...ownedClientIds].filter((id): id is string => Boolean(id))),
  )
}

/**
 * Resolves the set of clientIds a member has checklist items on, scoped by uid.
 * Pass `isAdmin: true` to skip the lookup entirely (admins are unscoped).
 */
export function useMemberClientIds(isAdmin: boolean, uid: string | undefined): string[] {
  const [clientIds, setClientIds] = useState<string[]>([])

  useEffect(() => {
    if (isAdmin || !uid) {
      setClientIds([])
      return
    }

    let cancelled = false
    getClientMemberClientIds(uid).then((ids) => {
      if (!cancelled) setClientIds(ids)
    })
    return () => {
      cancelled = true
    }
  }, [isAdmin, uid])

  return clientIds
}
