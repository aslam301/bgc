'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'
import { revalidatePath } from 'next/cache'

// Check if user is super admin
async function isAdmin() {
  const user = await getUser()
  if (!user) return false

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'super_admin'
}

export async function approveEvent(eventId: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from('events')
    .update({
      status: 'published',
      moderation_status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user!.id
    })
    .eq('id', eventId)

  if (error) {
    console.error('Approve event error:', error)
    return { error: 'Failed to approve event' }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  return { success: true }
}

export async function rejectEvent(eventId: string, reason?: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from('events')
    .update({
      status: 'draft',
      moderation_status: 'rejected',
      admin_notes: reason || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user!.id
    })
    .eq('id', eventId)

  if (error) {
    console.error('Reject event error:', error)
    return { error: 'Failed to reject event' }
  }

  revalidatePath('/admin/events')
  return { success: true }
}

export async function updateEventStatus(eventId: string, status: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)

  if (error) {
    console.error('Update event status error:', error)
    return { error: 'Failed to update event status' }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  return { success: true }
}

export async function deleteEvent(eventId: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Delete event error:', error)
    return { error: 'Failed to delete event' }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  return { success: true }
}
