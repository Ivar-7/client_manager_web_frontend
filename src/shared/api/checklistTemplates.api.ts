import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from './firebaseClient'
import { mapFirestoreError } from './errors'
import type { FetchStatus } from './pagination'
import type { ChecklistTemplateInput, ChecklistTemplateRecord } from '../types/domain.types'

const COLLECTION = 'checklistTemplates'

function mapDoc(document: {
  id: string
  data: () => Record<string, unknown>
}): ChecklistTemplateRecord {
  return { id: document.id, ...document.data() } as ChecklistTemplateRecord
}

/** Small by design — every template is fetched in full for the Workflow page. */
export async function getAllChecklistTemplates(): Promise<ChecklistTemplateRecord[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION), orderBy('stageOrder'), orderBy('order')),
  )
  return snapshot.docs.map(mapDoc)
}

export async function getActiveChecklistTemplates(): Promise<ChecklistTemplateRecord[]> {
  const templates = await getAllChecklistTemplates()
  return templates.filter((template) => template.active)
}

export function useChecklistTemplates() {
  const [templates, setTemplates] = useState<ChecklistTemplateRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const builtQuery = query(collection(db, COLLECTION), orderBy('stageOrder'), orderBy('order'))
    const unsubscribe = onSnapshot(
      builtQuery,
      (snapshot) => {
        const items = snapshot.docs.map(mapDoc)
        setTemplates(items)
        setStatus(items.length === 0 ? 'empty' : 'success')
        setError(null)
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )
    return unsubscribe
  }, [])

  return { templates, status, error }
}

export async function createChecklistTemplate(input: ChecklistTemplateInput) {
  await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateChecklistTemplate(
  templateId: string,
  patch: Partial<ChecklistTemplateInput>,
) {
  await updateDoc(doc(db, COLLECTION, templateId), { ...patch, updatedAt: serverTimestamp() })
}

export async function deleteChecklistTemplate(templateId: string) {
  await deleteDoc(doc(db, COLLECTION, templateId))
}

/** Swaps `order` between two templates within the same stage. */
export async function reorderChecklistTemplates(
  templateA: ChecklistTemplateRecord,
  templateB: ChecklistTemplateRecord,
) {
  const batch = writeBatch(db)
  batch.update(doc(db, COLLECTION, templateA.id), {
    order: templateB.order,
    updatedAt: serverTimestamp(),
  })
  batch.update(doc(db, COLLECTION, templateB.id), {
    order: templateA.order,
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
}
