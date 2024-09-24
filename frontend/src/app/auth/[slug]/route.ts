import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Provider } from '@supabase/supabase-js'
import { createClient } from '@/db/server'

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT

  if (deployment === "PROD") {
    return 'https://heighliner.tech'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://heighliner.tech'
  }
}

// Use the new function to set the base URL
const baseUrl = getBaseUrl()

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { slug: string }
  },
) {
  const slug = params.slug
  const { searchParams } = new URL(req.url)
  const next = searchParams.get('next')
  const redirectPath = next ? `$/auth/callback?next=${next}` : `/chat`
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (slug === 'email') {
    const email = searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${new URL(req.url).origin}${redirectPath}`,
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Check your email for the login code' })
  }

  // Handle other providers
  const provider = slug as Provider
  let options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${new URL(req.url).origin}${redirectPath}`,
  }

  if (provider === 'azure') {
    options.scopes = 'email'
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  })

  if (error) throw error
  return NextResponse.redirect(data.url)
}