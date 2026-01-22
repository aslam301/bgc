import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import EventActions from './EventActions'

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Build query based on filter
  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(name, email)
    `)
    .order('created_at', { ascending: false })

  // Apply filter
  if (params.filter === 'pending') {
    query = query.eq('moderation_status', 'pending')
  } else if (params.filter === 'approved') {
    query = query.eq('moderation_status', 'approved')
  } else if (params.filter === 'rejected') {
    query = query.eq('moderation_status', 'rejected')
  } else if (params.filter === 'published') {
    query = query.eq('status', 'published')
  } else if (params.filter === 'draft') {
    query = query.eq('status', 'draft')
  }

  const { data: events, error } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Event Moderation</h2>
          <p className="text-slate-600 mt-1">Review and manage all events</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/events"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !params.filter
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Events
          </Link>
          <Link
            href="/admin/events?filter=pending"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              params.filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending Approval
          </Link>
          <Link
            href="/admin/events?filter=approved"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              params.filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Approved
          </Link>
          <Link
            href="/admin/events?filter=rejected"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              params.filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rejected
          </Link>
          <Link
            href="/admin/events?filter=published"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              params.filter === 'published'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Published
          </Link>
          <Link
            href="/admin/events?filter=draft"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              params.filter === 'draft'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Draft
          </Link>
        </div>
      </div>

      {/* Events List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading events: {error.message}</p>
        </div>
      )}

      {!events || events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Events Found</h3>
          <p className="text-slate-600">
            {params.filter
              ? `No events with status "${params.filter}"`
              : 'No events in the system yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
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
                      <span className="font-medium">Organizer:</span> {event.organizer?.name || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {event.location_city}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {format(new Date(event.start_date), 'PP')}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
                    </div>
                  </div>

                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Created:</span> {format(new Date(event.created_at), 'PPp')}
                  </div>

                  {event.admin_notes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Admin Notes:</strong> {event.admin_notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <EventActions event={event} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
