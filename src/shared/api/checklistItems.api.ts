import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type QueryConstraint,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from './firebaseClient'
import { mapFirestoreError } from './errors'
import { logActivity } from './activityLog.api'
import { usePaginatedCollection, type FetchStatus } from './pagination'
import type { ChecklistItemInput, ChecklistItemRecord } from '../types/domain.types'

const COLLECTION = 'checklistItems'

function mapDoc(document: {
  id: string
  data: () => Record<string, unknown>
}): ChecklistItemRecord {
  return { id: document.id, ...document.data() } as ChecklistItemRecord
}

/** All checklist items for one client — bounded by design (a handful of templates per stage). */
export function useClientChecklistItems(clientId: string | null) {
  const [items, setItems] = useState<ChecklistItemRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) {
      setItems([])
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
        const result = snapshot.docs.map(mapDoc)
        setItems(result)
        setStatus(result.length === 0 ? 'empty' : 'success')
        setError(null)
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )
    return unsubscribe
  }, [clientId])

  return { items, status, error }
}

export interface TaskFilters {
  assignedTo?: string
  completed?: boolean
  sort?: 'dueDate' | 'priority'
}

const PRIORITY_RANK: Record<ChecklistItemRecord['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
}

/** Cross-client checklist items for /tasks — admin sees all, member is scoped via assignedTo. */
export function useTaskChecklistItems(pageSize: number, filters: TaskFilters) {
  const resetKey = JSON.stringify(filters)
  const sort = filters.sort ?? 'dueDate'

  const result = usePaginatedCollection<ChecklistItemRecord>(
    db,
    COLLECTION,
    () => {
      const constraints: QueryConstraint[] = []
      if (filters.assignedTo) constraints.push(where('assignedTo', '==', filters.assignedTo))
      if (filters.completed !== undefined)
        constraints.push(where('completed', '==', filters.completed))
      return constraints
    },
    sort === 'dueDate' ? 'dueDate' : 'priority',
    'asc',
    pageSize,
    mapDoc,
    resetKey,
  )

  if (sort === 'priority') {
    return {
      ...result,
      items: [...result.items].sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
      ),
    }
  }

  return result
}

export async function createChecklistItem(input: ChecklistItemInput) {
  await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function toggleChecklistItem(
  item: ChecklistItemRecord,
  completed: boolean,
  actorId: string,
  actorName: string,
) {
  await updateDoc(doc(db, COLLECTION, item.id), {
    completed,
    completedAt: completed ? serverTimestamp() : null,
    completedBy: completed ? actorId : null,
    updatedAt: serverTimestamp(),
  })

  logActivity({
    clientId: item.clientId,
    actorId,
    actorName,
    action: `${completed ? 'completed' : 're-opened'} checklist item "${item.label}"`,
    entityType: 'checklistItem',
    entityId: item.id,
  })
}

export async function updateChecklistItem(
  itemId: string,
  patch: Partial<Omit<ChecklistItemInput, 'dueDate'>> & { dueDate?: Date | null },
) {
  const payload: Record<string, unknown> = { ...patch, updatedAt: serverTimestamp() }
  if (patch.dueDate instanceof Date) {
    payload.dueDate = Timestamp.fromDate(patch.dueDate)
  }
  await updateDoc(doc(db, COLLECTION, itemId), payload)
}

export async function deleteChecklistItem(itemId: string) {
  await deleteDoc(doc(db, COLLECTION, itemId))
}

export async function stampChecklistFromTemplates(
  clientId: string,
  stageIdsByOrder: Record<number, string>,
  templates: Array<{
    id: string
    label: string
    order: number
    stageOrder: number
    required: boolean
  }>,
) {
  const batch = writeBatch(db)

  templates.forEach((template) => {
    const stageId = stageIdsByOrder[template.stageOrder]
    if (!stageId) return

    const itemRef = doc(collection(db, COLLECTION))
    batch.set(itemRef, {
      clientId,
      stageId,
      templateId: template.id,
      label: template.label,
      order: template.order,
      required: template.required,
      completed: false,
      completedAt: null,
      completedBy: null,
      assignedTo: null,
      dueDate: null,
      priority: 'medium',
      notes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()
}
