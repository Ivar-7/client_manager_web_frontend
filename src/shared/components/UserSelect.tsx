import { useEffect, useRef, useState } from 'react'

import type { UserRecord } from '../types/domain.types'

interface UserSelectProps {
  users: UserRecord[]
  value: string | null
  onChange: (userId: string | null) => void
  placeholder?: string
}

export function UserSelect({ users, value, onChange, placeholder = 'Unassigned' }: UserSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selected = users.find((user) => user.id === value)
  const filtered = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))

  const select = (userId: string | null) => {
    onChange(userId)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full rounded-lg border border-border bg-surface-strong px-3 py-2 text-left text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {selected ? selected.name : <span className="text-muted/70">{placeholder}</span>}
      </button>

      {open ? (
        <div className="absolute z-20 mt-1 w-full min-w-[220px] rounded-lg border border-border bg-surface shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search members…"
            className="w-full border-b border-border bg-transparent px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50"
          />
          <div className="max-h-56 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => select(null)}
              className="block w-full px-3 py-2 text-left text-sm text-muted hover:bg-surface-muted"
            >
              Unassigned
            </button>
            {filtered.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => select(user.id)}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted ${
                  user.id === value ? 'text-accent font-medium' : 'text-text'
                }`}
              >
                {user.name}
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">No members match "{query}".</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
