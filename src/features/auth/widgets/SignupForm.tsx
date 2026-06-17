import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../shared/components/Button'
import { Field, Input } from '../../../shared/components/Field'
import { signUp } from '../api/auth.api'
import { mapAuthError } from '../../../shared/api/errors'

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signUp(name, email, password)
    } catch (caughtError) {
      setError(mapAuthError(caughtError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Full name">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </Field>
      <Field label="Password" hint="At least 6 characters">
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" loading={loading} className="w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent">
          Log in
        </Link>
      </p>
    </form>
  )
}
