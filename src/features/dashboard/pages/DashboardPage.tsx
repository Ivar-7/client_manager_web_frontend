import { useMemo, useState, type FormEvent } from 'react'

import { Badge, Button, EmptyState, Field, LoadingState, Panel } from '../../../shared/components/UI'
import { formatDate, formatDateTime, toLocalDateInputValue } from '../../../shared/utils/dates'
import { useDashboardWorkspace } from '../providers/dashboardWorkspaceContext'
import type {
  AssetInput,
  AssetType,
  ChecklistItemInput,
  ClientInput,
  ClientRecord,
  MeetingInput,
  StageInput,
  StageStatus,
} from '../../../shared/types/domain'

const clientStatusTone: Record<ClientRecord['status'], 'positive' | 'warning' | 'neutral'> = {
  onboarding: 'warning',
  active: 'positive',
  inactive: 'neutral',
}

const stageTone: Record<StageStatus, 'neutral' | 'positive' | 'warning' | 'danger' | 'accent'> = {
  pending: 'neutral',
  inProgress: 'accent',
  blocked: 'warning',
  approved: 'positive',
  rejected: 'danger',
}

const assetTone: Record<AssetInput['status'], 'positive' | 'warning' | 'danger' | 'neutral'> = {
  active: 'positive',
  pending: 'warning',
  expired: 'danger',
  suspended: 'neutral',
}

const assetTypeLabels: Record<AssetType, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  dns: 'DNS',
}

const stageStatusOptions: Array<{ label: string; value: StageStatus }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'inProgress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const clientStatusOptions: ClientInput['status'][] = ['onboarding', 'active', 'inactive']
const assetTypeOptions: AssetType[] = ['domain', 'hosting', 'dns']
const assetStatusOptions: AssetInput['status'][] = ['active', 'pending', 'expired', 'suspended']

