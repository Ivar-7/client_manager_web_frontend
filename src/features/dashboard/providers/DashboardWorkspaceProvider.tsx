import { collection, doc, onSnapshot, setDoc, type Unsubscribe, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { ensureAnonymousSession, firebaseDb } from '../../../shared/firebase/app'
import { hasFirebaseConfig } from '../../../shared/firebase/config'
import { nowIsoString } from '../../../shared/utils/dates'
import { sampleWorkspace } from '../data/sampleWorkspace'
import { WorkspaceContext } from './dashboardWorkspaceContext'
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
  WorkspaceCollection,
  WorkspaceState,
} from '../../../shared/types/domain'

type WorkspaceItem<K extends WorkspaceCollection> = WorkspaceState[K] extends Array<infer Item>
  ? Item & { id: string }
  : never
const STORAGE_KEY = 'client-manager-web-workspace'

function createId() {
  return globalThis.crypto?.randomUUID() ?? `id-${Math.random().toString(36).slice(2, 11)}`
}

function cloneWorkspace(workspace: WorkspaceState): WorkspaceState {
  return {
    users: [...workspace.users],
    clients: [...workspace.clients],
    stages: [...workspace.stages],
    checklistItems: [...workspace.checklistItems],
    assetRecords: [...workspace.assetRecords],
    meetingNotes: [...workspace.meetingNotes],
  }
}

function readStoredWorkspace() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as WorkspaceState
  } catch {
    return null
  }
}

function saveStoredWorkspace(workspace: WorkspaceState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
}

function emptyWorkspace(): WorkspaceState {
  return {
    users: [],
    clients: [],
    stages: [],
    checklistItems: [],
    assetRecords: [],
    meetingNotes: [],
  }
}

function mapSnapshot<T>(docs: Array<{ id: string; data: () => unknown }>) {
  return docs.map((item) => ({ id: item.id, ...(item.data() as object) })) as T[]
}

