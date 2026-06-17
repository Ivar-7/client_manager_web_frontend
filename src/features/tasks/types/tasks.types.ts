export type TaskCompletionFilter = 'incomplete' | 'completed'
export type TaskSort = 'dueDate' | 'priority'

export interface TasksFilterState {
  completion: TaskCompletionFilter
  sort: TaskSort
}

export const DEFAULT_TASKS_FILTER: TasksFilterState = {
  completion: 'incomplete',
  sort: 'dueDate',
}
