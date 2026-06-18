interface TagChipProps {
  label: string
  onRemove?: () => void
}

export function TagChip({ label, onRemove }: TagChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-strong px-2 py-0.5 text-xs font-medium text-muted">
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-0.5 rounded text-muted/60 transition-colors hover:text-danger"
        >
          <svg viewBox="0 0 12 12" fill="currentColor" className="size-3">
            <path d="M6.53 6 9.27 3.26a.375.375 0 0 0-.53-.53L6 5.47 3.26 2.73a.375.375 0 0 0-.53.53L5.47 6 2.73 8.74a.375.375 0 1 0 .53.53L6 6.53l2.74 2.74a.375.375 0 1 0 .53-.53L6.53 6Z" />
          </svg>
        </button>
      ) : null}
    </span>
  )
}
