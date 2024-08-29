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
      const { favorite_theme } = await req.json()
      const { error } = await db
        .from('user_config')
        .update({ favorite_theme })
        .eq('user_id', userId)
  
      if (error) throw error
  
      return new NextResponse(JSON.stringify({ message: 'Favorite theme updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error updating favorite theme:', error)
      return new NextResponse(JSON.stringify({ message: 'Error updating favorite theme' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }