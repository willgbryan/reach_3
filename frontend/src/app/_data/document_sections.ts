'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { createClient } from '@/db/server'

export async function removeDocument({ id, path }: { id: string; path: string }) {
  try {
    const db = createClient(cookies())
    await db.from('document_sections').delete().eq('id', id).throwOnError()

    revalidatePath('/library')
    return revalidatePath(path)
  } catch (error) {
    return {
      error: 'Unauthorized',
    }
  }
}

export async function searchDocuments({ query }: { query: string }) {
  try {
    const db = createClient(cookies())

    const { data: results, error } = await db
      .from('document_sections')
      .select('content, name, created_at, metadata, updated_at, id')
      .textSearch('fts', `'${query}'`, {
        type: 'websearch',
        config: 'english',
      })

    return results
  } catch (error) {
    return []
  }
}

export async function getAllDocuments() {
  try {
    const db = createClient(cookies())

    const { count } = await db.from('document_sections').select('id', { count: 'exact' })

    return count
  } catch (error) {
    return 0
  }
}
