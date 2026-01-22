'use client'

import { signup } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, null)

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
            Join Us
          </h1>
          <p className="text-stone-600">
            Create your BoardGameCulture account
          </p>
        </div>

        {/* Success Message */}
        {state?.success && state?.requiresConfirmation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-medium">
              ✓ Account created successfully!
            </p>
            <p className="text-xs text-green-700 mt-2">
              {state.message}
            </p>
            <Link
              href="/login"
              className="inline-block mt-3 text-sm text-green-800 underline font-medium"
            >
              Go to Login →
            </Link>
          </div>
        )}

        {/* Error Message */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 font-medium">
              ✕ {state.error}
            </p>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Password
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
              <p className="text-xs text-stone-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
          >
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="text-stone-900 font-semibold hover:text-brand-600 transition">
              Sign in
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
