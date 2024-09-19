import { NextRequest } from 'next/server'
import { processLifetimePayment, processSubscriptionPayment } from '@/app/_data/stripe'
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

function validateEnvironment(config: any) {
  if (!config.url || !config.serviceRoleKey || !config.webhookSecret) {
    throw new Error('Required environment variables are missing')
  }
}

async function validateAndConstructStripeEvent(req: NextRequest) {
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

async function processStripeEvent(event: any, db: any) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, db)
        break
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object, db)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, db)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, db)
        break
      default:
        console.warn(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing Stripe webhook event:', error.message)
    throw error
  }
}

async function handleSubscriptionChange(subscription: any, db: any) {
  const { data: payment, error } = await db
    .from('payments')
    .select('*')
    .eq('metadata->stripeSubscriptionId', subscription.id)
    .single()

  if (error) {
    throw new Error(`Error fetching payment: ${error.message}`)
  }

  if (!payment) {
    throw new Error(`No payment found for subscription ${subscription.id}`)
  }

  const updateData = {
    status: subscription.status,
    amount: subscription.items.data[0].price.unit_amount,
    price_id: subscription.items.data[0].price.id,
    metadata: {
      ...payment.metadata,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  }

  const { error: updateError } = await db
    .from('payments')
    .update(updateData)
    .eq('id', payment.id)

  if (updateError) {
    throw new Error(`Error updating payment: ${updateError.message}`)
  }
}

async function handleCheckoutSessionCompleted(session: any, db: any) {
  try {
    switch (session.mode) {
      case 'subscription':
        await processSubscriptionPayment(session, db)
        break
      case 'payment':
        const oneTimePaymentType = session.metadata?.oneTimePaymentType
        if (oneTimePaymentType === 'lifetime') {
          await processLifetimePayment(session, db)
        } else {
          console.warn(`Unhandled one-time payment type: ${oneTimePaymentType}`)
        }
        break
      default:
        console.warn(`Unhandled session mode: ${session.mode}`)
        break
    }
  } catch (error) {
    console.error('Error in handling checkout session:', error.message)
    throw error
  }
}

async function handleInvoicePaymentSucceeded(invoice: any, db: any) {
  if (invoice.subscription) {
    const { data: payment, error } = await db
      .from('payments')
      .select('*')
      .eq('metadata->stripeSubscriptionId', invoice.subscription)
      .single()

    if (error) {
      throw new Error(`Error fetching payment: ${error.message}`)
    }

    if (payment) {
      const updateData = {
        status: 'active',
        amount: invoice.amount_paid,
        created: new Date(invoice.created * 1000).toISOString(),
      }

      const { error: updateError } = await db
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        throw new Error(`Error updating payment: ${updateError.message}`)
      }
    }
  }
}

async function handleInvoicePaymentFailed(invoice: any, db: any) {
  if (invoice.subscription) {
    const { data: payment, error } = await db
      .from('payments')
      .select('*')
      .eq('metadata->stripeSubscriptionId', invoice.subscription)
      .single()

    if (error) {
      throw new Error(`Error fetching payment: ${error.message}`)
    }

    if (payment) {
      const updateData = {
        status: 'past_due',
      }

      const { error: updateError } = await db
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        throw new Error(`Error updating payment: ${updateError.message}`)
      }
    }
  }
}