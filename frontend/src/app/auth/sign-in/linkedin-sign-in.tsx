'use client'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/app/supabase-provider'

function getBaseUrl(): string {
  const deployment = process.env.NEXT_PUBLIC_DEPLOYMENT
  if (deployment === "PROD") {
    return 'https://heighliner.tech'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://heighliner.tech'
  }
}

export function LinkedInSignIn() {
  const { supabase } = useSupabase()

  const signInWithLinkedIn = async () => {
    const baseUrl = getBaseUrl()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `/auth/callback`,
      },
    })
    if (error) console.error('Error signing in with LinkedIn:', error)
  }

  return (
    <Button
      onClick={signInWithLinkedIn}
      variant="outline"
      className="w-full bg-[#e4e4e4] text-black hover:text-stone-100 hover:bg-stone-900 flex items-center justify-center border-none"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/144px-LinkedIn_icon.svg.png?20210220164014"
        alt="LinkedIn logo"
        className="w-5 h-5 mr-3"
      />
      Sign in with LinkedIn
    </Button>
  )
}