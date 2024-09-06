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
      .select('chart_config')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new NextResponse(JSON.stringify({ chart_config: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new NextResponse(JSON.stringify({ chart_config: data.chart_config || {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching chart configuration:', error)
    return new NextResponse(JSON.stringify({ message: 'Error fetching chart configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}