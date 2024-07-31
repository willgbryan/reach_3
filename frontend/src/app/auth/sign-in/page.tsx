import { redirect } from 'next/navigation'

import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CultIcon } from '@/components/ui/icons'

import { OTPForm } from './oauth-form'

export default async function SignIn() {
  const session = await getSession()

  if (session) {
    return redirect('/')
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
          <div className="flex items-center justify-center pt-12 md:pt-24 ">
            <Card>
              <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>👋 Welcome to the cult</CardDescription>
              </CardHeader>
              <CardContent className=" space-y-2">
                <div className="space-y-2 w-full min-w-[16rem] lg:min-w-[24rem]">
                  <OTPForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
