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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">❌ {state.error}</p>
        </div>
      )}

      {state?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium flex items-center gap-2">
            ✅ Registration successful!
          </p>
          <p className="text-sm text-green-700 mt-1">{state.message}</p>
        </div>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium text-lg"
          >
            {ticketPrice > 0 ? `Register - ₹${ticketPrice}` : 'Register for Free'}
          </button>
          {ticketPrice > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              💡 Payment integration coming soon. Registration will be confirmed manually.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
