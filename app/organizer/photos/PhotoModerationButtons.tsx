'use client'

import { approvePhoto, rejectPhoto } from '@/lib/actions/photos'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function PhotoModerationButtons({ photoId }: { photoId: string }) {
  const [processing, setProcessing] = useState(false)

  async function handleApprove() {
    setProcessing(true)
    await approvePhoto(photoId)
    setProcessing(false)
  }

  async function handleReject() {
    setProcessing(true)
    await rejectPhoto(photoId)
    setProcessing(false)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={processing}
        className="flex-1 px-4 py-2 bg-mint text-ink border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase flex items-center justify-center gap-1 disabled:opacity-50"
      >
        <Check size={14} strokeWidth={3} />
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={processing}
        className="flex-1 px-4 py-2 bg-coral text-white border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase flex items-center justify-center gap-1 disabled:opacity-50"
      >
        <X size={14} strokeWidth={3} />
        Reject
      </button>
    </div>
  )
}
