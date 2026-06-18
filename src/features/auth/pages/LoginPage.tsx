import { LoginForm } from '../widgets/LoginForm'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg p-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-accent glow-accent shadow-lg">
            <svg viewBox="0 0 20 20" fill="white" className="size-6">
              <path
                fillRule="evenodd"
                d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM6.05 6a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 6.05 6Zm.75 2.75a.75.75 0 0 0-1.5 0v4.01a.75.75 0 0 0 1.5 0V8.75ZM10 6a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 10 6Zm3.75.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-text">Welcome back</h1>
            <p className="mt-1 text-sm text-muted">Sign in to your workspace</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
