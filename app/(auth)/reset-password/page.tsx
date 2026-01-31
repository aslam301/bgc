'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/lib/actions/password-reset'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      // Redirect to login after 3 seconds
      const timeout = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [state?.success, router])

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
          <div className="mb-3 text-3xl animate-float">🔑</div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 uppercase">
            Reset Password
          </h1>
          <p className="text-sm sm:text-base text-foreground font-mono">
            Enter your new password below
          </p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div className="mb-6 p-4 bg-mint border-2 border-ink shadow-neo">
            <p className="text-sm text-ink font-bold">✓ {state.message}</p>
            <p className="text-xs text-ink/80 mt-2 font-mono">
              Redirecting to sign in page...
            </p>
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
            <div className="space-y-5">
              <div>
                <Label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <Label htmlFor="confirm_password" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Reset Password <ArrowRight size={18} strokeWidth={3} />
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
