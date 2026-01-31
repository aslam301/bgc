'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/lib/actions/password-reset'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null)

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
          <div className="mb-3 text-3xl animate-float">🔐</div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 uppercase">
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-base text-foreground font-mono">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div className="mb-6 p-4 bg-mint border-2 border-ink shadow-neo">
            <p className="text-sm text-ink font-bold">✓ {state.message}</p>
            <p className="text-xs text-ink/80 mt-2 font-mono">
              Check your email inbox for the password reset link.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 mt-3 text-sm text-ink font-bold uppercase tracking-wider hover:text-coral transition"
            >
              Go to Login <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
        )}

        {/* Error Message */}
        {state?.error && (
          <div className="mb-6 p-4 bg-coral border-2 border-ink shadow-neo">
            <p className="text-sm text-white font-bold">
              ✕ {state.error}
            </p>
          </div>
        )}

        {/* Form */}
        {!state?.success && (
          <form action={formAction} className="bg-card border-2 border-ink shadow-[6px_6px_0_0_hsl(var(--ink))] p-4 sm:p-8">
            <div className="mb-6">
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

            <button
              type="submit"
              className="w-full px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Send Reset Link <ArrowRight size={18} strokeWidth={3} />
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-coral font-bold transition uppercase tracking-wider"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
