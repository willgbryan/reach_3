import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AppLayout } from '@/components/layout/app-layout'
import { MainPanelLayout } from '@/components/layout/main-panel'
import { NavHistoryList } from '@/components/nav/nav-history-list'
import { createClient } from '@/db/server'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }) {
  const db = createClient(cookies())
  const {
    data: { user },
  } = await db.auth.getUser()

  if (!user) {
    redirect(`/auth/sign-in`)
  }

  return (
    <AppLayout historyChildren={<NavHistoryList user={user} />} user={user}>

    {/* <AppLayout user={user}> */}
      <MainPanelLayout>{children}</MainPanelLayout>
    </AppLayout>
  )
}
