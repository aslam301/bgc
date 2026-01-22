'use client'

import { signup } from '@/lib/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Join Us</h1>
          <p className="text-slate-600 mt-2">Create your BoardGameCulture account</p>
        </div>

        {/* Success Message */}
        {state?.success && state?.requiresConfirmation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✅ Account created successfully!
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ❌ {state.error}
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition font-medium"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Dev Mode Notice */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            💡 <strong>Development Mode:</strong> To skip email verification, disable "Confirm email" in Supabase dashboard → Authentication → Providers → Email.
          </p>
        </div>
      </div>
    </div>
  )
}
