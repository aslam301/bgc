'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/lib/actions/password-reset'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null)

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
            Forgot Password?
          </h1>
          <p className="text-stone-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-medium">✓ {state.message}</p>
            <p className="text-xs text-green-700 mt-2">
              Check your email inbox for the password reset link.
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
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
            >
              Send Reset Link
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
