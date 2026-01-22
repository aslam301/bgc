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
        <h2 className="text-3xl font-bold text-stone-900">My Events</h2>
        <p className="text-stone-600 mt-1">Manage all your events in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-600">Total Events</p>
              <p className="text-3xl font-bold text-stone-900 mt-2">{totalEvents}</p>
            </div>
            <div className="text-4xl">🎲</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-600">Published</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{publishedEvents}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-600">Pending Approval</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingEvents}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {!events || events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-2xl font-bold text-stone-900 mb-2">No Events Yet</h3>
          <p className="text-stone-600 mb-6">
            Create your first event and start building your community!
          </p>
          <Link
            href="/events/create"
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
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
                className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Link
                        href={`/events/${event.id}`}
                        target="_blank"
                        className="text-xl font-bold text-stone-900 hover:text-brand-600 transition"
                      >
                        {event.title}
                      </Link>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          event.status === 'published'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : event.status === 'draft'
                            ? 'bg-stone-50 border border-stone-200 text-stone-800'
                            : event.status === 'cancelled'
                            ? 'bg-red-50 border border-red-200 text-red-800'
                            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                        }`}
                      >
                        {event.status}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          event.moderation_status === 'approved'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : event.moderation_status === 'pending'
                            ? 'bg-orange-50 border border-orange-200 text-orange-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}
                      >
                        {event.moderation_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-stone-600 dark:text-stone-400 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{format(new Date(event.start_date), 'PP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="font-medium">{event.location_city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">
                          {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">{registrationCount}
                        {event.max_attendees && ` / ${event.max_attendees}`}</span>
                      </div>
                    </div>

                    {event.moderation_status === 'rejected' && event.admin_notes && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {event.admin_notes}
                        </p>
                      </div>
                    )}

                    {event.moderation_status === 'pending' && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <p className="text-sm text-orange-800">
                          ⏳ Your event is pending approval. We typically review events within 24 hours.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                    {event.status !== 'cancelled' && (
                      <>
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Event
                        </Link>
                        <Link
                          href={`/organizer/events/${event.id}/attendees`}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-700 dark:bg-stone-600 text-white rounded-lg hover:bg-stone-800 dark:hover:bg-stone-700 transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          View Attendees
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
