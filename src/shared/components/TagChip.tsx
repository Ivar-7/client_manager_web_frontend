interface TagChipProps {
  label: string
  onRemove?: () => void
}

export function TagChip({ label, onRemove }: TagChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-text">
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="text-muted hover:text-danger"
        >
          ×
        </button>
      ) : null}
    </span>
  )
}
