import { Timestamp, where } from 'firebase/firestore'

import { useAuth } from '../../../app/providers/useAuth'
import { db } from '../../../shared/api/firebaseClient'
import { useCollectionCount } from '../../../shared/api/pagination'
import { useActivityLog } from '../../../shared/api/activityLog.api'
import { useBlockedStages } from '../../../shared/api/stages.api'

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

export function useAdminOverview() {
  const onboardingCount = useCollectionCount(
    db,
    'clients',
    () => [where('status', '==', 'onboarding')],
    'onboarding',
  )
  const incompleteCount = useCollectionCount(
    db,
    'checklistItems',
    () => [where('completed', '==', false)],
    'incomplete',
  )
  const goLiveCount = useCollectionCount(
    db,
    'clients',
    () => [where('onboardingStage', '==', 5)],
    'golive',
  )
  const recentActivity = useActivityLog(10, {})
  const blockedStages = useBlockedStages()

  return { onboardingCount, incompleteCount, goLiveCount, recentActivity, blockedStages }
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
