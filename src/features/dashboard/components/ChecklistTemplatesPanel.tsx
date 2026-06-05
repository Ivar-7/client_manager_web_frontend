import { Badge, Button, EmptyState, Field, Panel } from '../../../shared/components/UI'
import type { ChecklistTemplateInput, ChecklistTemplateRecord } from '../../../shared/types/domain'

interface ChecklistTemplatesPanelProps {
  templateForm: ChecklistTemplateInput
  onTemplateFormChange: (updater: (previous: ChecklistTemplateInput) => ChecklistTemplateInput) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  templates: ChecklistTemplateRecord[]
  onUpdateTemplate: (templateId: string, patch: Partial<ChecklistTemplateInput>) => Promise<void>
  onDeleteTemplate: (templateId: string) => Promise<void>
}

export function ChecklistTemplatesPanel({
  templateForm,
  onTemplateFormChange,
  onSubmit,
  templates,
  onUpdateTemplate,
  onDeleteTemplate,
}: ChecklistTemplatesPanelProps) {
  return (
    <Panel
      title="Checklist templates"
      subtitle="Manage the predefined onboarding checklist used for every client."
      action={<span className="panel__meta">{templates.length} templates</span>}
    >
      <form className="stack stack--tight" onSubmit={onSubmit} style={{ marginBottom: '32px' }}>
        <div className="grid-form grid-form--compact">
          <Field label="Task">
            <input
              value={templateForm.label}
              onChange={(event) => onTemplateFormChange((previous) => ({ ...previous, label: event.target.value }))}
              placeholder="Create username"
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              min="1"
              value={templateForm.order}
              onChange={(event) => onTemplateFormChange((previous) => ({ ...previous, order: Number(event.target.value) }))}
            />
          </Field>
          <Field label="Required">
            <select
              value={templateForm.required ? 'yes' : 'no'}
              onChange={(event) =>
                onTemplateFormChange((previous) => ({ ...previous, required: event.target.value === 'yes' }))
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Active">
            <select
              value={templateForm.active ? 'yes' : 'no'}
              onChange={(event) =>
                onTemplateFormChange((previous) => ({ ...previous, active: event.target.value === 'yes' }))
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={2}
            value={templateForm.description}
            onChange={(event) =>
              onTemplateFormChange((previous) => ({ ...previous, description: event.target.value }))
            }
            placeholder="Short internal note for this checklist step"
          />
        </Field>

        <div className="form-actions mb-8">
          <Button type="submit">Add template row</Button>
        </div>
      </form>

      <div className="stack">
        {templates.length === 0 ? (
          <EmptyState
            title="No checklist templates"
            description="Add template rows so each new client gets a predefined checklist."
          />
        ) : (
          templates.map((template) => (
            <article key={template.id} className="list-card">
              <div className="list-card__top">
                <div>
                  <strong>
                    {template.order}. {template.label}
                  </strong>
                  <p>{template.description || 'No description provided.'}</p>
                </div>
                <div className="inline-actions">
                  <Badge tone={template.required ? 'accent' : 'neutral'}>
                    {template.required ? 'required' : 'optional'}
                  </Badge>
                  <Badge tone={template.active ? 'positive' : 'neutral'}>
                    {template.active ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </div>
              <div className="list-card__actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    void onUpdateTemplate(template.id, {
                      active: !template.active,
                    })
                  }
                >
                  {template.active ? 'Set inactive' : 'Set active'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    void onUpdateTemplate(template.id, {
                      required: !template.required,
                    })
                  }
                >
                  {template.required ? 'Set optional' : 'Set required'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => void onDeleteTemplate(template.id)}>
                  Delete
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
