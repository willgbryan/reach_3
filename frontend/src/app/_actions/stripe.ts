'use server'

import { createClient } from '@/db/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function createStripePortalSession(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created', { ascending: false })
      .limit(1)
      .single()

    if (paymentError || !payment?.stripe_customer_id) {
      console.log(`customer id data= ${payment}`)
      console.error('Error fetching stripe_customer_id:', paymentError)
      throw new Error('Unable to find Stripe customer ID for user')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: payment.stripe_customer_id,
      return_url: `https://heighliner.tech/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating Stripe portal session:', error)
    throw new Error('Failed to create Stripe portal session')
  }
}