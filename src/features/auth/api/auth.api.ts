import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { auth, db } from '../../../shared/api/firebaseClient'
import { initialsFromName } from '../../../shared/api/users.api'

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signUp(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })

  await setDoc(doc(db, 'users', credential.user.uid), {
    name,
    email,
    role: 'member',
    avatarInitials: initialsFromName(name),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function signOutUser() {
  await signOut(auth)
}
