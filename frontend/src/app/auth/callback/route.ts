import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createClient } from '@/db/server'

const getUrl = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT
  if (deployment === "PROD") {
    return 'https://themagi.systems'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_SITE_URL || 
           process.env.NEXT_PUBLIC_VERCEL_URL || 
           'http://localhost:3000'
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? ''
  const redirectPath = searchParams.get('redirect')
  const redirect = getUrl() + redirectPath

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const baseUrl = getBaseUrl()
      return NextResponse.redirect(new URL(`${baseUrl}/${next}`, request.url))

      // return NextResponse.redirect(
      //   redirect ? origin : new URL(`/${next.slice(1)}`, request.url)
      // );
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
