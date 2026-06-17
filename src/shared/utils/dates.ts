import { Timestamp } from 'firebase/firestore'

export type DateLike = Timestamp | Date | string | number | null | undefined

function toDate(value: DateLike): Date | null {
  if (!value) return null
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: DateLike) {
  const date = toDate(value)
  if (!date) return 'Not set'
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

export function formatDateTime(value: DateLike) {
  const date = toDate(value)
  if (!date) return 'Not set'
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function toLocalDateInputValue(value: DateLike) {
  const date = toDate(value)
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

export function relativeTime(value: DateLike) {
  const date = toDate(value)
  if (!date) return 'just now'

  const diffMs = date.getTime() - Date.now()
  const diffSeconds = Math.round(diffMs / 1000)
  const abs = Math.abs(diffSeconds)

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ]

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  for (const [unit, secondsInUnit] of units) {
    if (abs >= secondsInUnit || unit === 'second') {
      return formatter.format(Math.round(diffSeconds / secondsInUnit), unit)
    }
  }

  return formatter.format(0, 'second')
}

export function isOverdue(value: DateLike, completed = false) {
  const date = toDate(value)
  if (!date || completed) return false
  return date.getTime() < Date.now()
}

export function isExpiringSoon(value: DateLike, withinDays = 30) {
  const date = toDate(value)
  if (!date) return false
  const diffDays = (date.getTime() - Date.now()) / 86400000
  return diffDays >= 0 && diffDays <= withinDays
}

export function isExpired(value: DateLike) {
  const date = toDate(value)
  if (!date) return false
  return date.getTime() < Date.now()
}
