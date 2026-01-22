import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventForm from './EventForm'
import Navigation from '@/components/Navigation'

export default async function CreateEventPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch active cities
  const supabase = await createClient()
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-16">
      <Navigation />

      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">Create Event</h1>
          <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-400">Host a board game event in your community</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-0 sm:px-4 py-4 sm:py-8 lg:px-8">
        <EventForm userId={user.id} cities={cities || []} />
      </main>
    </div>
  )
}
