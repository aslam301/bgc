'use client'

import { createComment } from '@/lib/actions/discussions'
import { useState } from 'react'
import { Send } from 'lucide-react'

export default function CommentForm({ discussionId, parentId }: { discussionId: string; parentId?: string }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError('')

    const result = await createComment(discussionId, content, parentId)

    if (result?.error) {
      setError(result.error)
    } else {
      setContent('')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-coral border-2 border-ink">
          <p className="text-sm text-white font-bold">✕ {error}</p>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? 'Write a reply...' : 'Share your thoughts...'}
        rows={4}
        required
        className="w-full px-4 py-3 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-mono bg-card text-foreground resize-none"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} strokeWidth={3} />
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  )
}
