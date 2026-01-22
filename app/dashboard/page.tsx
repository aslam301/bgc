import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Welcome, {profile?.name || 'User'}! 👋
          </h2>
          <p className="text-slate-600">
            You're logged in as <span className="font-medium">{user.email}</span>
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            Role: {profile?.role || 'user'}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">My Events</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">My Games</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="text-3xl">🎲</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Discussions</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="text-3xl">💬</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-left">
              <div className="text-2xl mb-2">📅</div>
              <p className="font-medium text-slate-900">Browse Events</p>
              <p className="text-xs text-slate-600">Find board game events</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-left">
              <div className="text-2xl mb-2">➕</div>
              <p className="font-medium text-slate-900">Create Event</p>
              <p className="text-xs text-slate-600">Host your own event</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-left">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-medium text-slate-900">Discussions</p>
              <p className="text-xs text-slate-600">Ask questions</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-left">
              <div className="text-2xl mb-2">👥</div>
              <p className="font-medium text-slate-900">Communities</p>
              <p className="text-xs text-slate-600">Join gaming groups</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
