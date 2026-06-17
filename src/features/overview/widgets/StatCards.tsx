import { Card } from '../../../shared/components/Card'

interface StatCardsProps {
  cards: Array<{ label: string; value: number | null }>
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-sm text-muted">{card.label}</p>
          <strong className="mt-1 block text-3xl tracking-tight text-text">
            {card.value ?? '—'}
          </strong>
        </Card>
      ))}
    </div>
  )
}
