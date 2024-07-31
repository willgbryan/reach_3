'use client'

// Client side fetch hooks
import useSWR from 'swr'

import { createClient } from '@/db/client'

async function getUserSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return { userId: session?.user.id, db: supabase }
}

export async function getUserDocumentSets() {
  const { userId, db } = await getUserSession()

  if (userId) {
    const { data, error } = await db
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
      .eq('user_id', userId)

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
  return null
}

export function useGetDocumentSets() {
  const { data, isLoading, error } = useSWR('get-user-document-sets', getUserDocumentSets)

  return { data, isLoading, error }
}
