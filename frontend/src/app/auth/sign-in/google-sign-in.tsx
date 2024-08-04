'use client'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/app/supabase-provider'

export function GoogleSignIn() {
  const { supabase } = useSupabase()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error signing in with Google:', error)
  }

  return (
    <Button
      onClick={signInWithGoogle}
      variant="outline"
      className="w-full bg-[#e4e4e4] text-black hover:bg-stone-900 flex items-center justify-center border-none" 
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5 mr-3"
      />
      Sign in with Google
    </Button>
  )
}