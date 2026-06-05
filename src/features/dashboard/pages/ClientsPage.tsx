import { LoadingState } from '../../../shared/components/UI'
import { ClientOverviewPanel } from '../components/ClientOverviewPanel'
import { ClientsPanel } from '../components/ClientsPanel'
import { useDashboardPageModel } from '../hooks/useDashboardPageModel'

export default function ClientsPage() {
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
      <ClientsPanel
        searchQuery={vm.searchQuery}
        onSearchChange={vm.setSearchQuery}
        clientForm={vm.clientForm}
        onClientFormChange={vm.setClientForm}
        onSubmit={(event) => void vm.handleClientSubmit(event)}
        filteredClients={vm.filteredClients}
        activeClientId={vm.selectedClient?.id ?? null}
        onSelectClient={vm.setSelectedClientId}
      />

      <ClientOverviewPanel
        selectedClient={vm.selectedClient}
        selectedChecklistItems={vm.selectedChecklistItems}
        users={vm.workspace.users}
        currentUserId={vm.currentUser?.id ?? null}
        onUpdateClient={vm.updateClient}
        onToggleChecklistItem={vm.toggleChecklistItem}
        onDeleteChecklistItem={vm.deleteChecklistItem}
      />
    </div>
  )
}
