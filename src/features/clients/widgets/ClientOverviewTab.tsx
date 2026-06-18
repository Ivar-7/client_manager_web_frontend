import { useEffect, useState } from 'react'

import { useAuth } from '../../../app/providers/useAuth'
import { updateClient } from '../../../shared/api/clients.api'
import { getUsersByIds } from '../../../shared/api/users.api'
import { AvatarInitials } from '../../../shared/components/AvatarInitials'
import { Card } from '../../../shared/components/Card'
import { InlineEditField } from '../../../shared/components/InlineEditField'
import { StageProgress } from '../../../shared/components/StageProgress'
import { TagChip } from '../../../shared/components/TagChip'
import type {
  ChecklistItemRecord,
  ClientRecord,
  StageRecord,
  UserRecord,
} from '../../../shared/types/domain.types'

interface ClientOverviewTabProps {
  client: ClientRecord
  stages: StageRecord[]
  checklistItems: ChecklistItemRecord[]
}

export function ClientOverviewTab({ client, stages, checklistItems }: ClientOverviewTabProps) {
  const { isAdmin, firebaseUser, profile } = useAuth()
  const [assignedTeam, setAssignedTeam] = useState<UserRecord[]>([])

  useEffect(() => {
    const assigneeIds = checklistItems
      .map((item) => item.assignedTo)
      .filter((id): id is string => Boolean(id))
    getUsersByIds(assigneeIds).then(setAssignedTeam)
  }, [checklistItems])

  const save = (field: keyof ClientRecord) => async (value: string) => {
    if (!firebaseUser || !profile) return
    await updateClient(client.id, { [field]: value }, firebaseUser.uid, profile.name)
  }

  return (
    <div className="grid gap-5">
      <Card title="Onboarding progress">
        <StageProgress stages={stages} />
      </Card>

      <Card title="Client details">
        <div className="grid gap-4 sm:grid-cols-2">
          <InlineEditField
            label="Name"
            value={client.name}
            onSave={save('name')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Email"
            value={client.email}
            onSave={save('email')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Phone"
            value={client.phone}
            onSave={save('phone')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Website"
            value={client.website}
            onSave={save('website')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Company"
            value={client.companyName}
            onSave={save('companyName')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Industry"
            value={client.industry}
            onSave={save('industry')}
            readOnly={!isAdmin}
          />
          <InlineEditField
            label="Notes"
            value={client.notes}
            onSave={save('notes')}
            readOnly={!isAdmin}
            multiline
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(client.tags ?? []).map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      </Card>

      <Card title="Assigned team">
        {assignedTeam.length === 0 ? (
          <p className="text-sm text-muted">No team members assigned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {assignedTeam.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <AvatarInitials initials={user.avatarInitials} size="sm" />
                <span className="text-sm text-text">{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
