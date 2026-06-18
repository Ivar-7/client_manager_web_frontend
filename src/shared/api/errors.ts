const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account already exists with that email.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/missing-password': 'Enter a password.',
}

function extractAuthCode(error: unknown): string | null {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code)
  }
  return null
}

export function mapAuthError(error: unknown): string {
  const code = extractAuthCode(error)
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code]
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}

export function mapFirestoreError(error: unknown): string {
  console.error('Firestore error:', error)

  const code = extractAuthCode(error)
  if (code === 'permission-denied') {
    return "You don't have permission to do that."
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong loading data. Please try again.'
}
