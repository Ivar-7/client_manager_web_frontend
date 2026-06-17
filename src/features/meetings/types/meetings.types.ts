export interface MeetingsFilterState {
  clientId: string
  startDate: string
  endDate: string
}

export const DEFAULT_MEETINGS_FILTER: MeetingsFilterState = {
  clientId: '',
  startDate: '',
  endDate: '',
}
