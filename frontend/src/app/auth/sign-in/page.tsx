import { redirect } from 'next/navigation'
import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { Card, CardContent } from '@/components/ui/card'
import { OTPAuthFlow } from './otp-auth-flow'
import BackgroundMedia from "@/components/cult/bg-media"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';

export default async function SignIn() {
  const session = await getSession()
  if (session) {
    // redirect('/chat')
    return redirect(`${baseUrl}/chat`)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Video background (hidden on small screens) */}
      <div className="hidden md:block md:w-1/2 relative">
        <BackgroundMedia
          type="video"
          variant="light"
          src="/auth-quantum-vertical.mp4"
          videoFit="cover"
        />
      </div>

      {/* Sign-in form (full width and height on small screens, half width on md and up) */}
      <div className="flex-grow w-full md:w-1/2 flex flex-col items-center justify-center bg-[#e4e4e4] p-8">
        <Heading variant="secondary" weight="thin" size="xl" className="mb-8">Magi</Heading>
        <Card className="w-full max-w-md bg-[#e4e4e4] border-none relative corner-borders">
          <CardContent className="items-center justify-center space-y-4 p-6">
            <OTPAuthFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}