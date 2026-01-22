import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import { redirect, notFound } from 'next/navigation'
import EventEditForm from './EventEditForm'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const user = await getUser()
  const { id } = await params

  if (!user) {
    redirect('/login')
  }

  // Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('organizer_id', user.id) // Ensure only organizer can edit
    .single()

  if (error || !event) {
    notFound()
  }

  // Don't allow editing if cancelled
  if (event.status === 'cancelled') {
    redirect(`/organizer`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
            <p className="text-slate-600 mt-1">Update your event details</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <EventEditForm event={event} />
      </main>
    </div>
  )
}
