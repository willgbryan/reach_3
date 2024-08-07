import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/db/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType
  const next = searchParams.get('next') ?? '/chat'
  // const next = searchParams.get('next') ?? `${baseUrl}/chat`

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url))
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url))
}

export async function POST(req: NextRequest) {
  const { email, token, type } = await req.json()
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: type as EmailOtpType
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'Success' })
}