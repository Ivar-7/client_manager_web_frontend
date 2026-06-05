import { useMemo, useState, type FormEvent } from 'react'

import { useDashboardWorkspace } from '../providers/dashboardWorkspaceContext'
import type { AssetInput, ChecklistTemplateInput, ClientInput, MeetingInput } from '../../../shared/types/domain'

export function useDashboardPageModel() {
  const {
    mode,
    status,
    error,
    currentUser,
    workspace,
    createClient,
    updateClient,
    createChecklistTemplate,
    updateChecklistTemplate,
    deleteChecklistTemplate,
    initializeClientChecklist,
    toggleChecklistItem,
    deleteChecklistItem,
    createAssetRecord,
    createMeetingNote,
  } = useDashboardWorkspace()

  const [selectedClientId, setSelectedClientId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [clientForm, setClientForm] = useState<ClientInput>({
    name: '',
    email: '',
    phone: '',
    website: '',
    status: 'onboarding',
    onboardingStage: 'intake',
    ownerId: currentUser?.id ?? null,
  })
  const [templateForm, setTemplateForm] = useState<ChecklistTemplateInput>({
    label: '',
    description: '',
    order: 1,
    required: true,
    active: true,
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

  const filteredClients = useMemo(
    () =>
      workspace.clients.filter((client) => {
        const haystack = `${client.name} ${client.email} ${client.website} ${client.status}`.toLowerCase()
        return haystack.includes(searchQuery.toLowerCase())
      }),
    [searchQuery, workspace.clients],
  )

  const activeClientId = selectedClient?.id ?? selectedClientId ?? workspace.clients[0]?.id ?? ''

  const checklistTemplates = useMemo(
    () => [...workspace.checklistTemplates].sort((left, right) => left.order - right.order),
    [workspace.checklistTemplates],
  )

  const selectedChecklistItems = useMemo(
    () =>
      workspace.checklistItems
        .filter((item) => item.clientId === selectedClient?.id)
        .sort((left, right) => left.order - right.order),
    [selectedClient?.id, workspace.checklistItems],
  )

  const selectedAssets = useMemo(
    () =>
      workspace.assetRecords
        .filter((asset) => asset.clientId === selectedClient?.id)
        .sort((left, right) => left.type.localeCompare(right.type)),
    [selectedClient?.id, workspace.assetRecords],
  )

  const selectedMeetings = useMemo(
    () =>
      workspace.meetingNotes
        .filter((meeting) => meeting.clientId === selectedClient?.id)
        .sort((left, right) => right.date.localeCompare(left.date)),
    [selectedClient?.id, workspace.meetingNotes],
  )

  const pendingChecklistCount = workspace.checklistItems.filter((item) => !item.completed).length
  const approvedStageCount = workspace.clients.filter((client) => client.onboardingStage === 'goLive').length
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
    await initializeClientChecklist(createdClient.id)

    setSelectedClientId(createdClient.id)
    setClientForm({
      name: '',
      email: '',
      phone: '',
      website: '',
      status: 'onboarding',
      onboardingStage: 'intake',
      ownerId: currentUser?.id ?? null,
    })
  }

  async function handleTemplateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!templateForm.label.trim()) {
      return
    }

    const createdTemplate = await createChecklistTemplate({
      ...templateForm,
      order: Math.max(1, templateForm.order),
    })

    await Promise.all(
      workspace.clients.map(async (client) => initializeClientChecklist(client.id, createdTemplate)),
    )

    setTemplateForm((previous) => ({
      ...previous,
      label: '',
      description: '',
      order: createdTemplate.order + 1,
      required: true,
      active: true,
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

  return {
    mode,
    status,
    error,
    currentUser,
    workspace,
    searchQuery,
    setSearchQuery,
    clientForm,
    setClientForm,
    templateForm,
    setTemplateForm,
    assetForm,
    setAssetForm,
    meetingForm,
    setMeetingForm,
    selectedClient,
    setSelectedClientId,
    filteredClients,
    checklistTemplates,
    selectedChecklistItems,
    selectedAssets,
    selectedMeetings,
    pendingChecklistCount,
    approvedStageCount,
    onboardingClientCount,
    handleClientSubmit,
    handleTemplateSubmit,
    handleAssetSubmit,
    handleMeetingSubmit,
    updateClient,
    updateChecklistTemplate,
    deleteChecklistTemplate,
    initializeClientChecklist,
    toggleChecklistItem,
    deleteChecklistItem,
  }
}
