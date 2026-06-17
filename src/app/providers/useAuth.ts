import { useContext } from 'react'

import { AuthContext } from './AuthProvider'

export function useAuth() {
  const context = useContext(AuthContext)
  return {
    ...context,
    isAdmin: context.profile?.role === 'admin',
    isMember: context.profile?.role === 'member',
  }
}
