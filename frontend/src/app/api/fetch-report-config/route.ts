import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export async function GET(req: NextRequest) {
  const db = createClient(cookies())
  const { data: { session } } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data, error } = await db
      .from('user_config')
      .select('report_config')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching report configuration:', error)
    return new NextResponse(JSON.stringify({ message: 'Error fetching report configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}