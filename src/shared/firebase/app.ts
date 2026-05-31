import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import { firebaseConfig, hasFirebaseConfig } from './config'

export const firebaseApp = hasFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null

export async function ensureAnonymousSession() {
  if (!firebaseAuth) {
    return null
  }

  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser
  }

  const credential = await signInAnonymously(firebaseAuth)
  return credential.user
}
