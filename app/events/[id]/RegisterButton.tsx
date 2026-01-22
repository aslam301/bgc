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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800 font-semibold">✕ {state.error}</p>
        </div>
      )}

      {state?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 font-semibold flex items-center gap-2">
            ✓ Registration successful!
          </p>
          <p className="text-sm text-green-700 mt-1">{state.message}</p>
        </div>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold text-lg shadow-sm"
          >
            {ticketPrice > 0 ? `Register - ₹${ticketPrice}` : 'Register for Free'}
          </button>
          {ticketPrice > 0 && (
            <p className="text-xs text-stone-500 mt-2">
              Payment integration coming soon. Registration will be confirmed manually.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
