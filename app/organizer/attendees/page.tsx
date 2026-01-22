import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function AllAttendeesPage() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all events by this organizer
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('organizer_id', user.id)

  const eventIds = events?.map(e => e.id) || []

  // Fetch all registrations for organizer's events
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      attendee:profiles!user_id(name, email),
      event:events!event_id(title, start_date)
    `)
    .in('event_id', eventIds)
    .order('registered_at', { ascending: false })

  const totalAttendees = registrations?.length || 0
  const confirmedCount = registrations?.filter(r => r.status === 'confirmed').length || 0
  const pendingCount = registrations?.filter(r => r.status === 'pending_payment').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">All Attendees</h1>
        <p className="text-slate-600 mt-1">View all registrations across your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Registrations</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalAttendees}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Confirmed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{confirmedCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Payment</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">All Attendees</h3>
        </div>

        {!registrations || registrations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Attendees Yet</h3>
            <p className="text-slate-600">
              When people register for your events, they'll appear here.
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
                    Event
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
                    <td className="px-6 py-4">
                      <Link
                        href={`/organizer/events/${registration.event_id}/attendees`}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {registration.event?.title || 'Unknown Event'}
                      </Link>
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
    </div>
  )
}
