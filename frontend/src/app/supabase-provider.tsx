'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/db/client'

const Context = createContext<any | undefined>(undefined)

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, _session) => {
      if (_session?.access_token !== session?.access_token) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, session])

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  let context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
