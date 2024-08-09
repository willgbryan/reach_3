import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL(`${baseUrl}/auth/sign-in`, req.url), {
    status: 302,
  })
}
