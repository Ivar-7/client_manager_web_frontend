import { motion } from 'framer-motion'

import type { StageRecord } from '../types/domain.types'

interface StageProgressProps {
  stages: StageRecord[]
}

const STATUS_CLASSES: Record<StageRecord['status'], string> = {
  pending: 'bg-surface-strong text-muted border-border',
  inProgress: 'bg-accent text-white border-accent shadow-sm shadow-accent/30',
  blocked: 'bg-danger-soft text-danger border-danger/30',
  approved: 'bg-success-soft text-success border-success/30',
  rejected: 'bg-danger-soft text-danger border-danger/30',
}

export function StageProgress({ stages }: StageProgressProps) {
  const sorted = [...stages].sort((a, b) => a.order - b.order)

  return (
    <ol className="flex w-full items-center gap-1 overflow-x-auto">
      {sorted.map((stage, index) => (
        <li key={stage.id} className="flex flex-1 items-center gap-1">
          <motion.div
            layout
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition-all sm:px-3 ${STATUS_CLASSES[stage.status]}`}
            title={`${stage.name}: ${stage.status}`}
          >
            <span className="shrink-0 font-mono text-[10px] opacity-60">{stage.order}</span>
            <span className="hidden truncate sm:inline">{stage.name}</span>
          </motion.div>
          {index < sorted.length - 1 ? (
            <span className="h-px w-2 shrink-0 bg-border-strong" />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
