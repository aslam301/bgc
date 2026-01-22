'use client'

import { login } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4 sm:mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            Sign in to BoardGameCulture
          </p>
        </div>

        {/* Error Messages */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 font-medium">
              {state.errorType === 'email_not_confirmed' ? (
                <>
                  ⚠️ Email not confirmed. Please check your inbox and click the confirmation link.
                  <br />
                  <span className="text-xs mt-2 block">
                    Didn't receive the email? Check your spam folder or{' '}
                    <Link href="/signup" className="underline">try signing up again</Link>.
                  </span>
                </>
              ) : (
                <>✕ {state.error}</>
              )}
            </p>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-8 sm:shadow-sm">
          <div className="space-y-5">
            <div>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium transition"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-stone-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-stone-900 font-semibold hover:text-brand-600 transition">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
