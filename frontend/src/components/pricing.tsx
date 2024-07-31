import { cookies } from 'next/headers'
import Link from 'next/link'

import { getLifetimePaymentStatus, getSession } from '@/app/_data/user'
import { StripeCheckout } from '@/app/api/stripe/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/db/server'
import { cn } from '@/lib/utils'

import { Heading } from './cult/gradient-heading'

export async function LifetimePayment() {
  const PAYMENT_MODE = 'one-time'
  const ONE_TIME_PAYMENT_TYPE = 'lifetime' // null
  const PRICE = 5_00

  const db = createClient(cookies())
  const hasLicense = await getLifetimePaymentStatus(db)
  const session = await getSession()

  return (
    <>
      {hasLicense ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <div>
              <Link href={'/'}>Access </Link>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <>
          <p className="text-base font-semibold text-neutral-800">Limited time offer</p>
          <p className="mt-6 flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-neutral-900">$5</span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-600">
              USD
            </span>
          </p>
          <StripeCheckout
            metadata={{
              userId: session?.user.id ?? null,
              oneTimePaymentType: ONE_TIME_PAYMENT_TYPE,
            }}
            paymentType={PAYMENT_MODE}
            price={PRICE}
            className="my-1 rounded border bg-gray-50 px-4 py-2 transition duration-100 hover:bg-blue-600 hover:text-white"
          >
            Buy the product
          </StripeCheckout>
        </>
      )}
    </>
  )
}

export function Pricing({ children }) {
  return (
    <div className=" py-24 sm:py-36 rounded-t-[64px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading variant="default" size="xxl">
            Pricing
          </Heading>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 bg-neutral-900 ring-neutral-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-100">
              <Heading variant="default" size="xxl">
                Product
              </Heading>
            </h3>
            <p className="mt-6 text-base leading-7 text-neutral-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A voluptates asperiores
              nostrum dignissimos ut quia aliquam harum eaque ipsa. Iusto ad sapiente earum libero
              quibusdam neque optio architecto suscipit ipsam!
            </p>
          </div>
          <div className="-mt-2 p-2 lg:mt-[3px] lg:mr-1  lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-brand-400 py-10 text-center ring-1 ring-inset ring-neutral-900/5 lg:flex lg:flex-col lg:justify-center lg:py-[4.2rem]">
              <div className="mx-auto max-w-xs px-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
