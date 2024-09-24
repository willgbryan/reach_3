import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/db/server'

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT
  if (deployment === "PROD") {
    return 'https://heighliner.tech'
  } else if (deployment === "DEV") {
    return 'https://heighliner.tech'
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://heighliner.tech'
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/chat'
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      const baseUrl = getBaseUrl()
      console.log(`Redirecting to: ${baseUrl}${next}`)
      return NextResponse.redirect(new URL(`${baseUrl}${next}`, request.url))
    } else {
      console.error('Error exchanging code for session:', error)
    }
  }
  
  console.log('Redirecting to sign-in page due to error or missing code')
  return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}