import { Timestamp, where } from 'firebase/firestore'

import { useAuth } from '../../../app/providers/useAuth'
import { db } from '../../../shared/api/firebaseClient'
import { useCollectionCount } from '../../../shared/api/pagination'
import { useActivityLog } from '../../../shared/api/activityLog.api'
import { useBlockedStages } from '../../../shared/api/stages.api'
import { usePaginatedCollection } from '../../../shared/api/pagination'
import type { ClientRecord } from '../../../shared/types/domain.types'

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function startOfTomorrow() {
  const date = startOfToday()
  date.setDate(date.getDate() + 1)
  return date
}

function mapClient(doc: import('firebase/firestore').QueryDocumentSnapshot): ClientRecord {
  const data = doc.data()
  return { id: doc.id, ...data } as ClientRecord
}

export function useAdminOverview() {
  const onboardingCount = useCollectionCount(
    db,
    'clients',
    () => [where('status', '==', 'onboarding')],
    'onboarding',
  )
  const activeCount = useCollectionCount(
    db,
    'clients',
    () => [where('status', '==', 'active')],
    'active',
  )
  const incompleteCount = useCollectionCount(
    db,
    'checklistItems',
    () => [where('completed', '==', false)],
    'incomplete',
  )
  const completedCount = useCollectionCount(
    db,
    'checklistItems',
    () => [where('completed', '==', true)],
    'completed',
  )
  const goLiveCount = useCollectionCount(
    db,
    'clients',
    () => [where('onboardingStage', '==', 5)],
    'golive',
  )
  const highPriorityCount = useCollectionCount(
    db,
    'clients',
    () => [where('priority', '==', 'high'), where('status', '==', 'onboarding')],
    'highpriority',
  )
  const recentActivity = useActivityLog(8, {})
  const blockedStages = useBlockedStages()
  const recentClients = usePaginatedCollection<ClientRecord>(
    db,
    'clients',
    () => [],
    'updatedAt',
    'desc',
    5,
    mapClient,
    'recent-clients',
  )

  return {
    onboardingCount,
    activeCount,
    incompleteCount,
    completedCount,
    goLiveCount,
    highPriorityCount,
    recentActivity,
    blockedStages,
    recentClients,
  }
}

export function useMemberOverview() {
  const { firebaseUser } = useAuth()
  const uid = firebaseUser?.uid ?? '__none__'

  const incompleteCount = useCollectionCount(
    db,
    'checklistItems',
    () => [where('assignedTo', '==', uid), where('completed', '==', false)],
    `incomplete-${uid}`,
  )
  const dueTodayCount = useCollectionCount(
    db,
    'checklistItems',
    () => [
      where('assignedTo', '==', uid),
      where('completed', '==', false),
      where('dueDate', '>=', Timestamp.fromDate(startOfToday())),
      where('dueDate', '<', Timestamp.fromDate(startOfTomorrow())),
    ],
    `due-today-${uid}`,
  )
  const overdueCount = useCollectionCount(
    db,
    'checklistItems',
    () => [
      where('assignedTo', '==', uid),
      where('completed', '==', false),
      where('dueDate', '<', Timestamp.fromDate(startOfToday())),
    ],
    `overdue-${uid}`,
  )
  const myActivity = useActivityLog(10, { actorId: uid })

  return { incompleteCount, dueTodayCount, overdueCount, myActivity }
}
