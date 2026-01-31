'use client'

import { registerForEvent } from '@/lib/actions/events'
import { useActionState } from 'react'

interface RegisterButtonProps {
  eventId: string
  ticketPrice: number
}

export default function RegisterButton({ eventId, ticketPrice }: RegisterButtonProps) {
  const [state, formAction] = useActionState(registerForEvent, null)

  return (
    <div>
      {state?.error && (
        <div className="mb-4 p-4 bg-coral border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))]">
          <p className="text-sm text-white font-bold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {state.error}
          </p>
        </div>
      )}

      {state?.success ? (
        <div className="bg-mint border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))]">
          <p className="text-ink font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Registration successful!
          </p>
          <p className="text-sm text-ink/80 font-mono mt-1">{state.message}</p>
        </div>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <button
            type="submit"
            className={`px-8 py-3 font-bold text-sm border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] transition-all hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 uppercase tracking-wider ${
              ticketPrice === 0
                ? 'bg-mint text-ink'
                : 'bg-coral text-white'
            }`}
          >
            {ticketPrice > 0 ? `Buy Ticket - ₹${ticketPrice}` : 'Register Free'}
          </button>
          {ticketPrice > 0 && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Payment integration coming soon
            </p>
          )}
        </form>
      )}
    </div>
  )
}
