import { useAuth } from '../../../app/providers/useAuth'
import { useMeetingNotes } from '../../../shared/api/meetingNotes.api'
import { useMemberClientIds } from '../../../shared/api/clients.api'
import type { MeetingsFilterState } from '../types/meetings.types'

const PAGE_SIZE = 25

export function useMeetings(filters: MeetingsFilterState) {
  const { isAdmin, firebaseUser } = useAuth()
  const memberClientIds = useMemberClientIds(isAdmin, firebaseUser?.uid)

  return useMeetingNotes(PAGE_SIZE, {
    clientId: filters.clientId || undefined,
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    clientIds: isAdmin ? undefined : memberClientIds,
  })
}
