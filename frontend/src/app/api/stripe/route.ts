import { NextRequest } from 'next/server'

import { processLifetimePayment } from '@/app/_data/stripe'
import { adminConfig, dbAdmin } from '@/db/admin'
import { stripe } from '@/lib/stripe'

validateEnvironment(adminConfig)

export async function POST(req: NextRequest) {
  const event = await validateAndConstructStripeEvent(req)
  await processStripeEvent(event, dbAdmin)

  return new Response(JSON.stringify({ status: 200, message: 'success' }), {
    status: 200,
  })
}

function validateEnvironment(config) {
  if (!config.url || !config.serviceRoleKey || !config.webhookSecret) {
    throw new Error('Required environment variables are missing')
  }
}

async function validateAndConstructStripeEvent(req) {
  if (!req.body) throw new Error(`Missing request body`)

  const stripeSignature = req.headers.get('stripe-signature')
  if (!stripeSignature) throw new Error('Stripe signature is missing')

  try {
    return stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      adminConfig.webhookSecret,
    )
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}

async function processStripeEvent(event, db) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, db)
        break

      // Add more cases for other event types as needed
      // Subscription support coming soon

      default:
        console.warn(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing Stripe webhook event:', error.message)
    throw error
  }
}

async function handleCheckoutSessionCompleted(session, db) {
  try {
    switch (session.mode) {
      // Coming soon
      case 'payment':
        const oneTimePaymentType = session.metadata?.oneTimePaymentType
        if (oneTimePaymentType === 'lifetime') {
          await processLifetimePayment(session, db)
        } else {
          // await handlePayment(session, userId, db);
        }

        break
      default:
        console.warn(`Unhandled session mode: ${session.mode}`)
        // Handle other modes or throw an error if necessary
        break
    }
  } catch (error) {
    console.error('Error in handling checkout session:', error.message)
    throw error // Rethrow after logging, if this aligns with your error handling strategy
  }
}
