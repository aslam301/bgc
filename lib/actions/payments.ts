'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(data: {
  event_id: string
  user_id: string
  amount: number
  payment_method: string
  razorpay_payment_id?: string
  razorpay_order_id?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions')
    .insert({
      ...data,
      status: 'completed',
      transaction_date: new Date().toISOString()
    })

  if (error) {
    return { error: 'Failed to record transaction' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function requestPayout(amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is an organizer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'organizer') {
    return { error: 'Only organizers can request payouts' }
  }

  // Get organizer's balance
  const { data: earnings } = await supabase
    .rpc('get_organizer_earnings', { organizer_id: user.id })

  if (!earnings || earnings < amount) {
    return { error: 'Insufficient balance' }
  }

  // Create payout request
  const { error } = await supabase
    .from('organizer_payouts')
    .insert({
      organizer_id: user.id,
      amount,
      status: 'pending',
      requested_at: new Date().toISOString()
    })

  if (error) {
    return { error: 'Failed to create payout request' }
  }

  revalidatePath('/organizer/payouts')
  return { success: true }
}

export async function approvePayout(payoutId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Only admins can approve payouts' }
  }

  const { error } = await supabase
    .from('organizer_payouts')
    .update({
      status: 'approved',
      processed_at: new Date().toISOString(),
      processed_by: user.id
    })
    .eq('id', payoutId)

  if (error) {
    return { error: 'Failed to approve payout' }
  }

  revalidatePath('/admin/payouts')
  return { success: true }
}

export async function rejectPayout(payoutId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Only admins can reject payouts' }
  }

  const { error } = await supabase
    .from('organizer_payouts')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      processed_at: new Date().toISOString(),
      processed_by: user.id
    })
    .eq('id', payoutId)

  if (error) {
    return { error: 'Failed to reject payout' }
  }

  revalidatePath('/admin/payouts')
  return { success: true }
}
