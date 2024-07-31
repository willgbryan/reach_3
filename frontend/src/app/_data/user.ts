'use server'

import 'server-only'

import { cookies } from 'next/headers'

import { createClient } from '@/db/server'

export async function getSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}

export async function getUserDetails() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data: userDetails } = await supabase.from('users').select('*').single()
    return userDetails
  } catch (error) {
    return null
  }
}

export async function getSubscription() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError()
    return subscription
  } catch (error) {
    return null
  }
}

// USER PAYMENT STATUS

/**
 * Retrieves the lifetime payment status for the current user.
 *
 * @param {object} supabase - The initialized Supabase client.
 * @returns {boolean} True if the user has completed a lifetime payment, false otherwise.
 */
export async function getLifetimePaymentStatus(supabase) {
  const userId = await getCurrentUserId()
  if (!userId) return false

  return await hasCompletedLifetimePayment(userId, supabase)
}

/**
 * Gets the current user's ID from the session.
 *
 * @returns {string|null} The current user's ID or null if not found.
 */
export async function getCurrentUserId() {
  const session = await getSession()
  return session?.user?.id || null
}

/**
 * Checks if the user has completed a lifetime payment.
 *
 * @param {string} userId - The user ID.
 * @param {object} supabase - The initialized Supabase client.
 * @returns {boolean} True if a completed lifetime payment exists, false otherwise.
 */
async function hasCompletedLifetimePayment(userId, supabase) {
  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('user_id', userId)
    .eq('metadata ->> oneTimePaymentType', 'lifetime')
    .single()

  if (error) {
    return false // Not a paid user
  }

  return data.status === 'completed'
}

export async function getUserDocumentSets() {
  const id = await getCurrentUserId()
  if (!id) return []

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('document_set')
    .select(
      `
        id, 
        title, 
        description,
        created_at,
        updated_at,
        private,
        document_sections ( id, content, metadata, name )
      `,
    )
    .eq('user_id', id)

  if (error) {
    console.error('Error fetching study sets with documents:', error)
    return []
  }

  // Filter study sets to include only those that have associated documents
  const setsWithDocuments = data.filter(
    (set) => set.document_sections && set.document_sections.length > 0,
  )

  return setsWithDocuments
}
