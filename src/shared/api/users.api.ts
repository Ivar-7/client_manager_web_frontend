import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'

import { db } from './firebaseClient'
import type { UserRecord } from '../types/domain.types'

const COLLECTION = 'users'

export async function getUserById(uid: string): Promise<UserRecord | null> {
  const snapshot = await getDoc(doc(db, COLLECTION, uid))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as UserRecord
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export async function getUsersByIds(ids: string[]): Promise<UserRecord[]> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)))
  if (uniqueIds.length === 0) return []

  const chunks = chunk(uniqueIds, 30)
  const results = await Promise.all(
    chunks.map((idChunk) =>
      getDocs(query(collection(db, COLLECTION), where(documentId(), 'in', idChunk))),
    ),
  )

  return results.flatMap((snapshot) =>
    snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as UserRecord),
  )
}

/** Used to populate assignee pickers — capped since there is no dedicated team page. */
export async function getAssignableUsers(): Promise<UserRecord[]> {
  const snapshot = await getDocs(query(collection(db, COLLECTION), limit(200)))
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as UserRecord)
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
