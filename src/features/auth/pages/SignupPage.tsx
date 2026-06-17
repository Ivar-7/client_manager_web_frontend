import { SignupForm } from '../widgets/SignupForm'

export default function SignupPage() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-muted">Get access to the client onboarding workspace.</p>
        <SignupForm />
      </div>
    </div>
  )
}
