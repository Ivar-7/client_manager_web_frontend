import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import { firebaseConfig, hasFirebaseConfig } from './config'

export const firebaseApp = hasFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null

export function explainFirebaseError(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Firebase connection failed. Check your Firebase config and console settings.'
  }

  if (error.message.includes('permission-denied')) {
    return 'Firestore denied access (permission-denied). Update your Firestore security rules for this app environment.'
  }

  return error.message
}
