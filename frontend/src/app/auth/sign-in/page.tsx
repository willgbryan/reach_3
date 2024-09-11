import { redirect } from 'next/navigation'
import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { Card, CardContent } from '@/components/ui/card'
import { OTPAuthFlow } from './otp-auth-flow'
import BackgroundMedia from "@/components/cult/bg-media"
import Head from 'next/head'

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT

  if (deployment === "PROD") {
    return 'https://heighliner.tech'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://heighliner.tech'
  }
}

const title = "Heighliner"
const description = "Knowledge work, modernized"
const imageUrl = "https://s.yimg.com/ny/api/res/1.2/6YLkalF05.eeHi15u_0_.w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://o.aolcdn.com/hss/storage/midas/29cdfcf2bb2af26b103c432d02cbe5e2/205180329/TN-JPL1978-300dpi-ed2.jpg"
const canonicalUrl = "https://heighliner.tech/chat"

const baseUrl = getBaseUrl()
export default async function SignIn() {
  const session = await getSession()
  if (session) {
    // redirect('/chat')
    return redirect(`${baseUrl}/chat`)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
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
      <div className="hidden md:block md:w-1/2 relative">
        <BackgroundMedia
          type="video"
          variant="light"
          src="/auth-quantum-vertical.mp4"
          videoFit="cover"
        />
      </div>

      <div className="flex-grow w-full md:w-1/2 flex flex-col items-center justify-center bg-[#e4e4e4] p-8">
        <Heading variant="secondary" weight="thin" size="xl" className="mb-8">Heighliner</Heading>
        <Card className="w-full max-w-md bg-[#e4e4e4] border-none relative corner-borders">
          <CardContent className="items-center justify-center space-y-4 p-6">
            <OTPAuthFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}