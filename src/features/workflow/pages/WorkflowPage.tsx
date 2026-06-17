import { useAuth } from '../../../app/providers/useAuth'
import { useChecklistTemplates } from '../../../shared/api/checklistTemplates.api'
import { EmptyState, LoadingState } from '../../../shared/components/States'
import { STAGE_NAMES } from '../../../shared/types/domain.types'
import { TemplateStageGroup } from '../widgets/TemplateStageGroup'

export default function WorkflowPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <EmptyState
        title="Access restricted"
        description="Only admins can manage the onboarding workflow."
      />
    )
  }

  return <WorkflowAdminView />
}

function WorkflowAdminView() {
  const { templates, status } = useChecklistTemplates()

  if (status === 'loading') {
    return <LoadingState title="Loading templates" description="Fetching checklist templates." />
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
        Changes only apply to new clients. Existing checklists are not updated.
      </div>
      {STAGE_NAMES.map((name, index) => {
        const stageOrder = index + 1
        return (
          <TemplateStageGroup
            key={stageOrder}
            stageOrder={stageOrder}
            stageName={name}
            templates={templates.filter((template) => template.stageOrder === stageOrder)}
          />
        )
      })}
    </div>
  )
}
