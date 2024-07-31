// Set the script to run in client-side context
'use client'

// Import necessary hooks from React
import { useState } from 'react'
// Import Stripe.js functions and type definitions
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js'
import { toast } from 'sonner'
import type S from 'stripe'

import { Button } from '@/components/ui/button'

// Initialize stripePromise to hold the loaded Stripe instance
let stripePromise: Promise<StripeClient | null>

// Function to load and return the Stripe instance, or return the existing instance if already loaded
const getStripe = () => {
  // Check if the stripePromise is not already set
  if (!stripePromise) {
    // Load Stripe with the publishable key and assign the resulting promise to stripePromise
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  // Return the promise which will resolve to the Stripe instance
  return stripePromise
}

export function CheckoutButton(props: {
  // Function to create a Stripe Checkout session
  createStripeSession(): Promise<S.Response<S.Checkout.Session> | undefined>
  className?: string
  children?: React.ReactNode
}) {
  // State to manage the loading status of the button
  const [loading, setLoading] = useState(false)

  return (
    <Button
      className="relative mt-10 text-white bg-gradient-to-b from-neutral-800 via-neutral-800 to-black px-6 py-2 rounded-full group transition-[width] duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] text-lg flex items-center mx-auto w-auto shadow-[0_1px_5px_rgba(0,0,0,0.2)]"
      onClick={async () => {
        setLoading(true)
        // Await the creation of a Stripe Checkout session
        const session = await props.createStripeSession()

        // Alert and exit function if session creation fails
        if (!session) {
          toast.error('Could not create stripe session')
          return
        }

        // Await the loading of the Stripe instance
        const stripe = await getStripe()
        // Alert and exit function if Stripe fails to load
        if (!stripe) {
          toast.error('Could not load stripe')
          return
        }

        // Redirect to Stripe's checkout page and catch any errors
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        })

        // Alert if there is an error in redirecting to checkout
        if (error) {
          toast.error(error.message)
        }
      }}
      disabled={loading}
    >
      Purchase now
      <div className="w-0 opacity-0 group-hover:w-[16px] group-hover:opacity-100 ml-1 overflow-hidden duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] transition-[width]">
        →
      </div>
      {/* {props.children ?? "Upgrade"} */}
    </Button>
  )
}
