import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useEffect, useState, type ReactNode } from 'react'

import { auth } from '../../shared/api/firebaseClient'
import { getUserById } from '../../shared/api/users.api'
import type { UserRecord } from '../../shared/types/domain.types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  status: AuthStatus
  firebaseUser: User | null
  profile: UserRecord | null
}

export const AuthContext = createContext<AuthContextValue>({
  status: 'loading',
  firebaseUser: null,
  profile: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserRecord | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null)
        setProfile(null)
        setStatus('unauthenticated')
        return
      }

      setFirebaseUser(user)
      const userProfile = await getUserById(user.uid)
      setProfile(userProfile)
      setStatus('authenticated')
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ status, firebaseUser, profile }}>
      {children}
    </AuthContext.Provider>
  )
}
