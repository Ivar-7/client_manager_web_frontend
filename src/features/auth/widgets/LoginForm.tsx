import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../shared/components/Button'
import { Field, Input } from '../../../shared/components/Field'
import { signIn } from '../api/auth.api'
import { mapAuthError } from '../../../shared/api/errors'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (caughtError) {
      setError(mapAuthError(caughtError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Email">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" loading={loading} className="w-full">
        Log in
      </Button>
      <p className="text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-accent">
          Sign up
        </Link>
      </p>
    </form>
  )
}
