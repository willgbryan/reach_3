import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createClient } from '@/db/server'

import { embedAndStoreFileData } from './embed'

export const runtime = 'nodejs'

/**
 * Retrieves the current user session and initializes the Supabase client.
 * This function extracts the user ID from the session and returns it along
 * with the initialized database client.
 */
async function getUserSession() {
  const supabase = createClient(cookies())
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return { userId: session?.user.id, db: supabase }
}

/**
 * Retrieves or creates a study set in the database.
 * It first checks if a study set with the given name already exists for the user.
 * If it exists, it returns its ID. Otherwise, it creates a new study set and returns its ID.
 * @param {Object} db - The database client.
 * @param {string} userId - The ID of the user.
 * @param {string} indexName - The name of the study set.
 */
async function getOrCreateDocSet(db, userId, docSetName) {
  let { data: existingStudySet, error } = await db
    .from('document_set')
    .select('id')
    .eq('user_id', userId)
    .eq('title', docSetName)
    .single()

  if (error) {
    console.error('Error fetching study set:', error)
  }

  if (existingStudySet) {
    return existingStudySet.id
  }

  const { data: newStudySet, error: insertError } = await db
    .from('document_set')
    .insert({ title: docSetName, user_id: userId })
    .single()

  if (insertError) {
    console.error('Error creating study set:', insertError)
  }

  return newStudySet?.id
}

/**
 * The main handler for POST requests.
 * This function processes the request data, embeds and stores file data,
 * and then responds with the result.
 * @param {Request} req - The incoming request object.
 */
export async function POST(req) {
  const { fileData, fileName, docSetName } = await req.json()
  const { db, userId } = await getUserSession()

  try {
    const docSetId = await getOrCreateDocSet(db, userId, docSetName)
    const seedResult = await embedAndStoreFileData({
      fileData,
      docSetId,
      docSetName,
      fileName,
    })

    return NextResponse.json({ success: true, seedResult })
  } catch (error) {
    console.error('Error in embedding and storing file data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed in the embedding and storing process',
    })
  }
}
