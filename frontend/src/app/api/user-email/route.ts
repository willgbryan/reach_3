import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/db/server'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const db = createClient(cookieStore)
  const { data: { session } } = await db.auth.getSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ email: null }, { status: 200 })
  }

  return NextResponse.json({ email: session.user.email }, { status: 200 })
}