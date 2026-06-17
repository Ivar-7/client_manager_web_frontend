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
      <Button variant="secondary" type="button" disabled={!hasPrevPage} onClick={onPrev}>
        Previous
      </Button>
      <span className="text-sm text-muted">Page {page + 1}</span>
      <Button variant="secondary" type="button" disabled={!hasNextPage} onClick={onNext}>
        Next
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
    <div className="flex justify-center pt-2">
      <Button variant="secondary" type="button" onClick={onLoadMore} loading={loading}>
        Load more
      </Button>
    </div>
  )
}
