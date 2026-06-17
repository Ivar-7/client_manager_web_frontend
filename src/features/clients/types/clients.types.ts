import type { ClientPriority, ClientStatus } from '../../../shared/types/domain.types'

export interface ClientFormState {
  name: string
  email: string
  phone: string
  website: string
  companyName: string
  industry: string
  notes: string
  priority: ClientPriority
  tags: string
  ownerId: string
}

export const EMPTY_CLIENT_FORM: ClientFormState = {
  name: '',
  email: '',
  phone: '',
  website: '',
  companyName: '',
  industry: '',
  notes: '',
  priority: 'medium',
  tags: '',
  ownerId: '',
}

export interface ClientsFilterState {
  search: string
  status: ClientStatus | ''
  priority: ClientPriority | ''
  sort: 'name' | 'updatedAt' | 'priority'
}

export const DEFAULT_CLIENTS_FILTER: ClientsFilterState = {
  search: '',
  status: '',
  priority: '',
  sort: 'updatedAt',
}
