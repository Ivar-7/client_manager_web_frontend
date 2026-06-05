import { LoadingState } from '../../../shared/components/UI'
import { ChecklistTemplatesPanel } from '../components/ChecklistTemplatesPanel'
import { useDashboardPageModel } from '../hooks/useDashboardPageModel'

export default function WorkflowPage() {
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
    <div className="section-grid section-grid--page">
      <ChecklistTemplatesPanel
        templateForm={vm.templateForm}
        onTemplateFormChange={vm.setTemplateForm}
        onSubmit={(event) => void vm.handleTemplateSubmit(event)}
        templates={vm.checklistTemplates}
        onUpdateTemplate={vm.updateChecklistTemplate}
        onDeleteTemplate={vm.deleteChecklistTemplate}
      />
    </div>
  )
}