export default function DashboardPage() {
  const { mode, status, error, currentUser, workspace, createClient, updateClient, createStage, updateStageStatus, createChecklistItem, toggleChecklistItem, createAssetRecord, createMeetingNote, seedSampleWorkspace } = useDashboardWorkspace()
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [clientForm, setClientForm] = useState<ClientInput>({
    name: '',
    email: '',
    phone: '',
    website: '',
    status: 'onboarding',
    ownerId: currentUser?.id ?? null,
  })
  const [stageForm, setStageForm] = useState<StageInput>({
    clientId: '',
    name: '',
    order: 1,
    status: 'pending',
    dueDate: null,
    completedAt: null,
    actionedById: null,
    comment: '',
  })
  const [checklistForm, setChecklistForm] = useState<ChecklistItemInput>({
    stageId: '',
    meetingId: null,
    label: '',
    order: 1,
    completed: false,
    assignedTo: null,
    dueDate: null,
    completedAt: null,
  })
  const [assetForm, setAssetForm] = useState<AssetInput>({
    clientId: '',
    type: 'domain',
    name: '',
    value: '',
    status: 'pending',
    expiresAt: null,
  })
  const [meetingForm, setMeetingForm] = useState<MeetingInput>({
    clientId: '',
    title: '',
    date: new Date().toISOString(),
    notes: '',
    createdBy: currentUser?.name ?? 'Workspace user',
    attendees: [],
  })

  const selectedClient = useMemo(
    () => workspace.clients.find((client) => client.id === selectedClientId) ?? workspace.clients[0] ?? null,
    [selectedClientId, workspace.clients],
  )

  const filteredClients = workspace.clients.filter((client) => {
    const haystack = `${client.name} ${client.email} ${client.website} ${client.status}`.toLowerCase()
    return haystack.includes(searchQuery.toLowerCase())
  })

  const activeClientId = selectedClient?.id ?? selectedClientId ?? workspace.clients[0]?.id ?? ''
  const activeChecklistStageId =
    checklistForm.stageId && selectedStages.some((stage) => stage.id === checklistForm.stageId)
      ? checklistForm.stageId
      : selectedStages[0]?.id ?? ''

  const selectedStages = workspace.stages
    .filter((stage) => stage.clientId === selectedClient?.id)
    .sort((left, right) => left.order - right.order)

  const selectedChecklistItems = workspace.checklistItems
    .filter((item) => selectedStages.some((stage) => stage.id === item.stageId))
    .sort((left, right) => left.order - right.order)

  const selectedAssets = workspace.assetRecords
    .filter((asset) => asset.clientId === selectedClient?.id)
    .sort((left, right) => left.type.localeCompare(right.type))

  const selectedMeetings = workspace.meetingNotes
    .filter((meeting) => meeting.clientId === selectedClient?.id)
    .sort((left, right) => right.date.localeCompare(left.date))

  const pendingChecklistCount = workspace.checklistItems.filter((item) => !item.completed).length
  const approvedStageCount = workspace.stages.filter((stage) => stage.status === 'approved').length
  const onboardingClientCount = workspace.clients.filter((client) => client.status === 'onboarding').length

  async function handleClientSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!clientForm.name.trim()) {
      return
    }

    const createdClient = await createClient({
      ...clientForm,
      ownerId: clientForm.ownerId ?? currentUser?.id ?? null,
    })
    setSelectedClientId(createdClient.id)
    setClientForm({
      name: '',
      email: '',
      phone: '',
      website: '',
      status: 'onboarding',
      ownerId: currentUser?.id ?? null,
    })
  }

  async function handleStageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeClientId || !stageForm.name.trim()) {
      return
    }

    const createdStage = await createStage({
      ...stageForm,
      clientId: activeClientId,
    })
    setStageForm((previous) => ({
      ...previous,
      name: '',
      order: createdStage.order + 1,
      dueDate: null,
      status: 'pending',
      comment: '',
    }))
  }

  async function handleChecklistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeChecklistStageId || !checklistForm.label.trim()) {
      return
    }

    const createdChecklistItem = await createChecklistItem({
      ...checklistForm,
      stageId: activeChecklistStageId,
    })
    setChecklistForm((previous) => ({
      ...previous,
      label: '',
      order: createdChecklistItem.order + 1,
      meetingId: null,
      dueDate: null,
      completed: false,
    }))
  }

  async function handleAssetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeClientId || !assetForm.name.trim() || !assetForm.value.trim()) {
      return
    }

    const createdAsset = await createAssetRecord({
      ...assetForm,
      clientId: activeClientId,
    })
    setAssetForm((previous) => ({
      ...previous,
      name: '',
      value: '',
      expiresAt: null,
      status: createdAsset.status,
    }))
  }

  async function handleMeetingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeClientId || !meetingForm.title.trim()) {
      return
    }

    await createMeetingNote({
      ...meetingForm,
      clientId: activeClientId,
      createdBy: currentUser?.name ?? meetingForm.createdBy,
    })
    setMeetingForm((previous) => ({
      ...previous,
      title: '',
      notes: '',
      date: new Date().toISOString(),
      attendees: [],
    }))
  }

  if (status === 'loading') {
    return <LoadingState title="Connecting workspace" description="Loading your Firebase collections and session state." />
  }

  return (
    <div className="dashboard-shell">
      <aside className="hero-panel">
        <div className="hero-panel__eyebrow">Client Onboarding Dashboard</div>
        <h1>Ship client work with one live Firebase workspace.</h1>
        <p>
          Track onboarding stages, checklist progress, infrastructure records, and meeting notes from a single source of truth.
        </p>
        <div className="hero-panel__stats">
          <article>
            <strong>{workspace.clients.length}</strong>
            <span>Clients</span>
          </article>
          <article>
            <strong>{onboardingClientCount}</strong>
            <span>Onboarding</span>
          </article>
          <article>
            <strong>{pendingChecklistCount}</strong>
            <span>Open tasks</span>
          </article>
          <article>
            <strong>{approvedStageCount}</strong>
            <span>Approved stages</span>
          </article>
        </div>
        <div className="hero-panel__status-row">
          <Badge tone={mode === 'firebase' ? 'positive' : 'warning'}>{mode === 'firebase' ? 'Firebase' : 'Demo mode'}</Badge>
          <Badge tone={error ? 'danger' : 'neutral'}>{error ?? 'Realtime workspace ready'}</Badge>
        </div>
        <Button variant="secondary" onClick={() => void seedSampleWorkspace()}>
          Load sample workspace
        </Button>
      </aside>

      <main className="dashboard-grid">
        <Panel
          title="Clients"
          subtitle="Search, inspect, and create onboarding accounts."
          action={<span className="panel__meta">{filteredClients.length} visible</span>}
        >
          <div className="stack stack--tight">
            <Field label="Search clients">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Northstar, active, support@..."
              />
            </Field>

            <form className="grid-form" onSubmit={(event) => void handleClientSubmit(event)}>
              <Field label="Name">
                <input
                  value={clientForm.name}
                  onChange={(event) => setClientForm((previous) => ({ ...previous, name: event.target.value }))}
                  placeholder="New client"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(event) => setClientForm((previous) => ({ ...previous, email: event.target.value }))}
                  placeholder="client@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={clientForm.phone}
                  onChange={(event) => setClientForm((previous) => ({ ...previous, phone: event.target.value }))}
                  placeholder="+1 (555) 014-0000"
                />
              </Field>
              <Field label="Website">
                <input
                  value={clientForm.website}
                  onChange={(event) => setClientForm((previous) => ({ ...previous, website: event.target.value }))}
                  placeholder="https://client.example"
                />
              </Field>
              <Field label="Status">
                <select
                  value={clientForm.status}
                  onChange={(event) => setClientForm((previous) => ({ ...previous, status: event.target.value as ClientInput['status'] }))}
                >
                  {clientStatusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="form-actions">
                <Button type="submit">Create client</Button>
              </div>
            </form>

            <div className="scroll-stack client-list">
              {filteredClients.length === 0 ? (
                <EmptyState
                  title="No clients yet"
                  description="Create a client record or load the sample workspace to see the full onboarding flow."
                />
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className={`client-card ${selectedClient?.id === client.id ? 'client-card--active' : ''}`}
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <div>
                      <strong>{client.name}</strong>
                      <p>{client.email}</p>
                    </div>
                    <Badge tone={clientStatusTone[client.status]}>{client.status}</Badge>
                  </button>
                ))
              )}
            </div>
          </div>
        </Panel>

        <section className="detail-column">
          <Panel
            title={selectedClient ? selectedClient.name : 'Select a client'}
            subtitle={selectedClient ? `${selectedClient.website} · ${selectedClient.phone}` : 'Choose a client from the list to manage onboarding work.'}
            action={selectedClient ? <Badge tone={clientStatusTone[selectedClient.status]}>{selectedClient.status}</Badge> : null}
          >
            {selectedClient ? (
              <div className="detail-card">
                <div className="detail-card__grid">
                  <div>
                    <span>Owner</span>
                    <strong>{workspace.users.find((user) => user.id === selectedClient.ownerId)?.name ?? 'Unassigned'}</strong>
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
                      onChange={(event) => void updateClient(selectedClient.id, { status: event.target.value as ClientInput['status'] })}
                    >
                      {clientStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      void updateClient(selectedClient.id, {
                        ownerId: currentUser?.id ?? null,
                      })
                    }
                  >
                    Assign to me
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No client selected"
                description="Pick a client from the sidebar to see their stages, checklist items, assets, and meeting history."
              />
            )}
          </Panel>

          <div className="section-grid">
            <Panel
              title="Stages"
              subtitle="Track approval flow for the selected client."
              action={
                <form className="mini-form" onSubmit={(event) => void handleStageSubmit(event)}>
                  <Button type="submit">Add stage</Button>
                </form>
              }
            >
              <form className="stack stack--tight" onSubmit={(event) => void handleStageSubmit(event)}>
                <div className="grid-form grid-form--compact">
                  <Field label="Name">
                    <input
                      value={stageForm.name}
                      onChange={(event) => setStageForm((previous) => ({ ...previous, name: event.target.value }))}
                      placeholder="Content review"
                    />
                  </Field>
                  <Field label="Order">
                    <input
                      type="number"
                      min="1"
                      value={stageForm.order}
                      onChange={(event) => setStageForm((previous) => ({ ...previous, order: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Due date">
                    <input
                      type="date"
                      value={toLocalDateInputValue(stageForm.dueDate)}
                      onChange={(event) =>
                        setStageForm((previous) => ({
                          ...previous,
                          dueDate: event.target.value ? new Date(event.target.value).toISOString() : null,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={stageForm.status}
                      onChange={(event) => setStageForm((previous) => ({ ...previous, status: event.target.value as StageStatus }))}
                    >
                      {stageStatusOptions.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Comment">
                  <textarea
                    rows={2}
                    value={stageForm.comment ?? ''}
                    onChange={(event) => setStageForm((previous) => ({ ...previous, comment: event.target.value }))}
                    placeholder="Add context for this stage"
                  />
                </Field>
                <div className="form-actions">
                  <Button type="submit">Save stage</Button>
                </div>
              </form>

              <div className="stack">
                {selectedStages.length === 0 ? (
                  <EmptyState
                    title="No stages for this client"
                    description="Add the first onboarding stage to start tracking approvals."
                  />
                ) : (
                  selectedStages.map((stage) => (
                    <article key={stage.id} className="list-card">
                      <div className="list-card__top">
                        <div>
                          <strong>{stage.name}</strong>
                          <p>
                            Order {stage.order} · Due {formatDate(stage.dueDate)}
                          </p>
                        </div>
                        <Badge tone={stageTone[stage.status]}>{stage.status}</Badge>
                      </div>
                      <p>{stage.comment || 'No comment added yet.'}</p>
                      <div className="list-card__actions">
                        {stageStatusOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={stage.status === option.value ? 'primary' : 'ghost'}
                            type="button"
                            onClick={() => void updateStageStatus(stage.id, option.value, stage.comment)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Checklist" subtitle="Confirm deliverables for the current stages.">
              <form className="stack stack--tight" onSubmit={(event) => void handleChecklistSubmit(event)}>
                <div className="grid-form grid-form--compact">
                  <Field label="Stage">
                    <select
                        value={activeChecklistStageId}
                        onChange={(event) => setChecklistForm((previous) => ({ ...previous, stageId: event.target.value }))}
                    >
                      <option value="">Select stage</option>
                      {selectedStages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Label">
                    <input
                      value={checklistForm.label}
                      onChange={(event) => setChecklistForm((previous) => ({ ...previous, label: event.target.value }))}
                      placeholder="Approve homepage content"
                    />
                  </Field>
                  <Field label="Order">
                    <input
                      type="number"
                      min="1"
                      value={checklistForm.order}
                      onChange={(event) => setChecklistForm((previous) => ({ ...previous, order: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Due date">
                    <input
                      type="date"
                      value={toLocalDateInputValue(checklistForm.dueDate)}
                      onChange={(event) =>
                        setChecklistForm((previous) => ({
                          ...previous,
                          dueDate: event.target.value ? new Date(event.target.value).toISOString() : null,
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="form-actions">
                  <Button type="submit">Add checklist item</Button>
                </div>
              </form>

              <div className="stack">
                {selectedChecklistItems.length === 0 ? (
                  <EmptyState title="No checklist items yet" description="Create tasks that map to a stage." />
                ) : (
                  selectedChecklistItems.map((item) => (
                    <label key={item.id} className="check-item">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => void toggleChecklistItem(item.id, !item.completed)}
                      />
                      <span>
                        <strong>{item.label}</strong>
                        <small>
                          Due {formatDate(item.dueDate)} · {item.completed ? 'Completed' : 'Open'}
                        </small>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Infrastructure" subtitle="Keep domain, hosting, and DNS records in sync.">
              <form className="stack stack--tight" onSubmit={(event) => void handleAssetSubmit(event)}>
                <div className="grid-form grid-form--compact">
                  <Field label="Type">
                    <select
                      value={assetForm.type}
                      onChange={(event) => setAssetForm((previous) => ({ ...previous, type: event.target.value as AssetType }))}
                    >
                      {assetTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {assetTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Name">
                    <input
                      value={assetForm.name}
                      onChange={(event) => setAssetForm((previous) => ({ ...previous, name: event.target.value }))}
                      placeholder="Primary domain"
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      value={assetForm.value}
                      onChange={(event) => setAssetForm((previous) => ({ ...previous, value: event.target.value }))}
                      placeholder="example.com"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={assetForm.status}
                      onChange={(event) => setAssetForm((previous) => ({ ...previous, status: event.target.value as AssetInput['status'] }))}
                    >
                      {assetStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Expires">
                  <input
                    type="date"
                    value={toLocalDateInputValue(assetForm.expiresAt)}
                    onChange={(event) =>
                      setAssetForm((previous) => ({
                        ...previous,
                        expiresAt: event.target.value ? new Date(event.target.value).toISOString() : null,
                      }))
                    }
                  />
                </Field>
                <div className="form-actions">
                  <Button type="submit">Add record</Button>
                </div>
              </form>

              <div className="stack">
                {selectedAssets.length === 0 ? (
                  <EmptyState title="No records yet" description="Create a domain, hosting, or DNS record to keep the launch team aligned." />
                ) : (
                  selectedAssets.map((asset) => (
                    <article key={asset.id} className="list-card">
                      <div className="list-card__top">
                        <div>
                          <strong>{asset.name}</strong>
                          <p>{asset.value}</p>
                        </div>
                        <Badge tone={assetTone[asset.status]}>{assetTypeLabels[asset.type]} · {asset.status}</Badge>
                      </div>
                      <p>Expires {formatDate(asset.expiresAt)}</p>
                    </article>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Meeting notes" subtitle="Capture client decisions and attendees.">
              <form className="stack stack--tight" onSubmit={(event) => void handleMeetingSubmit(event)}>
                <div className="grid-form grid-form--compact">
                  <Field label="Title">
                    <input
                      value={meetingForm.title}
                      onChange={(event) => setMeetingForm((previous) => ({ ...previous, title: event.target.value }))}
                      placeholder="Weekly sync"
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      type="datetime-local"
                      value={toLocalDateInputValue(meetingForm.date)}
                      onChange={(event) =>
                        setMeetingForm((previous) => ({
                          ...previous,
                          date: event.target.value ? new Date(event.target.value).toISOString() : new Date().toISOString(),
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Attendees">
                  <input
                    value={meetingForm.attendees.join(', ')}
                    onChange={(event) =>
                      setMeetingForm((previous) => ({
                        ...previous,
                        attendees: event.target.value
                          .split(',')
                          .map((value) => value.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Anna Rivera, Mina Hart"
                  />
                </Field>
                <Field label="Notes">
                  <textarea
                    rows={3}
                    value={meetingForm.notes}
                    onChange={(event) => setMeetingForm((previous) => ({ ...previous, notes: event.target.value }))}
                    placeholder="Record decisions, blockers, and follow-up items."
                  />
                </Field>
                <div className="form-actions">
                  <Button type="submit">Save note</Button>
                </div>
              </form>

              <div className="stack">
                {selectedMeetings.length === 0 ? (
                  <EmptyState title="No meeting notes yet" description="Log the last conversation so the onboarding team stays aligned." />
                ) : (
                  selectedMeetings.map((meeting) => (
                    <article key={meeting.id} className="list-card">
                      <div className="list-card__top">
                        <div>
                          <strong>{meeting.title}</strong>
                          <p>
                            {formatDateTime(meeting.date)} · Created by {meeting.createdBy}
                          </p>
                        </div>
                        <Badge tone="accent">{meeting.attendees.length} attendees</Badge>
                      </div>
                      <p>{meeting.notes}</p>
                      <p className="muted">{meeting.attendees.join(' • ')}</p>
                    </article>
                  ))
                )}
              </div>
            </Panel>
          </div>
        </section>
      </main>
    </div>
  )
}
