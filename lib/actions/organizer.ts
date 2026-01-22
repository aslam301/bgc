'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function updateEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to update events' }
  }

  const eventId = formData.get('event_id') as string

  // Verify ownership
  const { data: existingEvent } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single()

  if (!existingEvent || existingEvent.organizer_id !== user.id) {
    return { error: 'Unauthorized: You can only edit your own events' }
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

  // Update event
  const { error } = await supabase
    .from('events')
    .update({
      title,
      description,
      start_date: start.toISOString(),
      end_date: end ? end.toISOString() : null,
      location_venue: locationVenue || null,
      location_address: locationAddress || null,
      location_city: locationCity,
      max_attendees: maxAttendees,
      ticket_price: ticketPrice,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('organizer_id', user.id) // Double-check ownership

  if (error) {
    console.error('Event update error:', error)
    return { error: 'Failed to update event. Please try again.' }
  }

  revalidatePath('/organizer')
  revalidatePath(`/events/${eventId}`)
  revalidatePath(`/organizer/events/${eventId}/edit`)

  return {
    success: true,
    message: 'Event updated successfully!'
  }
}

export async function cancelEvent(eventId: string) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify ownership
  const { data: event } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single()

  if (!event || event.organizer_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Update event status to cancelled
  const { error } = await supabase
    .from('events')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('organizer_id', user.id)

  if (error) {
    console.error('Event cancellation error:', error)
    return { error: 'Failed to cancel event' }
  }

  revalidatePath('/organizer')
  revalidatePath(`/events/${eventId}`)

  return { success: true, message: 'Event cancelled successfully' }
}

export async function deleteOrganizerEvent(eventId: string) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify ownership
  const { data: event } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single()

  if (!event || event.organizer_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Delete event (only if no registrations exist - we should check this)
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .limit(1)

  if (registrations && registrations.length > 0) {
    return { error: 'Cannot delete event with existing registrations. Please cancel it instead.' }
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('organizer_id', user.id)

  if (error) {
    console.error('Event deletion error:', error)
    return { error: 'Failed to delete event' }
  }

  revalidatePath('/organizer')

  return { success: true, message: 'Event deleted successfully' }
}
