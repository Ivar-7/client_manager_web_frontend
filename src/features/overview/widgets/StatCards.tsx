interface StatCardsProps {
  cards: Array<{ label: string; value: number | null }>
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{card.label}</p>
          <strong className="mt-3 block font-mono text-4xl font-bold tracking-tight text-text">
            {card.value ?? (
              <span className="inline-block size-8 animate-pulse rounded-lg bg-surface-strong" />
            )}
          </strong>
        </div>
      ))}
    </div>
  )
}
