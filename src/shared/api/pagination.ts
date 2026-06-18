import { useEffect, useRef, useState } from 'react'
import {
  collection,
  getCountFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type Firestore,
  type OrderByDirection,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { mapFirestoreError } from './errors'

export type FetchStatus = 'loading' | 'success' | 'empty' | 'error'

export interface PaginatedResult<T> {
  items: T[]
  status: FetchStatus
  error: string | null
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: () => void
  prevPage: () => void
}

/**
 * Subscribes to one page of a Firestore query in real time. `buildConstraints`
 * and `resetKey` must change together — resetKey drives when the cursor stack
 * is thrown away (filter/search changes), buildConstraints supplies the where()
 * clauses for the current resetKey.
 */
export function usePaginatedCollection<T>(
  db: Firestore,
  collectionPath: string,
  buildConstraints: () => QueryConstraint[],
  orderByField: string,
  orderByDirection: OrderByDirection,
  pageSize: number,
  mapDoc: (doc: QueryDocumentSnapshot<DocumentData>) => T,
  resetKey: string,
  enabled = true,
): PaginatedResult<T> {
  const [page, setPage] = useState(0)
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const cursorsRef = useRef<Array<QueryDocumentSnapshot<DocumentData> | null>>([null])

  useEffect(() => {
    cursorsRef.current = [null]
    setPage(0)
  }, [resetKey])

  useEffect(() => {
    if (!enabled) {
      setItems([])
      setHasNextPage(false)
      setStatus('empty')
      return
    }

    setStatus('loading')
    setError(null)

    const cursor = cursorsRef.current[page] ?? null
    const constraintsList = [...buildConstraints(), orderBy(orderByField, orderByDirection)]
    if (cursor) constraintsList.push(startAfter(cursor))
    constraintsList.push(limit(pageSize + 1))

    const builtQuery = query(collection(db, collectionPath), ...constraintsList)

    const unsubscribe = onSnapshot(
      builtQuery,
      (snapshot) => {
        const docs = snapshot.docs
        const hasMore = docs.length > pageSize
        const pageDocs = hasMore ? docs.slice(0, pageSize) : docs

        setHasNextPage(hasMore)
        if (pageDocs.length > 0) {
          cursorsRef.current[page + 1] = pageDocs[pageDocs.length - 1]
        }
        setItems(pageDocs.map(mapDoc))
        setStatus(pageDocs.length === 0 ? 'empty' : 'success')
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionPath, page, pageSize, orderByField, orderByDirection, resetKey, enabled])

  return {
    items,
    status,
    error,
    page,
    hasNextPage,
    hasPrevPage: page > 0,
    nextPage: () => setPage((current) => (hasNextPage ? current + 1 : current)),
    prevPage: () => setPage((current) => Math.max(0, current - 1)),
  }
}

export interface InfiniteResult<T> {
  items: T[]
  status: FetchStatus
  error: string | null
  hasNextPage: boolean
  nextPage: () => void
}

/**
 * "Load more" style pagination: each call grows the query's limit and re-subscribes,
 * so the visible list accumulates while staying real-time.
 */
export function useInfiniteCollection<T>(
  db: Firestore,
  collectionPath: string,
  buildConstraints: () => QueryConstraint[],
  orderByField: string,
  orderByDirection: OrderByDirection,
  pageSize: number,
  mapDoc: (doc: QueryDocumentSnapshot<DocumentData>) => T,
  resetKey: string,
  enabled = true,
): InfiniteResult<T> {
  const [pageCount, setPageCount] = useState(1)
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    setPageCount(1)
  }, [resetKey])

  useEffect(() => {
    if (!enabled) {
      setItems([])
      setHasNextPage(false)
      setStatus('empty')
      return
    }

    setStatus('loading')
    setError(null)

    const fetchLimit = pageCount * pageSize
    const builtQuery = query(
      collection(db, collectionPath),
      ...buildConstraints(),
      orderBy(orderByField, orderByDirection),
      limit(fetchLimit + 1),
    )

    const unsubscribe = onSnapshot(
      builtQuery,
      (snapshot) => {
        const docs = snapshot.docs
        const hasMore = docs.length > fetchLimit
        const visibleDocs = hasMore ? docs.slice(0, fetchLimit) : docs

        setHasNextPage(hasMore)
        setItems(visibleDocs.map(mapDoc))
        setStatus(visibleDocs.length === 0 ? 'empty' : 'success')
      },
      (snapshotError) => {
        setError(mapFirestoreError(snapshotError))
        setStatus('error')
      },
    )

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionPath, pageCount, pageSize, orderByField, orderByDirection, resetKey, enabled])

  return {
    items,
    status,
    error,
    hasNextPage,
    nextPage: () => setPageCount((current) => current + 1),
  }
}

export function useCollectionCount(
  db: Firestore,
  collectionPath: string,
  buildConstraints: () => QueryConstraint[],
  resetKey: string,
) {
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState<FetchStatus>('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    const builtQuery = query(collection(db, collectionPath), ...buildConstraints())
    getCountFromServer(builtQuery)
      .then((snapshot) => {
        if (cancelled) return
        setCount(snapshot.data().count)
        setStatus('success')
      })
      .catch((error) => {
        if (cancelled) return
        mapFirestoreError(error)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionPath, resetKey])

  return { count, status }
}
