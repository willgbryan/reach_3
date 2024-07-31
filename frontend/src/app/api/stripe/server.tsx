import { headers } from 'next/headers'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { CheckoutButton } from './client'

// Updated StripeCheckout component to include payment type
export async function StripeCheckout({
  price, // Price for the item or membership
  className, // Optional className for styling
  children, // Optional children elements
  metadata, // Metadata object to be passed to Stripe
  paymentType, // Type of payment: 'subscription' or 'one-time'
}: {
  price: number
  className?: string
  children?: React.ReactNode
  metadata: { [name: string]: string | number | null }
  paymentType: 'subscription' | 'one-time'
}) {
  // Stripe React Server Component to create Checkout session
  async function createStripeSession() {
    'use server'
    const headersList = headers()

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Item' },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],

        metadata,
        mode: 'payment',
        success_url: `${headersList.get('origin')}/auth/sign-in`,
        cancel_url: `${headersList.get('origin')}/`,
      })

      return JSON.parse(JSON.stringify(session)) as Stripe.Response<Stripe.Checkout.Session>
    } catch (error) {
      console.error(`createStripeSession()`, error)
    }
  }

  return (
    <CheckoutButton
      createStripeSession={createStripeSession}
      className={className}
      children={children}
    />
  )
}
