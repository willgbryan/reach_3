import { redirect } from 'next/navigation'

import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { CultIcon } from '@/components/ui/icons'

export const dynamic = 'force-dynamic'

export default async function SignIn() {
  const session = await getSession()

  if (!session) {
    return redirect('/auth/sign-in')
  }

  if (session) {
    return redirect('/chat')
  }

  return (
    <>
      <section className="h-full w-full">
        <div className=" flex flex-col justify-center items-center mt-16 md:mt-36">
          <div className="flex gap-2">
            <CultIcon className=" h-16 w-12 md:h-24 md:w-16 mt-1" />
            <div>
              <Heading size="xxl">Manifest</Heading>
              <Heading size="sm" variant="secondary" className="-mt-2 md:-mt-4">
                newcult.co template
              </Heading>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
