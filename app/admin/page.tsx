import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get statistics
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  const { count: pendingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('moderation_status', 'pending')

  const { count: publishedEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalCommunities } = await supabase
    .from('communities')
    .select('*', { count: 'exact', head: true })

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select('id, title, status, moderation_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
        <p className="text-slate-600 mt-1">Platform statistics and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Events</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalEvents || 0}</p>
            </div>
            <div className="text-4xl">🎲</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Approval</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingEvents || 0}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
          <Link
            href="/admin/events?filter=pending"
            className="text-sm text-orange-600 hover:underline mt-2 inline-block"
          >
            Review now →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Published Events</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{publishedEvents || 0}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalUsers || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Recent Events</h3>
          <Link
            href="/admin/events"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            View all →
          </Link>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="font-medium text-slate-900 hover:text-slate-700"
                  >
                    {event.title}
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">
                    Created {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No events yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/events?filter=pending"
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center"
          >
            <div className="text-3xl mb-2">⏳</div>
            <p className="font-medium text-slate-900">Review Pending Events</p>
            <p className="text-sm text-slate-600 mt-1">{pendingEvents || 0} waiting</p>
          </Link>

          <Link
            href="/admin/events"
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center"
          >
            <div className="text-3xl mb-2">🎲</div>
            <p className="font-medium text-slate-900">Manage All Events</p>
            <p className="text-sm text-slate-600 mt-1">{totalEvents || 0} total</p>
          </Link>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 opacity-50 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-medium text-slate-900">View Reports</p>
            <p className="text-sm text-slate-600 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
