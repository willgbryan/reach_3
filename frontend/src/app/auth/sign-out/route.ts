import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/db/server'

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT

  if (deployment === "PROD") {
    return 'https://themagi.systems'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems'
  }
}

const baseUrl = getBaseUrl()

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL(`/auth/sign-in`, req.url), {
    status: 302,
  })
}
