import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Provider } from '@supabase/supabase-js'
import { createClient } from '@/db/server'

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
  const redirectPath = next ? `/auth/callback?next=${next}` : `/auth/callback`
  
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