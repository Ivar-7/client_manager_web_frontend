import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../../app/providers/useAuth'
import { assignClientToMember, deleteClient, updateClient } from '../../../shared/api/clients.api'
import { getAssignableUsers, getUsersByIds } from '../../../shared/api/users.api'
import { AvatarInitials } from '../../../shared/components/AvatarInitials'
import { Card } from '../../../shared/components/Card'
import { InlineConfirm } from '../../../shared/components/InlineConfirm'
import { InlineEditField } from '../../../shared/components/InlineEditField'
import { StageProgress } from '../../../shared/components/StageProgress'
import { TagChip } from '../../../shared/components/TagChip'
import { UserSelect } from '../../../shared/components/UserSelect'
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
  const navigate = useNavigate()
  const [assignedTeam, setAssignedTeam] = useState<UserRecord[]>([])
  const [assignableUsers, setAssignableUsers] = useState<UserRecord[]>([])
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    const assigneeIds = checklistItems
      .map((item) => item.assignedTo)
      .filter((id): id is string => Boolean(id))
    getUsersByIds(assigneeIds).then(setAssignedTeam)
  }, [checklistItems])

  useEffect(() => {
    getAssignableUsers().then(setAssignableUsers)
  }, [])

  const save = (field: keyof ClientRecord) => async (value: string) => {
    if (!firebaseUser || !profile) return
    await updateClient(client.id, { [field]: value }, firebaseUser.uid, profile.name)
  }

  const handleAssign = async (userId: string | null) => {
    if (!firebaseUser || !profile || !userId) return
    setAssigning(true)
    try {
      await assignClientToMember(client.id, client.name, userId, firebaseUser.uid, profile.name)
    } finally {
      setAssigning(false)
    }
  }

  const handleDelete = async () => {
    if (!firebaseUser || !profile) return
    await deleteClient(client.id, firebaseUser.uid, profile.name, client.name)
    navigate('/clients')
  }

  return (
    <div className="grid gap-5">
      <Card title="Onboarding progress">
        <StageProgress stages={stages} />
      </Card>

      <Card title="Client details">
        <div className="grid gap-5 sm:grid-cols-2">
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
        {(client.tags ?? []).length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            <span className="w-full text-xs font-semibold uppercase tracking-wider text-muted">
              Tags
            </span>
            {(client.tags ?? []).map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        ) : null}
      </Card>

      {isAdmin ? (
        <Card
          title="Assign to member"
          subtitle="Sets the client owner and assigns any unassigned checklist items to them — no need to go stage by stage."
        >
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <UserSelect
                users={assignableUsers}
                value={client.ownerId}
                onChange={handleAssign}
                placeholder="Choose a member…"
              />
            </div>
            {assigning ? <span className="text-xs text-muted">Assigning…</span> : null}
          </div>
        </Card>
      ) : null}

      <Card title="Assigned team">
        {assignedTeam.length === 0 ? (
          <p className="text-sm text-muted">No team members assigned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {assignedTeam.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <AvatarInitials initials={user.avatarInitials} size="sm" />
                <span className="text-sm font-medium text-text">{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {isAdmin ? (
        <Card title="Danger zone">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Permanently deletes this client along with its stages, checklist, assets, and meeting
              notes. This cannot be undone.
            </p>
            <InlineConfirm label="Delete client" onConfirm={handleDelete} />
          </div>
        </Card>
      ) : null}
    </div>
  )
}
