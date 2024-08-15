'use server'

import 'server-only'

import { cookies } from 'next/headers'

import { createClient } from '@/db/server'

export interface OldSource {
  id: string
  source_url: string
  content: string
  chat_id: string
}

export async function getOldSources(chatId: string): Promise<OldSource[]> {
  try {
    const db = createClient(cookies())
    const { data, error } = await db
      .from('web_source_content_raw')
      .select('id, source_url, content, chat_id')
      .eq('chat_id', chatId)
      .throwOnError()

    if (error) {
      throw error
    }

    return (data as OldSource[] ?? []).filter((source): source is OldSource =>
      source &&
      typeof source === 'object' &&
      'id' in source &&
      'source_url' in source &&
      'content' in source &&
      'chat_id' in source
    )
  } catch (error) {
    console.error('Error fetching old sources:', error)
    return []
  }
}