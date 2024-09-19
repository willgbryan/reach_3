import { NextRequest, NextResponse } from 'next/server';
import { processLifetimePayment, processSubscriptionPayment } from '@/app/_data/stripe';
import { adminConfig, dbAdmin } from '@/db/admin';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    validateEnvironment(adminConfig);
    const event = await validateAndConstructStripeEvent(req);
    await processStripeEvent(event, dbAdmin);
    return NextResponse.json({ status: 200, message: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function validateEnvironment(config: any) {
  if (!config.url || !config.serviceRoleKey || !config.webhookSecret) {
    throw new Error('Required environment variables are missing');
  }
}

async function validateAndConstructStripeEvent(req: NextRequest) {
  const buf = Buffer.from(await req.arrayBuffer());
  const signature = req.headers.get('stripe-signature');
  console.log('Raw body length:', buf.length);
  console.log('Stripe-Signature:', signature);
  if (!signature) throw new Error('Stripe signature is missing');

  try {
    return stripe.webhooks.constructEvent(buf, signature, adminConfig.webhookSecret);
  } catch (error) {
    console.error('Error constructing Stripe event:', error);
    throw error;
  }
}

async function processStripeEvent(event: any, db: any) {
  console.log(`Processing ${event.livemode ? 'live' : 'test'} event type: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, db, event.livemode)
        break
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object, db, event.livemode)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, db, event.livemode)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, db, event.livemode)
        break
      default:
        console.warn(`Unhandled event type: ${event.type}`)
        logUnhandledEvent(event)
    }
  } catch (error) {
    console.error('Error processing Stripe webhook event:', error)
    throw error
  }
}

function logUnhandledEvent(event: any) {
  console.log('Unhandled Stripe event:', {
    id: `unhandled_${event.id}`,
    type: event.type,
    created: new Date().toISOString(),
    data: event.data.object,
    is_test: !event.livemode
  })
}

async function handleSubscriptionChange(subscription: any, db: any, isLiveMode: boolean) {
  console.log(`Handling ${isLiveMode ? 'live' : 'test'} subscription change:`, subscription.id)

  const { data: payment, error } = await db
    .from('payments')
    .select('*')
    .eq('metadata->subscriptionId', subscription.id)
    .single()

  if (error) {
    throw new Error(`Error fetching payment: ${error.message}`)
  }

  if (!payment) {
    if (!isLiveMode) {
      await createTestPaymentRecord(subscription, db)
      return
    }
    throw new Error(`No payment found for subscription ${subscription.id}`)
  }

  const updateData = {
    status: subscription.status,
    amount: subscription.items.data[0].price.unit_amount,
    price_id: subscription.items.data[0].price.id,
    metadata: {
      ...payment.metadata,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      isTestEvent: !isLiveMode
    }
  }

  const { error: updateError } = await db
    .from('payments')
    .update(updateData)
    .eq('id', payment.id)

  if (updateError) {
    throw new Error(`Error updating payment: ${updateError.message}`)
  }

  console.log('Subscription change handled successfully')
}

async function handleCheckoutSessionCompleted(session: any, db: any, isLiveMode: boolean) {
  console.log(`Handling ${isLiveMode ? 'live' : 'test'} checkout session completed:`, session.id)

  try {
    switch (session.mode) {
      case 'subscription':
        await processSubscriptionPayment(session, db, isLiveMode)
        break
      case 'payment':
        const oneTimePaymentType = session.metadata?.oneTimePaymentType
        if (oneTimePaymentType === 'lifetime') {
          await processLifetimePayment(session, db, isLiveMode)
        } else {
          console.warn(`Unhandled one-time payment type: ${oneTimePaymentType}`)
        }
        break
      default:
        console.warn(`Unhandled session mode: ${session.mode}`)
        break
    }
    console.log('Checkout session handled successfully')
  } catch (error) {
    console.error('Error in handling checkout session:', error)
    throw error
  }
}

async function handleInvoicePaymentSucceeded(invoice: any, db: any, isLiveMode: boolean) {
  console.log(`Handling ${isLiveMode ? 'live' : 'test'} invoice payment succeeded:`, invoice.id)

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
        metadata: {
          ...payment.metadata,
          isTestEvent: !isLiveMode
        }
      }

      const { error: updateError } = await db
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        throw new Error(`Error updating payment: ${updateError.message}`)
      }
    } else if (!isLiveMode) {
      await createTestPaymentRecord(invoice, db)
    }
  }

  console.log('Invoice payment succeeded handled successfully')
}

async function handleInvoicePaymentFailed(invoice: any, db: any, isLiveMode: boolean) {
  console.log(`Handling ${isLiveMode ? 'live' : 'test'} invoice payment failed:`, invoice.id)

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
        metadata: {
          ...payment.metadata,
          isTestEvent: !isLiveMode
        }
      }

      const { error: updateError } = await db
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        throw new Error(`Error updating payment: ${updateError.message}`)
      }
    } else if (!isLiveMode) {
      // For test events, create a new payment record if it doesn't exist
      await createTestPaymentRecord(invoice, db, 'past_due')
    }
  }

  console.log('Invoice payment failed handled successfully')
}

async function createTestPaymentRecord(data: any, db: any, status: string = 'active') {
  const paymentData = {
    id: `test_${data.id}`,
    user_id: 'test_user',
    price_id: data.items?.data[0]?.price?.id || 'test_price',
    status: status,
    amount: data.amount_total || data.amount_paid || 0,
    currency: data.currency || 'usd',
    stripe_customer_id: data.customer,
    metadata: {
      stripeSubscriptionId: data.subscription,
      isTestEvent: true
    },
    created: new Date().toISOString(),
    description: `Test payment for ${data.id}`
  }

  const { error } = await db.from('payments').insert(paymentData)

  if (error) {
    throw new Error(`Error creating test payment record: ${error.message}`)
  }
}