import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const {
    data: { session },
  } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { chatId, completion, messages } = await req.json()

    await saveChatHistory({
      chatId,
      completion,
      messages,
      userId,
      db,
    })

    return new NextResponse(JSON.stringify({ message: 'Chat history saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error saving chat history:', error)
    return new NextResponse(JSON.stringify({ message: 'Error saving chat history' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

interface ChatHistoryParams {
  chatId: string
  completion: string
  messages: any[]
  userId: string
  db: ReturnType<typeof createClient>
}

async function saveChatHistory({
  chatId,
  completion,
  messages,
  userId,
  db,
}: ChatHistoryParams): Promise<void> {
  const newMessage = {
    content: completion,
    role: 'assistant',
    messageIndex: messages.length.toString(),
  }
  const chatPayload = {
    title: messages[0].content.substring(0, 100),
    userId,
    id: chatId,
    createdAt: new Date().toISOString(),
    path: `/chat/${chatId}`,
    messages: [...messages, newMessage],
  }
  const { error } = await db
    .from('chats')
    .upsert({
      id: chatId,
      user_id: userId,
      payload: chatPayload,
    })
  if (error) {
    console.error('Error saving chat history:', error)
    throw error
  }
}