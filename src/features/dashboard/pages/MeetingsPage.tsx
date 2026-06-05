import { LoadingState } from '../../../shared/components/UI'
import { MeetingsPanel } from '../components/MeetingsPanel'
import { useDashboardPageModel } from '../hooks/useDashboardPageModel'

export default function MeetingsPage() {
  const vm = useDashboardPageModel()

  if (vm.status === 'loading') {
    return (
      <LoadingState
        title="Connecting workspace"
        description="Loading your Firebase collections and session state."
      />
    )
  }

  return (
    <div className="dashboard-grid">
      <MeetingsPanel
        meetingForm={vm.meetingForm}
        onMeetingFormChange={vm.setMeetingForm}
        onSubmit={(event) => void vm.handleMeetingSubmit(event)}
        selectedMeetings={vm.selectedMeetings}
      />
    </div>
  )
}
