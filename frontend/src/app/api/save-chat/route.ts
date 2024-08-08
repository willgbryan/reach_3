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
    const { chatId, completion, messages, isNewsletter, cadence, topic, style } = await req.json()
    await saveChatHistory({
      chatId,
      completion,
      messages,
      userId,
      db,
      isNewsletter,
      cadence,
    })

    if (isNewsletter) {
      await createNewsletterEntry({
        chatId,
        userId,
        db,
        topic,
        cadence,
        style,
      })
    }

    return new NextResponse(JSON.stringify({ message: 'Chat history and newsletter saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error saving chat history or creating newsletter:', error)
    return new NextResponse(JSON.stringify({ message: 'Error saving chat history or creating newsletter' }), {
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
  isNewsletter?: boolean
  cadence?: string
}

async function saveChatHistory({
  chatId,
  completion,
  messages,
  userId,
  db,
  isNewsletter = false,
  cadence,
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
    isNewsletter,
    cadence: isNewsletter && cadence ? getCronExpression(cadence) : null,
  }

  const { error } = await db
    .from('chats')
    .upsert({
      id: chatId,
      user_id: userId,
      payload: chatPayload,
      is_newsletter: isNewsletter,
      cron_expression: isNewsletter && cadence ? getCronExpression(cadence) : null,
    })

  if (error) {
    console.error('Error saving chat history:', error)
    throw error
  }
}

interface NewsletterEntryParams {
  chatId: string
  userId: string
  db: ReturnType<typeof createClient>
  topic: string
  cadence: string
  style: 'succinct' | 'standard' | 'in-depth'
}

async function createNewsletterEntry({
  chatId,
  userId,
  db,
  topic,
  cadence,
  style,
}: NewsletterEntryParams): Promise<void> {
  const reportType = {
    'succinct': 'paragraph',
    'standard': 'research_report',
    'in-depth': 'detailed_report'
  }[style]

  const { error } = await db
    .from('newsletters')
    .insert({
      id: chatId,
      user_id: userId,
      created_at: new Date().toISOString(),
      topic: topic,
      cron_expression: getCronExpression(cadence),
      report_type: reportType,
    })

  if (error) {
    console.error('Error creating newsletter entry:', error)
    throw error
  }
}

function getCronExpression(cadence: string): string {
  switch (cadence) {
    case 'daily':
      return '0 0 * * *'
    case 'weekly':
      return '0 0 * * 0'
    case 'monthly':
      return '0 0 1 * *'
    default:
      throw new Error('Invalid cadence')
  }
}