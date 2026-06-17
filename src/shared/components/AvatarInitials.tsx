interface AvatarInitialsProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<NonNullable<AvatarInitialsProps['size']>, string> = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
}

export function AvatarInitials({ initials, size = 'md' }: AvatarInitialsProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-strong ${SIZE_CLASSES[size]}`}
      title={initials}
    >
      {initials}
    </span>
  )
}
