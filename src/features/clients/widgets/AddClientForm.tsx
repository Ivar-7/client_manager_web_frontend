import { useState, type FormEvent } from 'react'

import { Card } from '../../../shared/components/Card'
import { Button } from '../../../shared/components/Button'
import { Field, Input, Select, Textarea } from '../../../shared/components/Field'
import { EMPTY_CLIENT_FORM, type ClientFormState } from '../types/clients.types'

interface AddClientFormProps {
  onSubmit: (form: ClientFormState) => Promise<void>
  onCancel: () => void
}

export function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const [form, setForm] = useState<ClientFormState>(EMPTY_CLIENT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to create client.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title="Add client"
      subtitle="Creates the client, 5 onboarding stages, and stamps the active checklist."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </Field>
        <Field label="Website">
          <Input
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
          />
        </Field>
        <Field label="Company name">
          <Input
            value={form.companyName}
            onChange={(event) => setForm({ ...form, companyName: event.target.value })}
          />
        </Field>
        <Field label="Industry">
          <Input
            value={form.industry}
            onChange={(event) => setForm({ ...form, industry: event.target.value })}
          />
        </Field>
        <Field label="Priority">
          <Select
            value={form.priority}
            onChange={(event) =>
              setForm({ ...form, priority: event.target.value as ClientFormState['priority'] })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field>
        <Field label="Tags" hint="Comma separated">
          <Input
            value={form.tags}
            onChange={(event) => setForm({ ...form, tags: event.target.value })}
          />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
        </Field>
        {error ? <p className="text-sm text-danger sm:col-span-2">{error}</p> : null}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create client
          </Button>
        </div>
      </form>
    </Card>
  )
}
