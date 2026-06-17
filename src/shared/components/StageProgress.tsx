import { motion } from 'framer-motion'

import type { StageRecord } from '../types/domain.types'

interface StageProgressProps {
  stages: StageRecord[]
}

const STATUS_CLASSES: Record<StageRecord['status'], string> = {
  pending: 'bg-surface-muted text-muted border-border',
  inProgress: 'bg-accent text-white border-accent',
  blocked: 'bg-danger-soft text-danger border-danger/40',
  approved: 'bg-success-soft text-success border-success/40',
  rejected: 'bg-danger-soft text-danger border-danger/40',
}

export function StageProgress({ stages }: StageProgressProps) {
  const sorted = [...stages].sort((a, b) => a.order - b.order)

  return (
    <ol className="flex w-full items-center gap-1.5 overflow-x-auto sm:gap-2">
      {sorted.map((stage, index) => (
        <li key={stage.id} className="flex flex-1 items-center gap-1.5 sm:gap-2">
          <motion.div
            layout
            className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border px-2 py-2 text-center text-xs font-semibold sm:px-3 ${STATUS_CLASSES[stage.status]}`}
            title={`${stage.name}: ${stage.status}`}
          >
            <span className="shrink-0">{stage.order}</span>
            <span className="hidden truncate sm:inline">{stage.name}</span>
          </motion.div>
          {index < sorted.length - 1 ? (
            <span className="h-px w-3 shrink-0 bg-border-strong sm:w-4" />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
