import { Badge, Button, EmptyState, Field, Panel } from '../../../shared/components/UI'
import { formatDateTime } from '../../../shared/utils/dates'
import { clientStatusOptions, clientStatusTone, onboardingStageOptions, stageTone } from '../constants/dashboardOptions'
import type { ChecklistItemRecord, ClientInput, ClientRecord, UserRecord } from '../../../shared/types/domain'

interface ClientOverviewPanelProps {
  selectedClient: ClientRecord | null
  selectedChecklistItems: ChecklistItemRecord[]
  users: UserRecord[]
  currentUserId: string | null
  onUpdateClient: (clientId: string, patch: Partial<ClientInput>) => Promise<void>
  onToggleChecklistItem: (itemId: string, completed: boolean) => Promise<void>
  onDeleteChecklistItem: (itemId: string) => Promise<void>
}

export function ClientOverviewPanel({
  selectedClient,
  selectedChecklistItems,
  users,
  currentUserId,
  onUpdateClient,
  onToggleChecklistItem,
  onDeleteChecklistItem,
}: ClientOverviewPanelProps) {
  const completedCount = selectedChecklistItems.filter((item) => item.completed).length

  return (
    <Panel
      title={selectedClient ? selectedClient.name : 'Select a client'}
      subtitle={
        selectedClient
          ? `${selectedClient.website} · ${selectedClient.phone}`
          : 'Choose a client from the list to manage onboarding work.'
      }
      action={
        selectedClient ? (
          <div className="inline-actions">
            <Badge tone={clientStatusTone[selectedClient.status]}>{selectedClient.status}</Badge>
            <Badge tone={stageTone[selectedClient.onboardingStage]}>{selectedClient.onboardingStage}</Badge>
          </div>
        ) : null
      }
    >
      {selectedClient ? (
        <div className="detail-card">
          <div className="detail-card__grid">
            <div>
              <span>Owner</span>
              <strong>{users.find((user) => user.id === selectedClient.ownerId)?.name ?? 'Unassigned'}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{formatDateTime(selectedClient.createdAt)}</strong>
            </div>
            <div>
              <span>Updated</span>
              <strong>{formatDateTime(selectedClient.updatedAt)}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{selectedClient.email}</strong>
            </div>
          </div>
          <div className="inline-form">
            <Field label="Update client status">
              <select
                value={selectedClient.status}
                onChange={(event) =>
                  void onUpdateClient(selectedClient.id, {
                    status: event.target.value as ClientInput['status'],
                  })
                }
              >
                {clientStatusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </Field>
              <Field label="Update stage">
                <select
                  value={selectedClient.onboardingStage}
                  onChange={(event) =>
                    void onUpdateClient(selectedClient.id, {
                      onboardingStage: event.target.value as ClientInput['onboardingStage'],
                    })
                  }
                >
                  {onboardingStageOptions.map((stageOption) => (
                    <option key={stageOption.value} value={stageOption.value}>
                      {stageOption.label}
                    </option>
                  ))}
                </select>
              </Field>
            <Button
              variant="secondary"
              onClick={() =>
                void onUpdateClient(selectedClient.id, {
                  ownerId: currentUserId,
                })
              }
            >
              Assign to me
            </Button>
          </div>
          <div className="stack stack--tight">
            <div className="inline-actions">
              <strong>Client checklist</strong>
              <span className="muted">
                {completedCount}/{selectedChecklistItems.length} completed
              </span>
            </div>
            {selectedChecklistItems.length === 0 ? (
              <EmptyState
                title="Checklist not initialized"
                description="Create checklist templates in Workflow, then initialize this client checklist."
              />
            ) : (
              selectedChecklistItems.map((item) => (
                <div key={item.id} className="check-item">
                  <label style={{ display: 'contents' }}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => void onToggleChecklistItem(item.id, !item.completed)}
                    />
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.completed ? 'Done' : 'Not done'}</small>
                    </span>
                  </label>
                  <Button type="button" variant="ghost" onClick={() => void onDeleteChecklistItem(item.id)}>
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No client selected"
          description="Pick a client from the sidebar to manage stage and checklist completion."
        />
      )}
    </Panel>
  )
}
