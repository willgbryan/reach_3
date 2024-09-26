'use server'

import { createClient } from '@/db/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function createStripePortalSession(stripeCustomerId: string) {
    if (!stripeCustomerId) {
      throw new Error('Stripe customer ID is required')
    }
  
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `https://heighliner.tech/billing`,
      })
      return { url: session.url }
    } catch (error) {
      console.error('Error creating Stripe portal session:', error)
      throw new Error('Failed to create Stripe portal session')
    }
  }