import { useState } from 'react'

import { Button } from './Button'

interface InlineConfirmProps {
  label: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
}

export function InlineConfirm({ label, confirmLabel = 'Confirm', onConfirm }: InlineConfirmProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!confirming) {
    return (
      <Button variant="danger" size="sm" type="button" onClick={() => setConfirming(true)}>
        {label}
      </Button>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-muted">Sure?</span>
      <Button
        variant="danger"
        size="sm"
        type="button"
        loading={loading}
        onClick={async () => {
          setLoading(true)
          try {
            await onConfirm()
          } finally {
            setLoading(false)
            setConfirming(false)
          }
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="sm" type="button" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  )
}