export function DashboardWorkspaceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'firebase' | 'demo'>(hasFirebaseConfig ? 'firebase' : 'demo')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    hasFirebaseConfig ? 'loading' : 'ready',
  )
  const [error, setError] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => {
    if (hasFirebaseConfig) {
      return emptyWorkspace()
    }

    return readStoredWorkspace() ?? cloneWorkspace(sampleWorkspace)
  })
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(
    hasFirebaseConfig ? null : sampleWorkspace.users[0] ?? null,
  )

  const updateLocalCollection = useCallback(
    <K extends WorkspaceCollection>(
      collectionKey: K,
      updater: (items: WorkspaceState[K]) => WorkspaceState[K],
    ) => {
      setWorkspace((previous) => {
        const next = {
          ...previous,
          [collectionKey]: updater(previous[collectionKey]),
        } as WorkspaceState

        saveStoredWorkspace(next)
        return next
      })
    },
    [],
  )

  const patchLocalRecord = useCallback(
    <K extends WorkspaceCollection>(collectionKey: K, recordId: string, patch: Partial<WorkspaceItem<K>>) => {
      updateLocalCollection(collectionKey, (items) =>
        items.map((item) =>
          item.id === recordId ? ({ ...item, ...patch } as unknown as WorkspaceItem<K>) : item,
        ) as WorkspaceState[K],
      )
    },
    [updateLocalCollection],
  )

  const appendLocalRecord = useCallback(
    <K extends WorkspaceCollection>(collectionKey: K, record: WorkspaceItem<K>) => {
      updateLocalCollection(collectionKey, (items) => [...items, record] as WorkspaceState[K])
    },
    [updateLocalCollection],
  )

  useEffect(() => {
    const db = firebaseDb

    if (!hasFirebaseConfig || !db) {
      return
    }

    let cancelled = false
    let completedCollections = 0
    const expectedCollections: WorkspaceCollection[] = [
      'users',
      'clients',
      'stages',
      'checklistItems',
      'assetRecords',
      'meetingNotes',
    ]

    const readyIfComplete = () => {
      completedCollections += 1
      if (!cancelled && completedCollections === expectedCollections.length) {
        setStatus('ready')
      }
    }

    let unsubscribers: Unsubscribe[] = []

    void ensureAnonymousSession()
      .then((authUser) => {
        if (cancelled) {
          return
        }

        if (authUser) {
          const userRecord: UserRecord = {
            id: authUser.uid,
            name: authUser.displayName ?? 'Workspace User',
            email: authUser.email ?? 'anonymous@firebase.local',
            role: 'manager',
          }
          setCurrentUser(userRecord)
          void setDoc(doc(db, 'users', userRecord.id), userRecord, { merge: true })
        }

        unsubscribers = [
          onSnapshot(collection(db, 'users'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              users: mapSnapshot<UserRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
          onSnapshot(collection(db, 'clients'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              clients: mapSnapshot<ClientRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
          onSnapshot(collection(db, 'stages'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              stages: mapSnapshot<StageRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
          onSnapshot(collection(db, 'checklistItems'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              checklistItems: mapSnapshot<ChecklistItemRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
          onSnapshot(collection(db, 'assetRecords'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              assetRecords: mapSnapshot<AssetRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
          onSnapshot(collection(db, 'meetingNotes'), (snapshot) => {
            setWorkspace((previous) => ({
              ...previous,
              meetingNotes: mapSnapshot<MeetingNoteRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
            }))
            readyIfComplete()
          }),
        ]
      })
      .catch((caughtError: unknown) => {
        if (cancelled) {
          return
        }

        setError(caughtError instanceof Error ? caughtError.message : 'Firebase connection failed')
        setMode('demo')
        setWorkspace(readStoredWorkspace() ?? cloneWorkspace(sampleWorkspace))
        setCurrentUser(sampleWorkspace.users[0] ?? null)
        setStatus('ready')
      })

    return () => {
      cancelled = true
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const syncOrSet = useCallback(
    async <K extends WorkspaceCollection>(collectionKey: K, record: WorkspaceItem<K>) => {
      const db = firebaseDb

      if (!db || mode === 'demo') {
        appendLocalRecord(collectionKey, record)
        return
      }

      await setDoc(doc(db, collectionKey, record.id), record as WorkspaceItem<K> & Record<string, unknown>)
    },
    [appendLocalRecord, mode],
  )

  const createClient = useCallback(
    async (input: ClientInput) => {
      const client: ClientRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('clients', client)
      return client
    },
    [syncOrSet],
  )

  const updateClient = useCallback(
    async (clientId: string, patch: Partial<ClientInput>) => {
      const nextPatch = { ...patch, updatedAt: nowIsoString() }
      const db = firebaseDb

      if (!db || mode === 'demo') {
        patchLocalRecord('clients', clientId, nextPatch)
        return
      }

      await updateDoc(doc(db, 'clients', clientId), nextPatch)
    },
    [mode, patchLocalRecord],
  )

  const createStage = useCallback(
    async (input: StageInput) => {
      const stage: StageRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('stages', stage)
      return stage
    },
    [syncOrSet],
  )

  const updateStageStatus = useCallback(
    async (stageId: string, statusValue: StageRecord['status'], comment?: string) => {
      const patch: Partial<StageRecord> = {
        status: statusValue,
        updatedAt: nowIsoString(),
        comment,
        completedAt: statusValue === 'approved' ? nowIsoString() : null,
        actionedById: currentUser?.id ?? null,
      }
      const db = firebaseDb

      if (!db || mode === 'demo') {
        patchLocalRecord('stages', stageId, patch)
        return
      }

      await updateDoc(doc(db, 'stages', stageId), patch)
    },
    [currentUser?.id, mode, patchLocalRecord],
  )

  const createChecklistItem = useCallback(
    async (input: ChecklistItemInput) => {
      const checklistItem: ChecklistItemRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('checklistItems', checklistItem)
      return checklistItem
    },
    [syncOrSet],
  )

  const toggleChecklistItem = useCallback(
    async (itemId: string, completed: boolean) => {
      const patch: Partial<ChecklistItemRecord> = {
        completed,
        updatedAt: nowIsoString(),
        completedAt: completed ? nowIsoString() : null,
      }
      const db = firebaseDb

      if (!db || mode === 'demo') {
        patchLocalRecord('checklistItems', itemId, patch)
        return
      }

      await updateDoc(doc(db, 'checklistItems', itemId), patch)
    },
    [mode, patchLocalRecord],
  )

  const createAssetRecord = useCallback(
    async (input: AssetInput) => {
      const assetRecord: AssetRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('assetRecords', assetRecord)
      return assetRecord
    },
    [syncOrSet],
  )

  const createMeetingNote = useCallback(
    async (input: MeetingInput) => {
      const meetingNote: MeetingNoteRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('meetingNotes', meetingNote)
      return meetingNote
    },
    [syncOrSet],
  )

  const seedSampleWorkspace = useCallback(async () => {
    const db = firebaseDb

    if (!db || mode === 'demo') {
      setWorkspace(cloneWorkspace(sampleWorkspace))
      saveStoredWorkspace(cloneWorkspace(sampleWorkspace))
      setCurrentUser(sampleWorkspace.users[0] ?? null)
      return
    }

    const writes: Promise<unknown>[] = []
    const collections: Array<[WorkspaceCollection, Array<{ id: string }>]> = [
      ['users', sampleWorkspace.users],
      ['clients', sampleWorkspace.clients],
      ['stages', sampleWorkspace.stages],
      ['checklistItems', sampleWorkspace.checklistItems],
      ['assetRecords', sampleWorkspace.assetRecords],
      ['meetingNotes', sampleWorkspace.meetingNotes],
    ]

    collections.forEach(([collectionKey, records]) => {
      records.forEach((record) => {
        writes.push(setDoc(doc(db, collectionKey, record.id), record as unknown as Record<string, unknown>))
      })
    })

    await Promise.all(writes)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      status,
      error,
      currentUser,
      workspace,
      createClient,
      updateClient,
      createStage,
      updateStageStatus,
      createChecklistItem,
      toggleChecklistItem,
      createAssetRecord,
      createMeetingNote,
      seedSampleWorkspace,
    }),
    [
      mode,
      status,
      error,
      currentUser,
      workspace,
      createClient,
      updateClient,
      createStage,
      updateStageStatus,
      createChecklistItem,
      toggleChecklistItem,
      createAssetRecord,
      createMeetingNote,
      seedSampleWorkspace,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
