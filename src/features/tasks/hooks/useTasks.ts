import { useAuth } from '../../../app/providers/useAuth'
import { useTaskChecklistItems } from '../../../shared/api/checklistItems.api'
import type { TasksFilterState } from '../types/tasks.types'

const PAGE_SIZE = 25

export function useTasks(filters: TasksFilterState) {
  const { isAdmin, firebaseUser } = useAuth()

  return useTaskChecklistItems(PAGE_SIZE, {
    assignedTo: isAdmin ? undefined : firebaseUser?.uid,
    completed: filters.completion === 'completed',
    sort: filters.sort,
  })
}
