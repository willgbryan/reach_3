import { redirect } from 'next/navigation'

import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { CultIcon } from '@/components/ui/icons'

export const dynamic = 'force-dynamic'

function getBaseUrl(): string {
  const deployment = process.env.DEPLOYMENT

  if (deployment === "PROD") {
    return 'https://themagi.systems'
  } else if (deployment === "DEV") {
    return ''
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems'
  }
}

const baseUrl = getBaseUrl()

export default async function SignIn() {
  const session = await getSession()

  if (!session) {
    return redirect(`${baseUrl}/auth/sign-in`)
  }

  if (session) {
    return redirect(`${baseUrl}/chat`)
  }

  return (
    <>
      <section className="h-full w-full">
        <div className=" flex flex-col justify-center items-center mt-16 md:mt-36">
          <div className="flex gap-2">
            <div>
              <Heading size="xxl">Heighliner</Heading>
              <Heading size="sm" variant="secondary" className="-mt-2 md:-mt-4">
                if you're reading this, the app is cooked.
              </Heading>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
