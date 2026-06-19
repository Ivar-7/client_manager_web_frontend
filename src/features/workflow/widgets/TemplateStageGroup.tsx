import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Card } from '../../../shared/components/Card'
import { InlineConfirm } from '../../../shared/components/InlineConfirm'
import {
  deleteChecklistTemplate,
  reorderChecklistTemplates,
  updateChecklistTemplate,
} from '../../../shared/api/checklistTemplates.api'
import type { ChecklistTemplateRecord } from '../../../shared/types/domain.types'
import { AddTemplateForm } from './AddTemplateForm'

interface TemplateStageGroupProps {
  stageOrder: number
  stageName: string
  templates: ChecklistTemplateRecord[]
}

export function TemplateStageGroup({ stageOrder, stageName, templates }: TemplateStageGroupProps) {
  const sorted = [...templates].sort((a, b) => a.order - b.order)

  return (
    <Card title={`Stage ${stageOrder}: ${stageName}`}>
      <div className="grid gap-2">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted">No templates yet.</p>
        ) : (
          sorted.map((template, index) => (
            <div
              key={template.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong p-3"
            >
              <div className="min-w-0 flex-1">
                <strong className="block text-sm text-text">{template.label}</strong>
                {template.description ? (
                  <p className="mt-0.5 text-xs text-muted">{template.description}</p>
                ) : null}
                <div className="mt-1.5 flex gap-1.5">
                  <Badge tone={template.required ? 'accent' : 'neutral'}>
                    {template.required ? 'Required' : 'Optional'}
                  </Badge>
                  <Badge tone={template.active ? 'positive' : 'neutral'}>
                    {template.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => reorderChecklistTemplates(template, sorted[index - 1])}
                  aria-label="Move up"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                    <path
                      fillRule="evenodd"
                      d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06L7.25 11.44V2.75A.75.75 0 0 1 8 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === sorted.length - 1}
                  onClick={() => reorderChecklistTemplates(template, sorted[index + 1])}
                  aria-label="Move down"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                    <path
                      fillRule="evenodd"
                      d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateChecklistTemplate(template.id, { active: !template.active })}
                >
                  {template.active ? 'Deactivate' : 'Activate'}
                </Button>
                <InlineConfirm
                  label="Delete"
                  onConfirm={() => deleteChecklistTemplate(template.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <AddTemplateForm stageOrder={stageOrder} nextOrder={sorted.length + 1} />
      </div>
    </Card>
  )
}
