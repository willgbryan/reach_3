import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Provider } from '@supabase/supabase-js'

import { createClient } from '@/db/server'

export async function GET(
  req: NextRequest,
  {
    params, // searchParams,
  }: {
    params: { slug: string }
  },
) {
  const provider = params.slug as Provider
  const { searchParams } = new URL(req.url)
  const next = searchParams.get('next')
  const redirectPath = next ? `/auth/callback?next=${next}` : `/auth/callback`

  let options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${new URL(req.url).origin}${redirectPath}`,
  }

  if (provider == 'azure') {
    options.scopes = 'email'
  }

  if (provider) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    })

    if (error) throw error

    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(new URL('/auth/sign-in', req.url))
}
