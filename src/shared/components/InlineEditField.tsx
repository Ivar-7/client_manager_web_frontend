import { useState, type ChangeEvent } from 'react'

import { Input, Textarea } from './Field'

interface InlineEditFieldProps {
  value: string
  onSave: (value: string) => void | Promise<void>
  label: string
  multiline?: boolean
  readOnly?: boolean
  placeholder?: string
}

export function InlineEditField({
  value,
  onSave,
  label,
  multiline,
  readOnly,
  placeholder,
}: InlineEditFieldProps) {
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  if (readOnly) {
    return (
      <div>
        <span className="text-sm text-muted">{label}</span>
        <p className="mt-1 text-sm text-text">{value || '—'}</p>
      </div>
    )
  }

  const commit = async () => {
    if (draft === value) return
    setSaving(true)
    try {
      await onSave(draft)
    } finally {
      setSaving(false)
    }
  }

  const sharedProps = {
    value: draft,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(event.target.value),
    onBlur: commit,
    placeholder,
    disabled: saving,
    'aria-label': label,
  }

  return (
    <div>
      <span className="text-sm text-muted">{label}</span>
      <div className="mt-1">
        {multiline ? <Textarea {...sharedProps} /> : <Input {...sharedProps} />}
      </div>
    </div>
  )
}
