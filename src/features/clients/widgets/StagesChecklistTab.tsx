import { useEffect, useState } from 'react'

import { getAssignableUsers } from '../../../shared/api/users.api'
import type {
  ChecklistItemRecord,
  StageRecord,
  UserRecord,
} from '../../../shared/types/domain.types'
import { StageCard } from './StageCard'

interface StagesChecklistTabProps {
  stages: StageRecord[]
  checklistItems: ChecklistItemRecord[]
  isAdmin: boolean
  currentUserId: string
  currentUserName: string
}

export function StagesChecklistTab({
  stages,
  checklistItems,
  isAdmin,
  currentUserId,
  currentUserName,
}: StagesChecklistTabProps) {
  const [users, setUsers] = useState<UserRecord[]>([])

  useEffect(() => {
    getAssignableUsers().then(setUsers)
  }, [])

  const sortedStages = [...stages].sort((a, b) => a.order - b.order)

  return (
    <div className="grid gap-4">
      {sortedStages.map((stage) => (
        <StageCard
          key={stage.id}
          stage={stage}
          allStages={stages}
          items={checklistItems}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          users={users}
        />
      ))}
    </div>
  )
}
