'use client'

import { requestPayout } from '@/lib/actions/payments'
import { useState } from 'react'
import { DollarSign } from 'lucide-react'

export default function PayoutRequestForm({ availableBalance }: { availableBalance: number }) {
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const requestAmount = parseFloat(amount)

    if (requestAmount < 500) {
      setMessage({ type: 'error', text: 'Minimum payout amount is ₹500' })
      setSubmitting(false)
      return
    }

    if (requestAmount > availableBalance) {
      setMessage({ type: 'error', text: 'Insufficient balance' })
      setSubmitting(false)
      return
    }

    const result = await requestPayout(requestAmount)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Payout requested successfully!' })
      setAmount('')
    }

    setSubmitting(false)
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
        <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
          Amount (₹)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={submitting || availableBalance < 500}
          placeholder="Enter amount"
          min="500"
          max={availableBalance}
          step="1"
          required
          className="w-full px-4 py-3 border-2 border-ink shadow-[2px_2px_0_0_hsl(var(--ink))] font-mono focus:outline-none focus:shadow-[4px_4px_0_0_hsl(var(--ink))] transition-all disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Min: ₹500 | Max: ₹{availableBalance.toLocaleString('en-IN')}
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || availableBalance < 500}
        className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DollarSign size={16} strokeWidth={3} />
        {submitting ? 'Requesting...' : 'Request Payout'}
      </button>

      {availableBalance < 500 && (
        <p className="text-xs text-coral font-mono">
          You need at least ₹500 to request a payout
        </p>
      )}
    </form>
  )
}
