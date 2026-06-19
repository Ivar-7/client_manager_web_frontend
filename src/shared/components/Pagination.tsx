import { Button } from './Button'

interface PaginationProps {
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onNext: () => void
  onPrev: () => void
}

export function Pagination({ page, hasNextPage, hasPrevPage, onNext, onPrev }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <Button variant="secondary" size="sm" type="button" disabled={!hasPrevPage} onClick={onPrev}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
          <path
            fillRule="evenodd"
            d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        Previous
      </Button>
      <span className="rounded-lg border border-border bg-surface-strong px-3 py-1.5 text-xs font-semibold text-muted">
        Page {page + 1}
      </span>
      <Button variant="secondary" size="sm" type="button" disabled={!hasNextPage} onClick={onNext}>
        Next
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
          <path
            fillRule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </div>
  )
}

interface LoadMoreProps {
  hasNextPage: boolean
  onLoadMore: () => void
  loading?: boolean
}

export function LoadMore({ hasNextPage, onLoadMore, loading }: LoadMoreProps) {
  if (!hasNextPage) return null
  return (
    <div className="flex justify-center pt-4">
      <Button variant="secondary" size="sm" type="button" onClick={onLoadMore} loading={loading}>
        Load more
      </Button>
    </div>
  )
}
