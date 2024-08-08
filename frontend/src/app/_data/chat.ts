'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { createClient } from '@/db/server'
import { Chat, type ChatWithSources } from '@/types/index'

import { getCurrentUserId } from './user'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const db = createClient(cookies())
    const { data } = await db
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .eq('is_newsletter', false)
      .throwOnError()

    return (data?.map((entry) => entry.payload as Chat) ?? []).filter(chat => 
      chat && 
      typeof chat === 'object' && 
      'id' in chat &&
      'path' in chat &&
      'title' in chat &&
      'messages' in chat &&
      Array.isArray(chat.messages)
    )
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export interface NewsletterChat {
  id: string;
  path: string;
  title: string;
  messages: any[];
  createdAt: string;
  cron_expression: string;
}

interface RawChatData {
  id: string;
  payload: {
    path: string;
    title: string;
    messages: any[];
    createdAt: string;
  };
  cron_expression: string;
}

export async function getNewsletterChats(userId?: string | null): Promise<NewsletterChat[]> {
  if (!userId) {
    return []
  }
  try {
    const db = createClient(cookies())
    const { data } = await db
      .from('chats')
      .select('id, payload, cron_expression')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .eq('is_newsletter', true)
      .eq('is_deleted', false)
      .throwOnError()

    return (data as RawChatData[] ?? [])
      .map((entry): NewsletterChat => ({
        id: entry.id,
        path: entry.payload.path,
        title: entry.payload.title,
        messages: entry.payload.messages,
        createdAt: entry.payload.createdAt,
        cron_expression: entry.cron_expression,
      }))
      .filter((chat): chat is NewsletterChat =>
        chat &&
        typeof chat === 'object' &&
        'id' in chat &&
        'path' in chat &&
        'title' in chat &&
        'messages' in chat &&
        'createdAt' in chat &&
        'cron_expression' in chat &&
        Array.isArray(chat.messages)
      )
  } catch (error) {
    console.error('Error fetching newsletter chats:', error)
    return []
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const db = createClient(cookies())
    await db.from('chats').delete().eq('id', id).throwOnError()
    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    console.error('Error removing chat:', error)
    return {
      error: 'Unauthorized',
    }
  }
}

export async function clearChats() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return {
      error: 'Unauthorized',
    }
  }
  try {
    const db = createClient(cookies())
    await db.from('chats').delete().eq('user_id', userId).throwOnError()
    revalidatePath('/')
  } catch (error) {
    return {
      error: 'Unauthorized',
    }
  }
}

export async function getSharedChat(id: string) {
  const db = createClient(cookies())
  const { data } = await db
    .from('chats')
    .select('payload')
    .eq('id', id)
    .not('payload->sharePath', 'is', null)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  }

  const db = createClient(cookies())
  await db
    .from('chats')
    .update({ payload: payload as any })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}

export async function getChatWithSources(id: string): Promise<ChatWithSources> {
  const db = createClient(cookies())

  // Fetch chat payload
  const { data: chatData, error: chatError } = await db
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  if (chatError) {
    console.error('Error fetching chat:', chatError)
    // return null; // Handle the error appropriately
  }

  // Fetch sources associated with the chat
  const { data: sourceData, error: sourceError } = await db
    .from('source_chat_map')
    .select(`messageindex, sources (id, content, metadata)`)
    .eq('chat_id', id)

  if (sourceError) {
    console.error('Error fetching sources:', sourceError)
    // return null; // Handle the error appropriately
  }

  // Map sources to their corresponding message index
  const sourcesByMessageIndex = {}
  sourceData?.forEach((mapping) => {
    const messageIndex: string | null = mapping.messageindex

    // Ensure messageIndex is a string before using it as a key
    if (messageIndex && !sourcesByMessageIndex[messageIndex]) {
      sourcesByMessageIndex[messageIndex] = []
    }

    // Since we're sure messageIndex is not null here, we can safely use the non-null assertion operator (!)
    if (messageIndex) {
      sourcesByMessageIndex[messageIndex!].push(mapping.sources)
    }
  })

  const chatWithSources: ChatWithSources = {
    payload: (chatData?.payload as Chat) ?? {},
    sources: sourcesByMessageIndex,
  }

  return chatWithSources
}
