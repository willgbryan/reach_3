'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { createClient } from '@/db/server'

export async function getSubscriptionStatus() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return null
    }
    const { data: subscription, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .order('created', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
    if (!subscription) {
      return null
    }
    
    let parsedMetadata = subscription.metadata
    if (typeof subscription.metadata === 'string') {
      try {
        parsedMetadata = JSON.parse(subscription.metadata)
      } catch (e) {
        console.error('Error parsing metadata:', e)
      }
    }
    
    return {
      ...subscription,
      metadata: parsedMetadata,
      isActive: true,
    }
  } catch (error) {
    console.error('Error in getSubscriptionStatus:', error)
    return null
  }
}

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

export async function checkAndInsertUserConfig() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    console.error('No user ID found')
    return
  }

  try {
    const { data: existingConfig, error: selectError } = await supabase
      .from('user_config')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError
    }

    if (!existingConfig) {
      const { data: insertData, error: insertError } = await supabase
        .from('user_config')
        .insert({
          user_id: userId,
          job_title: 'Not specified',
          industry: 'Not specified',
          report_config: {},
          favorite_theme: (`${userId}/HeighlinerBaseTemplate.pptx`),
          chart_config: {},
        })
        .single()

      if (insertError) {
        // If insert fails due to a conflict, it means another process inserted the config
        // between our check and insert. In this case, we can consider it a success.
        if (insertError.code === '23505') { // unique_violation error code
          console.log('User config was inserted by another process')
          return
        }
        throw insertError
      }

      console.log('New user config inserted:', insertData)
      await createUserThemeFolder(userId, supabase)
      await createUserUploadFolder(userId, supabase)

    } else {
      console.log('User config already exists')
    }
  } catch (error) {
    console.error('Error checking/inserting user config:', error)
  }
}

async function createUserThemeFolder(userId: string, supabase: any) {
  try {
    const { data: folderData, error: folderError } = await supabase
      .storage
      .from('slide_themes')
      .upload(`${userId}/.folder`, new Uint8Array())

    if (folderError) {
      throw folderError
    }

    console.log(`Folder created for user ${userId} in slide_themes bucket`)

    const sourceFile = 'base_templates/HeighlinerBaseTemplate.pptx'
    const destinationFile = `${userId}/HeighlinerBaseTemplate.pptx`

    const { data, error } = await supabase
      .storage
      .from('slide_themes')
      .copy(sourceFile, destinationFile)

    if (error) {
      throw error
    }

    console.log(`Base template copied to user ${userId}'s folder`)
  } catch (error) {
    console.error('Error in createUserThemeFolder:', error)
  }
}

async function createUserUploadFolder(userId: string, supabase: any) {
  try {
    const { data: folderData, error: folderError } = await supabase
      .storage
      .from('user_uploads')
      .upload(`${userId}/.folder`, new Uint8Array())

    if (folderError) {
      throw folderError
    }

    console.log(`Successfully created user upload folder for ${userId}`)
  } catch (error) {
    console.error('Error in createUserUploadFolder:', error)
  }
}

// // gotta bring this back in once payment has been implemented
// export async function getSubscription() {
//   const cookieStore = cookies()
//   const supabase = createClient(cookieStore)
//   try {
//     const { data: subscription } = await supabase
//       .from('subscriptions')
//       .select('*, prices(*, products(*))')
//       .in('status', ['trialing', 'active'])
//       .maybeSingle()
//       .throwOnError()
//     return subscription
//   } catch (error) {
//     return null
//   }
// }

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
