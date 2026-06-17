import { useState, type FormEvent } from 'react'

import { Button } from '../../../shared/components/Button'
import { Field, Input, Select, Textarea } from '../../../shared/components/Field'
import { createChecklistTemplate } from '../../../shared/api/checklistTemplates.api'

interface AddTemplateFormProps {
  stageOrder: number
  nextOrder: number
}

export function AddTemplateForm({ stageOrder, nextOrder }: AddTemplateFormProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [required, setRequired] = useState(true)
  const [loading, setLoading] = useState(false)

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Add template
      </Button>
    )
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await createChecklistTemplate({
        label,
        description,
        order: nextOrder,
        stageOrder,
        required,
        active: true,
      })
      setLabel('')
      setDescription('')
      setRequired(true)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-border bg-surface-muted p-4 sm:grid-cols-2"
    >
      <Field label="Label">
        <Input value={label} onChange={(event) => setLabel(event.target.value)} required />
      </Field>
      <Field label="Required">
        <Select
          value={required ? 'yes' : 'no'}
          onChange={(event) => setRequired(event.target.value === 'yes')}
        >
          <option value="yes">Required</option>
          <option value="no">Optional</option>
        </Select>
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add
        </Button>
      </div>
    </form>
  )
}
