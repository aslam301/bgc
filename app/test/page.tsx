import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()

  // Test database connection by counting records in each table
  const tests = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('communities').select('*', { count: 'exact', head: true }),
    supabase.from('games').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
    supabase.from('moderation_settings').select('*', { count: 'exact', head: true }),
  ])

  const tableNames = [
    'profiles',
    'communities',
    'games',
    'events',
    'event_registrations',
    'transactions',
    'moderation_settings'
  ]

  const results = tests.map((test, index) => ({
    table: tableNames[index],
    count: test.count ?? 0,
    error: test.error?.message,
    success: !test.error
  }))

  const allSuccessful = results.every(r => r.success)

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">
            🔗 Supabase Connection Test
          </h1>

          <div className={`mb-6 p-4 rounded-lg ${allSuccessful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold text-lg">
              {allSuccessful ? '✅ All tables connected successfully!' : '❌ Some tables failed to connect'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Database Tables:</h2>

            {results.map((result) => (
              <div
                key={result.table}
                className={`p-4 rounded-lg border-2 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {result.success ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="font-semibold text-lg">{result.table}</p>
                      {result.success ? (
                        <p className="text-sm text-slate-600">
                          {result.count} records found
                        </p>
                      ) : (
                        <p className="text-sm text-red-600">
                          Error: {result.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-slate-600">
              ✨ Your Supabase database is set up and ready to use!
            </p>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
