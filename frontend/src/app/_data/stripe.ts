'use server'

// Ensure these functions only ever run on the server so we dont leak dbAdmin
import 'server-only'

import { dbAdmin } from '@/db/admin'
import { stripe } from '@/lib/stripe'

// PaymentHandler.js
/**
 * This module contains functions to handle lifetime payments in a Next.js application using Supabase.
 */

/**
 * Processes a lifetime payment session.
 *
 * @param {object} session - The Stripe session object.
 * @param {object} db - The database object to interact with your database.
 */
async function processLifetimePayment(session, db) {
  validateSession(session)
  const userEmail = getUserEmailFromSession(session)
  const userId = await ensureUserExists(userEmail)
  await recordPaymentIfNotExists(userId, session, db)
}

/**
 * Validates the Stripe session.
 *
 * @param {object} session - The Stripe session object.
 */
function validateSession(session) {
  if (session.mode !== 'payment') {
    throw new Error('Called with a non-payment session')
  }

  if (!session.payment_intent || !session.metadata) {
    throw new Error('Required session data is missing')
  }
}

/**
 * Extracts the user's email from the Stripe session.
 *
 * @param {object} session - The Stripe session object.
 * @returns {string} The user's email address.
 */
function getUserEmailFromSession(session) {
  const userEmail = session.customer_details.email
  if (!userEmail) {
    throw new Error('Customer email is missing from Stripe session.')
  }
  return userEmail
}

/**
 * Ensures that a user exists in the database, either by finding an existing user or creating a new one.
 *
 * @param {string} userEmail - The email address of the user.
 * @returns {string} The user ID.
 */
async function ensureUserExists(userEmail) {
  const existingUser = await getUserByEmail(userEmail)

  if (existingUser) {
    return existingUser
  }

  return await createUser(userEmail)
}

/**
 * Fetches a user by email.
 *
 * @param {string} userEmail - The email address of the user.
 * @returns {string|null} The user ID if exists, or null.
 */
async function getUserByEmail(userEmail) {
  const { data: existingUser, error } = await dbAdmin.rpc('get_user_id_by_email', {
    user_email: userEmail,
  })

  if (error) {
    throw new Error(`Error in [getUserByEmail] - ${error.message}`)
  }

  return existingUser
}

/**
 * Creates a new user in the database.
 *
 * @param {string} userEmail - The email address of the user.
 * @returns {string} The new user ID.
 */
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

/**
 * Records the payment in the database if the user has not already made a lifetime payment.
 *
 * @param {string} userId - The user ID.
 * @param {object} session - The Stripe session object.
 * @param {object} db - The database object.
 */
async function recordPaymentIfNotExists(userId, session, db) {
  const hasLifetimePayment = await checkLifetimePaymentExists(userId, db)

  if (!hasLifetimePayment) {
    await insertPaymentRecord(userId, session, db)
  }
}

/**
 * Checks if a lifetime payment already exists for a user.
 *
 * @param {string} userId - The user ID.
 * @param {object} db - The database object.
 * @returns {boolean} True if a lifetime payment exists, false otherwise.
 */
async function checkLifetimePaymentExists(userId, db) {
  const { data } = await db
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .eq('metadata', 'lifetime')
    .eq('status', 'completed')
    .single()

  return !!data
}

/**
 * Inserts a new payment record into the database.
 *
 * @param {string} userId - The user ID.
 * @param {object} session - The Stripe session object.
 * @param {object} db - The database object.
 */
async function insertPaymentRecord(userId, session, db) {
  const { error } = await db.from('payments').insert({
    id: session.payment_intent,
    user_id: userId,
    price_id: session.metadata.price_id,
    status: 'completed',
    amount: session.amount_total,
    currency: session.currency,
    metadata: { oneTimePaymentType: 'lifetime', paymentType: 'one-time' },
  })

  if (error) {
    throw error
  }
}

export { processLifetimePayment }

function validateSubscriptionSession(session) {
  if (session.mode !== 'subscription') {
    throw new Error('Called with a non-subscription session')
  }

  if (!session.subscription || !session.customer || !session.metadata) {
    throw new Error('Required session data is missing')
  }
}

async function processSubscriptionPayment(session, db) {
  validateSubscriptionSession(session)
  const userEmail = getUserEmailFromSession(session)
  const userId = await ensureUserExists(userEmail)
  await recordSubscriptionPayment(userId, session, db)
}

async function recordSubscriptionPayment(userId, session, db) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription)
  const customer = await stripe.customers.retrieve(session.customer)

  const paymentData = {
    id: session.id,
    user_id: userId,
    price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    amount: subscription.items.data[0].price.unit_amount,
    currency: subscription.currency,
    stripe_customer_id: customer.id,
    metadata: {
      subscriptionId: session.subscription,
      customerId: session.customer,
      paymentType: 'subscription'
    },
    created: new Date(subscription.created * 1000).toISOString(),
    description: `Subscription to ${subscription.items.data[0].price.product}`
  }

  const { error } = await db.from('payments').insert(paymentData)

  if (error) {
    throw new Error(`Error inserting subscription payment: ${error.message}`)
  }
}

export { processSubscriptionPayment }