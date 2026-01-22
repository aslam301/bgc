import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import EventForm from './EventForm'

export default async function CreateEventPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create Event</h1>
              <p className="text-slate-600 mt-1">Host a board game event in your community</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <EventForm userId={user.id} />
      </main>
    </div>
  )
}
