import { LoginForm } from '../widgets/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text">Welcome back</h1>
        <p className="mb-6 text-sm text-muted">Log in to your client onboarding workspace.</p>
        <LoginForm />
      </div>
    </div>
  )
}
