import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-slate-900">
          BoardGameCulture
        </h1>
        <p className="text-2xl text-slate-600">
          India's Board Game Community Platform
        </p>

        {/* Auth Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <Link href="/events" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">🎲 Events</h3>
            <p className="text-slate-600">Discover board game events</p>
          </Link>
          <div className="bg-white p-6 rounded-lg shadow-md opacity-60">
            <h3 className="font-semibold text-lg mb-2">💬 Discussions</h3>
            <p className="text-slate-600">Coming soon</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md opacity-60">
            <h3 className="font-semibold text-lg mb-2">👥 Communities</h3>
            <p className="text-slate-600">Coming soon</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 pt-8">
          🚀 Authentication is live! Create an account to get started.
        </p>
      </div>
    </div>
  );
}
