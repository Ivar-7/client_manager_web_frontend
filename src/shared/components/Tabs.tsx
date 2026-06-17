interface TabItem {
  key: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto rounded-full border border-border bg-surface-muted p-1.5">
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'bg-accent text-white' : 'text-muted hover:text-text'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
