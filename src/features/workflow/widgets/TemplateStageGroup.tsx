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
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-strong p-3"
            >
              <div className="min-w-0">
                <strong className="block text-text">{template.label}</strong>
                <p className="text-sm text-muted">{template.description}</p>
                <div className="mt-1 flex gap-1.5">
                  <Badge tone={template.required ? 'accent' : 'neutral'}>
                    {template.required ? 'Required' : 'Optional'}
                  </Badge>
                  <Badge tone={template.active ? 'positive' : 'neutral'}>
                    {template.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => reorderChecklistTemplates(template, sorted[index - 1])}
                  aria-label="Move up"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={index === sorted.length - 1}
                  onClick={() => reorderChecklistTemplates(template, sorted[index + 1])}
                  aria-label="Move down"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="secondary"
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
      <div className="mt-3">
        <AddTemplateForm stageOrder={stageOrder} nextOrder={sorted.length + 1} />
      </div>
    </Card>
  )
}
