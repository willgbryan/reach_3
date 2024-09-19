'use server'

import { createClient } from '@/db/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function createStripePortalSession(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: user, error: userError } = await supabase
      .from('payments')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError || !user?.stripe_customer_id) {
      throw new Error('Unable to find Stripe customer ID for user')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating Stripe portal session:', error)
    throw new Error('Failed to create Stripe portal session')
  }
}