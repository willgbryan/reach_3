'use server'

import 'server-only'
import { dbAdmin } from '@/db/admin'
import { stripe } from '@/lib/stripe'

async function processLifetimePayment(session, db, isLiveMode) {
  console.log(`Processing ${isLiveMode ? 'live' : 'test'} lifetime payment for session:`, session.id)
  validateSession(session)
  const userEmail = getUserEmailFromSession(session)
  const userId = isLiveMode ? await ensureUserExists(userEmail) : `test_user_${session.id}`
  await recordLifetimePayment(userId, session, db, isLiveMode)
}

function validateSession(session) {
  if (session.mode !== 'payment') {
    throw new Error('Called with a non-payment session')
  }

  if (!session.payment_intent || !session.metadata) {
    throw new Error('Required session data is missing')
  }
}

function getUserEmailFromSession(session) {
  const userEmail = session.customer_details.email
  if (!userEmail) {
    throw new Error('Customer email is missing from Stripe session.')
  }
  return userEmail
}

async function ensureUserExists(userEmail) {
  const existingUser = await getUserByEmail(userEmail)
  if (existingUser) {
    return existingUser
  }
  return await createUser(userEmail)
}

async function getUserByEmail(userEmail) {
  const { data: existingUser, error } = await dbAdmin.rpc('get_user_id_by_email', {
    user_email: userEmail,
  })

  if (error) {
    throw new Error(`Error in [getUserByEmail] - ${error.message}`)
  }

  return existingUser
}

async function createUser(userEmail) {
  const { data, error } = await dbAdmin.auth.admin.createUser({
    email: userEmail,
  })

  if (error) {
    throw error
  }

  if (!data?.user?.id) {
    throw new Error('Failed to create a new user.')
  }

  return data.user.id
}

async function recordLifetimePayment(userId, session, db, isLiveMode) {
  const paymentData = {
    id: isLiveMode ? session.payment_intent : `test_${session.payment_intent}`,
    user_id: userId,
    price_id: session.metadata.price_id,
    status: 'completed',
    amount: session.amount_total,
    currency: session.currency,
    metadata: { 
      oneTimePaymentType: 'lifetime', 
      paymentType: 'one-time',
      isTestEvent: !isLiveMode
    },
  }

  const { error } = await db.from('payments').insert(paymentData)

  if (error) {
    throw new Error(`Error inserting lifetime payment: ${error.message}`)
  }

  console.log(`${isLiveMode ? 'Live' : 'Test'} lifetime payment recorded successfully`)
}

async function processSubscriptionPayment(session, db, isLiveMode) {
  console.log(`Processing ${isLiveMode ? 'live' : 'test'} subscription payment for session:`, session.id)
  validateSubscriptionSession(session)
  const userEmail = getUserEmailFromSession(session)
  const userId = isLiveMode ? await ensureUserExists(userEmail) : `test_user_${session.id}`
  await recordSubscriptionPayment(userId, session, db, isLiveMode)
}

function validateSubscriptionSession(session) {
  if (session.mode !== 'subscription') {
    throw new Error('Called with a non-subscription session')
  }

  if (!session.subscription || !session.customer || !session.metadata) {
    throw new Error('Required session data is missing')
  }
}

async function recordSubscriptionPayment(userId, session, db, isLiveMode) {
  let subscription, customer

  if (isLiveMode) {
    subscription = await stripe.subscriptions.retrieve(session.subscription)
    customer = await stripe.customers.retrieve(session.customer)
  } else {
    subscription = {
      id: `test_sub_${session.id}`,
      status: 'active',
      items: { data: [{ price: { id: 'test_price', product: 'Test Product' } }] },
      created: Date.now() / 1000
    }
    customer = { id: `test_cus_${session.id}` }
  }

  const paymentData = {
    id: isLiveMode ? session.id : `test_${session.id}`,
    user_id: userId,
    price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    amount: session.amount_total, // Use session amount as subscription might not have this for test events
    currency: session.currency,
    stripe_customer_id: customer.id,
    metadata: {
      subscriptionId: session.subscription,
      customerId: session.customer,
      paymentType: 'subscription',
      isTestEvent: !isLiveMode
    },
    created: new Date(subscription.created * 1000).toISOString(),
    description: `${isLiveMode ? '' : 'Test '}Subscription to ${subscription.items.data[0].price.product}`
  }

  const { error } = await db.from('payments').insert(paymentData)

  if (error) {
    throw new Error(`Error inserting subscription payment: ${error.message}`)
  }

  console.log(`${isLiveMode ? 'Live' : 'Test'} subscription payment recorded successfully`)
}

export { processLifetimePayment, processSubscriptionPayment }