import { cookies } from 'next/headers'
import { createClient } from '@/db/server'
import { nanoid } from '@/lib/utils'
import MainVectorPanel from './_features/main-panel'
import { checkAndInsertUserConfig } from '@/app/_data/user'
import Head from 'next/head'

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

  const title = "Heighliner"
  const description = "Knowledge work, modernized"
  const imageUrl = "https://s.yimg.com/ny/api/res/1.2/6YLkalF05.eeHi15u_0_.w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://o.aolcdn.com/hss/storage/midas/29cdfcf2bb2af26b103c432d02cbe5e2/205180329/TN-JPL1978-300dpi-ed2.jpg"
  const canonicalUrl = "https://heighliner.tech/chat"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MainVectorPanel id={id} user={user} />
    </>
  )
}