import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const { data: { session } } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { chatId, sources, content } = await req.json()

    const { error } = await db
      .from('web_source_content_raw')
      .insert(
        sources.map((source: string, index: number) => ({
          added_by: userId,
          source_url: source,
          content: content[index],
          chat_id: chatId,
        }))
      )

    if (error) {
      throw error
    }

    return new NextResponse(JSON.stringify({ message: 'Sources and content saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error saving sources and content:', error)
    return new NextResponse(JSON.stringify({ message: 'Error saving sources and content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}