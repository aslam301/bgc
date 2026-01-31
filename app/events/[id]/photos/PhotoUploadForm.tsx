'use client'

import { uploadEventPhoto } from '@/lib/actions/photos'
import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function PhotoUploadForm({ eventId }: { eventId: string }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await uploadEventPhoto(eventId, formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Photo uploaded! It will appear after moderation.' })
      e.currentTarget.reset()
    }

    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-4 border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] ${
          message.type === 'success' ? 'bg-mint' : 'bg-coral'
        }`}>
          <p className={`text-sm font-bold ${
            message.type === 'success' ? 'text-ink' : 'text-white'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div>
        <input
          type="file"
          name="photo"
          accept="image/*"
          required
          disabled={uploading}
          className="block w-full text-sm text-foreground font-mono
            file:mr-4 file:py-2 file:px-4
            file:border-2 file:border-ink
            file:text-sm file:font-bold
            file:bg-sunny file:text-ink
            file:shadow-[3px_3px_0_0_hsl(var(--ink))]
            hover:file:shadow-[4px_4px_0_0_hsl(var(--ink))]
            file:transition-all
            disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload size={16} strokeWidth={3} />
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>
  )
}
