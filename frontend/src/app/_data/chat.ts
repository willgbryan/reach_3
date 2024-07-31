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
      .throwOnError()

    return (data?.map((entry) => entry.payload) as Chat[]) ?? []
  } catch (error) {
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
