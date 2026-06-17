import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FieldProps {
  label: string
  children: ReactNode
  hint?: string
  className?: string
}

export function Field({ label, children, hint, className }: FieldProps) {
  return (
    <label className={`grid gap-1.5 ${className ?? ''}`}>
      <span className="text-sm text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  )
}

const inputClasses =
  'w-full rounded-2xl border border-border bg-surface-strong px-3.5 py-2.5 text-sm text-text outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft disabled:opacity-60'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClasses} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`${inputClasses} min-h-24 resize-y ${props.className ?? ''}`} />
  )
}
