import { collection, deleteDoc, doc, onSnapshot, setDoc, type Unsubscribe, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { explainFirebaseError, firebaseDb } from '../../../shared/firebase/app'
import { hasFirebaseConfig } from '../../../shared/firebase/config'
import { nowIsoString } from '../../../shared/utils/dates'
import { sampleWorkspace } from '../data/sampleWorkspace'
import { WorkspaceContext } from './dashboardWorkspaceContext'
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
    checklistTemplates: [...workspace.checklistTemplates],
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
    checklistTemplates: [],
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

  const removeLocalRecord = useCallback(
    <K extends WorkspaceCollection>(collectionKey: K, recordId: string) => {
      updateLocalCollection(
        collectionKey,
        (items) => items.filter((item) => item.id !== recordId) as WorkspaceState[K],
      )
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
      'checklistTemplates',
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

    const handleSnapshotError = (caughtError: unknown) => {
      if (cancelled) {
        return
      }

      setMode('firebase')
      setError(explainFirebaseError(caughtError))
      setWorkspace(emptyWorkspace())
      setCurrentUser(null)
      setStatus('error')
    }

    unsubscribers = [
      onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            users: mapSnapshot<UserRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'clients'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            clients: mapSnapshot<ClientRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'stages'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            stages: mapSnapshot<StageRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'checklistItems'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            checklistItems: mapSnapshot<ChecklistItemRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'checklistTemplates'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            checklistTemplates: mapSnapshot<ChecklistTemplateRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'assetRecords'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            assetRecords: mapSnapshot<AssetRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
      onSnapshot(
        collection(db, 'meetingNotes'),
        (snapshot) => {
          setWorkspace((previous) => ({
            ...previous,
            meetingNotes: mapSnapshot<MeetingNoteRecord>(snapshot.docs as Array<{ id: string; data: () => unknown }>),
          }))
          readyIfComplete()
        },
        handleSnapshotError,
      ),
    ]

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
        onboardingStage: input.onboardingStage ?? 'intake',
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

  const createChecklistTemplate = useCallback(
    async (input: ChecklistTemplateInput) => {
      const template: ChecklistTemplateRecord = {
        id: createId(),
        createdAt: nowIsoString(),
        updatedAt: nowIsoString(),
        ...input,
      }

      await syncOrSet('checklistTemplates', template)
      return template
    },
    [syncOrSet],
  )

  const updateChecklistTemplate = useCallback(
    async (templateId: string, patch: Partial<ChecklistTemplateInput>) => {
      const nextPatch = { ...patch, updatedAt: nowIsoString() }
      const db = firebaseDb

      if (!db || mode === 'demo') {
        patchLocalRecord('checklistTemplates', templateId, nextPatch)
        return
      }

      await updateDoc(doc(db, 'checklistTemplates', templateId), nextPatch)
    },
    [mode, patchLocalRecord],
  )

  const deleteChecklistTemplate = useCallback(
    async (templateId: string) => {
      const db = firebaseDb
      const checklistItemsForTemplate = workspace.checklistItems.filter(
        (item) => item.templateId === templateId,
      )

      if (!db || mode === 'demo') {
        removeLocalRecord('checklistTemplates', templateId)
        checklistItemsForTemplate.forEach((item) => {
          removeLocalRecord('checklistItems', item.id)
        })
        return
      }

      await Promise.all([
        deleteDoc(doc(db, 'checklistTemplates', templateId)),
        ...checklistItemsForTemplate.map((item) => deleteDoc(doc(db, 'checklistItems', item.id))),
      ])
    },
    [mode, removeLocalRecord, workspace.checklistItems],
  )

  const initializeClientChecklist = useCallback(
    async (clientId: string, includeTemplate?: ChecklistTemplateRecord) => {
      const combinedTemplates = includeTemplate
        ? [
            ...workspace.checklistTemplates.filter((template) => template.id !== includeTemplate.id),
            includeTemplate,
          ]
        : workspace.checklistTemplates

      const templates = combinedTemplates
        .filter((template) => template.active)
        .sort((left, right) => left.order - right.order)

      if (templates.length === 0) {
        return
      }

      const db = firebaseDb
      const existing = new Set(
        workspace.checklistItems
          .filter((item) => item.clientId === clientId)
          .map((item) => item.templateId)
          .filter(Boolean),
      )

      const writes: Promise<unknown>[] = []

      templates.forEach((template) => {
        if (existing.has(template.id)) {
          return
        }

        const checklistItem: ChecklistItemRecord = {
          id: `${clientId}_${template.id}`,
          clientId,
          templateId: template.id,
          label: template.label,
          order: template.order,
          completed: false,
          assignedTo: null,
          dueDate: null,
          completedAt: null,
          meetingId: null,
          createdAt: nowIsoString(),
          updatedAt: nowIsoString(),
        }

        if (!db || mode === 'demo') {
          appendLocalRecord('checklistItems', checklistItem)
          return
        }

        writes.push(setDoc(doc(db, 'checklistItems', checklistItem.id), checklistItem))
      })

      if (writes.length > 0) {
        await Promise.all(writes)
      }
    },
    [appendLocalRecord, mode, workspace.checklistItems, workspace.checklistTemplates],
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

  const deleteChecklistItem = useCallback(
    async (itemId: string) => {
      const db = firebaseDb

      if (!db || mode === 'demo') {
        removeLocalRecord('checklistItems', itemId)
        return
      }

      await deleteDoc(doc(db, 'checklistItems', itemId))
    },
    [mode, removeLocalRecord],
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
      ['checklistTemplates', sampleWorkspace.checklistTemplates],
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
      createChecklistTemplate,
      updateChecklistTemplate,
      deleteChecklistTemplate,
      initializeClientChecklist,
      createChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
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
      createChecklistTemplate,
      updateChecklistTemplate,
      deleteChecklistTemplate,
      initializeClientChecklist,
      createChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      createAssetRecord,
      createMeetingNote,
      seedSampleWorkspace,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
