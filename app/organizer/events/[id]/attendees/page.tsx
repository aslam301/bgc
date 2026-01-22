import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const user = await getUser()
  const { id } = await params

  if (!user) {
    redirect('/login')
  }

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('organizer_id', user.id) // Ensure only organizer can view
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Fetch registrations
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      attendee:profiles!user_id(name, email)
    `)
    .eq('event_id', id)
    .order('registered_at', { ascending: false })

  const confirmedCount = registrations?.filter(r => r.status === 'confirmed').length || 0
  const pendingCount = registrations?.filter(r => r.status === 'pending_payment').length || 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/organizer"
                className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
              >
                ← Back to My Events
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
              <p className="text-slate-600 mt-1">Event Attendees</p>
            </div>
            <Link
              href={`/organizer/events/${event.id}/edit`}
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Edit Event
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Registrations</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {registrations?.length || 0}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{confirmedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Payment</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Event Details Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Event Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">Date:</span>
              <p className="text-slate-900 mt-1">{format(new Date(event.start_date), 'PP')}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Location:</span>
              <p className="text-slate-900 mt-1">{event.location_city}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Ticket Price:</span>
              <p className="text-slate-900 mt-1">
                {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Capacity:</span>
              <p className="text-slate-900 mt-1">
                {event.max_attendees || 'Unlimited'}
              </p>
            </div>
          </div>
        </div>

        {/* Attendees List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Attendee List</h3>
          </div>

          {!registrations || registrations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Attendees Yet</h3>
              <p className="text-slate-600">
                When people register for your event, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Attendee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {registration.attendee?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {registration.attendee?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            registration.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : registration.status === 'pending_payment'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {registration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {registration.registered_at
                          ? format(new Date(registration.registered_at), 'PP p')
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
