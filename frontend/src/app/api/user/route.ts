import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const db = createClient(cookieStore)

  const { data: { session } } = await db.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ user: session.user })
}