'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/lib/actions/password-reset'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Reset Password
          </h1>
          <p className="text-stone-600">
            Enter your new password below
          </p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-medium">✓ {state.message}</p>
            <p className="text-xs text-green-700 mt-2">
              Redirecting to sign in page...
            </p>
          </div>
        )}

        {/* Error Message */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 font-medium">✕ {state.error}</p>
          </div>
        )}

        {/* Form */}
        {!state?.success && (
          <form action={formAction} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-stone-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-stone-600 hover:text-stone-900 font-medium transition"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
