import { LoadingState } from '../../../shared/components/UI'
import { AssetsPanel } from '../components/AssetsPanel'
import { useDashboardPageModel } from '../hooks/useDashboardPageModel'

export default function InfrastructurePage() {
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
      <AssetsPanel
        assetForm={vm.assetForm}
        onAssetFormChange={vm.setAssetForm}
        onSubmit={(event) => void vm.handleAssetSubmit(event)}
        selectedAssets={vm.selectedAssets}
      />
    </div>
  )
}
