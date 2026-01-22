import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import EventDetailActions from './EventDetailActions'

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(id, name, email, role),
      community:communities(name, slug),
      reviewed_by_profile:profiles!reviewed_by(name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Get registration count
  const { count: registrationCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/events"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to Events
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>
        </div>
        <Link
          href={`/events/${event.id}`}
          target="_blank"
          className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
        >
          View Public Page →
        </Link>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-3">
        <span
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            event.status === 'published'
              ? 'bg-green-100 text-green-800'
              : event.status === 'draft'
              ? 'bg-slate-100 text-slate-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          Status: {event.status}
        </span>
        <span
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            event.moderation_status === 'approved'
              ? 'bg-green-100 text-green-800'
              : event.moderation_status === 'pending'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          Moderation: {event.moderation_status}
        </span>
      </div>

      {/* Admin Actions */}
      <EventDetailActions event={event} />

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Event Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-slate-700">Title:</span>
              <p className="text-slate-900 mt-1">{event.title}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Start Date:</span>
              <p className="text-slate-900 mt-1">{format(new Date(event.start_date), 'PPpp')}</p>
            </div>
            {event.end_date && (
              <div>
                <span className="font-medium text-slate-700">End Date:</span>
                <p className="text-slate-900 mt-1">{format(new Date(event.end_date), 'PPpp')}</p>
              </div>
            )}
            <div>
              <span className="font-medium text-slate-700">Location:</span>
              <p className="text-slate-900 mt-1">
                {event.location_venue && `${event.location_venue}, `}
                {event.location_city}
              </p>
              {event.location_address && (
                <p className="text-slate-600 text-xs mt-1 whitespace-pre-line">{event.location_address}</p>
              )}
            </div>
            <div>
              <span className="font-medium text-slate-700">Ticket Price:</span>
              <p className="text-slate-900 mt-1">
                {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free Event'}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Max Attendees:</span>
              <p className="text-slate-900 mt-1">
                {event.max_attendees || 'Unlimited'}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Registrations:</span>
              <p className="text-slate-900 mt-1">{registrationCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Organizer Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-slate-700">Name:</span>
              <p className="text-slate-900 mt-1">{event.organizer?.name || 'Unknown'}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Email:</span>
              <p className="text-slate-900 mt-1">{event.organizer?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">User ID:</span>
              <p className="text-slate-900 mt-1 font-mono text-xs">{event.organizer_id}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Role:</span>
              <p className="text-slate-900 mt-1">{event.organizer?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Event Description</h3>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      {/* Moderation Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Moderation Details</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-slate-700">Created At:</span>
            <p className="text-slate-900 mt-1">{format(new Date(event.created_at), 'PPpp')}</p>
          </div>
          {event.reviewed_at && (
            <>
              <div>
                <span className="font-medium text-slate-700">Reviewed At:</span>
                <p className="text-slate-900 mt-1">{format(new Date(event.reviewed_at), 'PPpp')}</p>
              </div>
              {event.reviewed_by_profile && (
                <div>
                  <span className="font-medium text-slate-700">Reviewed By:</span>
                  <p className="text-slate-900 mt-1">
                    {event.reviewed_by_profile.name} ({event.reviewed_by_profile.email})
                  </p>
                </div>
              )}
            </>
          )}
          {event.admin_notes && (
            <div>
              <span className="font-medium text-slate-700">Admin Notes:</span>
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-900">{event.admin_notes}</p>
              </div>
            </div>
          )}
          {event.moderation_flags && event.moderation_flags.length > 0 && (
            <div>
              <span className="font-medium text-slate-700">Moderation Flags:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.moderation_flags.map((flag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community Info */}
      {event.community && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Community</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-slate-700">Name:</span>
              <p className="text-slate-900 mt-1">{event.community.name}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Slug:</span>
              <p className="text-slate-900 mt-1">{event.community.slug}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
