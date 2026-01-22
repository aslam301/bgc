'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Please enter your email address' }
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error: 'Failed to send password reset email. Please try again.' }
  }

  return {
    success: true,
    message: 'Password reset link sent! Check your email inbox.'
  }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!password || !confirmPassword) {
    return { error: 'Please fill in all fields' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.error('Password update error:', error)
    return { error: 'Failed to update password. Please try again.' }
  }

  return {
    success: true,
    message: 'Password updated successfully! You can now sign in with your new password.'
  }
}
