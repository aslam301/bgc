'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create an event' }
  }

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const locationVenue = formData.get('location_venue') as string
  const locationAddress = formData.get('location_address') as string
  const locationCity = formData.get('location_city') as string
  const maxAttendeesStr = formData.get('max_attendees') as string
  const ticketPriceStr = formData.get('ticket_price') as string

  // Validate required fields
  if (!title || !description || !startDate || !locationCity) {
    return { error: 'Please fill in all required fields' }
  }

  // Parse numeric fields
  const maxAttendees = maxAttendeesStr ? parseInt(maxAttendeesStr) : null
  const ticketPrice = ticketPriceStr ? parseFloat(ticketPriceStr) : 0

  // Validate dates
  const start = new Date(startDate)
  if (start < new Date()) {
    return { error: 'Event cannot start in the past' }
  }

  // Validate end date if provided
  let end = null
  if (endDate) {
    end = new Date(endDate)
    if (end <= start) {
      return { error: 'End date must be after start date' }
    }
  }

  // Insert event
  const { data: event, error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      start_date: start.toISOString(),
      end_date: end ? end.toISOString() : null,
      location_venue: locationVenue || null,
      location_address: locationAddress || null,
      location_city: locationCity,
      max_attendees: maxAttendees,
      ticket_price: ticketPrice,
      organizer_id: user.id,
      status: 'draft',
      moderation_status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Event creation error:', error)
    return { error: 'Failed to create event. Please try again.' }
  }

  revalidatePath('/events')
  return {
    success: true,
    message: 'Event created successfully! It will be reviewed by our team.',
    eventId: event.id
  }
}

export async function registerForEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to register for events' }
  }

  const eventId = formData.get('event_id') as string

  if (!eventId) {
    return { error: 'Invalid event' }
  }

  // Get event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (eventError || !event) {
    return { error: 'Event not found' }
  }

  // Check if already registered
  const { data: existingReg } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single()

  if (existingReg) {
    return { error: 'You are already registered for this event' }
  }

  // Check if event is full
  if (event.max_attendees) {
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed')

    if (count && count >= event.max_attendees) {
      return { error: 'This event is full' }
    }
  }

  // Create registration
  const { error: regError } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: event.ticket_price > 0 ? 'pending_payment' : 'confirmed',
    })

  if (regError) {
    console.error('Registration error:', regError)
    return { error: 'Failed to register. Please try again.' }
  }

  revalidatePath(`/events/${eventId}`)

  if (event.ticket_price > 0) {
    return {
      success: true,
      message: 'Registration created! Payment integration coming soon. Your registration is pending payment confirmation.'
    }
  } else {
    return {
      success: true,
      message: 'You are successfully registered for this free event!'
    }
  }
}
