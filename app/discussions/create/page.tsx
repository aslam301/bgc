'use client'

import { createDiscussion } from '@/lib/actions/discussions'
import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Menu } from 'lucide-react'

export default function CreateDiscussionPage() {
  const [state, formAction] = useActionState(createDiscussion, null)

  const categories = [
    { value: 'rules', label: 'Rules Questions', icon: '📖' },
    { value: 'strategy', label: 'Strategy Tips', icon: '🎯' },
    { value: 'general', label: 'General Chat', icon: '🎲' },
    { value: 'marketplace', label: 'Buy/Sell/Trade', icon: '🛒' },
    { value: 'meetups', label: 'Looking for Group', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-background art-bg">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-card border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-foreground uppercase text-lg">
            BoardGameCulture
          </Link>
          <Link
            href="/discussions"
            className="px-4 py-2 bg-coral text-white border-2 border-ink shadow-[2px_2px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase"
          >
            Cancel
          </Link>
        </div>
      </header>

      <div className="pt-16">

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/discussions"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-coral transition uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Discussions
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Start a Discussion</h1>
          <p className="text-foreground mt-2 font-mono">
            Ask questions, share insights, or start a conversation with the community
          </p>
        </div>

        {/* Error Message */}
        {state?.error && (
          <div className="mb-6 p-4 bg-coral border-2 border-ink shadow-neo">
            <p className="text-sm text-white font-bold">✕ {state.error}</p>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="bg-card border-2 border-ink shadow-neo-lg p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold bg-card text-foreground"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold bg-card text-foreground"
                placeholder="What's your question or topic?"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-xs font-mono uppercase tracking-wider text-foreground font-bold mb-2">
                Description
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-mono bg-card text-foreground resize-none"
                placeholder="Provide details about your question or topic. Be clear and specific to get better responses."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
            >
              Post Discussion
            </button>
            <Link
              href="/discussions"
              className="flex-1 px-6 py-3 bg-card text-foreground border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-6 bg-mint/20 border-2 border-ink p-4 sm:p-6">
          <h3 className="font-black text-foreground mb-3 uppercase">Community Guidelines</h3>
          <ul className="space-y-2 text-sm text-foreground font-mono">
            <li className="flex items-start gap-2">
              <span className="text-mint font-bold">✓</span>
              <span>Be respectful and courteous to other community members</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint font-bold">✓</span>
              <span>Search for existing discussions before posting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint font-bold">✓</span>
              <span>Provide clear, detailed information in your posts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint font-bold">✓</span>
              <span>Stay on topic and relevant to board games</span>
            </li>
          </ul>
        </div>
        </main>
      </div>
    </div>
  )
}
