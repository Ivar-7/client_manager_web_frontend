import { Badge, Button, EmptyState, Field, Panel } from '../../../shared/components/UI'
import { clientStatusOptions, clientStatusTone, onboardingStageOptions } from '../constants/dashboardOptions'
import type { ClientInput, ClientRecord } from '../../../shared/types/domain'

interface ClientsPanelProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  clientForm: ClientInput
  onClientFormChange: (updater: (previous: ClientInput) => ClientInput) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  filteredClients: ClientRecord[]
  activeClientId: string | null
  onSelectClient: (clientId: string) => void
}

export function ClientsPanel({
  searchQuery,
  onSearchChange,
  clientForm,
  onClientFormChange,
  onSubmit,
  filteredClients,
  activeClientId,
  onSelectClient,
}: ClientsPanelProps) {
  return (
    <Panel
      title="Clients"
      subtitle="Search, inspect, and create onboarding accounts."
      action={<span className="panel__meta">{filteredClients.length} visible</span>}
    >
      <div className="stack stack--tight">
        <Field label="Search clients">
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Northstar, active, support@..."
          />
        </Field>

        <form className="grid-form" onSubmit={onSubmit}>
          <Field label="Name">
            <input
              value={clientForm.name}
              onChange={(event) => onClientFormChange((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="New client"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={clientForm.email}
              onChange={(event) => onClientFormChange((previous) => ({ ...previous, email: event.target.value }))}
              placeholder="client@example.com"
            />
          </Field>
          <Field label="Phone">
            <input
              value={clientForm.phone}
              onChange={(event) => onClientFormChange((previous) => ({ ...previous, phone: event.target.value }))}
              placeholder="+1 (555) 014-0000"
            />
          </Field>
          <Field label="Website">
            <input
              value={clientForm.website}
              onChange={(event) => onClientFormChange((previous) => ({ ...previous, website: event.target.value }))}
              placeholder="https://client.example"
            />
          </Field>
          <Field label="Status">
            <select
              value={clientForm.status}
              onChange={(event) =>
                onClientFormChange((previous) => ({
                  ...previous,
                  status: event.target.value as ClientInput['status'],
                }))
              }
            >
              {clientStatusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stage">
            <select
              value={clientForm.onboardingStage}
              onChange={(event) =>
                onClientFormChange((previous) => ({
                  ...previous,
                  onboardingStage: event.target.value as ClientInput['onboardingStage'],
                }))
              }
            >
              {onboardingStageOptions.map((stageOption) => (
                <option key={stageOption.value} value={stageOption.value}>
                  {stageOption.label}
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
              description="Create a client record to start onboarding operations."
            />
          ) : (
            filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                className={`client-card ${activeClientId === client.id ? 'client-card--active' : ''}`}
                onClick={() => onSelectClient(client.id)}
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
  )
}
