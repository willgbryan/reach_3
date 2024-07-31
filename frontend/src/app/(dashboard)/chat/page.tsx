import { cookies } from 'next/headers'

import { createClient } from '@/db/server'
import { nanoid } from '@/lib/utils'

import MainVectorPanel from './_features/main-panel'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const id = nanoid()

  const db = createClient(cookies())
  const {
    data: { user },
  } = await db.auth.getUser()

  return <MainVectorPanel id={id} user={user} />
}
