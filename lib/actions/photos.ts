'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadEventPhoto(eventId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to upload photos' }
  }

  const file = formData.get('photo') as File
  if (!file) {
    return { error: 'Please select a photo to upload' }
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Photo must be under 5MB' }
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' }
  }

  try {
    // Upload to Supabase storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${eventId}/${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('event-photos')
      .upload(fileName, file)

    if (uploadError) {
      return { error: 'Failed to upload photo' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-photos')
      .getPublicUrl(fileName)

    // Create photo record
    const { error: dbError } = await supabase
      .from('event_photos')
      .insert({
        event_id: eventId,
        uploaded_by: user.id,
        photo_url: publicUrl,
        status: 'pending',
      })

    if (dbError) {
      return { error: 'Failed to save photo record' }
    }

    revalidatePath(`/events/${eventId}/photos`)
    return { success: true }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function approvePhoto(photoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is event organizer or admin
  const { data: photo } = await supabase
    .from('event_photos')
    .select('event:events(organizer_id)')
    .eq('id', photoId)
    .single()

  if (!photo) {
    return { error: 'Photo not found' }
  }

  const { error } = await supabase
    .from('event_photos')
    .update({
      status: 'approved',
      moderated_by: user.id,
      moderated_at: new Date().toISOString()
    })
    .eq('id', photoId)

  if (error) {
    return { error: 'Failed to approve photo' }
  }

  revalidatePath('/organizer/photos')
  return { success: true }
}

export async function rejectPhoto(photoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('event_photos')
    .update({
      status: 'rejected',
      moderated_by: user.id,
      moderated_at: new Date().toISOString()
    })
    .eq('id', photoId)

  if (error) {
    return { error: 'Failed to reject photo' }
  }

  revalidatePath('/organizer/photos')
  return { success: true }
}
