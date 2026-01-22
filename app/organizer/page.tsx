import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function OrganizerDashboard() {
  const supabase = await createClient()
  const user = await getUser()

  // Fetch organizer's events
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      registrations:event_registrations(count)
    `)
    .eq('organizer_id', user!.id)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalEvents = events?.length || 0
  const publishedEvents = events?.filter(e => e.status === 'published').length || 0
  const pendingEvents = events?.filter(e => e.moderation_status === 'pending').length || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">My Events</h2>
        <p className="text-slate-600 mt-1">Manage all your events in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Events</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalEvents}</p>
            </div>
            <div className="text-4xl">🎲</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Published</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{publishedEvents}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Approval</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingEvents}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {!events || events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Events Yet</h3>
          <p className="text-slate-600 mb-6">
            Create your first event and start building your community!
          </p>
          <Link
            href="/events/create"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const registrationCount = event.registrations?.[0]?.count || 0

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/events/${event.id}`}
                        target="_blank"
                        className="text-xl font-bold text-slate-900 hover:text-slate-700"
                      >
                        {event.title}
                      </Link>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'draft'
                            ? 'bg-slate-100 text-slate-800'
                            : event.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {event.status}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.moderation_status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : event.moderation_status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {event.moderation_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                      <div>
                        <span className="font-medium">📅 Date:</span>{' '}
                        {format(new Date(event.start_date), 'PP')}
                      </div>
                      <div>
                        <span className="font-medium">📍 Location:</span> {event.location_city}
                      </div>
                      <div>
                        <span className="font-medium">💰 Price:</span>{' '}
                        {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
                      </div>
                      <div>
                        <span className="font-medium">👥 Registrations:</span> {registrationCount}
                        {event.max_attendees && ` / ${event.max_attendees}`}
                      </div>
                    </div>

                    {event.moderation_status === 'rejected' && event.admin_notes && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {event.admin_notes}
                        </p>
                      </div>
                    )}

                    {event.moderation_status === 'pending' && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          ⏳ Your event is pending approval. We typically review events within 24 hours.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {event.status !== 'cancelled' && (
                      <>
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm text-center whitespace-nowrap"
                        >
                          ✏️ Edit
                        </Link>
                        <Link
                          href={`/organizer/events/${event.id}/attendees`}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm text-center whitespace-nowrap"
                        >
                          👥 Attendees
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
