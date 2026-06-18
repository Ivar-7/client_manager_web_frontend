interface AvatarInitialsProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<NonNullable<AvatarInitialsProps['size']>, string> = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-11 text-base',
}

export function AvatarInitials({ initials, size = 'md' }: AvatarInitialsProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-accent/10 font-semibold text-accent ring-1 ring-accent/20 ${SIZE_CLASSES[size]}`}
      title={initials}
    >
      {initials}
    </span>
  )
}
