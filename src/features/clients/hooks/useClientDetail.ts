import { useAuth } from '../../../app/providers/useAuth'
import { useClientDoc } from '../../../shared/api/clients.api'
import { useClientStages } from '../../../shared/api/stages.api'
import { useClientChecklistItems } from '../../../shared/api/checklistItems.api'

export function useClientDetail(clientId: string) {
  const { isAdmin, firebaseUser } = useAuth()
  const { client, status: clientStatus, error } = useClientDoc(clientId)
  const { stages, status: stagesStatus } = useClientStages(clientId)
  const { items: checklistItems, status: checklistStatus } = useClientChecklistItems(clientId)

  const hasAssignedItem = checklistItems.some((item) => item.assignedTo === firebaseUser?.uid)
  const isOwner = Boolean(client && firebaseUser && client.ownerId === firebaseUser.uid)
  const hasAccess = isAdmin || hasAssignedItem || isOwner

  const visibleChecklistItems = isAdmin
    ? checklistItems
    : checklistItems.filter((item) => item.assignedTo === firebaseUser?.uid)

  const status =
    clientStatus === 'loading' || stagesStatus === 'loading' || checklistStatus === 'loading'
      ? 'loading'
      : clientStatus === 'error'
        ? 'error'
        : clientStatus === 'empty'
          ? 'empty'
          : 'success'

  return {
    client,
    stages,
    checklistItems: visibleChecklistItems,
    allChecklistItems: checklistItems,
    hasAccess,
    status,
    error,
  }
}
