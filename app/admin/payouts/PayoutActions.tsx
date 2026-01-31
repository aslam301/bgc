'use client'

import { approvePayout, rejectPayout } from '@/lib/actions/payments'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function PayoutActions({ payoutId }: { payoutId: string }) {
  const [processing, setProcessing] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  async function handleApprove() {
    setProcessing(true)
    await approvePayout(payoutId)
    setProcessing(false)
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setProcessing(true)
    await rejectPayout(payoutId, rejectionReason)
    setProcessing(false)
  }

  if (showRejectForm) {
    return (
      <div className="space-y-3">
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Reason for rejection..."
          disabled={processing}
          rows={3}
          className="w-full px-4 py-3 border-2 border-ink shadow-[2px_2px_0_0_hsl(var(--ink))] font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0_0_hsl(var(--ink))] transition-all disabled:opacity-50"
        />
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-coral text-white border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase disabled:opacity-50"
          >
            Confirm Reject
          </button>
          <button
            onClick={() => setShowRejectForm(false)}
            disabled={processing}
            className="px-4 py-2 border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={processing}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-mint text-ink border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase disabled:opacity-50"
      >
        <Check size={16} strokeWidth={3} />
        Approve
      </button>
      <button
        onClick={() => setShowRejectForm(true)}
        disabled={processing}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-coral text-white border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[4px_4px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase disabled:opacity-50"
      >
        <X size={16} strokeWidth={3} />
        Reject
      </button>
    </div>
  )
}
