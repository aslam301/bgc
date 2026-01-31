'use client'

import { login } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="min-h-screen bg-background art-bg flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4 sm:mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </Link>
          <div className="mb-3 text-3xl animate-float">🎲</div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 uppercase">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-foreground font-mono">
            Sign in to BoardGameCulture
          </p>
        </div>

        {/* Error Messages */}
        {state?.error && (
          <div className="mb-6 p-4 bg-coral border-2 border-ink shadow-neo">
            <p className="text-sm text-white font-bold">
              {state.errorType === 'email_not_confirmed' ? (
                <>
                  ⚠️ Email not confirmed. Please check your inbox and click the confirmation link.
                  <br />
                  <span className="text-xs mt-2 block font-mono">
                    Didn't receive the email? Check your spam folder or{' '}
                    <Link href="/signup" className="underline font-bold">try signing up again</Link>.
                  </span>
                </>
              ) : (
                <>✕ {state.error}</>
              )}
            </p>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="bg-card border-2 border-ink shadow-[6px_6px_0_0_hsl(var(--ink))] p-4 sm:p-8">
          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-coral hover:text-coral/80 font-bold uppercase tracking-wider transition"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} strokeWidth={3} />
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground font-mono">
            Don't have an account?{' '}
            <Link href="/signup" className="text-coral font-bold hover:underline transition uppercase tracking-wider">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-coral font-bold transition uppercase tracking-wider">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
