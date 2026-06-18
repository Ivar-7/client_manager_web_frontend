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
    return <LoadingState title="" description="" />
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Workflow</h1>
        <p className="mt-1 text-sm text-muted">Manage default checklist templates per stage</p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3">
        <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-warning">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-warning">
          Changes only apply to new clients. Existing checklists are not updated.
        </p>
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
