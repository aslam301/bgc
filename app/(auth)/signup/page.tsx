'use client'

import { signup } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, null)

  return (
    <div className="min-h-screen bg-background art-bg flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </Link>
          <div className="mb-3 text-3xl animate-float">🎲 🎮</div>
          <h1 className="text-3xl font-black text-foreground mb-2 uppercase">
            Join Us
          </h1>
          <p className="text-foreground font-mono">
            Create your BoardGameCulture account
          </p>
        </div>

        {/* Success Message */}
        {state?.success && state?.requiresConfirmation && (
          <div className="mb-6 p-4 bg-mint border-2 border-ink shadow-neo">
            <p className="text-sm text-ink font-bold">
              ✓ Account created successfully!
            </p>
            <p className="text-xs text-ink/80 mt-2 font-mono">
              {state.message}
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
        <form action={formAction} className="bg-card border-2 border-ink shadow-[6px_6px_0_0_hsl(var(--ink))] p-5 sm:p-8">
          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="John Doe"
              />
            </div>

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
              <Label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Password
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
              <p className="text-xs text-foreground mt-1 font-mono">
                Must be at least 6 characters
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight size={18} strokeWidth={3} />
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground font-mono">
            Already have an account?{' '}
            <Link href="/login" className="text-coral font-bold hover:underline transition uppercase tracking-wider">
              Sign in
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
