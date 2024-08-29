import { cookies } from 'next/headers'
import { createClient } from '@/db/server'
import { nanoid } from '@/lib/utils'
import MainVectorPanel from './_features/main-panel'
import { checkAndInsertUserConfig } from '@/app/_data/user'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const id = nanoid()
  const db = createClient(cookies())
  const {
    data: { user },
  } = await db.auth.getUser()

  if (user) {
    await checkAndInsertUserConfig()
  }

  return <MainVectorPanel id={id} user={user} />
}